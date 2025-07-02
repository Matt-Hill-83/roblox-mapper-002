/**
 * Visualizer Module
 * Displays hierarchical data results in console table format
 */

/**
 * Display positioned entities in formatted console tables
 */
function displayResults(positionedEntities) {
    console.log("\n=== HIERARCHICAL LAYOUT RESULTS ===\n");
    
    // Group entities by their group ID for separate tables
    const groups = groupEntitiesByGroup(positionedEntities);
    
    // Display summary
    displaySummary(groups, positionedEntities);
    
    // Display each group in its own table
    groups.forEach((entities, groupId) => {
        displayGroupTable(groupId, entities);
    });
    
    // Display overall positioning table
    displayOverallTable(positionedEntities);
}

/**
 * Group positioned entities by their group ID
 */
function groupEntitiesByGroup(positionedEntities) {
    const groups = new Map();
    
    positionedEntities.forEach(entity => {
        if (!groups.has(entity.groupId)) {
            groups.set(entity.groupId, []);
        }
        groups.get(entity.groupId).push(entity);
    });
    
    return groups;
}

/**
 * Display summary information
 */
function displaySummary(groups, positionedEntities) {
    console.log("📊 SUMMARY");
    console.log("─".repeat(50));
    console.log(`Total Groups: ${groups.size}`);
    console.log(`Total Entities: ${positionedEntities.length}`);
    
    // Count entity types
    const typeCounts = {};
    positionedEntities.forEach(entity => {
        typeCounts[entity.type] = (typeCounts[entity.type] || 0) + 1;
    });
    
    console.log("Entity Types:");
    Object.entries(typeCounts).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
    });
    console.log();
}

/**
 * Display a single group's entities in table format
 */
function displayGroupTable(groupId, entities) {
    console.log(`🌳 ${groupId.toUpperCase()}`);
    console.log("─".repeat(50));
    
    // Format entities for table display
    const tableData = entities.map(entity => ({
        ID: entity.entityId,
        Type: entity.type,
        Parent: entity.parentId || 'ROOT',
        Level: entity.level,
        'X Position': Math.round(entity.x),
        'Y Position': Math.round(entity.y)
    }));
    
    // Sort by level then by X position for better readability
    tableData.sort((a, b) => {
        if (a.Level !== b.Level) return a.Level - b.Level;
        return a['X Position'] - b['X Position'];
    });
    
    console.table(tableData);
    console.log();
}

/**
 * Display overall positioning table with all entities
 */
function displayOverallTable(positionedEntities) {
    console.log("🗺️  COMPLETE LAYOUT MAP");
    console.log("─".repeat(50));
    
    const tableData = positionedEntities.map(entity => ({
        Group: entity.groupId,
        ID: entity.entityId,
        Type: entity.type,
        Parent: entity.parentId || 'ROOT',
        X: Math.round(entity.x),
        Y: Math.round(entity.y),
        Level: entity.level
    }));
    
    // Sort by group, then level, then X position
    tableData.sort((a, b) => {
        if (a.Group !== b.Group) return a.Group.localeCompare(b.Group);
        if (a.Level !== b.Level) return a.Level - b.Level;
        return a.X - b.X;
    });
    
    console.table(tableData);
}

/**
 * Format table data with custom formatting
 */
function formatTable(data, title) {
    console.log(`\n${title}`);
    console.log("─".repeat(title.length));
    console.table(data);
}

module.exports = {
    displayResults,
    formatTable
};