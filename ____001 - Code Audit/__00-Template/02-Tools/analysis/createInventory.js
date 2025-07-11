const fs = require('fs');
const path = require('path');
const { scanDirectory, getFileMetrics, countPatterns } = require('./fileScanner');

/**
 * Create File Inventory Script
 * 
 * This script creates a comprehensive inventory of all TypeScript files in the project.
 * It collects metrics like file size, line count, and code patterns.
 * 
 * IMPORTANT: Adjust the srcPath based on your folder structure!
 * 
 * The script assumes the following structure:
 * - ____001 - Code Audit/
 *   - __00-Template/
 *     - 02-Tools/
 *       - analysis/
 *         - createInventory.js (this file)
 * - src/ (the source code to analyze)
 * 
 * Default path goes up 5 levels from this script to reach the project root,
 * then into the src folder.
 */

// ADJUST THIS PATH based on where the audit folder is relative to the src folder
// Go up from: analysis -> 02-Tools -> __00-Template -> ____001 - Code Audit -> cursor (contains src)
const srcPath = path.join(__dirname, '../../../../src');
console.log('Scanning directory:', srcPath);

// Verify the path exists
if (!fs.existsSync(srcPath)) {
  console.error(`ERROR: Source directory not found at: ${srcPath}`);
  console.error('Please adjust the srcPath variable in this script.');
  console.error('Current script location:', __dirname);
  process.exit(1);
}

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

// Calculate additional metrics
const totalAny = inventory.reduce((sum, file) => sum + (file.patterns.any || 0), 0);
const totalTypeAssertions = inventory.reduce((sum, file) => sum + (file.patterns.typeAssertions || 0), 0);
const totalInterfaces = inventory.reduce((sum, file) => sum + file.patterns.interfaces, 0);

// Create summary report
const summaryReport = {
  timestamp: new Date().toISOString(),
  scanPath: srcPath,
  summary: {
    totalFiles: inventory.length,
    totalLines,
    totalSize,
    totalFunctions,
    totalClasses,
    totalInterfaces,
    totalTodos,
    totalAnyTypes: totalAny,
    totalTypeAssertions,
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
    todos: file.patterns.todos,
    anyTypes: file.patterns.any || 0,
    typeAssertions: file.patterns.typeAssertions || 0
  }))
};

// Save inventory - create the data directory relative to this script
const outputDir = path.join(__dirname, '..', 'data');
const outputPath = path.join(outputDir, 'fileInventory.json');

// Ensure the output directory exists
fs.mkdirSync(outputDir, { recursive: true });

// Write the inventory file
fs.writeFileSync(outputPath, JSON.stringify(summaryReport, null, 2));

console.log('\nSummary:');
console.log(`Total files: ${summaryReport.summary.totalFiles}`);
console.log(`Total lines: ${summaryReport.summary.totalLines}`);
console.log(`Total size: ${(summaryReport.summary.totalSize / 1024).toFixed(2)} KB`);
console.log(`Total functions: ${summaryReport.summary.totalFunctions}`);
console.log(`Total classes: ${summaryReport.summary.totalClasses}`);
console.log(`Total interfaces: ${summaryReport.summary.totalInterfaces}`);
console.log(`Total TODOs: ${summaryReport.summary.totalTodos}`);
console.log(`Total 'any' types: ${summaryReport.summary.totalAnyTypes}`);
console.log(`Total type assertions: ${summaryReport.summary.totalTypeAssertions}`);
console.log(`\nInventory saved to: ${outputPath}`);

// Show top 5 largest files
console.log('\nTop 5 largest files:');
inventory.slice(0, 5).forEach((file, index) => {
  console.log(`${index + 1}. ${file.relativePath} - ${file.lines} lines, ${(file.size / 1024).toFixed(2)} KB`);
});