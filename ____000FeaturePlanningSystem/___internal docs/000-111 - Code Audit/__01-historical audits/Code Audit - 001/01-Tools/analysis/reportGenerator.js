const fs = require('fs');
const path = require('path');

/**
 * Generate executive summary
 */
function generateSummary(inventory, codeIssues, dependencies) {
  const summary = {
    overview: {
      totalFiles: inventory.summary.totalFiles,
      totalLines: inventory.summary.totalLines,
      totalSize: `${(inventory.summary.totalSize / 1024).toFixed(2)} KB`,
      avgLinesPerFile: inventory.summary.averageLinesPerFile
    },
    codeQuality: {
      totalIssues: codeIssues.reduce((sum, file) => sum + file.issues.length, 0),
      highComplexityFunctions: codeIssues.reduce((sum, file) => {
        const complexityIssues = file.issues.filter(i => i.type === 'complexity');
        return sum + (complexityIssues.length > 0 ? complexityIssues[0].details.length : 0);
      }, 0),
      namingIssues: codeIssues.reduce((sum, file) => 
        sum + file.issues.filter(i => i.type === 'naming').length, 0),
      typeIssues: codeIssues.reduce((sum, file) => 
        sum + file.issues.filter(i => i.type === 'type').length, 0)
    },
    architecture: {
      totalDependencies: dependencies.graph.edges.length,
      circularDependencies: dependencies.circular.length,
      modules: Object.keys(dependencies.cohesion).length,
      avgModuleCohesion: calculateAvgCohesion(dependencies.cohesion)
    }
  };
  
  return summary;
}

/**
 * Calculate average module cohesion
 */
function calculateAvgCohesion(modules) {
  const values = Object.values(modules).map(m => m.cohesion);
  const sum = values.reduce((a, b) => a + b, 0);
  return values.length > 0 ? (sum / values.length).toFixed(2) : 0;
}

/**
 * Generate file inventory table
 */
function generateFileTable(inventory, codeIssues) {
  const rows = inventory.files.map(file => {
    const fileIssues = codeIssues.find(f => f.file === file.path);
    const issueCount = fileIssues ? fileIssues.issues.length : 0;
    
    return `| ${file.path} | ${file.lines} | ${(file.size / 1024).toFixed(1)} KB | ${issueCount} |`;
  });
  
  const table = `
| File | Lines | Size | Issues |
|------|-------|------|--------|
${rows.join('\n')}
`;
  
  return table;
}

/**
 * Generate dependency diagram
 */
function generateDependencyDiagram(graph) {
  const nodes = graph.nodes.slice(0, 20); // Limit to top 20 for readability
  const edges = graph.edges.filter(e => 
    nodes.some(n => n.id === e.from) && nodes.some(n => n.id === e.to)
  );
  
  let mermaid = '```mermaid\ngraph TD\n';
  
  // Add nodes
  nodes.forEach(node => {
    const label = node.label.replace('.ts', '');
    mermaid += `    ${node.id.replace(/[\/\-\.]/g, '_')}["${label}"]\n`;
  });
  
  // Add edges
  edges.forEach(edge => {
    const from = edge.from.replace(/[\/\-\.]/g, '_');
    const to = edge.to.replace(/[\/\-\.]/g, '_');
    mermaid += `    ${from} --> ${to}\n`;
  });
  
  mermaid += '```';
  
  return mermaid;
}

/**
 * Generate recommendations
 */
