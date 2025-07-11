const fs = require('fs');
const path = require('path');

/**
 * Enhanced Code Quality Audit 005
 * Focuses on detailed tables and post-refactoring analysis
 */

const srcPath = path.join(__dirname, '../../../src');
console.log('Running Enhanced Code Quality Audit 005...\n');
console.log('Scanning directory:', srcPath);

// Enhanced file scanner with class and method detection
function scanDirectory(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const skipDirs = ['node_modules', 'out', '.git', 'dist', 'build', 'coverage'];
      const shouldSkip = skipDirs.includes(file) || file.startsWith('____') || file.startsWith('___');
      if (!shouldSkip) {
        scanDirectory(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function analyzeClassesAndMethods(content) {
  const classes = [];
  const methods = [];
  
  // Find class definitions with their methods
  const classRegex = /class\s+(\w+)[\s\S]*?\{([\s\S]*?)(?=\n\s*class|\n\s*export|\n\s*interface|\n\s*$)/g;
  let classMatch;
  
  while ((classMatch = classRegex.exec(content)) !== null) {
    const className = classMatch[1];
    const classBody = classMatch[2];
    
    // Find methods in this class
    const methodRegex = /(?:public|private|protected)?\s*(?:static)?\s*(\w+)\s*\([^)]*\)\s*[:{}]/g;
    const classMethods = [];
    let methodMatch;
    
    while ((methodMatch = methodRegex.exec(classBody)) !== null) {
      const methodName = methodMatch[1];
      if (methodName !== 'constructor' && !methodName.startsWith('get') && !methodName.startsWith('set')) {
        classMethods.push(methodName);
      }
    }
    
    classes.push({
      name: className,
      methodCount: classMethods.length,
      methods: classMethods
    });
  }
  
  // Find standalone functions
  const functionRegex = /(?:export\s+)?function\s+(\w+)\s*\(/g;
  let funcMatch;
  
  while ((funcMatch = functionRegex.exec(content)) !== null) {
    methods.push({
      name: funcMatch[1],
      type: 'function',
      isExported: funcMatch[0].includes('export')
    });
  }
  
  // Find arrow functions
  const arrowRegex = /(?:export\s+)?const\s+(\w+)\s*=\s*(?:\([^)]*\)\s*)?=>/g;
  let arrowMatch;
  
  while ((arrowMatch = arrowRegex.exec(content)) !== null) {
    methods.push({
      name: arrowMatch[1],
      type: 'arrow',
      isExported: arrowMatch[0].includes('export')
    });
  }
  
  return { classes, methods };
}

function countCodePatterns(content) {
  return {
    functions: (content.match(/function\s+\w+|=>\s*{|=\s*\([^)]*\)\s*=>/g) || []).length,
    classes: (content.match(/class\s+\w+/g) || []).length,
    interfaces: (content.match(/interface\s+\w+/g) || []).length,
    exports: (content.match(/export\s+(default\s+)?/g) || []).length,
    imports: (content.match(/import\s+/g) || []).length,
    anyTypes: (content.match(/:\s*any\b/g) || []).length,
    typeAssertions: (content.match(/as\s+\w+/g) || []).length,
    todos: (content.match(/\/\/\s*(TODO|FIXME|HACK)/gi) || []).length
  };
}

function analyzeModularization(files) {
  const dataGeneratorFiles = files.filter(f => 
    f.relativePath.includes('dataGenerator')
  );
  
  const analysis = {
    mainFile: null,
    moduleFiles: [],
    totalLines: 0,
    moduleCount: 0
  };
  
  dataGeneratorFiles.forEach(file => {
    if (file.relativePath.endsWith('dataGenerator.ts')) {
      analysis.mainFile = {
        path: file.relativePath,
        lines: file.lines,
        classes: file.classAnalysis.classes.length,
        imports: file.patterns.imports
      };
    } else if (file.relativePath.includes('dataGenerator/')) {
      analysis.moduleFiles.push({
        path: file.relativePath,
        lines: file.lines,
        classes: file.classAnalysis.classes.length
      });
    }
    analysis.totalLines += file.lines;
  });
  
  analysis.moduleCount = analysis.moduleFiles.length;
  
  return analysis;
}

function findDeadCode(files) {
  const deadCode = [];
  
  files.forEach(file => {
    // Look for large commented code blocks
    const commentedCode = file.content.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || [];
    const largeCommentBlocks = commentedCode.filter(block => 
      block.split('\n').length > 5 && 
      (block.includes('function') || block.includes('class') || block.includes('='))
    );
    
    if (largeCommentBlocks.length > 0) {
      deadCode.push({
        file: file.relativePath,
        type: 'commented-code',
        count: largeCommentBlocks.length,
        lines: largeCommentBlocks.reduce((sum, block) => sum + block.split('\n').length, 0)
      });
    }
    
    // Look for potentially unused exports
    const exports = (file.content.match(/export\s+(?:const|function|class|interface)\s+(\w+)/g) || [])
      .map(match => match.match(/(\w+)$/)?.[0])
      .filter(Boolean);
    
    if (exports.length > 0) {
      const potentiallyUnused = exports.filter(exportName => {
        const used = files.some(otherFile => {
          if (otherFile.path === file.path) return false;
          return otherFile.content.includes(exportName);
        });
        return !used;
      });
      
      if (potentiallyUnused.length > 0) {
        deadCode.push({
          file: file.relativePath,
          type: 'unused-export',
          items: potentiallyUnused
        });
      }
    }
  });
  
  return deadCode;
}

// Main execution
const files = scanDirectory(srcPath);
console.log(`Found ${files.length} TypeScript files\n`);

// Analyze each file
const inventory = files.map(filePath => {
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relativePath = path.relative(srcPath, filePath);
  
  const patterns = countCodePatterns(content);
  const classAnalysis = analyzeClassesAndMethods(content);
  
  return {
    path: filePath,
    relativePath,
    name: path.basename(filePath),
    size: stats.size,
    lines: lines.length,
    lastModified: stats.mtime,
    content,
    patterns,
    classAnalysis
  };
});

// Sort by size
inventory.sort((a, b) => b.size - a.size);

// Generate enhanced metrics
const totalLines = inventory.reduce((sum, file) => sum + file.lines, 0);
const totalClasses = inventory.reduce((sum, file) => sum + file.classAnalysis.classes.length, 0);
const totalMethods = inventory.reduce((sum, file) => 
  sum + file.classAnalysis.classes.reduce((methodSum, cls) => methodSum + cls.methodCount, 0), 0);

// Analyze modularization impact
const modularizationAnalysis = analyzeModularization(inventory);

// Find remaining dead code
const deadCodePatterns = findDeadCode(inventory);

// Create enhanced file table
const fileTable = inventory.map(file => ({
  name: file.name,
  path: file.relativePath,
  lines: file.lines,
  size: Math.round(file.size / 1024 * 100) / 100, // KB
  classes: file.classAnalysis.classes.length,
  interfaces: file.patterns.interfaces,
  methods: file.classAnalysis.classes.reduce((sum, cls) => sum + cls.methodCount, 0),
  exports: file.patterns.exports,
  imports: file.patterns.imports,
  anyTypes: file.patterns.anyTypes
}));

// Create class table
const classTable = [];
inventory.forEach(file => {
  file.classAnalysis.classes.forEach(cls => {
    classTable.push({
      className: cls.name,
      fileName: file.name,
      filePath: file.relativePath,
      methodCount: cls.methodCount,
      methods: cls.methods.join(', '),
      fileLines: file.lines
    });
  });
});

// Create summary report
const auditReport = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: inventory.length,
    totalLines,
    totalClasses,
    totalMethods,
    totalInterfaces: inventory.reduce((sum, file) => sum + file.patterns.interfaces, 0),
    totalAnyTypes: inventory.reduce((sum, file) => sum + file.patterns.anyTypes, 0),
    averageLinesPerFile: Math.round(totalLines / inventory.length),
    averageMethodsPerClass: totalClasses > 0 ? Math.round(totalMethods / totalClasses * 100) / 100 : 0
  },
  modularization: modularizationAnalysis,
  tables: {
    files: fileTable,
    classes: classTable
  },
  deadCode: deadCodePatterns,
  largestFiles: fileTable.slice(0, 10),
  mostComplexClasses: classTable
    .sort((a, b) => b.methodCount - a.methodCount)
    .slice(0, 10)
};

// Save results
const resultsPath = path.join(__dirname, '03-Results');
fs.mkdirSync(resultsPath, { recursive: true });

// Save enhanced inventory
fs.writeFileSync(
  path.join(resultsPath, 'fileInventory.json'),
  JSON.stringify(auditReport, null, 2)
);

// Save detailed analysis
fs.writeFileSync(
  path.join(resultsPath, 'detailedAnalysis.json'),
  JSON.stringify({
    timestamp: new Date().toISOString(),
    files: inventory,
    deadCode: deadCodePatterns,
    modularization: modularizationAnalysis
  }, null, 2)
);

// Save CSV files
const fileCSV = [
  'Name,Path,Lines,Size(KB),Classes,Interfaces,Methods,Exports,Imports,AnyTypes',
  ...fileTable.map(f => `"${f.name}","${f.path}",${f.lines},${f.size},${f.classes},${f.interfaces},${f.methods},${f.exports},${f.imports},${f.anyTypes}`)
].join('\n');

const classCSV = [
  'ClassName,FileName,FilePath,MethodCount,Methods,FileLines',
  ...classTable.map(c => `"${c.className}","${c.fileName}","${c.filePath}",${c.methodCount},"${c.methods}",${c.fileLines}`)
].join('\n');

fs.writeFileSync(path.join(resultsPath, 'files-table.csv'), fileCSV);
fs.writeFileSync(path.join(resultsPath, 'classes-table.csv'), classCSV);

// Output summary
console.log('=== Enhanced Audit 005 Summary ===');
console.log(`Total files: ${auditReport.summary.totalFiles}`);
console.log(`Total lines: ${auditReport.summary.totalLines}`);
console.log(`Total classes: ${auditReport.summary.totalClasses}`);
console.log(`Total methods: ${auditReport.summary.totalMethods}`);
console.log(`Total interfaces: ${auditReport.summary.totalInterfaces}`);
console.log(`Average methods per class: ${auditReport.summary.averageMethodsPerClass}`);

console.log('\n=== Modularization Impact ===');
if (modularizationAnalysis.mainFile) {
  console.log(`Main dataGenerator: ${modularizationAnalysis.mainFile.lines} lines`);
  console.log(`Module files: ${modularizationAnalysis.moduleCount}`);
  console.log(`Total dataGenerator lines: ${modularizationAnalysis.totalLines}`);
}

console.log(`\nDead code patterns found: ${deadCodePatterns.length}`);
console.log(`Results saved to: ${resultsPath}`);

console.log('\n=== Top 5 Largest Files ===');
auditReport.largestFiles.slice(0, 5).forEach((file, i) => {
  console.log(`${i + 1}. ${file.name} - ${file.lines} lines, ${file.classes} classes`);
});

console.log('\n=== Top 5 Most Complex Classes ===');
auditReport.mostComplexClasses.slice(0, 5).forEach((cls, i) => {
  console.log(`${i + 1}. ${cls.className} (${cls.fileName}) - ${cls.methodCount} methods`);
});