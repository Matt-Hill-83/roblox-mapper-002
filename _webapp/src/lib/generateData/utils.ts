import type { SimpleEntity } from "../positioning/types";
import type { Connection } from "./interfaces";
import { DEFAULT_ENTITY_TYPES, DEFAULT_CONNECTOR_TYPES } from "./constants";

export function generateEntityTypeNames(count: number): string[] {
  return DEFAULT_ENTITY_TYPES.slice(0, Math.min(count, DEFAULT_ENTITY_TYPES.length));
}

export function generateConnectorTypeNames(count: number): string[] {
  return DEFAULT_CONNECTOR_TYPES.slice(
    0,
    Math.min(count, DEFAULT_CONNECTOR_TYPES.length)
  );
}

export function selectRandomIndices(
  totalCount: number,
  selectCount: number
): number[] {
  const indices: number[] = [];
  const maxSelect = Math.min(selectCount, totalCount);

  while (indices.length < maxSelect) {
    const randomIndex = Math.floor(Math.random() * totalCount);
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }

  return indices;
}

export function isInSameTree(
  entity1: SimpleEntity,
  entity2: SimpleEntity,
  entities: SimpleEntity[]
): boolean {
  // Simple check: if they share a common root ancestor
  const root1 = findRoot(entity1, entities);
  const root2 = findRoot(entity2, entities);
  return root1?.id === root2?.id;
}

export function findRoot(
  entity: SimpleEntity,
  entities: SimpleEntity[]
): SimpleEntity | null {
  if (!entity.parentId) return entity;

  const parent = entities.find((e) => e.id === entity.parentId);
  if (!parent) return entity;

  return findRoot(parent, entities);
}

export function addCrossTreeConnections(
  entities: SimpleEntity[],
  connections: Connection[],
  connectorTypeNames: string[],
  percentage: number
) {
  const connectionCount = Math.floor((entities.length * percentage) / 100);

  for (let i = 0; i < connectionCount; i++) {
    const sourceIndex = Math.floor(Math.random() * entities.length);
    const targetIndex = Math.floor(Math.random() * entities.length);

    if (sourceIndex !== targetIndex) {
      const source = entities[sourceIndex];
      const target = entities[targetIndex];

      // Avoid connecting within same tree
      if (!isInSameTree(source, target, entities)) {
        if (!source.connections.includes(target.id)) {
          source.connections.push(target.id);

          // Add typed connection
          const connectorType =
            connectorTypeNames[
              Math.floor(Math.random() * connectorTypeNames.length)
            ];
          connections.push({
            fromId: source.id,
            toId: target.id,
            type: connectorType,
          });
        }
      }
    }
  }
}

export function applyClustering(
  entities: SimpleEntity[],
  connections: Connection[],
  connectorTypeNames: string[],
  coefficient: number
) {
  // Simple clustering: increase connections between nodes that share connections
  const targetConnections = Math.floor((entities.length * coefficient) / 100);
  let addedConnections = 0;

  for (const entity of entities) {
    if (addedConnections >= targetConnections) break;

    // Find entities connected to this entity's connections
    for (const connectedId of entity.connections) {
      const connectedEntity = entities.find((e) => e.id === connectedId);
      if (connectedEntity) {
        for (const secondaryId of connectedEntity.connections) {
          if (
            secondaryId !== entity.id &&
            !entity.connections.includes(secondaryId)
          ) {
            entity.connections.push(secondaryId);

            // Add typed connection
            const connectorType =
              connectorTypeNames[
                Math.floor(Math.random() * connectorTypeNames.length)
              ];
            connections.push({
              fromId: entity.id,
              toId: secondaryId,
              type: connectorType,
            });

            addedConnections++;
            if (addedConnections >= targetConnections) break;
          }
        }
      }
      if (addedConnections >= targetConnections) break;
    }
  }
}

export function applyNetworkDensity(
  entities: SimpleEntity[],
  connections: Connection[],
  connectorTypeNames: string[],
  density: "sparse" | "medium" | "dense"
) {
  const densityMultipliers = { sparse: 0.5, medium: 1.0, dense: 2.0 };
  const multiplier = densityMultipliers[density];

  const additionalConnections = Math.floor(entities.length * 0.1 * multiplier);

  for (let i = 0; i < additionalConnections; i++) {
    const sourceIndex = Math.floor(Math.random() * entities.length);
    const targetIndex = Math.floor(Math.random() * entities.length);

    if (sourceIndex !== targetIndex) {
      const source = entities[sourceIndex];
      const target = entities[targetIndex];

      if (!source.connections.includes(target.id)) {
        source.connections.push(target.id);

        // Add typed connection
        const connectorType =
          connectorTypeNames[
            Math.floor(Math.random() * connectorTypeNames.length)
          ];
        connections.push({
          fromId: source.id,
          toId: target.id,
          type: connectorType,
        });
      }
    }
  }
}