const fs = require('fs');
const path = require('path');

// Adjust the src path to point to the correct location
const srcPath = path.join(__dirname, '../../../src');
console.log('Scanning directory:', srcPath);

// File Scanner Functions
function scanDirectory(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and output directories
      if (file !== 'node_modules' && file !== 'out' && file !== '.git' && !file.startsWith('____') && !file.startsWith('___')) {
        scanDirectory(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function getFileMetrics(filePath) {
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  return {
    path: filePath,
    name: path.basename(filePath),
    size: stats.size,
    lines: lines.length,
    lastModified: stats.mtime,
    content: content
  };
}

function countPatterns(content) {
  const patterns = {
    functions: (content.match(/function\s+\w+|=>\s*{|=\s*\([^)]*\)\s*=>/g) || []).length,
    classes: (content.match(/class\s+\w+/g) || []).length,
    interfaces: (content.match(/interface\s+\w+/g) || []).length,
    exports: (content.match(/export\s+(default\s+)?/g) || []).length,
    imports: (content.match(/import\s+/g) || []).length,
    todos: (content.match(/\/\/\s*(TODO|FIXME|HACK)/gi) || []).length,
    any: (content.match(/:\s*any\b/g) || []).length,
    typeAssertions: (content.match(/as\s+\w+/g) || []).length
  };
  
  return patterns;
}

// Analyze recently refactored files
function analyzeRefactoredFiles(files) {
  const refactoredFiles = [
    'shared/modules/renderers/unifiedDataRenderer/core/dataGenerator.ts',
    'shared/modules/renderers/unifiedDataRenderer/core/positionCalculator.ts',
    'server/services/main/game.service.ts'
  ];
  
  const analysis = {};
  
  refactoredFiles.forEach(targetFile => {
    const file = files.find(f => f.relativePath.includes(targetFile));
    if (file) {
      analysis[targetFile] = {
        lines: file.lines,
        size: file.size,
        classes: file.patterns.classes,
        functions: file.patterns.functions,
        complexity: estimateComplexity(file.content)
      };
    }
  });
  
  return analysis;
}

function estimateComplexity(content) {
  // Simple complexity estimation based on control flow keywords
  const controlFlow = (content.match(/\b(if|else|for|while|switch|case|try|catch)\b/g) || []).length;
  const nestingDepth = calculateMaxNesting(content);
  
  return {
    controlFlowStatements: controlFlow,
    estimatedCyclomaticComplexity: Math.ceil(controlFlow / 10),
    maxNestingDepth: nestingDepth
  };
}

function calculateMaxNesting(content) {
  let maxNesting = 0;
  let currentNesting = 0;
  
  for (let char of content) {
    if (char === '{') {
      currentNesting++;
      maxNesting = Math.max(maxNesting, currentNesting);
    } else if (char === '}') {
      currentNesting = Math.max(0, currentNesting - 1);
    }
  }
  
  return maxNesting;
}

// Find orphaned files
function findOrphanedFiles(files) {
  const orphaned = [];
  
  // Check for old module files that might be orphaned after refactoring
  const suspectPatterns = [
    /nodeGenerator\.ts$/,
    /linkGenerator\.ts$/,
    /propertyManager\.ts$/,
    /testDataProcessor\.ts$/,
    /boundsCalculator\.ts$/,
    /nodeOrganizer\.ts$/,
    /positionMapper\.ts$/,
    /swimLaneCalculator\.ts$/
  ];
  
  files.forEach(file => {
    if (suspectPatterns.some(pattern => pattern.test(file.relativePath))) {
      // Check if file is imported anywhere
      const imported = files.some(otherFile => {
        if (otherFile.path === file.path) return false;
        return otherFile.content.includes(path.basename(file.name, '.ts'));
      });
      
      if (!imported) {
        orphaned.push(file.relativePath);
      }
    }
  });
  
  return orphaned;
}

// Find dead code patterns
function findDeadCode(files) {
  const deadCode = [];
  
  files.forEach(file => {
    // Look for commented out code blocks
    const commentedCode = file.content.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || [];
    const largeCommentBlocks = commentedCode.filter(block => block.split('\n').length > 5);
    
    if (largeCommentBlocks.length > 0) {
      deadCode.push({
        file: file.relativePath,
        type: 'commented-code',
        count: largeCommentBlocks.length,
        lines: largeCommentBlocks.reduce((sum, block) => sum + block.split('\n').length, 0)
      });
    }
    
    // Look for unused exports (simplified check)
    const exports = (file.content.match(/export\s+(?:const|function|class|interface)\s+(\w+)/g) || [])
      .map(match => match.match(/(\w+)$/)?.[0])
      .filter(Boolean);
    
    const potentiallyUnused = exports.filter(exportName => {
      // Check if exported item is used in other files
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
  });
  
  return deadCode;
}

// Main execution
console.log('Starting Code Quality Audit 004...\n');

const files = scanDirectory(srcPath);
console.log(`Found ${files.length} TypeScript files`);

// Create inventory with metrics
const inventory = files.map(filePath => {
  const metrics = getFileMetrics(filePath);
  const patterns = countPatterns(metrics.content);
  const relativePath = path.relative(srcPath, filePath);
  
  return {
    ...metrics,
    relativePath,
    patterns
  };
});

// Sort by size (largest first)
inventory.sort((a, b) => b.size - a.size);

// Generate summary stats
const totalLines = inventory.reduce((sum, file) => sum + file.lines, 0);
const totalSize = inventory.reduce((sum, file) => sum + file.size, 0);
const totalFunctions = inventory.reduce((sum, file) => sum + file.patterns.functions, 0);
const totalClasses = inventory.reduce((sum, file) => sum + file.patterns.classes, 0);
const totalTodos = inventory.reduce((sum, file) => sum + file.patterns.todos, 0);
const totalAny = inventory.reduce((sum, file) => sum + file.patterns.any, 0);

// Analyze refactored files
const refactoringAnalysis = analyzeRefactoredFiles(inventory);

// Find orphaned files
const orphanedFiles = findOrphanedFiles(inventory);

// Find dead code
const deadCodePatterns = findDeadCode(inventory);

// Create summary report
const auditReport = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: inventory.length,
    totalLines,
    totalSize,
    totalFunctions,
    totalClasses,
    totalTodos,
    totalAnyTypes: totalAny,
    averageLinesPerFile: Math.round(totalLines / inventory.length),
    averageSizePerFile: Math.round(totalSize / inventory.length)
  },
  refactoringImpact: refactoringAnalysis,
  largestFiles: inventory.slice(0, 10).map(f => ({
    path: f.relativePath,
    lines: f.lines,
    size: f.size
  })),
  mostComplexFiles: inventory
    .map(f => ({
      path: f.relativePath,
      complexity: estimateComplexity(f.content)
    }))
    .sort((a, b) => b.complexity.controlFlowStatements - a.complexity.controlFlowStatements)
    .slice(0, 10),
  orphanedFiles,
  deadCode: deadCodePatterns,
  filesWithMostTodos: inventory
    .filter(f => f.patterns.todos > 0)
    .sort((a, b) => b.patterns.todos - a.patterns.todos)
    .slice(0, 5)
    .map(f => ({
      path: f.relativePath,
      todos: f.patterns.todos
    })),
  filesWithAnyTypes: inventory
    .filter(f => f.patterns.any > 0)
    .map(f => ({
      path: f.relativePath,
      count: f.patterns.any
    }))
};

// Save results
const resultsPath = path.join(__dirname, '03-Results');
fs.mkdirSync(resultsPath, { recursive: true });

// Save detailed inventory
fs.writeFileSync(
  path.join(resultsPath, 'fileInventory.json'),
  JSON.stringify(auditReport, null, 2)
);

// Save dead code list
fs.writeFileSync(
  path.join(resultsPath, 'deadCode.json'),
  JSON.stringify({
    orphanedFiles,
    deadCodePatterns
  }, null, 2)
);

console.log('\nAudit Summary:');
console.log(`Total files: ${auditReport.summary.totalFiles}`);
console.log(`Total lines: ${auditReport.summary.totalLines}`);
console.log(`Total size: ${(auditReport.summary.totalSize / 1024).toFixed(2)} KB`);
console.log(`Total functions: ${auditReport.summary.totalFunctions}`);
console.log(`Total classes: ${auditReport.summary.totalClasses}`);
console.log(`Total TODOs: ${auditReport.summary.totalTodos}`);
console.log(`Total 'any' types: ${auditReport.summary.totalAnyTypes}`);
console.log(`\nOrphaned files found: ${orphanedFiles.length}`);
console.log(`Dead code patterns found: ${deadCodePatterns.length}`);

console.log('\nRefactoring Impact:');
Object.entries(refactoringAnalysis).forEach(([file, metrics]) => {
  console.log(`\n${file}:`);
  console.log(`  Lines: ${metrics.lines}`);
  console.log(`  Classes: ${metrics.classes}`);
  console.log(`  Functions: ${metrics.functions}`);
  console.log(`  Complexity: ${metrics.complexity.estimatedCyclomaticComplexity}`);
});

console.log(`\nResults saved to: ${resultsPath}`);