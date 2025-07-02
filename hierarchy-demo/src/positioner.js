/**
 * Positioner Module
 * Calculates 2D positions for hierarchical entities
 */

const TREE_SPACING = 200; // Horizontal distance between different trees
const LEVEL_HEIGHT = 50;  // Vertical distance between parent and child levels
const ENTITY_SPACING = 30; // Horizontal spacing between siblings

/**
 * Position all entity groups in 2D space
 */
function position2D(groups) {
    const positionedEntities = [];
    
    groups.forEach((group, groupIndex) => {
        const groupPositions = positionGroup(group, groupIndex);
        positionedEntities.push(...groupPositions);
    });
    
    return positionedEntities;
}

/**
 * Position a single group of connected entities
 */
function positionGroup(group, groupIndex) {
    const positions = [];
    const entityMap = new Map();
    
    // Create entity map for quick lookup
    group.entities.forEach(entity => {
        entityMap.set(entity.id, entity);
    });
    
    // Calculate base position for this group
    const baseX = groupIndex * TREE_SPACING;
    const baseY = 0;
    
    // Find root entity
    const root = group.entities.find(entity => entity.parentId === null);
    if (!root) return positions;
    
    // Position entities starting from root
    positionEntityAndChildren(
        root.id,
        entityMap,
        baseX,
        baseY,
        0, // level
        0, // sibling index
        group.id,
        positions
    );
    
    return positions;
}

/**
 * Recursively position an entity and all its children
 */
function positionEntityAndChildren(entityId, entityMap, baseX, baseY, level, siblingIndex, groupId, positions) {
    const entity = entityMap.get(entityId);
    if (!entity) return;
    
    // Calculate position for current entity
    const position = calculatePosition(baseX, baseY, level, siblingIndex);
    
    positions.push({
        entityId: entity.id,
        type: entity.type,
        parentId: entity.parentId,
        x: position.x,
        y: position.y,
        level: level,
        groupId: groupId
    });
    
    // Position all children
    entity.children.forEach((childId, childIndex) => {
        // Calculate offset for children to center them under parent
        const childrenCount = entity.children.length;
        const childSiblingIndex = childIndex - (childrenCount - 1) / 2;
        
        positionEntityAndChildren(
            childId,
            entityMap,
            position.x, // Use parent's x as base for children
            baseY,
            level + 1,
            childSiblingIndex,
            groupId,
            positions
        );
    });
}

/**
 * Calculate 2D position based on hierarchy level and sibling index
 */
function calculatePosition(baseX, baseY, level, siblingIndex) {
    return {
        x: baseX + (siblingIndex * ENTITY_SPACING),
        y: baseY - (level * LEVEL_HEIGHT) // Parents above children
    };
}

module.exports = {
    position2D,
    calculatePosition
};