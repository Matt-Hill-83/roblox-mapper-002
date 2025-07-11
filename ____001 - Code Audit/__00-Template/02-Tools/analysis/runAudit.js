const fs = require('fs');
const path = require('path');
const { analyzeFile, findDuplicates } = require('./codeAnalyzer');
const { buildDependencyGraph, findCircularDependencies, analyzeModuleCohesion } = require('./dependencyMapper');
const { generateFullReport } = require('./reportGenerator');

/**
 * Run Full Code Quality Audit
 * 
 * This script runs a comprehensive code quality audit including:
 * - Code quality analysis (complexity, duplication, etc.)
 * - Architecture analysis (dependencies, circular deps, cohesion)
 * - Report generation
 * 
 * Prerequisites:
 * 1. Run createInventory.js first to generate fileInventory.json
 * 2. Ensure all required modules are present
 * 
 * The script expects the following structure:
 * - data/fileInventory.json (created by createInventory.js)
 * - src/ folder containing TypeScript code to analyze
 */

console.log('Starting Code Quality Audit...\n');

// Load file inventory
const inventoryPath = path.join(__dirname, '../data/fileInventory.json');
if (!fs.existsSync(inventoryPath)) {
  console.error('ERROR: fileInventory.json not found!');
  console.error('Please run createInventory.js first.');
  process.exit(1);
}

const inventoryData = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const inventory = inventoryData.files || inventoryData; // Handle both old and new formats

// Load full file data for analysis
const { scanDirectory, getFileMetrics } = require('./fileScanner');

// Use the same src path as createInventory.js
const srcPath = inventoryData.scanPath || path.join(__dirname, '../../../../../src');
// Verify src path exists
if (!fs.existsSync(srcPath)) {
  console.error(`ERROR: Source directory not found at: ${srcPath}`);
  console.error('Please check the path in createInventory.js and ensure it matches your project structure.');
  process.exit(1);
}

const files = scanDirectory(srcPath).map(filePath => {
  const metrics = getFileMetrics(filePath);
  return {
    ...metrics,
    relativePath: path.relative(srcPath, filePath)
  };
});

console.log(`Analyzing ${files.length} files...\n`);

// T2: Code Quality Analysis
console.log('Performing code quality analysis...');
const codeIssues = files.map(file => ({
  file: file.relativePath,
  issues: analyzeFile(file)
}));

// Find duplicates across all files
const duplicates = findDuplicates(files);
console.log(`Found ${duplicates.length} duplicate code patterns`);

// T3: Architecture Analysis
console.log('\nPerforming architecture analysis...');
const dependencyGraph = buildDependencyGraph(files);
console.log(`Built dependency graph with ${dependencyGraph.nodes.length} nodes and ${dependencyGraph.edges.length} edges`);

const circularDeps = findCircularDependencies(dependencyGraph);
console.log(`Found ${circularDeps.length} circular dependencies`);

const moduleCohesion = analyzeModuleCohesion(dependencyGraph);
console.log(`Analyzed cohesion for ${Object.keys(moduleCohesion).length} modules`);

// T4: Generate Report
console.log('\nGenerating report...');
const dependencies = {
  graph: dependencyGraph,
  circular: circularDeps,
  cohesion: moduleCohesion
};

// Pass the full inventory data which includes the summary
const report = generateFullReport(inventoryData, codeIssues, dependencies);

// Save report
const reportsDir = path.join(__dirname, '..', 'reports');
const reportPath = path.join(reportsDir, 'CodeQualityAuditReport.md');
fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(reportPath, report);

console.log(`\nAudit complete! Report saved to: ${reportPath}`);

// Save detailed data for reference
const detailedData = {
  timestamp: new Date().toISOString(),
  srcPath,
  inventory,
  codeIssues,
  duplicates,
  dependencies
};

const dataDir = path.join(__dirname, '..', 'data');
const dataPath = path.join(dataDir, 'detailedAnalysis.json');
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(dataPath, JSON.stringify(detailedData, null, 2));
console.log(`Detailed analysis data saved to: ${dataPath}`);

// Also save a summary of findings
const summaryPath = path.join(dataDir, 'auditSummary.json');
const summary = {
  timestamp: new Date().toISOString(),
  filesAnalyzed: files.length,
  totalIssues: codeIssues.reduce((sum, item) => sum + item.issues.length, 0),
  duplicatePatterns: duplicates.length,
  circularDependencies: circularDeps.length,
  modulesAnalyzed: Object.keys(moduleCohesion).length
};
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
console.log(`\nAudit summary saved to: ${summaryPath}`);