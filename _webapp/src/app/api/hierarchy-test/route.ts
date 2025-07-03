import { NextRequest, NextResponse } from 'next/server';

// Import our hierarchy logic (we'll need to adapt this)
// For now, we'll create simplified versions of the core functions

interface TestDataConfig {
  // Basic parameters
  numberOfNodes: number;
  numberOfConnectedChains: number;
  depthOfLongestChain: number;
  
  // Advanced parameters
  totalNodes: number;
  maxDepth: number;
  branchingMin: number;
  branchingMax: number;
  crossTreeConnections: number; // percentage 0-100
  entityTypes: number;
  connectorTypes: number;
  clusteringCoeff: number; // percentage 0-100
  hubNodes: number;
  networkDensity: 'sparse' | 'medium' | 'dense';
}

interface Connection {
  fromId: string;
  toId: string;
  type: string; // Connector type like "uses", "owns", "maintains"
}

interface SimpleEntity {
  id: string;
  type: string; // Now supports multiple entity types
  parentId?: string;
  children: string[];
  connections: string[]; // Cross-tree connections (just IDs for backward compatibility)
  weight: number; // For weighted relationships
  isHub: boolean; // Hub node indicator
}

interface ConnectedGroup {
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

interface EntityPosition {
  entityId: string;
  type: string;
  parentId?: string;
  x: number;
  y: number;
  level: number;
  groupId: string;
}

// Advanced data generator with complex network properties
function generateConfigurableData(config: TestDataConfig): { entities: SimpleEntity[], connections: Connection[] } {
  const entities: SimpleEntity[] = [];
  const connections: Connection[] = [];
  let entityCounter = 0;
  
  // Generate entity type names and connector type names
  const entityTypeNames = generateEntityTypeNames(config.entityTypes);
  const connectorTypeNames = generateConnectorTypeNames(config.connectorTypes || 3);
  
  const createEntity = (type: string, parentId?: string, isHub = false): SimpleEntity => {
    entityCounter++;
    return {
      id: `entity_${entityCounter}`,
      type,
      parentId,
      children: [],
      connections: [],
      weight: Math.random() * 10 + 1, // Random weight 1-11
      isHub
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
        const branchingFactor = Math.floor(
          Math.random() * (config.branchingMax - config.branchingMin + 1)
        ) + config.branchingMin;
        
        const childrenCount = Math.min(branchingFactor, remainingChainNodes);
        
        for (let i = 0; i < childrenCount && remainingChainNodes > 0; i++) {
          // Randomly select entity type
          const childType = entityTypeNames[
            Math.floor(Math.random() * entityTypeNames.length)
          ];
          
          const child = createEntity(childType, parent.id);
          parent.children.push(child.id);
          allNodes.push(child);
          nextLevel.push(child);
          remainingChainNodes--;
          
          // Add parent-child connection with type "parentChild"
          connections.push({
            fromId: parent.id,
            toId: child.id,
            type: 'parentChild'
          });
        }
      }
      
      currentLevel = nextLevel;
      currentDepth++;
    }
  }

  // Add hub nodes
  const hubIndices = selectRandomIndices(allNodes.length, config.hubNodes);
  hubIndices.forEach(index => {
    allNodes[index].isHub = true;
  });

  // Add cross-tree connections
  addCrossTreeConnections(allNodes, connections, connectorTypeNames, config.crossTreeConnections);
  
  // Apply clustering coefficient
  applyClustering(allNodes, connections, connectorTypeNames, config.clusteringCoeff);
  
  // Apply network density adjustments
  applyNetworkDensity(allNodes, connections, connectorTypeNames, config.networkDensity);
  
  return { entities: allNodes, connections };
}

function generateEntityTypeNames(count: number): string[] {
  const baseTypes = [
    'Service', 'Component', 'Module', 'Interface', 'Controller', 
    'Repository', 'Entity', 'Utility', 'Factory', 'Manager'
  ];
  return baseTypes.slice(0, Math.min(count, baseTypes.length));
}

function generateConnectorTypeNames(count: number): string[] {
  const baseConnectorTypes = [
    'uses', 'owns', 'maintains', 'implements', 'extends', 
    'depends_on', 'configures', 'monitors', 'delegates_to', 'inherits_from'
  ];
  return baseConnectorTypes.slice(0, Math.min(count, baseConnectorTypes.length));
}

function selectRandomIndices(totalCount: number, selectCount: number): number[] {
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

function addCrossTreeConnections(
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
          const connectorType = connectorTypeNames[
            Math.floor(Math.random() * connectorTypeNames.length)
          ];
          connections.push({
            fromId: source.id,
            toId: target.id,
            type: connectorType
          });
        }
      }
    }
  }
}

