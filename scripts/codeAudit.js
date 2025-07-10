#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'src');
const OUTPUT_FILE = path.join(__dirname, '..', 'F004-CodeQualityReport.md');

// Metrics storage
const fileMetrics = [];
const issues = [];
const dependencies = new Map();

// Helper functions
function getFileStats(filePath) {
    const stats = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    
    return {
        path: path.relative(path.join(__dirname, '..'), filePath),
        size: stats.size,
        lines: lines.length,
        nonEmptyLines: nonEmptyLines.length,
        content: content
    };
}

function analyzeComplexity(content, filePath) {
    let complexity = 0;
    const issues = [];
    
    // Count decision points (if, else, switch, for, while, etc.)
    const decisionPoints = (content.match(/\b(if|else|switch|for|while|do|catch|\?|&&|\|\|)\b/g) || []).length;
    complexity += decisionPoints;
    
    // Check for deeply nested code (more than 3 levels)
    const lines = content.split('\n');
    let maxNesting = 0;
    let currentNesting = 0;
    
    lines.forEach((line, index) => {
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        currentNesting += openBraces - closeBraces;
        maxNesting = Math.max(maxNesting, currentNesting);
        
        if (currentNesting > 3) {
            issues.push({
                type: 'complexity',
                severity: 'medium',
                line: index + 1,
                message: `Deep nesting detected (level ${currentNesting})`
            });
        }
    });
    
    // Check for long functions
    const functionMatches = content.matchAll(/(?:function\s+\w+|(?:const|let|var)\s+\w+\s*=\s*(?:async\s+)?(?:\([^)]*\)|[^=])\s*=>|\w+\s*\([^)]*\)\s*{)/g);
    for (const match of functionMatches) {
        const startIndex = match.index;
        let braceCount = 0;
        let inFunction = false;
        let functionLength = 0;
        
        for (let i = startIndex; i < content.length; i++) {
            if (content[i] === '{') {
                braceCount++;
                inFunction = true;
            } else if (content[i] === '}') {
                braceCount--;
                if (braceCount === 0 && inFunction) {
                    functionLength = content.substring(startIndex, i).split('\n').length;
                    if (functionLength > 50) {
                        issues.push({
                            type: 'complexity',
                            severity: 'high',
                            line: content.substring(0, startIndex).split('\n').length,
                            message: `Long function detected (${functionLength} lines)`
                        });
                        complexity += Math.floor(functionLength / 50) * 5;
                    }
                    break;
                }
            }
        }
    }
    
    return { 
        score: complexity, 
        level: complexity < 10 ? 'Low' : complexity < 25 ? 'Medium' : 'High',
        issues: issues 
    };
}

function checkNamingConventions(content, filePath) {
    const issues = [];
    const lines = content.split('\n');
    
    // Check for non-camelCase variables
    const variablePattern = /(?:const|let|var)\s+([a-zA-Z_]\w*)/g;
    let match;
    while ((match = variablePattern.exec(content)) !== null) {
        const varName = match[1];
        if (!/^[a-z][a-zA-Z0-9]*$/.test(varName) && !/^[A-Z][A-Z0-9_]*$/.test(varName)) {
            const line = content.substring(0, match.index).split('\n').length;
            issues.push({
                type: 'naming',
                severity: 'low',
                line: line,
                message: `Variable '${varName}' doesn't follow camelCase convention`
            });
        }
    }
    
    // Check for non-PascalCase classes and interfaces
    const classPattern = /(?:class|interface|type)\s+([a-zA-Z_]\w*)/g;
    while ((match = classPattern.exec(content)) !== null) {
        const className = match[1];
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(className)) {
            const line = content.substring(0, match.index).split('\n').length;
            issues.push({
                type: 'naming',
                severity: 'medium',
                line: line,
                message: `Class/Interface '${className}' should use PascalCase`
            });
        }
    }
    
    return issues;
}

function checkTypeAnnotations(content, filePath) {
    const issues = [];
    
    // Check for functions without return type annotations
    const functionPattern = /(?:function\s+(\w+)|(?:const|let)\s+(\w+)\s*=\s*(?:async\s+)?)(?:\([^)]*\))\s*(?:=>)?\s*{/g;
    let match;
    while ((match = functionPattern.exec(content)) !== null) {
        const beforeFunction = content.substring(match.index - 50, match.index);
        if (!beforeFunction.includes(':') && !content.substring(match.index, match.index + 200).includes(': void')) {
            const line = content.substring(0, match.index).split('\n').length;
            const funcName = match[1] || match[2];
            issues.push({
                type: 'type-annotation',
                severity: 'medium',
                line: line,
                message: `Function '${funcName}' is missing return type annotation`
            });
        }
    }
    
    // Check for 'any' type usage
    const anyPattern = /:\s*any\b/g;
    while ((match = anyPattern.exec(content)) !== null) {
        const line = content.substring(0, match.index).split('\n').length;
        issues.push({
            type: 'type-annotation',
            severity: 'high',
            line: line,
            message: `Avoid using 'any' type`
        });
    }
    
    return issues;
}

