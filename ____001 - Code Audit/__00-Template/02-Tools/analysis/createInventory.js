const fs = require('fs');
const path = require('path');
const { scanDirectory, getFileMetrics, countPatterns } = require('./fileScanner');

// Scan the src directory
const srcPath = path.join(__dirname, '../../src');
console.log('Scanning directory:', srcPath);

const files = scanDirectory(srcPath);
console.log(`Found ${files.length} TypeScript files`);

// Create inventory
const inventory = files.map(filePath => {
  const metrics = getFileMetrics(filePath);
  const patterns = countPatterns(metrics.content);
  
  // Calculate relative path from src
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

// Create summary report
const summaryReport = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: inventory.length,
    totalLines,
    totalSize,
    totalFunctions,
    totalClasses,
    totalTodos,
    averageLinesPerFile: Math.round(totalLines / inventory.length),
    averageSizePerFile: Math.round(totalSize / inventory.length)
  },
  files: inventory.map(file => ({
    path: file.relativePath,
    lines: file.lines,
    size: file.size,
    functions: file.patterns.functions,
    classes: file.patterns.classes,
    interfaces: file.patterns.interfaces,
    todos: file.patterns.todos
  }))
};

// Save inventory
const outputPath = path.join(__dirname, '../data/fileInventory.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(summaryReport, null, 2));

console.log('\nSummary:');
console.log(`Total files: ${summaryReport.summary.totalFiles}`);
console.log(`Total lines: ${summaryReport.summary.totalLines}`);
console.log(`Total size: ${(summaryReport.summary.totalSize / 1024).toFixed(2)} KB`);
console.log(`Total functions: ${summaryReport.summary.totalFunctions}`);
console.log(`Total classes: ${summaryReport.summary.totalClasses}`);
console.log(`Total TODOs: ${summaryReport.summary.totalTodos}`);
console.log(`\nInventory saved to: ${outputPath}`);