function applyClustering(
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
      const connectedEntity = entities.find(e => e.id === connectedId);
      if (connectedEntity) {
        for (const secondaryId of connectedEntity.connections) {
          if (secondaryId !== entity.id && !entity.connections.includes(secondaryId)) {
            entity.connections.push(secondaryId);
            
            // Add typed connection
            const connectorType = connectorTypeNames[
              Math.floor(Math.random() * connectorTypeNames.length)
            ];
            connections.push({
              fromId: entity.id,
              toId: secondaryId,
              type: connectorType
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

function applyNetworkDensity(
  entities: SimpleEntity[], 
  connections: Connection[], 
  connectorTypeNames: string[], 
  density: 'sparse' | 'medium' | 'dense'
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
        const connectorType = connectorTypeNames[
          Math.floor(Math.random() * connectorTypeNames.length)
        ];
        connections.push({
          fromId: source.id,
          toId: target.id,
          type: connectorType
        });
      }
    }
  }
}

function isInSameTree(entity1: SimpleEntity, entity2: SimpleEntity, entities: SimpleEntity[]): boolean {
  // Simple check: if they share a common root ancestor
  const root1 = findRoot(entity1, entities);
  const root2 = findRoot(entity2, entities);
  return root1?.id === root2?.id;
}

function findRoot(entity: SimpleEntity, entities: SimpleEntity[]): SimpleEntity | null {
  if (!entity.parentId) return entity;
  
  const parent = entities.find(e => e.id === entity.parentId);
  if (!parent) return entity;
  
  return findRoot(parent, entities);
}

// Simplified analyzer based on our Node.js version
function findConnectedGroups(entities: SimpleEntity[]): ConnectedGroup[] {
  const entityMap = new Map<string, SimpleEntity>();
  entities.forEach(entity => entityMap.set(entity.id, entity));
  
  const visited = new Set<string>();
  const groups: ConnectedGroup[] = [];
  
  // Find roots
  const roots = entities.filter(entity => !entity.parentId);
  
  roots.forEach(root => {
    if (!visited.has(root.id)) {
      const groupEntities: SimpleEntity[] = [];
      traverseTree(root.id, entityMap, visited, groupEntities);
      
      if (groupEntities.length > 0) {
        // Calculate metrics
        const typeCounts: Record<string, number> = {};
        groupEntities.forEach(entity => {
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
            rootId: root.id
          }
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
  
  entity.children.forEach(childId => {
    traverseTree(childId, entityMap, visited, group);
  });
}

function calculateDepth(entityId: string, entityMap: Map<string, SimpleEntity>, currentDepth: number): number {
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

// Simplified positioner based on our Node.js version
function position2D(groups: ConnectedGroup[]): EntityPosition[] {
  const TREE_SPACING = 200;
  
  const positionedEntities: EntityPosition[] = [];
  
  groups.forEach((group, groupIndex) => {
    const entityMap = new Map<string, SimpleEntity>();
    group.entities.forEach(entity => entityMap.set(entity.id, entity));
    
    const baseX = groupIndex * TREE_SPACING;
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
  
  const ENTITY_SPACING = 30;
  const LEVEL_HEIGHT = 50;
  
  const x = baseX + (siblingIndex * ENTITY_SPACING);
  const y = baseY - (level * LEVEL_HEIGHT);
  
  positions.push({
    entityId: entity.id,
    type: entity.type,
    parentId: entity.parentId,
    x,
    y,
    level,
    groupId
  });
  
  entity.children.forEach((childId, childIndex) => {
    const childrenCount = entity.children.length;
    const childSiblingIndex = childIndex - (childrenCount - 1) / 2;
    
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

// Simple ASCII renderer
function createSimpleASCII(positioned: EntityPosition[]): string {
  if (positioned.length === 0) return 'No entities to display';
  
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
  
  const grid = Array(height).fill().map(() => Array(width).fill(' '));
  
  positioned.forEach(entity => {
    const gridX = Math.floor((entity.x - bounds.minX) * 0.1) + 10;
    const gridY = Math.floor((bounds.maxY - entity.y) * 0.1) + 5;
    
    if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
      const symbol = entity.type === 'Parent' ? '●' : '▲';
      grid[gridY][gridX] = symbol;
    }
  });
  
  return grid.map(row => row.join('')).join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const config: TestDataConfig = await request.json();
    
    // Validate input
    if (!config.numberOfNodes || !config.numberOfConnectedChains || !config.depthOfLongestChain) {
      return NextResponse.json(
        { error: 'Missing required configuration parameters' },
        { status: 400 }
      );
    }
    
    // Generate hierarchy data with typed connections
    const { entities, connections } = generateConfigurableData(config);
    const groups = findConnectedGroups(entities);
    const positioned = position2D(groups);
    const asciiMap = createSimpleASCII(positioned);
    
    return NextResponse.json({
      entities,
      connections,
      groups,
      positioned,
      asciiMap,
      config
    });
    
  } catch (error) {
    console.error('Error generating hierarchy:', error);
    return NextResponse.json(
      { error: 'Failed to generate hierarchy data' },
      { status: 500 }
    );
  }
}