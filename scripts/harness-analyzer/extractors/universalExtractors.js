const path = require('path');
const fs = require('fs');

function getDirectoryDepth(filePath, repoRoot) {
    const relativePath = path.relative(repoRoot, filePath);
    const depth = relativePath.split(path.sep).length - 1;
    
    if (depth <= 1) return 'root-level';
    if (depth <= 3) return 'shallow';
    if (depth <= 5) return 'moderate';
    if (depth <= 7) return 'deep';
    return 'very-deep';
}

function getFileExtension(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    // Group similar extensions
    const extensionGroups = {
        'go-source': ['.go'],
        'javascript': ['.js', '.mjs', '.cjs'],
        'typescript': ['.ts', '.tsx'],
        'python': ['.py', '.pyw'],
        'java': ['.java'],
        'config': ['.json', '.yaml', '.yml', '.toml', '.ini', '.conf'],
        'markup': ['.html', '.xml', '.svg'],
        'stylesheet': ['.css', '.scss', '.sass', '.less'],
        'documentation': ['.md', '.rst', '.txt'],
        'shell': ['.sh', '.bash', '.zsh'],
        'data': ['.csv', '.sql'],
        'build': ['.gradle', '.maven', '.make'],
        'other': []
    };
    
    for (const [group, extensions] of Object.entries(extensionGroups)) {
        if (extensions.includes(ext)) return group;
    }
    
    return ext || 'no-extension';
}

function hasTests(filePath, allFiles) {
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, path.extname(filePath));
    
    // Common test file patterns
    const testPatterns = [
        `${baseName}_test`,
        `${baseName}.test`,
        `${baseName}.spec`,
        `test_${baseName}`,
        `${baseName}Test`
    ];
    
    // Check if current file is in a test directory
    if (filePath.includes('/test/') || filePath.includes('/tests/') || 
        filePath.includes('/__tests__/') || filePath.includes('/spec/')) {
        return 'is-test';
    }
    
    // Check if a test file exists for this file
    const hasTestFile = allFiles.some(f => {
        const testBase = path.basename(f, path.extname(f));
        return path.dirname(f) === dir && testPatterns.some(pattern => testBase === pattern);
    });
    
    return hasTestFile ? 'has-tests' : 'no-tests';
}

