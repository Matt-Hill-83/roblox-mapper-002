const fs = require('fs');
const path = require('path');

/**
 * Recursively scan directory for TypeScript files
 */
function scanDirectory(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and output directories
      if (file !== 'node_modules' && file !== 'out' && file !== '.git') {
        scanDirectory(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Get file metrics
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
 * Count occurrences of patterns in file
 */
function countPatterns(content) {
  const patterns = {
    functions: (content.match(/function\s+\w+|=>\s*{|=\s*\([^)]*\)\s*=>/g) || []).length,
    classes: (content.match(/class\s+\w+/g) || []).length,
    interfaces: (content.match(/interface\s+\w+/g) || []).length,
    exports: (content.match(/export\s+(default\s+)?/g) || []).length,
    imports: (content.match(/import\s+/g) || []).length,
    todos: (content.match(/\/\/\s*(TODO|FIXME|HACK)/gi) || []).length
  };
  
  return patterns;
}

module.exports = {
  scanDirectory,
  getFileMetrics,
  countPatterns
};