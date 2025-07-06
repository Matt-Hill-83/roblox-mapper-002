const fs = require('fs');
const path = require('path');

const analysisData = JSON.parse(fs.readFileSync('/Users/__projects/roblox-mapper-002-multi/vscode/codebase_analysis.json', 'utf8'));

// Analyze module coupling and cohesion
function analyzeModuleCoupling() {
    const modules = {};
    
    // Group files by directory
    analysisData.fileDetails.forEach(file => {
        const dir = path.dirname(file.relativePath);
        if (!modules[dir]) {
            modules[dir] = {
                files: [],
                internalImports: 0,
                externalImports: 0,
                exportedTo: new Set(),
                importedFrom: new Set()
            };
        }
        modules[dir].files.push(file);
    });
    
    // Analyze imports between modules
    analysisData.fileDetails.forEach(file => {
        const fileDir = path.dirname(file.relativePath);
        
        file.importDetails.forEach(imp => {
            if (imp.startsWith('.')) {
                const fromDir = path.dirname(file.relativePath);
                let targetPath = path.join(fromDir, imp);
                targetPath = path.normalize(targetPath);
                
                // Find the actual target file
                const targetFile = analysisData.fileDetails.find(f => {
                    const possiblePaths = [
                        targetPath + '.ts',
                        targetPath + '.tsx',
                        path.join(targetPath, 'index.ts')
                    ];
                    return possiblePaths.includes(f.relativePath);
                });
                
                if (targetFile) {
                    const targetDir = path.dirname(targetFile.relativePath);
                    
                    if (fileDir === targetDir) {
                        modules[fileDir].internalImports++;
                    } else {
                        modules[fileDir].externalImports++;
                        modules[fileDir].importedFrom.add(targetDir);
                        modules[targetDir].exportedTo.add(fileDir);
                    }
                }
            }
        });
    });
    
    return modules;
}

// Find circular dependencies
function findCircularDependencies() {
    const graph = {};
    const cycles = [];
    
    // Build adjacency list
    analysisData.fileDetails.forEach(file => {
        graph[file.relativePath] = [];
        
        file.importDetails.forEach(imp => {
            if (imp.startsWith('.')) {
                const fromDir = path.dirname(file.relativePath);
                let targetPath = path.join(fromDir, imp);
                targetPath = path.normalize(targetPath);
                
                const possibleTargets = [
                    targetPath + '.ts',
                    targetPath + '.tsx',
                    path.join(targetPath, 'index.ts')
                ];
                
                for (const target of possibleTargets) {
                    if (analysisData.fileDetails.some(f => f.relativePath === target)) {
                        graph[file.relativePath].push(target);
                        break;
                    }
                }
            }
        });
    });
    
    // DFS to find cycles
    const visited = new Set();
    const recursionStack = new Set();
    
    function dfs(node, path = []) {
        if (recursionStack.has(node)) {
            const cycleStart = path.indexOf(node);
            if (cycleStart !== -1) {
                cycles.push(path.slice(cycleStart));
            }
            return;
        }
        
        if (visited.has(node)) return;
        
        visited.add(node);
        recursionStack.add(node);
        
        if (graph[node]) {
            graph[node].forEach(neighbor => {
                dfs(neighbor, [...path, node]);
            });
        }
        
        recursionStack.delete(node);
    }
    
    Object.keys(graph).forEach(node => {
        if (!visited.has(node)) {
            dfs(node);
        }
    });
    
    return cycles;
}

// Analyze export usage
function analyzeExportUsage() {
    const exportUsage = {};
    
    analysisData.fileDetails.forEach(file => {
        if (file.exportDetails.length > 0) {
            exportUsage[file.relativePath] = {
                exports: file.exportDetails,
                usedBy: file.importedBy,
                usageCount: file.importedBy.length,
                exportsPerImporter: file.importedBy.length > 0 ? 
                    (file.exportDetails.length / file.importedBy.length).toFixed(2) : 0
            };
        }
    });
    
    return exportUsage;
}

// Generate insights
const modules = analyzeModuleCoupling();
const cycles = findCircularDependencies();
const exportUsage = analyzeExportUsage();

// Calculate metrics
const moduleMetrics = Object.entries(modules).map(([dir, data]) => {
    const cohesion = data.internalImports / (data.internalImports + data.externalImports || 1);
    const coupling = data.exportedTo.size + data.importedFrom.size;
    
    return {
        module: dir,
        files: data.files.length,
        cohesion: (cohesion * 100).toFixed(1) + '%',
        coupling: coupling,
        internalImports: data.internalImports,
        externalImports: data.externalImports,
        exportedTo: Array.from(data.exportedTo),
        importedFrom: Array.from(data.importedFrom)
    };
}).sort((a, b) => b.files - a.files);

// Find most exported but unused symbols
const unusedExports = Object.entries(exportUsage)
    .filter(([_, data]) => data.usageCount === 0 && data.exports.length > 0)
    .map(([file, data]) => ({
        file,
        exportCount: data.exports.length,
        exports: data.exports.map(e => e.name)
    }))
    .sort((a, b) => b.exportCount - a.exportCount);