function countImports(content, language) {
    let count = 0;
    
    if (language === 'go') {
        // Count import statements
        const importRegex = /^import\s+(\([\s\S]*?\)|"[^"]+"|`[^`]+`)/gm;
        const matches = content.match(importRegex);
        if (matches) {
            matches.forEach(match => {
                if (match.includes('(')) {
                    // Multi-line import
                    const imports = match.match(/"[^"]+"/g);
                    count += imports ? imports.length : 0;
                } else {
                    count += 1;
                }
            });
        }
    } else if (['javascript', 'typescript'].includes(language)) {
        // Count import/require statements
        const importRegex = /^(import|const|let|var)\s+.*?(from|require\()\s*['"`][^'"`]+['"`]/gm;
        const matches = content.match(importRegex);
        count = matches ? matches.length : 0;
    } else if (language === 'python') {
        // Count import statements
        const importRegex = /^(import|from)\s+\S+/gm;
        const matches = content.match(importRegex);
        count = matches ? matches.length : 0;
    }
    
    if (count === 0) return 'no-imports';
    if (count <= 3) return 'few-imports';
    if (count <= 8) return 'moderate-imports';
    if (count <= 15) return 'many-imports';
    return 'heavy-imports';
}

function countExports(content, language) {
    let count = 0;
    
    if (language === 'go') {
        // Count exported functions/types (capitalized names)
        const exportRegex = /^(func|type|var|const)\s+[A-Z][a-zA-Z0-9_]*/gm;
        const matches = content.match(exportRegex);
        count = matches ? matches.length : 0;
    } else if (['javascript', 'typescript'].includes(language)) {
        // Count export statements
        const exportRegex = /^export\s+(default|async|function|class|const|let|var|\{)/gm;
        const matches = content.match(exportRegex);
        count = matches ? matches.length : 0;
    } else if (language === 'python') {
        // Count class and function definitions (all are potentially exportable)
        const exportRegex = /^(class|def)\s+[a-zA-Z_]/gm;
        const matches = content.match(exportRegex);
        count = matches ? matches.length : 0;
    }
    
    if (count === 0) return 'no-exports';
    if (count === 1) return 'single-export';
    if (count <= 3) return 'few-exports';
    if (count <= 7) return 'moderate-exports';
    return 'many-exports';
}

function getLineCount(content) {
    const lines = content.split('\n').length;
    
    if (lines <= 50) return 'tiny-file';
    if (lines <= 150) return 'small-file';
    if (lines <= 300) return 'medium-file';
    if (lines <= 600) return 'large-file';
    return 'huge-file';
}

function getCommentDensity(content, language) {
    const lines = content.split('\n');
    let commentLines = 0;
    let inBlockComment = false;
    
    lines.forEach(line => {
        const trimmed = line.trim();
        
        if (language === 'go') {
            if (trimmed.startsWith('//') || (inBlockComment && !trimmed.includes('*/'))) {
                commentLines++;
            }
            if (trimmed.includes('/*')) inBlockComment = true;
            if (trimmed.includes('*/')) inBlockComment = false;
        } else if (['javascript', 'typescript'].includes(language)) {
            if (trimmed.startsWith('//') || (inBlockComment && !trimmed.includes('*/'))) {
                commentLines++;
            }
            if (trimmed.includes('/*')) inBlockComment = true;
            if (trimmed.includes('*/')) inBlockComment = false;
        } else if (language === 'python') {
            if (trimmed.startsWith('#')) {
                commentLines++;
            }
            // Handle docstrings
            if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
                inBlockComment = !inBlockComment;
                if (inBlockComment) commentLines++;
            } else if (inBlockComment) {
                commentLines++;
            }
        }
    });
    
    const density = lines.length > 0 ? (commentLines / lines.length) : 0;
    
    if (density === 0) return 'no-comments';
    if (density < 0.05) return 'minimal-comments';
    if (density < 0.15) return 'light-comments';
    if (density < 0.25) return 'moderate-comments';
    if (density < 0.4) return 'heavy-comments';
    return 'documentation-heavy';
}

function getLastModified(stats) {
    const daysSinceModified = (Date.now() - stats.mtime) / (1000 * 60 * 60 * 24);
    
    if (daysSinceModified <= 7) return 'very-recent';
    if (daysSinceModified <= 30) return 'recent';
    if (daysSinceModified <= 90) return 'moderate-age';
    if (daysSinceModified <= 180) return 'aging';
    if (daysSinceModified <= 365) return 'old';
    return 'ancient';
}

function getModuleType(filePath) {
    const pathLower = filePath.toLowerCase();
    
    if (pathLower.includes('/client/') || pathLower.includes('/frontend/') || 
        pathLower.includes('/ui/') || pathLower.includes('/views/')) {
        return 'client-module';
    }
    if (pathLower.includes('/server/') || pathLower.includes('/backend/') || 
        pathLower.includes('/api/')) {
        return 'server-module';
    }
    if (pathLower.includes('/shared/') || pathLower.includes('/common/') || 
        pathLower.includes('/lib/') || pathLower.includes('/utils/')) {
        return 'shared-module';
    }
    if (pathLower.includes('/config/') || pathLower.includes('/settings/') || 
        pathLower.endsWith('.config.js') || pathLower.endsWith('.conf')) {
        return 'config-module';
    }
    if (pathLower.includes('/docs/') || pathLower.includes('/documentation/')) {
        return 'docs-module';
    }
    if (pathLower.includes('/scripts/') || pathLower.includes('/tools/') || 
        pathLower.includes('/bin/')) {
        return 'script-module';
    }
    if (pathLower.includes('/test/') || pathLower.includes('/tests/') || 
        pathLower.includes('/spec/')) {
        return 'test-module';
    }
    if (pathLower.includes('/build/') || pathLower.includes('/dist/') || 
        pathLower.includes('/out/')) {
        return 'build-module';
    }
    
    return 'general-module';
}

function getComplexityScore(content, language) {
    let score = 0;
    
    // Count control flow statements
    const controlFlowPatterns = {
        'go': [/\bif\b/g, /\bfor\b/g, /\bswitch\b/g, /\bcase\b/g, /\bselect\b/g],
        'javascript': [/\bif\b/g, /\bfor\b/g, /\bwhile\b/g, /\bswitch\b/g, /\bcase\b/g, /\bcatch\b/g],
        'typescript': [/\bif\b/g, /\bfor\b/g, /\bwhile\b/g, /\bswitch\b/g, /\bcase\b/g, /\bcatch\b/g],
        'python': [/\bif\b/g, /\bfor\b/g, /\bwhile\b/g, /\belif\b/g, /\bexcept\b/g, /\bwith\b/g]
    };
    
    const patterns = controlFlowPatterns[language] || [];
    patterns.forEach(pattern => {
        const matches = content.match(pattern);
        score += matches ? matches.length : 0;
    });
    
    // Add nesting depth estimation
    const lines = content.split('\n');
    let maxIndent = 0;
    lines.forEach(line => {
        const indent = line.match(/^(\s*)/)[1].length;
        maxIndent = Math.max(maxIndent, indent);
    });
    score += Math.floor(maxIndent / 4); // Assuming 4-space indents
    
    if (score === 0) return 'trivial';
    if (score <= 5) return 'simple-logic';
    if (score <= 15) return 'moderate-logic';
    if (score <= 30) return 'complex-logic';
    if (score <= 50) return 'very-complex';
    return 'extremely-complex';
}

module.exports = {
    getDirectoryDepth,
    getFileExtension,
    hasTests,
    countImports,
    countExports,
    getLineCount,
    getCommentDensity,
    getLastModified,
    getModuleType,
    getComplexityScore
};