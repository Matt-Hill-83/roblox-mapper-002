const fs = require('fs');
const path = require('path');

// Read the detailed analysis
const analysisPath = path.join(__dirname, '03-Results/data/detailedAnalysis.json');
const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

// Group files by category based on path
const categorizeFile = (filePath) => {
  if (filePath.includes('/services/')) return 'services';
  if (filePath.includes('/components/')) return 'components';
  if (filePath.includes('/renderers/')) return 'renderers';
  if (filePath.includes('/managers/')) return 'managers';
  if (filePath.includes('/utils/')) return 'utils';
  if (filePath.includes('/interfaces/')) return 'interfaces';
  if (filePath.includes('/data/')) return 'data';
  if (filePath.includes('/modules/')) return 'modules';
  return 'other';
};

// Analyze architecture
const architectureBreakdown = {};
const categoryStats = {};

analysis.files.forEach(file => {
  const category = categorizeFile(file.path);
  
  if (!architectureBreakdown[category]) {
    architectureBreakdown[category] = [];
    categoryStats[category] = {
      count: 0,
      totalLines: 0,
      totalComplexity: 0,
      totalSize: 0
    };
  }
  
  architectureBreakdown[category].push({
    path: file.path,
    lines: file.lines,
    complexity: file.complexity,
    size: file.size
  });
  
  categoryStats[category].count++;
  categoryStats[category].totalLines += file.lines;
  categoryStats[category].totalComplexity += file.complexity;
  categoryStats[category].totalSize += file.size;
});

// Calculate averages
Object.keys(categoryStats).forEach(category => {
  const stats = categoryStats[category];
  stats.avgLines = Math.round(stats.totalLines / stats.count);
  stats.avgComplexity = Math.round(stats.totalComplexity / stats.count * 10) / 10;
  stats.avgSize = Math.round(stats.totalSize / stats.count);
});

// Create architecture report
const architectureReport = {
  overview: {
    totalFiles: analysis.summary.totalFiles,
    totalLines: analysis.summary.totalLines,
    totalSize: analysis.summary.totalSize,
    categories: Object.keys(categoryStats).length
  },
  categoryBreakdown: categoryStats,
  topFilesByCategory: {},
  codeDistribution: {},
  insights: []
};

// Get top files by category
Object.keys(architectureBreakdown).forEach(category => {
  architectureReport.topFilesByCategory[category] = architectureBreakdown[category]
    .sort((a, b) => b.lines - a.lines)
    .slice(0, 3)
    .map(f => ({
      path: f.path.replace('src/', ''),
      lines: f.lines,
      complexity: f.complexity
    }));
});

// Calculate code distribution percentages
Object.keys(categoryStats).forEach(category => {
  architectureReport.codeDistribution[category] = {
    filesPercent: Math.round(categoryStats[category].count / analysis.summary.totalFiles * 100),
    linesPercent: Math.round(categoryStats[category].totalLines / analysis.summary.totalLines * 100)
  };
});

// Generate insights
if (categoryStats.data && categoryStats.data.linesPercent > 50) {
  architectureReport.insights.push({
    severity: 'critical',
    message: `Data files contain ${categoryStats.data.linesPercent}% of all code. Consider externalizing test data.`
  });
}

if (categoryStats.components && categoryStats.components.avgComplexity > 10) {
  architectureReport.insights.push({
    severity: 'high',
    message: `UI components have high average complexity (${categoryStats.components.avgComplexity}). Consider breaking down complex components.`
  });
}

if (categoryStats.services && categoryStats.services.avgLines > 300) {
  architectureReport.insights.push({
    severity: 'medium',
    message: `Service files average ${categoryStats.services.avgLines} lines. Consider splitting large services.`
  });
}

// Add general insights
architectureReport.insights.push({
  severity: 'info',
  message: `Project uses TypeScript throughout with ${analysis.patterns.totalInterfaces} interface definitions.`
});

architectureReport.insights.push({
  severity: 'info',
  message: `Found ${analysis.patterns.totalTodos} TODO/FIXME comments that need attention.`
});

// Save architecture report
const outputPath = path.join(__dirname, '03-Results/data/architectureReport.json');
fs.writeFileSync(outputPath, JSON.stringify(architectureReport, null, 2));

// Print summary
console.log('\nArchitecture Analysis Complete!');
console.log('================================');
console.log('\nCategory Breakdown:');
Object.entries(categoryStats).forEach(([category, stats]) => {
  console.log(`\n${category.toUpperCase()}:`);
  console.log(`  Files: ${stats.count}`);
  console.log(`  Avg Lines: ${stats.avgLines}`);
  console.log(`  Avg Complexity: ${stats.avgComplexity}`);
  console.log(`  % of Codebase: ${architectureReport.codeDistribution[category].linesPercent}%`);
});

console.log('\n\nKey Insights:');
architectureReport.insights.forEach(insight => {
  console.log(`[${insight.severity.toUpperCase()}] ${insight.message}`);
});

console.log(`\nReport saved to: ${outputPath}`);