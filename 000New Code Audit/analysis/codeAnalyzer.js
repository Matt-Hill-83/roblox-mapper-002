const fs = require('fs');

/**
 * Calculate cyclomatic complexity of a function
 */
function calculateComplexity(functionBody) {
  let complexity = 1; // Base complexity
  
  // Count decision points
  const decisionPatterns = [
    /\bif\b/g,
    /\belse\s+if\b/g,
    /\bfor\b/g,
    /\bwhile\b/g,
    /\bcase\b/g,
    /\bcatch\b/g,
    /\?\s*[^:]/g, // ternary operator
    /\|\|/g, // logical OR
    /&&/g   // logical AND
  ];
  
  decisionPatterns.forEach(pattern => {
    const matches = functionBody.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  });
  
  return complexity;
}

/**
 * Find duplicate code patterns
 */
function findDuplicates(files) {
  const codeBlocks = new Map();
  const duplicates = [];
  
  files.forEach(file => {
    const content = file.content;
    // Extract function bodies
    const functionMatches = content.match(/\{[^{}]*\}/g) || [];
    
    functionMatches.forEach(block => {
      // Normalize whitespace for comparison
      const normalized = block.replace(/\s+/g, ' ').trim();
      
      // Skip very small blocks
      if (normalized.length < 50) return;
      
      if (codeBlocks.has(normalized)) {
        duplicates.push({
          pattern: normalized.substring(0, 100) + '...',
          files: [codeBlocks.get(normalized), file.relativePath]
        });
      } else {
        codeBlocks.set(normalized, file.relativePath);
      }
    });
  });
  
  return duplicates;
}

/**
 * Check naming conventions
 */
function checkNamingConventions(content, filePath) {
  const issues = [];
  
  // Check class names (should be PascalCase)
  const classMatches = content.match(/class\s+(\w+)/g) || [];
  classMatches.forEach(match => {
    const className = match.replace('class ', '');
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(className)) {
      issues.push({
        type: 'naming',
        message: `Class name '${className}' should be PascalCase`,
        file: filePath
      });
    }
  });
  
  // Check interface names (should be PascalCase, optionally with I prefix)
  const interfaceMatches = content.match(/interface\s+(\w+)/g) || [];
  interfaceMatches.forEach(match => {
    const interfaceName = match.replace('interface ', '');
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(interfaceName)) {
      issues.push({
        type: 'naming',
        message: `Interface name '${interfaceName}' should be PascalCase`,
        file: filePath
      });
    }
  });
  
  // Check function names (should be camelCase)
  const functionMatches = content.match(/function\s+(\w+)/g) || [];
  functionMatches.forEach(match => {
    const functionName = match.replace('function ', '');
    if (!/^[a-z][a-zA-Z0-9]*$/.test(functionName)) {
      issues.push({
        type: 'naming',
        message: `Function name '${functionName}' should be camelCase`,
        file: filePath
      });
    }
  });
  
  return issues;
}

/**
 * Find missing type annotations
 */
function findMissingTypes(content, filePath) {
  const issues = [];
  
  // Check function parameters without types
  const functionParams = content.match(/\(([^)]*)\)\s*{/g) || [];
  functionParams.forEach(params => {
    const paramList = params.match(/\(([^)]*)\)/)[1];
    if (paramList && !paramList.includes(':')) {
      issues.push({
        type: 'type',
        message: `Function parameters missing type annotations: ${params}`,
        file: filePath
      });
    }
  });
  
  // Check variables declared with let/const without types
  const varDeclarations = content.match(/(let|const)\s+\w+\s*=/g) || [];
  varDeclarations.forEach(declaration => {
    if (!declaration.includes(':')) {
      // Allow type inference for simple cases
      const afterEquals = content.substring(content.indexOf(declaration) + declaration.length);
      const firstChar = afterEquals.trim()[0];
      // Skip if it's a simple literal or new instance
      if (!'"\'{[0123456789'.includes(firstChar) && !afterEquals.trim().startsWith('new ')) {
        issues.push({
          type: 'type',
          message: `Variable declaration might benefit from explicit type: ${declaration}`,
          file: filePath
        });
      }
    }
  });
  
  return issues;
}

/**
 * Analyze a single file
 */
function analyzeFile(file) {
  const content = file.content;
  const issues = [];
  
  // Calculate complexity for functions
  const functionBodies = content.match(/function[^{]+\{([^}]+)\}/g) || [];
  const complexFunctions = [];
  
  functionBodies.forEach(func => {
    const complexity = calculateComplexity(func);
    if (complexity > 10) {
      complexFunctions.push({
        complexity,
        preview: func.substring(0, 50) + '...'
      });
    }
  });
  
  if (complexFunctions.length > 0) {
    issues.push({
      type: 'complexity',
      message: `Found ${complexFunctions.length} functions with high complexity`,
      details: complexFunctions
    });
  }
  
  // Check naming conventions
  const namingIssues = checkNamingConventions(content, file.relativePath);
  issues.push(...namingIssues);
  
  // Find missing types
  const typeIssues = findMissingTypes(content, file.relativePath);
  issues.push(...typeIssues);
  
  return issues;
}

module.exports = {
  calculateComplexity,
  findDuplicates,
  checkNamingConventions,
  findMissingTypes,
  analyzeFile
};