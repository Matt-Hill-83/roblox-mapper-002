/**
 * Positioning logic for swim lane organization
 */

import { Cluster, Node } from "../../../shared/interfaces/simpleDataGenerator.interface";
import { RENDERER_CONSTANTS } from "./constants";

/**
 * Calculates swim lane positions for all nodes in the cluster
 * Based on the JavaScript test data generator positioning logic
 */
export function calculateSwimLanePositions(cluster: Cluster): void {
  const { COLUMN_SPACING, LEVEL_SPACING, BASE_Y } = RENDERER_CONSTANTS.POSITIONING;
  
  // Organize nodes by level
  const nodesByLevel = new Map<number, Node[]>();
  nodesByLevel.set(1, []);
  nodesByLevel.set(2, []);
  nodesByLevel.set(3, []);
  
  // Use the actual level information from each node
  cluster.groups.forEach(group => {
    group.nodes.forEach((node) => {
      const nodeWithLevel = node as Node & { level?: number };
      const level = nodeWithLevel.level || 1; // Default to level 1 if not set
      nodesByLevel.get(level)!.push(node);
    });
  });
  
  // Group nodes by type across all levels
  const typeCounters = new Map<string, number>();
  const nodesByTypeAndLevel = new Map<string, Node[]>();
  
  // First pass: organize nodes by type and level, count totals
  for (const [level, nodes] of nodesByLevel) {
    for (const node of nodes) {
      const key = `${node.type}-${level}`;
      if (!nodesByTypeAndLevel.has(key)) {
        nodesByTypeAndLevel.set(key, []);
      }
      nodesByTypeAndLevel.get(key)!.push(node);
      
      // Track total count per type
      typeCounters.set(node.type, (typeCounters.get(node.type) || 0) + 1);
    }
  }
  
  // Sort nodes within each type-level group alphabetically
  for (const [_, nodes] of nodesByTypeAndLevel) {
    // Manual sort implementation for Lua compatibility
    for (let i = 0; i < nodes.size() - 1; i++) {
      for (let j = i + 1; j < nodes.size(); j++) {
        if (nodes[i].name > nodes[j].name) {
          const temp = nodes[i];
          nodes[i] = nodes[j];
          nodes[j] = temp;
        }
      }
    }
  }
  
  // Calculate type columns (sorted by count, descending)
  const sortedTypes: string[] = [];
  typeCounters.forEach((_, nodeType) => {
    sortedTypes.push(nodeType);
  });
  // Manual sort for Lua compatibility
  for (let i = 0; i < sortedTypes.size() - 1; i++) {
    for (let j = i + 1; j < sortedTypes.size(); j++) {
      const countA = typeCounters.get(sortedTypes[i])!;
      const countB = typeCounters.get(sortedTypes[j])!;
      if (countB > countA) {
        const temp = sortedTypes[i];
        sortedTypes[i] = sortedTypes[j];
        sortedTypes[j] = temp;
      }
    }
  }
  
  // Assign positions
  let typeXOffset = 0;
  const typeXPositions = new Map<string, number>();
  
  for (const nodeType of sortedTypes) {
    typeXPositions.set(nodeType, typeXOffset);
    
    // Find max nodes of this type in any level
    let maxNodesInLevel = 0;
    for (let level = 1; level <= 3; level++) {
      const key = `${nodeType}-${level}`;
      const nodes = nodesByTypeAndLevel.get(key) || [];
      maxNodesInLevel = math.max(maxNodesInLevel, nodes.size());
    }
    
    // Move to next type column
    typeXOffset += maxNodesInLevel * COLUMN_SPACING;
    const typeIndex = sortedTypes.indexOf(nodeType);
    if (typeIndex !== -1 && typeIndex < sortedTypes.size() - 1) {
      typeXOffset += COLUMN_SPACING; // Extra gap between types
    }
  }
  
  // Assign positions to each node
  const typeNodeCounters = new Map<string, number>();
  for (const nodeType of sortedTypes) {
    typeNodeCounters.set(nodeType, 0);
  }
  
  for (let level = 1; level <= 3; level++) {
    const levelY = BASE_Y + (3 - level) * LEVEL_SPACING;  // Level 1 at top, level 3 at bottom
    
    for (const nodeType of sortedTypes) {
      const key = `${nodeType}-${level}`;
      const nodes = nodesByTypeAndLevel.get(key) || [];
      
      nodes.forEach((node, index) => {
        const baseX = typeXPositions.get(nodeType)!;
        
        // Find max nodes of this type across all levels for centering
        let maxNodesForType = 0;
        for (let checkLevel = 1; checkLevel <= 3; checkLevel++) {
          const checkKey = `${nodeType}-${checkLevel}`;
          const checkNodes = nodesByTypeAndLevel.get(checkKey) || [];
          maxNodesForType = math.max(maxNodesForType, checkNodes.size());
        }
        
        // Calculate centering offset
        const laneWidth = maxNodesForType * COLUMN_SPACING;
        const nodesWidth = nodes.size() * COLUMN_SPACING;
        const centeringOffset = (laneWidth - nodesWidth) / 2;
        
        const x = baseX + centeringOffset + index * COLUMN_SPACING;
        const z = 0;  // Depth, can be adjusted later
        
        // Update node position
        node.position = { x, y: levelY, z };
        
        // Add type number for labeling
        const typeCounter = typeNodeCounters.get(nodeType)! + 1;
        typeNodeCounters.set(nodeType, typeCounter);
        // Add typeNumber property to node for display
        const paddedNumber = typeCounter < 10 ? `0${typeCounter}` : `${typeCounter}`;
        const nodeWithType = node as Node & { typeNumber?: string };
        nodeWithType.typeNumber = `${nodeType.lower()}${paddedNumber}`;
      });
    }
  }
}