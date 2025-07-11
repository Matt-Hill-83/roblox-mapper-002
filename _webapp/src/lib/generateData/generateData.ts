import type { SimpleEntity, ConnectedGroup, EntityPosition } from "../positioning/types";
import type { TestDataConfig, Connection } from "./interfaces";
import { DEFAULT_NODE_WEIGHT_RANGE } from "./constants";
import {
  generateEntityTypeNames,
  generateConnectorTypeNames,
  selectRandomIndices,
  addCrossTreeConnections,
  applyClustering,
  applyNetworkDensity,
} from "./utils";

// Advanced data generator with complex network properties
export function generateConfigurableData(config: TestDataConfig): {
  entities: SimpleEntity[];
  connections: Connection[];
} {
  const connections: Connection[] = [];
  let entityCounter = 0;

  // Generate entity type names and connector type names
  const entityTypeNames = generateEntityTypeNames(config.entityTypes);
  const connectorTypeNames = generateConnectorTypeNames(
    config.connectorTypes || 3
  );

  const createEntity = (
    type: string,
    parentId?: string,
    isHub = false
  ): SimpleEntity => {
    entityCounter++;
    return {
      id: `entity_${entityCounter}`,
      type,
      parentId,
      children: [],
      connections: [],
      weight: Math.random() * (DEFAULT_NODE_WEIGHT_RANGE.max - DEFAULT_NODE_WEIGHT_RANGE.min) + DEFAULT_NODE_WEIGHT_RANGE.min,
      isHub,
    };
  };

  // Use advanced parameters for generation
  const totalNodes = config.totalNodes || config.numberOfNodes;
  const maxDepth = config.maxDepth || config.depthOfLongestChain;
  const numChains = config.numberOfConnectedChains;

  // Generate base hierarchical structure
  const nodesPerChain = Math.floor(totalNodes / numChains);
  const remainingNodes = totalNodes % numChains;
  const allNodes: SimpleEntity[] = [];

  for (let chainIndex = 0; chainIndex < numChains; chainIndex++) {
    let chainNodes = nodesPerChain;
    if (chainIndex < remainingNodes) chainNodes++;

    if (chainNodes < 1) continue;

    // Create root for this chain
    const rootType = entityTypeNames[0]; // Use first type for roots
    const root = createEntity(rootType);
    allNodes.push(root);

    let remainingChainNodes = chainNodes - 1;
    let currentLevel = [root];
    let currentDepth = 1;

    // Build hierarchy with variable branching
    while (remainingChainNodes > 0 && currentDepth < maxDepth) {
      const nextLevel: SimpleEntity[] = [];

      for (const parent of currentLevel) {
        if (remainingChainNodes <= 0) break;

        // Use branching factor range
        const branchingFactor =
          Math.floor(
            Math.random() * (config.branchingMax - config.branchingMin + 1)
          ) + config.branchingMin;

        const childrenCount = Math.min(branchingFactor, remainingChainNodes);

        for (let i = 0; i < childrenCount && remainingChainNodes > 0; i++) {
          // Randomly select entity type
          const childType =
            entityTypeNames[Math.floor(Math.random() * entityTypeNames.length)];

          const child = createEntity(childType, parent.id);
          parent.children.push(child.id);
          allNodes.push(child);
          nextLevel.push(child);
          remainingChainNodes--;

          // Add parent-child connection with type "parentChild"
          connections.push({
            fromId: parent.id,
            toId: child.id,
            type: "parentChild",
          });
        }
      }

      currentLevel = nextLevel;
      currentDepth++;
    }
  }

  // Add hub nodes
  const hubIndices = selectRandomIndices(allNodes.length, config.hubNodes);
  hubIndices.forEach((index) => {
    allNodes[index].isHub = true;
  });

  // Add cross-tree connections
  addCrossTreeConnections(
    allNodes,
    connections,
    connectorTypeNames,
    config.crossTreeConnections
  );

  // Apply clustering coefficient
  applyClustering(
    allNodes,
    connections,
    connectorTypeNames,
    config.clusteringCoeff
  );

  // Apply network density adjustments
  applyNetworkDensity(
    allNodes,
    connections,
    connectorTypeNames,
    config.networkDensity
  );

  return { entities: allNodes, connections };
}

// Simplified analyzer based on our Node.js version
export function findConnectedGroups(entities: SimpleEntity[]): ConnectedGroup[] {
  const entityMap = new Map<string, SimpleEntity>();
  entities.forEach((entity) => entityMap.set(entity.id, entity));

  const visited = new Set<string>();
  const groups: ConnectedGroup[] = [];

  // Find roots
  const roots = entities.filter((entity) => !entity.parentId);

  roots.forEach((root) => {
    if (!visited.has(root.id)) {
      const groupEntities: SimpleEntity[] = [];
      traverseTree(root.id, entityMap, visited, groupEntities);

      if (groupEntities.length > 0) {
        // Calculate metrics
        const typeCounts: Record<string, number> = {};
        groupEntities.forEach((entity) => {
          typeCounts[entity.type] = (typeCounts[entity.type] || 0) + 1;
        });

        const depth = calculateDepth(root.id, entityMap, 0);

        groups.push({
          id: `group_${groups.length + 1}`,
          rootEntityId: root.id,
          entities: groupEntities,
          metrics: {
            totalEntities: groupEntities.length,
            depth,
            typeCounts,
            rootId: root.id,
          },
        });
      }
    }
  });

  return groups;
}

function traverseTree(
  entityId: string,
  entityMap: Map<string, SimpleEntity>,
  visited: Set<string>,
  group: SimpleEntity[]
): void {
  if (visited.has(entityId)) return;

  const entity = entityMap.get(entityId);
  if (!entity) return;

  visited.add(entityId);
  group.push(entity);

  entity.children.forEach((childId) => {
    traverseTree(childId, entityMap, visited, group);
  });
}

function calculateDepth(
  entityId: string,
  entityMap: Map<string, SimpleEntity>,
  currentDepth: number
): number {
  const entity = entityMap.get(entityId);
  if (!entity || entity.children.length === 0) {
    return currentDepth;
  }

  let maxChildDepth = currentDepth;
  entity.children.forEach((childId) => {
    const childDepth = calculateDepth(childId, entityMap, currentDepth + 1);
    maxChildDepth = Math.max(maxChildDepth, childDepth);
  });

  return maxChildDepth;
}

// Simple ASCII renderer
export function createSimpleASCII(positioned: EntityPosition[]): string {
  if (positioned.length === 0) return "No entities to display";

  const bounds = positioned.reduce(
    (acc, entity) => ({
      minX: Math.min(acc.minX, entity.x),
      maxX: Math.max(acc.maxX, entity.x),
      minY: Math.min(acc.minY, entity.y),
      maxY: Math.max(acc.maxY, entity.y),
    }),
    { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  );

  const width = Math.ceil((bounds.maxX - bounds.minX) * 0.1) + 20;
  const height = Math.ceil((bounds.maxY - bounds.minY) * 0.1) + 10;

  const grid = Array(height)
    .fill(null)
    .map(() => Array(width).fill(" "));

  positioned.forEach((entity) => {
    const gridX = Math.floor((entity.x - bounds.minX) * 0.1) + 10;
    const gridY = Math.floor((bounds.maxY - entity.y) * 0.1) + 5;

    if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
      const symbol = entity.type === "Parent" ? "●" : "▲";
      grid[gridY][gridX] = symbol;
    }
  });

  return grid.map((row) => row.join("")).join("\n");
}