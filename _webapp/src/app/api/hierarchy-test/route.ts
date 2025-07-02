import { NextRequest, NextResponse } from 'next/server';

// Import our hierarchy logic (we'll need to adapt this)
// For now, we'll create simplified versions of the core functions

interface TestDataConfig {
  numberOfNodes: number;
  numberOfConnectedChains: number;
  depthOfLongestChain: number;
}

interface SimpleEntity {
  id: string;
  type: 'Parent' | 'Child';
  parentId?: string;
  children: string[];
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

// Simplified data generator based on our Node.js version
function generateConfigurableData(config: TestDataConfig): SimpleEntity[] {
  const entities: SimpleEntity[] = [];
  let entityCounter = 0;
  
  const createEntity = (type: 'Parent' | 'Child', parentId?: string): SimpleEntity => {
    entityCounter++;
    return {
      id: `entity_${entityCounter}`,
      type,
      parentId,
      children: []
    };
  };

  // Distribute nodes across chains
  const nodesPerChain = Math.floor(config.numberOfNodes / config.numberOfConnectedChains);
  const remainingNodes = config.numberOfNodes % config.numberOfConnectedChains;

  for (let chainIndex = 0; chainIndex < config.numberOfConnectedChains; chainIndex++) {
    let chainNodes = nodesPerChain;
    if (chainIndex < remainingNodes) chainNodes++; // Distribute remaining nodes
    
    if (chainNodes < 1) continue;

    // Create root for this chain
    const root = createEntity('Parent');
    entities.push(root);
    
    let remainingChainNodes = chainNodes - 1;
    let currentLevel = [root];
    let currentDepth = 1;
    
    // Build chain to specified depth or until nodes run out
    while (remainingChainNodes > 0 && currentDepth < config.depthOfLongestChain) {
      const nextLevel: SimpleEntity[] = [];
      
      for (const parent of currentLevel) {
        if (remainingChainNodes <= 0) break;
        
        // Create 1-3 children per parent
        const childrenCount = Math.min(
          Math.floor(Math.random() * 3) + 1,
          remainingChainNodes
        );
        
        for (let i = 0; i < childrenCount && remainingChainNodes > 0; i++) {
          const child = createEntity('Child', parent.id);
          parent.children.push(child.id);
          entities.push(child);
          nextLevel.push(child);
          remainingChainNodes--;
        }
      }
      
      currentLevel = nextLevel;
      currentDepth++;
    }
  }
  
  return entities;
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
  const LEVEL_HEIGHT = 50;
  const ENTITY_SPACING = 30;
  
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
    
    // Generate hierarchy data
    const entities = generateConfigurableData(config);
    const groups = findConnectedGroups(entities);
    const positioned = position2D(groups);
    const asciiMap = createSimpleASCII(positioned);
    
    return NextResponse.json({
      entities,
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