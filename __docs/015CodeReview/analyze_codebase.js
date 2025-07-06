const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = '/Users/__projects/roblox-mapper-002-multi/vscode/src';
const OUTPUT_FILE = '/Users/__projects/roblox-mapper-002-multi/vscode/codebase_analysis.json';

// Data structures
const fileData = new Map();
const importGraph = new Map();
const exportData = new Map();

// Helper functions
function getFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size;
}

function countLines(content) {
    return content.split('\n').length;
}

function extractImports(content, filePath) {
    const imports = [];
    const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    const requireRegex = /require\s*\(['"]([^'"]+)['"]\)/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[1]);
    }
    while ((match = requireRegex.exec(content)) !== null) {
        imports.push(match[1]);
    }
    
    return imports;
}

function extractExports(content) {
    const exports = [];
    
    // Named exports
    const namedExportRegex = /export\s+(?:const|let|var|function|class|interface|type|enum)\s+(\w+)/g;
    let match;
    while ((match = namedExportRegex.exec(content)) !== null) {
        exports.push({ name: match[1], type: 'named' });
    }
    
    // Export statements
    const exportStatementRegex = /export\s+{([^}]+)}/g;
    while ((match = exportStatementRegex.exec(content)) !== null) {
        const names = match[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0]);
        names.forEach(name => exports.push({ name, type: 'named' }));
    }
    
    // Default exports
    if (/export\s+default\s+/.test(content)) {
        exports.push({ name: 'default', type: 'default' });
    }
    
    return exports;
}

function resolveImportPath(fromFile, importPath) {
    // Handle relative imports
    if (importPath.startsWith('.')) {
        const fromDir = path.dirname(fromFile);
        let resolved = path.resolve(fromDir, importPath);
        
        // Try with .ts extension
        if (fs.existsSync(resolved + '.ts')) {
            return resolved + '.ts';
        }
        // Try as directory with index.ts
        if (fs.existsSync(path.join(resolved, 'index.ts'))) {
            return path.join(resolved, 'index.ts');
        }
        // Return as is if file exists
        if (fs.existsSync(resolved)) {
            return resolved;
        }
    }
    
    // Handle @rbxts imports
    if (importPath.startsWith('@rbxts/')) {
        return 'external:' + importPath;
    }
    
    return null;
}

function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = countLines(content);
    const size = getFileSize(filePath);
    const imports = extractImports(content, filePath);
    const exports = extractExports(content);
    
    // Store file data
    fileData.set(filePath, {
        path: filePath,
        relativePath: path.relative(SRC_DIR, filePath),
        lines,
        size,
        imports: imports.length,
        exports: exports.length,
        exportDetails: exports,
        importDetails: imports,
        importedBy: [],
        category: detectCategory(filePath),
        purpose: detectPurpose(content, filePath)
    });
    
    // Build import graph
    imports.forEach(imp => {
        const resolvedPath = resolveImportPath(filePath, imp);
        if (resolvedPath && !resolvedPath.startsWith('external:')) {
            if (!importGraph.has(resolvedPath)) {
                importGraph.set(resolvedPath, []);
            }
            importGraph.get(resolvedPath).push(filePath);
        }
    });
    
    // Store export data
    exportData.set(filePath, exports);
}

function detectCategory(filePath) {
    const relativePath = path.relative(SRC_DIR, filePath);
    if (relativePath.startsWith('client/')) return 'client';
    if (relativePath.startsWith('server/')) return 'server';
    if (relativePath.startsWith('shared/')) return 'shared';
    return 'unknown';
}

