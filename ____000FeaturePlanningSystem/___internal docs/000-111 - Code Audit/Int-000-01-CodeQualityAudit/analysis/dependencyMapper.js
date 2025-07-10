const path = require('path');

/**
 * Extract imports from a TypeScript file
 */
function extractImports(content, filePath) {
  const imports = [];
  
  // Match various import patterns
  const importPatterns = [
    // import { X } from 'Y'
    /import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/g,
    // import X from 'Y'
    /import\s+(\w+)\s+from\s*["']([^"']+)["']/g,
    // import * as X from 'Y'
    /import\s*\*\s*as\s+(\w+)\s+from\s*["']([^"']+)["']/g,
    // import 'Y'
    /import\s*["']([^"']+)["']/g
  ];
  
  importPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const importPath = match[match.length - 1];
      imports.push({
        from: filePath,
        to: importPath,
        type: getImportType(importPath)
      });
    }
  });
  
  return imports;
}

/**
 * Determine import type
 */
function getImportType(importPath) {
  if (importPath.startsWith('@rbxts/')) return 'rbxts';
  if (importPath.startsWith('.')) return 'relative';
  if (importPath.includes('/')) return 'package';
  return 'module';
}

/**
 * Build dependency graph
 */
function buildDependencyGraph(files) {
  const graph = {
    nodes: [],
    edges: []
  };
  
  // Create nodes for each file
  files.forEach(file => {
    graph.nodes.push({
      id: file.relativePath,
      label: path.basename(file.relativePath),
      type: getFileType(file.relativePath),
      size: file.lines
    });
  });
  
  // Create edges for dependencies
  files.forEach(file => {
    const imports = extractImports(file.content, file.relativePath);
    imports.forEach(imp => {
      // Resolve relative imports
      if (imp.type === 'relative') {
        const fromDir = path.dirname(file.relativePath);
        const resolved = path.join(fromDir, imp.to);
        const normalizedPath = resolved.replace(/\\/g, '/');
        
        // Find matching file
        const targetFile = files.find(f => {
          const normalized = f.relativePath.replace(/\\/g, '/');
          return normalized === normalizedPath + '.ts' || 
                 normalized === normalizedPath + '.tsx' ||
                 normalized === normalizedPath + '/index.ts';
        });
        
        if (targetFile) {
          graph.edges.push({
            from: file.relativePath,
            to: targetFile.relativePath,
            type: 'import'
          });
        }
      }
    });
  });
  
  return graph;
}

/**
 * Get file type based on path
 */
function getFileType(filePath) {
  if (filePath.includes('/client/')) return 'client';
  if (filePath.includes('/server/')) return 'server';
  if (filePath.includes('/shared/')) return 'shared';
  if (filePath.includes('/interfaces/')) return 'interface';
  if (filePath.includes('/services/')) return 'service';
  if (filePath.includes('/modules/')) return 'module';
  return 'other';
}

/**
 * Find circular dependencies
 */
function findCircularDependencies(graph) {
  const circular = [];
  const visited = new Set();
  const recursionStack = new Set();
  
  function dfs(node, path = []) {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);
    
    const edges = graph.edges.filter(e => e.from === node);
    for (const edge of edges) {
      if (!visited.has(edge.to)) {
        dfs(edge.to, [...path]);
      } else if (recursionStack.has(edge.to)) {
        // Found circular dependency
        const cycleStart = path.indexOf(edge.to);
        const cycle = path.slice(cycleStart);
        cycle.push(edge.to);
        circular.push(cycle);
      }
    }
    
    recursionStack.delete(node);
  }
  
  // Check all nodes
  graph.nodes.forEach(node => {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  });
  
  return circular;
}

/**
 * Analyze module cohesion
 */
function analyzeModuleCohesion(graph) {
  const modules = {};
  
  // Group files by module
  graph.nodes.forEach(node => {
    const module = node.id.split('/')[0];
    if (!modules[module]) {
      modules[module] = {
        files: [],
        internalEdges: 0,
        externalEdges: 0
      };
    }
    modules[module].files.push(node.id);
  });
  
  // Count internal vs external edges
  graph.edges.forEach(edge => {
    const fromModule = edge.from.split('/')[0];
    const toModule = edge.to.split('/')[0];
    
    if (fromModule === toModule) {
      modules[fromModule].internalEdges++;
    } else {
      modules[fromModule].externalEdges++;
    }
  });
  
  // Calculate cohesion metrics
  Object.keys(modules).forEach(module => {
    const m = modules[module];
    const total = m.internalEdges + m.externalEdges;
    m.cohesion = total > 0 ? m.internalEdges / total : 1;
    m.coupling = total > 0 ? m.externalEdges / total : 0;
  });
  
  return modules;
}

module.exports = {
  extractImports,
  buildDependencyGraph,
  findCircularDependencies,
  analyzeModuleCohesion
};