function findDuplicateCode(files) {
    const codeBlocks = new Map();
    const duplicates = [];
    
    files.forEach(file => {
        const lines = file.content.split('\n');
        
        // Look for duplicate blocks of 5+ lines
        for (let i = 0; i < lines.length - 5; i++) {
            const block = lines.slice(i, i + 5).join('\n').trim();
            if (block.length > 100) { // Minimum character threshold
                if (codeBlocks.has(block)) {
                    const existing = codeBlocks.get(block);
                    duplicates.push({
                        type: 'duplicate',
                        severity: 'medium',
                        files: [existing.file, file.path],
                        lines: [existing.line, i + 1],
                        message: `Duplicate code block found (5+ lines)`
                    });
                } else {
                    codeBlocks.set(block, { file: file.path, line: i + 1 });
                }
            }
        }
    });
    
    return duplicates;
}

function analyzeDependencies(content, filePath) {
    const imports = [];
    const importPattern = /import\s+(?:{[^}]+}|[^;]+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importPattern.exec(content)) !== null) {
        imports.push(match[1]);
    }
    
    dependencies.set(filePath, imports);
    return imports;
}

function generateReport(files, allIssues) {
    const totalFiles = files.length;
    const totalLines = files.reduce((sum, f) => sum + f.lines, 0);
    const totalIssues = allIssues.length;
    const avgComplexity = files.reduce((sum, f) => sum + (f.complexity?.score || 0), 0) / totalFiles;
    
    const highPriorityIssues = allIssues.filter(i => i.severity === 'high');
    const mediumPriorityIssues = allIssues.filter(i => i.severity === 'medium');
    const lowPriorityIssues = allIssues.filter(i => i.severity === 'low');
    
    let report = `# F004 - Code Quality Audit Report

Generated: ${new Date().toISOString()}

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Files | ${totalFiles} |
| Total Lines of Code | ${totalLines.toLocaleString()} |
| Total Issues Found | ${totalIssues} |
| Average Complexity | ${avgComplexity.toFixed(1)} |
| Quality Score | ${(10 - (totalIssues / totalFiles) * 0.5).toFixed(1)}/10 |

### Issue Breakdown
- **High Priority**: ${highPriorityIssues.length} issues
- **Medium Priority**: ${mediumPriorityIssues.length} issues
- **Low Priority**: ${lowPriorityIssues.length} issues

## File Inventory

| File | Lines | Size (KB) | Issues | Complexity |
|------|-------|-----------|--------|------------|
`;

    // Sort files by issue count (descending)
    files.sort((a, b) => (b.issueCount || 0) - (a.issueCount || 0));
    
    files.slice(0, 20).forEach(file => {
        report += `| ${file.path} | ${file.lines} | ${(file.size / 1024).toFixed(1)} | ${file.issueCount || 0} | ${file.complexity?.level || 'N/A'} |\n`;
    });
    
    if (files.length > 20) {
        report += `| ... and ${files.length - 20} more files | | | | |\n`;
    }
    
    report += `\n## High Priority Issues\n\n`;
    
    const issuesByType = new Map();
    allIssues.forEach(issue => {
        if (!issuesByType.has(issue.type)) {
            issuesByType.set(issue.type, []);
        }
        issuesByType.get(issue.type).push(issue);
    });
    
    report += `### Type Annotation Issues (${issuesByType.get('type-annotation')?.length || 0})\n\n`;
    issuesByType.get('type-annotation')?.slice(0, 5).forEach(issue => {
        report += `- **${issue.files?.[0] || issue.file}:${issue.line}** - ${issue.message}\n`;
    });
    
    report += `\n### Complexity Issues (${issuesByType.get('complexity')?.length || 0})\n\n`;
    issuesByType.get('complexity')?.slice(0, 5).forEach(issue => {
        report += `- **${issue.files?.[0] || issue.file}:${issue.line}** - ${issue.message}\n`;
    });
    
    report += `\n### Duplicate Code (${issuesByType.get('duplicate')?.length || 0})\n\n`;
    issuesByType.get('duplicate')?.slice(0, 5).forEach(issue => {
        report += `- Files: ${issue.files.join(', ')} (lines ${issue.lines.join(', ')})\n`;
    });
    
    report += `\n## Recommendations\n\n`;
    report += `### High Priority\n\n`;
    report += `1. **Add Type Annotations**: ${issuesByType.get('type-annotation')?.filter(i => i.severity === 'high').length || 0} functions are missing return type annotations\n`;
    report += `2. **Reduce Complexity**: ${files.filter(f => f.complexity?.level === 'High').length} files have high complexity and should be refactored\n`;
    report += `3. **Remove 'any' Types**: Found ${allIssues.filter(i => i.message.includes('any')).length} uses of 'any' type\n`;
    
    report += `\n### Medium Priority\n\n`;
    report += `1. **Extract Duplicate Code**: ${issuesByType.get('duplicate')?.length || 0} duplicate code blocks found\n`;
    report += `2. **Improve Naming Conventions**: ${issuesByType.get('naming')?.length || 0} naming convention violations\n`;
    report += `3. **Reduce Function Length**: ${allIssues.filter(i => i.message.includes('Long function')).length} functions exceed 50 lines\n`;
    
    report += `\n### Low Priority\n\n`;
    report += `1. **Code Organization**: Consider grouping related functionality\n`;
    report += `2. **Documentation**: Add JSDoc comments to public APIs\n`;
    report += `3. **Consistent Formatting**: Apply consistent code formatting\n`;
    
    report += `\n## Module Dependencies\n\n`;
    report += `\`\`\`mermaid\ngraph TD\n`;
    
    // Generate simple dependency graph for top-level modules
    const moduleGroups = new Map();
    dependencies.forEach((deps, file) => {
        const module = file.split('/')[0];
        if (!moduleGroups.has(module)) {
            moduleGroups.set(module, new Set());
        }
        deps.forEach(dep => {
            if (dep.startsWith('./') || dep.startsWith('../')) {
                const depModule = path.join(path.dirname(file), dep).split('/')[0];
                if (depModule !== module) {
                    moduleGroups.get(module).add(depModule);
                }
            }
        });
    });
    
    moduleGroups.forEach((deps, module) => {
        deps.forEach(dep => {
            report += `    ${module} --> ${dep}\n`;
        });
    });
    
    report += `\`\`\`\n`;
    
    return report;
}