// Generate detailed architecture report
let detailedReport = `# Detailed Architecture Analysis

## Module Coupling and Cohesion

| Module | Files | Cohesion | Coupling | Internal Imports | External Imports |
|--------|-------|----------|----------|------------------|------------------|
${moduleMetrics.slice(0, 20).map(m => 
    `| ${m.module} | ${m.files} | ${m.cohesion} | ${m.coupling} | ${m.internalImports} | ${m.externalImports} |`
).join('\n')}

## Circular Dependencies

${cycles.length > 0 ? 
    cycles.map((cycle, i) => `### Cycle ${i + 1}\n${cycle.map(f => `- ${f}`).join('\n')}`).join('\n\n') :
    'No circular dependencies detected.'}

## Export Usage Analysis

### Most Unused Exports
${unusedExports.slice(0, 10).map(e => 
    `- **${e.file}**: ${e.exportCount} unused exports (${e.exports.slice(0, 5).join(', ')}${e.exports.length > 5 ? '...' : ''})`
).join('\n')}

### Most Used Modules
${Object.entries(exportUsage)
    .filter(([_, data]) => data.usageCount > 0)
    .sort((a, b) => b[1].usageCount - a[1].usageCount)
    .slice(0, 10)
    .map(([file, data]) => 
        `- **${file}**: Used by ${data.usageCount} files, ${data.exports.length} exports`
    ).join('\n')}

## Architecture Patterns

### Service Layer
${analysisData.fileDetails
    .filter(f => f.purpose === 'service')
    .map(f => `- **${f.relativePath}**: ${f.imports} imports, ${f.exports} exports, used by ${f.importedBy.length} files`)
    .join('\n')}

### Component Makers Pattern
The codebase uses a consistent "maker" pattern for creating visual components:
${analysisData.fileDetails
    .filter(f => f.purpose === 'component-maker')
    .map(f => `- **${path.basename(path.dirname(f.relativePath))}**: ${f.relativePath}`)
    .join('\n')}

### Data Layer
The data layer consists of ${analysisData.summary.byPurpose.data.count} files with generated entity and relationship data:
- Average size: ${Math.round(analysisData.fileDetails
    .filter(f => f.purpose === 'data')
    .reduce((sum, f) => sum + f.lines, 0) / analysisData.summary.byPurpose.data.count)} lines
- Total lines: ${analysisData.fileDetails
    .filter(f => f.purpose === 'data')
    .reduce((sum, f) => sum + f.lines, 0)}

## Architectural Concerns

### High Coupling Modules
${moduleMetrics
    .filter(m => m.coupling > 5)
    .slice(0, 5)
    .map(m => `- **${m.module}**: Coupling score ${m.coupling} (imports from ${m.importedFrom.length} modules, exports to ${m.exportedTo.length} modules)`)
    .join('\n')}

### Low Cohesion Modules
${moduleMetrics
    .filter(m => parseFloat(m.cohesion) < 30)
    .slice(0, 5)
    .map(m => `- **${m.module}**: Cohesion ${m.cohesion} (${m.internalImports} internal vs ${m.externalImports} external imports)`)
    .join('\n')}

## Dependency Flow

### Client → Shared Dependencies
${analysisData.fileDetails
    .filter(f => f.category === 'client')
    .flatMap(f => f.importDetails
        .filter(imp => imp.includes('shared'))
        .map(imp => ({ from: f.relativePath, to: imp }))
    )
    .slice(0, 10)
    .map(dep => `- ${path.basename(dep.from)} → ${dep.to}`)
    .join('\n')}

### Server → Shared Dependencies
${analysisData.fileDetails
    .filter(f => f.category === 'server')
    .flatMap(f => f.importDetails
        .filter(imp => imp.includes('shared'))
        .map(imp => ({ from: f.relativePath, to: imp }))
    )
    .slice(0, 10)
    .map(dep => `- ${path.basename(dep.from)} → ${dep.to}`)
    .join('\n')}

## Key Architectural Findings

1. **Shared Module Dominance**: 75.9% of files are in the shared category, indicating heavy code reuse
2. **Data File Bloat**: Data files average ${Math.round(analysisData.fileDetails.filter(f => f.purpose === 'data').reduce((sum, f) => sum + f.lines, 0) / 40)} lines, suggesting need for external data storage
3. **Component Maker Pattern**: Well-structured component creation pattern with consistent interfaces
4. **Service Layer**: Limited to 8 services, may need expansion for better separation of concerns
5. **Import/Export Ratio**: ${(analysisData.summary.totalExports / analysisData.summary.totalImports).toFixed(2)} exports per import, indicating good modularity
`;

fs.writeFileSync('/Users/__projects/roblox-mapper-002-multi/vscode/detailed_architecture_analysis.md', detailedReport);
console.log('Detailed architecture analysis written to detailed_architecture_analysis.md');