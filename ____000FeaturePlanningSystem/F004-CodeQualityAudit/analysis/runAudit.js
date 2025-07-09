const fs = require('fs');
const path = require('path');
const { analyzeFile, findDuplicates } = require('./codeAnalyzer');
const { buildDependencyGraph, findCircularDependencies, analyzeModuleCohesion } = require('./dependencyMapper');
const { generateFullReport } = require('./reportGenerator');

console.log('Starting Code Quality Audit...\n');

// Load file inventory
const inventoryPath = path.join(__dirname, '../data/fileInventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

// Load full file data for analysis
const { scanDirectory, getFileMetrics } = require('./fileScanner');
const srcPath = path.join(__dirname, '../../../src');
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

const report = generateFullReport(inventory, codeIssues, dependencies);

// Save report
const reportPath = path.join(__dirname, '../reports/CodeQualityAuditReport.md');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, report);

console.log(`\nAudit complete! Report saved to: ${reportPath}`);

// Save detailed data for reference
const detailedData = {
  inventory,
  codeIssues,
  duplicates,
  dependencies
};

const dataPath = path.join(__dirname, '../data/detailedAnalysis.json');
fs.writeFileSync(dataPath, JSON.stringify(detailedData, null, 2));
console.log(`Detailed analysis data saved to: ${dataPath}`);