// Main execution
async function runAudit() {
    console.log('🔍 Starting code quality audit...\n');
    
    // Find all TypeScript files
    const tsFiles = glob.sync('**/*.ts', { 
        cwd: SRC_DIR,
        ignore: ['**/*.d.ts', '**/node_modules/**']
    });
    
    console.log(`Found ${tsFiles.length} TypeScript files\n`);
    
    // Analyze each file
    tsFiles.forEach((file, index) => {
        const filePath = path.join(SRC_DIR, file);
        const stats = getFileStats(filePath);
        
        // Analyze complexity
        const complexity = analyzeComplexity(stats.content, filePath);
        stats.complexity = complexity;
        
        // Check naming conventions
        const namingIssues = checkNamingConventions(stats.content, filePath);
        
        // Check type annotations
        const typeIssues = checkTypeAnnotations(stats.content, filePath);
        
        // Analyze dependencies
        analyzeDependencies(stats.content, stats.path);
        
        // Collect all issues for this file
        const fileIssues = [
            ...complexity.issues.map(i => ({ ...i, file: stats.path })),
            ...namingIssues.map(i => ({ ...i, file: stats.path })),
            ...typeIssues.map(i => ({ ...i, file: stats.path }))
        ];
        
        stats.issueCount = fileIssues.length;
        issues.push(...fileIssues);
        fileMetrics.push(stats);
        
        if ((index + 1) % 10 === 0) {
            console.log(`Analyzed ${index + 1}/${tsFiles.length} files...`);
        }
    });
    
    // Find duplicate code
    console.log('\n🔍 Checking for duplicate code...');
    const duplicates = findDuplicateCode(fileMetrics);
    issues.push(...duplicates);
    
    // Generate report
    console.log('\n📝 Generating report...');
    const report = generateReport(fileMetrics, issues);
    
    // Write report
    fs.writeFileSync(OUTPUT_FILE, report);
    console.log(`\n✅ Report generated: ${OUTPUT_FILE}`);
    
    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`   Total files analyzed: ${fileMetrics.length}`);
    console.log(`   Total issues found: ${issues.length}`);
    console.log(`   High priority: ${issues.filter(i => i.severity === 'high').length}`);
    console.log(`   Medium priority: ${issues.filter(i => i.severity === 'medium').length}`);
    console.log(`   Low priority: ${issues.filter(i => i.severity === 'low').length}`);
}

// Run the audit
runAudit().catch(console.error);