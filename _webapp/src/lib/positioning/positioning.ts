// Types for positioning
export interface SimpleEntity {
  id: string;
  type: string;
  parentId?: string;
  children: string[];
  connections: string[];
  weight?: number;
  isHub?: boolean;
}

export interface ConnectedGroup {
  id: string;
  rootEntityId: string;
  entities: SimpleEntity[];
  metrics: {
    totalEntities: number;
    depth: number;
    typeCounts: Record<string, number>;
    rootId: string;
  };
}

export interface EntityPosition {
  entityId: string;
  type: string;
  parentId?: string;
  x: number;
  y: number;
  level: number;
  groupId: string;
}

// Constants for positioning
const TREE_SPACING = 200;    // Horizontal distance between different trees
const ENTITY_SPACING = 30;   // Horizontal spacing between siblings
const LEVEL_HEIGHT = 50;     // Vertical distance between parent and child levels

/**
 * Position entities in 2D space using hierarchical layout
 * @param groups - Connected groups of entities to position
 * @returns Array of positioned entities with x,y coordinates
 */
export function position2D(groups: ConnectedGroup[]): EntityPosition[] {
  const positionedEntities: EntityPosition[] = [];
  
  groups.forEach((group, groupIndex) => {
    const entityMap = new Map<string, SimpleEntity>();
    group.entities.forEach(entity => entityMap.set(entity.id, entity));
    
    const baseX = Math.floor(groupIndex * TREE_SPACING);
    const baseY = 0;
    
    const root = group.entities.find(entity => !entity.parentId);
    if (!root) return;
    
    positionEntityAndChildren(
      root.id,
      entityMap,
      baseX,
      baseY,
      0,
      0,
      group.id,
      positionedEntities
    );
  });
  
  return positionedEntities;
}

/**
 * Recursively position an entity and its children
 * @param entityId - ID of the entity to position
 * @param entityMap - Map of all entities by ID
 * @param baseX - Base X coordinate for this subtree
 * @param baseY - Base Y coordinate for this subtree
 * @param level - Hierarchical level (depth)
 * @param siblingIndex - Index among siblings (for horizontal spacing)
 * @param groupId - ID of the connected group
 * @param positions - Array to accumulate positioned entities
 */
function positionEntityAndChildren(
  entityId: string,
  entityMap: Map<string, SimpleEntity>,
  baseX: number,
  baseY: number,
  level: number,
  siblingIndex: number,
  groupId: string,
  positions: EntityPosition[]
): void {
  const entity = entityMap.get(entityId);
  if (!entity) return;
  
  const x = baseX + (siblingIndex * ENTITY_SPACING);
  const y = baseY - (level * LEVEL_HEIGHT);
  
  // Ensure coordinates are valid numbers
  const validX = isNaN(x) ? 0 : x;
  const validY = isNaN(y) ? 0 : y;
  
  positions.push({
    entityId: entity.id,
    type: entity.type,
    parentId: entity.parentId,
    x: validX,
    y: validY,
    level,
    groupId
  });
  
  entity.children.forEach((childId, childIndex) => {
    const childrenCount = entity.children.length;
    // Center children under parent - ensure integer positioning
    const childSiblingIndex = Math.floor(childIndex - (childrenCount - 1) / 2);
    
    positionEntityAndChildren(
      childId,
      entityMap,
      x,
      baseY,
      level + 1,
      childSiblingIndex,
      groupId,
      positions
    );
  });
}

/**
 * Calculate the maximum depth of an entity's descendants
 * @param entity - Entity to calculate depth for
 * @param entityMap - Map of all entities by ID
 * @returns Maximum depth of descendants
 */
export function calculateMaxDepth(entity: SimpleEntity, entityMap: Map<string, SimpleEntity>): number {
  if (entity.children.length === 0) return 0;
  
  let maxChildDepth = 0;
  entity.children.forEach(childId => {
    const childEntity = entityMap.get(childId);
    if (childEntity) {
      const childDepth = 1 + calculateMaxDepth(childEntity, entityMap);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    }
  });
  
  return maxChildDepth;
}