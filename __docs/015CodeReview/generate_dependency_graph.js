const fs = require('fs');
const path = require('path');

const analysisData = JSON.parse(fs.readFileSync('/Users/__projects/roblox-mapper-002-multi/vscode/codebase_analysis.json', 'utf8'));

// Create a dependency graph visualization
const graph = {
    nodes: [],
    edges: []
};

// Process file details to build the graph
analysisData.fileDetails.forEach((file) => {
    // Add node
    graph.nodes.push({
        id: file.relativePath,
        label: path.basename(file.relativePath),
        category: file.category,
        purpose: file.purpose,
        lines: file.lines,
        imports: file.imports,
        exports: file.exports,
        isOrphaned: file.importedBy.length === 0
    });
    
    // Add edges for imports
    file.importDetails.forEach((imp) => {
        // Only process relative imports for now
        if (imp.startsWith('.')) {
            const fromDir = path.dirname(file.relativePath);
            let targetPath = path.join(fromDir, imp);
            
            // Normalize the path
            targetPath = path.normalize(targetPath);
            
            // Try different extensions
            const possibleTargets = [
                targetPath + '.ts',
                targetPath + '.tsx',
                path.join(targetPath, 'index.ts')
            ];
            
            for (const target of possibleTargets) {
                const normalizedTarget = path.normalize(target);
                if (analysisData.fileDetails.some(f => f.relativePath === normalizedTarget)) {
                    graph.edges.push({
                        from: file.relativePath,
                        to: normalizedTarget,
                        type: 'import'
                    });
                    break;
                }
            }
        }
    });
});

// Generate a DOT file for Graphviz
let dot = `digraph Dependencies {
    rankdir=LR;
    node [shape=box, style=filled];
    
    // Define node colors by category
    subgraph cluster_client {
        label="Client";
        color=lightblue;
        style=filled;
        ${graph.nodes.filter(n => n.category === 'client').map(n => 
            `"${n.id}" [label="${n.label}\\n${n.lines} lines", fillcolor="${n.isOrphaned ? 'red' : 'lightgreen'}"];`
        ).join('\n        ')}
    }
    
    subgraph cluster_server {
        label="Server";
        color=lightcoral;
        style=filled;
        ${graph.nodes.filter(n => n.category === 'server').map(n => 
            `"${n.id}" [label="${n.label}\\n${n.lines} lines", fillcolor="${n.isOrphaned ? 'red' : 'lightgreen'}"];`
        ).join('\n        ')}
    }
    
    subgraph cluster_shared {
        label="Shared";
        color=lightyellow;
        style=filled;
        ${graph.nodes.filter(n => n.category === 'shared').map(n => 
            `"${n.id}" [label="${n.label}\\n${n.lines} lines", fillcolor="${n.isOrphaned ? 'red' : 'lightgreen'}"];`
        ).join('\n        ')}
    }
    
    // Add edges
    ${graph.edges.map(e => `"${e.from}" -> "${e.to}";`).join('\n    ')}
}`;

fs.writeFileSync('/Users/__projects/roblox-mapper-002-multi/vscode/dependency_graph.dot', dot);

// Generate detailed report
let report = `# Roblox TypeScript Codebase Analysis Report

## Executive Summary

- **Total Files**: ${analysisData.summary.totalFiles}
- **Average Lines per File**: ${analysisData.summary.averageLines}
- **Total Imports**: ${analysisData.summary.totalImports}
- **Total Exports**: ${analysisData.summary.totalExports}
- **Orphaned Files**: ${analysisData.orphanedFiles.length}
- **Large Files (>300 lines)**: ${analysisData.largeFiles.length}

## Distribution by Category

| Category | Count | Percentage |
|----------|-------|------------|
${Object.entries(analysisData.summary.byCategory)
    .map(([cat, data]) => `| ${cat} | ${data.count} | ${(data.count / analysisData.summary.totalFiles * 100).toFixed(1)}% |`)
    .join('\n')}

## Distribution by Purpose

| Purpose | Count | Percentage |
|---------|-------|------------|
${Object.entries(analysisData.summary.byPurpose)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([purpose, data]) => `| ${purpose} | ${data.count} | ${(data.count / analysisData.summary.totalFiles * 100).toFixed(1)}% |`)
    .join('\n')}

## Orphaned Files (No Incoming Dependencies)

These files are not imported by any other files in the codebase:

${analysisData.orphanedFiles.map(f => `- \`${f}\``).join('\n')}

## Large Files (>300 lines)

| File | Lines | Size (bytes) |
|------|-------|--------------|
${analysisData.largeFiles.slice(0, 10).map(f => `| \`${f.path}\` | ${f.lines} | ${f.size} |`).join('\n')}

## Key Entry Points

### Client Entry Points
${analysisData.fileDetails
    .filter(f => f.category === 'client' && (f.relativePath.includes('main.client') || f.importedBy.length > 3))
    .map(f => `- \`${f.relativePath}\` (imported by ${f.importedBy.length} files)`)
    .join('\n')}

### Server Entry Points
${analysisData.fileDetails
    .filter(f => f.category === 'server' && (f.relativePath.includes('main.server') || f.importedBy.length > 3))
    .map(f => `- \`${f.relativePath}\` (imported by ${f.importedBy.length} files)`)
    .join('\n')}

### Most Imported Shared Modules
${analysisData.fileDetails
    .filter(f => f.category === 'shared')
    .sort((a, b) => b.importedBy.length - a.importedBy.length)
    .slice(0, 10)
    .map(f => `- \`${f.relativePath}\` (imported by ${f.importedBy.length} files)`)
    .join('\n')}

## Architecture Insights

### Data Files
- **Count**: ${analysisData.summary.byPurpose.data.count} files
- **Purpose**: Entity and relationship data definitions
- **Observation**: These files are extremely large (some >5000 lines) and contain generated data

### Component Makers
- **Count**: ${analysisData.summary.byPurpose['component-maker'].count} modules
- **Purpose**: Creating visual components (hexagons, bars, labels, etc.)
- **Key Modules**: hexagonMaker, hexStackMaker, barMaker, labelBlockMaker, ropeLabelMaker

### Services
- **Client Services**: configGui service suite
- **Server Services**: game.service, configGUIServer.service, graphInitializer.service
- **Shared Services**: simpleDataGenerator.service

### Renderers
- **Count**: ${analysisData.summary.byPurpose.renderer.count} modules
- **Key Renderers**: unifiedDataRenderer, simpleDataRenderer, dataGeneratorRobloxRenderer

## Recommendations

1. **Address Orphaned Files**
   - Review the 15 orphaned files to determine if they should be removed or integrated
   - Many appear to be index files that may need to be properly connected

2. **Refactor Large Data Files**
   - entityFileData.ts (5403 lines) should be split or moved to external data storage
   - Consider using a more efficient data format or database

3. **Module Organization**
   - Consider consolidating the many small data files into logical groups
   - The shared/modules directory could benefit from better organization

4. **Improve Import Structure**
   - Many files have low import counts, suggesting potential duplication
   - Consider creating more centralized export points

5. **Service Architecture**
   - The service layer is well-structured but could benefit from clearer interfaces
   - Consider adding a service registry or dependency injection pattern
`;

fs.writeFileSync('/Users/__projects/roblox-mapper-002-multi/vscode/codebase_analysis_report.md', report);

console.log('Dependency graph written to dependency_graph.dot');
console.log('Detailed report written to codebase_analysis_report.md');