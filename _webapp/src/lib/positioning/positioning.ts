import { positioningConstants } from "./positioningConstants";
import type { SimpleEntity, ConnectedGroup, EntityPosition } from "./types";

/**
 * Position entities in 2D space using hierarchical layout
 * @param groups - Connected groups of entities to position
 * @returns Array of positioned entities with x,y coordinates
 */
export function position2D(groups: ConnectedGroup[]): EntityPosition[] {
  const positionedEntities: EntityPosition[] = [];

  groups.forEach((group, groupIndex) => {
    const entityMap = new Map<string, SimpleEntity>();
    group.entities.forEach((entity) => entityMap.set(entity.id, entity));

    const baseX = Math.floor(groupIndex * positioningConstants.TREE_SPACING);
    const baseY = 0;

    const root = group.entities.find((entity) => !entity.parentId);
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

  const x = baseX + siblingIndex * positioningConstants.ENTITY_SPACING;
  const y = baseY - level * positioningConstants.LEVEL_HEIGHT;

  // Ensure coordinates are valid numbers
  const validX = isNaN(x) ? 0 : x;
  const validY = isNaN(y) ? 0 : y;

  // Generate random z coordinate between -10 and 10
  const z = Math.random() * 20 - 10;
  
  positions.push({
    entityId: entity.id,
    type: entity.type,
    parentId: entity.parentId,
    x: validX,
    y: validY,
    z: z,
    level,
    groupId,
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
