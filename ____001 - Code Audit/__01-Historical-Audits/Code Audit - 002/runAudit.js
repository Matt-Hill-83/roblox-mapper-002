const fs = require('fs');
const path = require('path');
const fileScanner = require('../../__00-Template/02-Tools/analysis/fileScanner');

// Define project root - going back to the main project  
const projectRoot = path.join(__dirname, '../../..');
const srcPath = path.join(projectRoot, 'src');

console.log('Starting Code Audit - 002');
console.log('Project root:', projectRoot);
console.log('Scanning src directory:', srcPath);

// Create output directories
const outputDir = path.join(__dirname, '03-Results');
const dataDir = path.join(outputDir, 'data');
const reportsDir = path.join(outputDir, 'reports');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

// Scan for TypeScript files
console.log('\nScanning for TypeScript files...');
const files = fileScanner.scanDirectory(srcPath);
console.log(`Found ${files.length} TypeScript files`);

// Collect metrics for each file
console.log('\nCollecting file metrics...');
const fileInventory = [];
const detailedAnalysis = {
  summary: {
    totalFiles: 0,
    totalLines: 0,
    totalSize: 0,
    averageFileSize: 0,
    averageLinesPerFile: 0,
    largestFiles: [],
    mostComplexFiles: []
  },
  files: [],
  patterns: {
    totalFunctions: 0,
    totalClasses: 0,
    totalInterfaces: 0,
    totalExports: 0,
    totalImports: 0,
    totalTodos: 0
  }
};

files.forEach((filePath, index) => {
  try {
    const metrics = fileScanner.getFileMetrics(filePath);
    const patterns = fileScanner.countPatterns(metrics.content);
    
    // Make path relative to project root for cleaner output
    const relativePath = path.relative(projectRoot, filePath);
    
    // Basic inventory entry
    fileInventory.push({
      path: relativePath,
      name: metrics.name,
      lines: metrics.lines,
      size: metrics.size,
      lastModified: metrics.lastModified
    });
    
    // Detailed analysis entry
    detailedAnalysis.files.push({
      path: relativePath,
      name: metrics.name,
      lines: metrics.lines,
      size: metrics.size,
      lastModified: metrics.lastModified,
      patterns: patterns,
      complexity: patterns.functions + patterns.classes // Simple complexity metric
    });
    
    // Update totals
    detailedAnalysis.summary.totalFiles++;
    detailedAnalysis.summary.totalLines += metrics.lines;
    detailedAnalysis.summary.totalSize += metrics.size;
    detailedAnalysis.patterns.totalFunctions += patterns.functions;
    detailedAnalysis.patterns.totalClasses += patterns.classes;
    detailedAnalysis.patterns.totalInterfaces += patterns.interfaces;
    detailedAnalysis.patterns.totalExports += patterns.exports;
    detailedAnalysis.patterns.totalImports += patterns.imports;
    detailedAnalysis.patterns.totalTodos += patterns.todos;
    
    if ((index + 1) % 50 === 0) {
      console.log(`  Processed ${index + 1}/${files.length} files...`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

// Calculate averages
detailedAnalysis.summary.averageFileSize = Math.round(
  detailedAnalysis.summary.totalSize / detailedAnalysis.summary.totalFiles
);
detailedAnalysis.summary.averageLinesPerFile = Math.round(
  detailedAnalysis.summary.totalLines / detailedAnalysis.summary.totalFiles
);

// Find largest files
detailedAnalysis.summary.largestFiles = detailedAnalysis.files
  .sort((a, b) => b.lines - a.lines)
  .slice(0, 10)
  .map(f => ({ path: f.path, lines: f.lines }));

// Find most complex files
detailedAnalysis.summary.mostComplexFiles = detailedAnalysis.files
  .sort((a, b) => b.complexity - a.complexity)
  .slice(0, 10)
  .map(f => ({ path: f.path, complexity: f.complexity }));

// Save results
console.log('\nSaving results...');
fs.writeFileSync(
  path.join(dataDir, 'fileInventory.json'),
  JSON.stringify(fileInventory, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, 'detailedAnalysis.json'),
  JSON.stringify(detailedAnalysis, null, 2)
);

console.log('\nAudit complete!');
console.log(`Total files analyzed: ${detailedAnalysis.summary.totalFiles}`);
console.log(`Total lines of code: ${detailedAnalysis.summary.totalLines}`);
console.log(`Results saved to: ${outputDir}`);