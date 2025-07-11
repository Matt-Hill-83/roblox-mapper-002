const fs = require('fs');
const path = require('path');

// Read the detailed analysis
const analysisPath = path.join(__dirname, '03-Results/data/detailedAnalysis.json');
const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

// Create dependency map
const dependencyMap = {};
const circularDeps = [];

// Analyze imports in each file
analysis.files.forEach(file => {
  const imports = [];
  
  // Simple regex to find import statements
  const importMatches = file.content ? file.content.match(/import\s+.*?\s+from\s+["'](.+?)["']/g) : [];
  
  if (importMatches) {
    importMatches.forEach(match => {
      const fromMatch = match.match(/from\s+["'](.+?)["']/);
      if (fromMatch) {
        const importPath = fromMatch[1];
        if (importPath.startsWith('./') || importPath.startsWith('../')) {
          imports.push(importPath);
        }
      }
    });
  }
  
  dependencyMap[file.path] = {
    imports: imports,
    importCount: imports.length,
    exportCount: file.patterns.exports,
    isService: file.path.includes('/services/'),
    isComponent: file.path.includes('/components/'),
    isUtil: file.path.includes('/utils/'),
    isInterface: file.path.includes('/interfaces/'),
    isRenderer: file.path.includes('/renderers/')
  };
});

// Analyze architectural patterns
const architectureAnalysis = {
  services: {
    count: 0,
    avgComplexity: 0,
    files: []
  },
  components: {
    count: 0,
    avgComplexity: 0,
    files: []
  },
  renderers: {
    count: 0,
    avgComplexity: 0,
    files: []
  },
  utils: {
    count: 0,
    avgComplexity: 0,
    files: []
  }
};

// Categorize files
analysis.files.forEach(file => {
  const dep = dependencyMap[file.path];
  const category = {
    path: file.path,
    complexity: file.complexity,
    lines: file.lines
  };
  
  if (dep.isService) {
    architectureAnalysis.services.files.push(category);
    architectureAnalysis.services.count++;
    architectureAnalysis.services.avgComplexity += file.complexity;
  } else if (dep.isComponent) {
    architectureAnalysis.components.files.push(category);
    architectureAnalysis.components.count++;
    architectureAnalysis.components.avgComplexity += file.complexity;
  } else if (dep.isRenderer) {
    architectureAnalysis.renderers.files.push(category);
    architectureAnalysis.renderers.count++;
    architectureAnalysis.renderers.avgComplexity += file.complexity;
  } else if (dep.isUtil) {
    architectureAnalysis.utils.files.push(category);
    architectureAnalysis.utils.count++;
    architectureAnalysis.utils.avgComplexity += file.complexity;
  }
});

// Calculate averages
Object.keys(architectureAnalysis).forEach(category => {
  const cat = architectureAnalysis[category];
  if (cat.count > 0) {
    cat.avgComplexity = Math.round(cat.avgComplexity / cat.count * 10) / 10;
  }
});

// Create architecture report
const architectureReport = {
  summary: {
    totalModules: analysis.summary.totalFiles,
    byCategory: architectureAnalysis,
    patterns: analysis.patterns
  },
  dependencies: {
    totalImports: analysis.patterns.totalImports,
    totalExports: analysis.patterns.totalExports,
    avgImportsPerFile: Math.round(analysis.patterns.totalImports / analysis.summary.totalFiles * 10) / 10
  },
  recommendations: [
    "Extract test data files to reduce codebase size by 69%",
    "Refactor complex UI components (layerGrid.ts)",
    "Break down large core modules (dataGenerator.ts, positionCalculator.ts)",
    "Implement dependency injection for better testability",
    "Add code quality metrics and monitoring"
  ]
};

// Save dependency analysis
fs.writeFileSync(
  path.join(__dirname, '03-Results/data/dependencyAnalysis.json'),
  JSON.stringify({ dependencyMap, architectureReport }, null, 2)
);

console.log('Dependency analysis complete!');
console.log('Architecture breakdown:');
console.log(`- Services: ${architectureAnalysis.services.count} files, avg complexity: ${architectureAnalysis.services.avgComplexity}`);
console.log(`- Components: ${architectureAnalysis.components.count} files, avg complexity: ${architectureAnalysis.components.avgComplexity}`);
console.log(`- Renderers: ${architectureAnalysis.renderers.count} files, avg complexity: ${architectureAnalysis.renderers.avgComplexity}`);
console.log(`- Utils: ${architectureAnalysis.utils.count} files, avg complexity: ${architectureAnalysis.utils.avgComplexity}`);