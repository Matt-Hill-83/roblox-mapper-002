/**
 * Data Generator Module
 * Generates fake hierarchical entities for testing
 */

let entityCounter = 0;

/**
 * Create a single entity with given properties
 */
function createEntity(type, parentId = null) {
    entityCounter++;
    return {
        id: `entity_${entityCounter}`,
        type: type,
        parentId: parentId,
        children: []
    };
}

/**
 * Generate fake hierarchical data with multiple disconnected trees
 */
function generateFakeData() {
    const entities = [];
    const trees = [];
    
    // Generate 2-3 separate hierarchy trees
    const numTrees = 2 + Math.floor(Math.random() * 2); // 2-3 trees
    
    for (let treeIndex = 0; treeIndex < numTrees; treeIndex++) {
        const tree = generateSingleTree(treeIndex);
        trees.push(tree);
        entities.push(...tree);
    }
    
    return entities;
}

/**
 * Generate a single hierarchy tree with 2-3 levels
 */
function generateSingleTree(treeIndex) {
    const tree = [];
    
    // Create root entity
    const root = createEntity('Parent');
    tree.push(root);
    
    // Generate 2-4 children for root
    const numChildren = 2 + Math.floor(Math.random() * 3); // 2-4 children
    
    for (let i = 0; i < numChildren; i++) {
        const child = createEntity('Child', root.id);
        root.children.push(child.id);
        tree.push(child);
        
        // Sometimes add grandchildren (50% chance)
        if (Math.random() > 0.5) {
            const numGrandchildren = 1 + Math.floor(Math.random() * 2); // 1-2 grandchildren
            for (let j = 0; j < numGrandchildren; j++) {
                const grandchild = createEntity('Child', child.id);
                child.children.push(grandchild.id);
                tree.push(grandchild);
            }
        }
    }
    
    return tree;
}

module.exports = {
    generateFakeData,
    createEntity
};