function generateRecommendations(summary, codeIssues, dependencies) {
  const recommendations = {
    high: [],
    medium: [],
    low: []
  };
  
  // High priority
  if (dependencies.circular.length > 0) {
    recommendations.high.push({
      issue: 'Circular Dependencies Detected',
      description: `Found ${dependencies.circular.length} circular dependencies that should be resolved`,
      action: 'Refactor code to break circular dependencies, consider using dependency injection or interfaces'
    });
  }
  
  if (summary.codeQuality.highComplexityFunctions > 10) {
    recommendations.high.push({
      issue: 'High Function Complexity',
      description: `${summary.codeQuality.highComplexityFunctions} functions have complexity > 10`,
      action: 'Break down complex functions into smaller, more manageable pieces'
    });
  }
  
  // Medium priority
  if (summary.codeQuality.namingIssues > 20) {
    recommendations.medium.push({
      issue: 'Inconsistent Naming Conventions',
      description: `Found ${summary.codeQuality.namingIssues} naming convention violations`,
      action: 'Establish and enforce consistent naming conventions across the codebase'
    });
  }
  
  if (summary.codeQuality.typeIssues > 50) {
    recommendations.medium.push({
      issue: 'Missing Type Annotations',
      description: `${summary.codeQuality.typeIssues} places could benefit from explicit type annotations`,
      action: 'Add explicit type annotations to improve type safety and code documentation'
    });
  }
  
  // Low priority
  const lowCohesionModules = Object.entries(dependencies.cohesion)
    .filter(([_, m]) => m.cohesion < 0.5)
    .map(([name, _]) => name);
    
  if (lowCohesionModules.length > 0) {
    recommendations.low.push({
      issue: 'Low Module Cohesion',
      description: `Modules ${lowCohesionModules.join(', ')} have low cohesion`,
      action: 'Consider reorganizing code to improve module cohesion'
    });
  }
  
  return recommendations;
}

/**
 * Generate full report
 */
function generateFullReport(inventory, codeIssues, dependencies) {
  const summary = generateSummary(inventory, codeIssues, dependencies);
  const fileTable = generateFileTable(inventory, codeIssues);
  const diagram = generateDependencyDiagram(dependencies.graph);
  const recommendations = generateRecommendations(summary, codeIssues, dependencies);
  
  const report = `# Code Quality Audit Report

Generated: ${new Date().toISOString()}

## Executive Summary

### Overview
- **Total Files**: ${summary.overview.totalFiles}
- **Total Lines**: ${summary.overview.totalLines}
- **Total Size**: ${summary.overview.totalSize}
- **Average Lines per File**: ${summary.overview.avgLinesPerFile}

### Code Quality Metrics
- **Total Issues Found**: ${summary.codeQuality.totalIssues}
- **High Complexity Functions**: ${summary.codeQuality.highComplexityFunctions}
- **Naming Convention Issues**: ${summary.codeQuality.namingIssues}
- **Type Annotation Issues**: ${summary.codeQuality.typeIssues}

### Architecture Metrics
- **Total Dependencies**: ${summary.architecture.totalDependencies}
- **Circular Dependencies**: ${summary.architecture.circularDependencies}
- **Number of Modules**: ${summary.architecture.modules}
- **Average Module Cohesion**: ${summary.architecture.avgModuleCohesion}

## File Inventory (Top 20 by Size)

${fileTable}

## Dependency Diagram (Top 20 Files)

${diagram}

## Recommendations

### High Priority

${recommendations.high.map(r => `
#### ${r.issue}
- **Description**: ${r.description}
- **Action**: ${r.action}
`).join('\n')}

### Medium Priority

${recommendations.medium.map(r => `
#### ${r.issue}
- **Description**: ${r.description}
- **Action**: ${r.action}
`).join('\n')}

### Low Priority

${recommendations.low.map(r => `
#### ${r.issue}
- **Description**: ${r.description}
- **Action**: ${r.action}
`).join('\n')}

## Detailed Analysis

### Module Cohesion Analysis

${Object.entries(dependencies.cohesion).map(([module, metrics]) => `
- **${module}**: Cohesion ${(metrics.cohesion * 100).toFixed(1)}%, Coupling ${(metrics.coupling * 100).toFixed(1)}%
  - Files: ${metrics.files.length}
  - Internal Dependencies: ${metrics.internalEdges}
  - External Dependencies: ${metrics.externalEdges}
`).join('\n')}

### Circular Dependencies

${dependencies.circular.length > 0 ? 
  dependencies.circular.map((cycle, i) => `
${i + 1}. ${cycle.join(' → ')}
`).join('\n') : 
  'No circular dependencies detected.'}

## Conclusion

This audit has identified ${summary.codeQuality.totalIssues} total issues across ${summary.overview.totalFiles} files. The codebase shows ${summary.architecture.circularDependencies > 0 ? 'some architectural concerns with circular dependencies' : 'good architectural structure with no circular dependencies'}. Focus should be placed on addressing the high-priority recommendations to improve code quality and maintainability.
`;
  
  return report;
}

module.exports = {
  generateSummary,
  generateFileTable,
  generateDependencyDiagram,
  generateRecommendations,
  generateFullReport
};