/**
 * ASCII Renderer Module
 * Creates ASCII art representations of hierarchical data maps
 */

const fs = require('fs');
const path = require('path');

/**
 * Render positioned entities as ASCII art and save to file
 */
function renderAndSaveASCII(positionedEntities, groups) {
    const asciiMap = createASCIIMap(positionedEntities);
    const filename = generateFilename();
    const fullContent = generateFullContent(asciiMap, positionedEntities, groups);
    
    const outputPath = path.join(__dirname, '..', 'output_data', filename);
    
    try {
        fs.writeFileSync(outputPath, fullContent, 'utf8');
        console.log(`📄 ASCII map saved to: ${filename}`);
        return outputPath;
    } catch (error) {
        console.error('❌ Failed to save ASCII file:', error.message);
        throw error;
    }
}

/**
 * Create ASCII representation of the entity positions
 */
function createASCIIMap(positionedEntities) {
    // Find bounds of the layout
    const bounds = calculateBounds(positionedEntities);
    const scale = 0.5; // Scale factor to fit reasonable ASCII grid
    
    // Create grid
    const width = Math.ceil((bounds.maxX - bounds.minX) * scale) + 20;
    const height = Math.ceil((bounds.maxY - bounds.minY) * scale) + 20;
    
    // Initialize grid with spaces
    const grid = Array(height).fill().map(() => Array(width).fill(' '));
    
    // Place entities on grid
    positionedEntities.forEach(entity => {
        const gridX = Math.floor((entity.x - bounds.minX) * scale) + 10;
        const gridY = Math.floor((bounds.maxY - entity.y) * scale) + 10; // Flip Y axis
        
        if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
            const symbol = getEntitySymbol(entity);
            grid[gridY][gridX] = symbol;
            
            // Add entity ID nearby if space allows
            const idStr = entity.entityId.replace('entity_', '');
            for (let i = 0; i < idStr.length && gridX + i + 1 < width; i++) {
                if (grid[gridY][gridX + i + 1] === ' ') {
                    grid[gridY][gridX + i + 1] = idStr[i];
                }
            }
        }
    });
    
    // Convert grid to string
    return grid.map(row => row.join('')).join('\n');
}

/**
 * Get ASCII symbol for entity based on type and hierarchy
 */
function getEntitySymbol(entity) {
    if (entity.type === 'Parent') {
        return entity.level === 0 ? '●' : '○'; // Root vs non-root parent
    } else {
        return entity.level === 1 ? '▲' : '△'; // Direct child vs deeper child
    }
}

/**
 * Calculate bounds of all entity positions
 */
function calculateBounds(positionedEntities) {
    if (positionedEntities.length === 0) {
        return { minX: 0, maxX: 100, minY: -100, maxY: 0 };
    }
    
    const xs = positionedEntities.map(e => e.x);
    const ys = positionedEntities.map(e => e.y);
    
    return {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys)
    };
}

/**
 * Generate filename with timestamp pattern: yyyy-mm-dd-seconds-stub.me
 */
function generateFilename() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const totalSeconds = Math.floor(now.getTime() / 1000);
    
    return `${year}-${month}-${day}-${totalSeconds}-hierarchy-map.me`;
}

/**
 * Generate complete file content with metadata and ASCII map
 */
function generateFullContent(asciiMap, positionedEntities, groups) {
    const timestamp = new Date().toISOString();
    const summary = generateSummary(positionedEntities, groups);
    
    return `# Hierarchical Data Map
Generated: ${timestamp}

## Summary
${summary}

## Legend
● = Root Parent Entity
○ = Parent Entity  
▲ = Direct Child Entity
△ = Deeper Child Entity
Numbers after symbols = Entity IDs

## ASCII Map
\`\`\`
${asciiMap}
\`\`\`

## Entity Details
${generateEntityTable(positionedEntities)}
`;
}

/**
 * Generate summary statistics
 */
function generateSummary(positionedEntities, groups) {
    const typeCounts = {};
    positionedEntities.forEach(entity => {
        typeCounts[entity.type] = (typeCounts[entity.type] || 0) + 1;
    });
    
    let summary = `Total Groups: ${groups.length}\n`;
    summary += `Total Entities: ${positionedEntities.length}\n`;
    summary += `Entity Types:\n`;
    Object.entries(typeCounts).forEach(([type, count]) => {
        summary += `  ${type}: ${count}\n`;
    });
    
    return summary;
}

/**
 * Generate entity details table
 */
function generateEntityTable(positionedEntities) {
    let table = `| Group | ID | Type | Parent | X | Y | Level |\n`;
    table += `|-------|----|----- |--------|---|---|-------|\n`;
    
    positionedEntities.sort((a, b) => {
        if (a.groupId !== b.groupId) return a.groupId.localeCompare(b.groupId);
        if (a.level !== b.level) return a.level - b.level;
        return a.x - b.x;
    });
    
    positionedEntities.forEach(entity => {
        table += `| ${entity.groupId} | ${entity.entityId} | ${entity.type} | ${entity.parentId || 'ROOT'} | ${Math.round(entity.x)} | ${Math.round(entity.y)} | ${entity.level} |\n`;
    });
    
    return table;
}

module.exports = {
    renderAndSaveASCII,
    createASCIIMap,
    generateFilename
};