function detectPurpose(content, filePath) {
    const fileName = path.basename(filePath);
    const dirName = path.basename(path.dirname(filePath));
    
    // Common patterns
    if (fileName.includes('.service.')) return 'service';
    if (fileName.includes('.controller.')) return 'controller';
    if (fileName.includes('.interface.')) return 'type-definitions';
    if (fileName.includes('Data.ts')) return 'data';
    if (fileName === 'index.ts') return 'module-export';
    if (fileName === 'constants.ts') return 'constants';
    if (fileName === 'utilities.ts' || fileName === 'utils.ts') return 'utilities';
    if (fileName.includes('Maker')) return 'component-maker';
    if (fileName.includes('Renderer')) return 'renderer';
    if (fileName.includes('Layout')) return 'layout';
    if (fileName.includes('Test')) return 'test';
    
    // Content-based detection
    if (content.includes('export interface') || content.includes('export type')) {
        return 'type-definitions';
    }
    if (content.includes('export const') && content.includes('= {')) {
        return 'configuration';
    }
    
    return 'general';
}

function findAllTypeScriptFiles(dir) {
    const files = [];
    
    function walk(currentPath) {
        const entries = fs.readdirSync(currentPath);
        
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                walk(fullPath);
            } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
                files.push(fullPath);
            }
        }
    }
    
    walk(dir);
    return files;
}

// Main analysis
console.log('Starting codebase analysis...');

const files = findAllTypeScriptFiles(SRC_DIR);
console.log(`Found ${files.length} TypeScript files`);

// Analyze each file
files.forEach(file => {
    try {
        analyzeFile(file);
    } catch (error) {
        console.error(`Error analyzing ${file}:`, error.message);
    }
});

// Update importedBy references
importGraph.forEach((importers, imported) => {
    if (fileData.has(imported)) {
        fileData.get(imported).importedBy = importers.map(imp => path.relative(SRC_DIR, imp));
    }
});

// Find orphaned files
const orphanedFiles = [];
fileData.forEach((data, filePath) => {
    if (data.importedBy.length === 0 && !filePath.endsWith('main.server.ts') && !filePath.endsWith('main.client.ts')) {
        orphanedFiles.push(data.relativePath);
    }
});

// Find large files
const largeFiles = [];
fileData.forEach((data) => {
    if (data.lines > 300) {
        largeFiles.push({
            path: data.relativePath,
            lines: data.lines,
            size: data.size
        });
    }
});

// Generate statistics
const stats = {
    totalFiles: files.length,
    byCategory: {},
    byPurpose: {},
    averageLines: 0,
    averageSize: 0,
    totalImports: 0,
    totalExports: 0
};

let totalLines = 0;
let totalSize = 0;

fileData.forEach((data) => {
    // Category stats
    if (!stats.byCategory[data.category]) {
        stats.byCategory[data.category] = { count: 0, files: [] };
    }
    stats.byCategory[data.category].count++;
    
    // Purpose stats
    if (!stats.byPurpose[data.purpose]) {
        stats.byPurpose[data.purpose] = { count: 0, files: [] };
    }
    stats.byPurpose[data.purpose].count++;
    
    totalLines += data.lines;
    totalSize += data.size;
    stats.totalImports += data.imports;
    stats.totalExports += data.exports;
});

stats.averageLines = Math.round(totalLines / files.length);
stats.averageSize = Math.round(totalSize / files.length);

// Create final report
const report = {
    summary: stats,
    orphanedFiles: orphanedFiles.sort(),
    largeFiles: largeFiles.sort((a, b) => b.lines - a.lines),
    fileDetails: Array.from(fileData.values()).sort((a, b) => a.relativePath.localeCompare(b.relativePath))
};

// Write report
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
console.log(`Analysis complete. Results written to ${OUTPUT_FILE}`);

// Print summary
console.log('\n=== SUMMARY ===');
console.log(`Total files: ${stats.totalFiles}`);
console.log(`Average lines per file: ${stats.averageLines}`);
console.log(`Orphaned files: ${orphanedFiles.length}`);
console.log(`Large files (>300 lines): ${largeFiles.length}`);
console.log('\nBy category:');
Object.entries(stats.byCategory).forEach(([cat, data]) => {
    console.log(`  ${cat}: ${data.count} files`);
});
console.log('\nBy purpose:');
Object.entries(stats.byPurpose).forEach(([purpose, data]) => {
    console.log(`  ${purpose}: ${data.count} files`);
});