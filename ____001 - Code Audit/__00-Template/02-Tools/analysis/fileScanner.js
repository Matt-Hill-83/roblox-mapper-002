const fs = require('fs');
const path = require('path');

/**
 * File Scanner Module
 * 
 * This module provides utilities for scanning TypeScript files in a project.
 * It recursively scans directories, collects file metrics, and counts code patterns.
 * 
 * Usage:
 * const { scanDirectory, getFileMetrics, countPatterns } = require('./fileScanner');
 * const files = scanDirectory('/path/to/src');
 * 
 * Note: The src path should be adjusted based on where this script is located
 * relative to the project root.
 */

/**
 * Recursively scan directory for TypeScript files
 * @param {string} dirPath - The directory path to scan
 * @param {string[]} fileList - Accumulator for found files (used internally)
 * @returns {string[]} Array of absolute file paths
 */
function scanDirectory(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, output directories, and audit folders
      const skipDirs = ['node_modules', 'out', '.git', 'dist', 'build', 'coverage'];
      const shouldSkip = skipDirs.includes(file) || file.startsWith('____') || file.startsWith('___');
      if (!shouldSkip) {
        scanDirectory(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Get file metrics including size, line count, and content
 * @param {string} filePath - Absolute path to the file
 * @returns {Object} File metrics object containing path, name, size, lines, lastModified, and content
 */
function getFileMetrics(filePath) {
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  return {
    path: filePath,
    name: path.basename(filePath),
    size: stats.size,
    lines: lines.length,
    lastModified: stats.mtime,
    content: content
  };
}

/**
 * Count occurrences of various code patterns in file content
 * @param {string} content - The file content to analyze
 * @returns {Object} Object with counts for functions, classes, interfaces, exports, imports, todos, any types, and type assertions
 */
function countPatterns(content) {
  const patterns = {
    functions: (content.match(/function\s+\w+|=>\s*{|=\s*\([^)]*\)\s*=>/g) || []).length,
    classes: (content.match(/class\s+\w+/g) || []).length,
    interfaces: (content.match(/interface\s+\w+/g) || []).length,
    exports: (content.match(/export\s+(default\s+)?/g) || []).length,
    imports: (content.match(/import\s+/g) || []).length,
    todos: (content.match(/\/\/\s*(TODO|FIXME|HACK)/gi) || []).length,
    any: (content.match(/:\s*any\b/g) || []).length,
    typeAssertions: (content.match(/as\s+\w+/g) || []).length,
    asyncFunctions: (content.match(/async\s+(function|\()/g) || []).length
  };
  
  return patterns;
}

module.exports = {
  scanDirectory,
  getFileMetrics,
  countPatterns
};