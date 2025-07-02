/**
 * Analyzer Module
 * Analyzes hierarchical data to identify connected groups and calculate metrics
 */

/**
 * Find all connected groups (separate hierarchy trees) in the entity data
 */
function findConnectedGroups(entities) {
    // Create a map for quick entity lookup
    const entityMap = new Map();
    entities.forEach(entity => {
        entityMap.set(entity.id, entity);
    });
    
    const visited = new Set();
    const groups = [];
    
    // Find all root entities (entities with no parent)
    const roots = entities.filter(entity => entity.parentId === null);
    
    // Traverse each tree starting from its root
    roots.forEach(root => {
        if (!visited.has(root.id)) {
            const group = [];
            traverseTree(root.id, entityMap, visited, group);
            
            if (group.length > 0) {
                groups.push({
                    id: `group_${groups.length + 1}`,
                    rootEntityId: root.id,
                    entities: group,
                    metrics: calculateGroupMetrics(group)
                });
            }
        }
    });
    
    return groups;
}

/**
 * Recursively traverse a tree and collect all connected entities
 */
function traverseTree(entityId, entityMap, visited, group) {
    if (visited.has(entityId)) return;
    
    const entity = entityMap.get(entityId);
    if (!entity) return;
    
    visited.add(entityId);
    group.push(entity);
    
    // Traverse all children
    entity.children.forEach(childId => {
        traverseTree(childId, entityMap, visited, group);
    });
}

/**
 * Calculate basic metrics for a connected group
 */
function calculateGroupMetrics(entities) {
    // Calculate depth (maximum levels from root)
    let maxDepth = 0;
    const entityMap = new Map();
    entities.forEach(entity => {
        entityMap.set(entity.id, entity);
    });
    
    // Find root (entity with no parent in this group)
    const root = entities.find(entity => entity.parentId === null);
    if (root) {
        maxDepth = calculateDepth(root.id, entityMap, 0);
    }
    
    // Count entity types
    const typeCounts = {};
    entities.forEach(entity => {
        typeCounts[entity.type] = (typeCounts[entity.type] || 0) + 1;
    });
    
    return {
        totalEntities: entities.length,
        depth: maxDepth,
        typeCounts: typeCounts,
        rootId: root ? root.id : null
    };
}

/**
 * Calculate the depth of a tree recursively
 */
function calculateDepth(entityId, entityMap, currentDepth) {
    const entity = entityMap.get(entityId);
    if (!entity || entity.children.length === 0) {
        return currentDepth;
    }
    
    let maxChildDepth = currentDepth;
    entity.children.forEach(childId => {
        const childDepth = calculateDepth(childId, entityMap, currentDepth + 1);
        maxChildDepth = Math.max(maxChildDepth, childDepth);
    });
    
    return maxChildDepth;
}

module.exports = {
    findConnectedGroups,
    calculateGroupMetrics
};