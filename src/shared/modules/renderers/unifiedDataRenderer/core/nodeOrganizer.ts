/**
 * Node Organizer for clustering and grouping nodes
 * Part of F002 Phase 2 refactoring - T5
 */

import { Cluster, Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { resolvePropertyValue } from "../../../../utils/nodePropertyHelpers";

export interface OrganizedNodes {
  nodesByLayer: Map<number, Node[]>;
  nodesByTypeAndLayer: Map<string, Node[]>;
  typeCounters: Map<string, number>;
}

export class NodeOrganizer {
  /**
   * Organize nodes by layer and property value
   */
  public organizeByLayerAndProperty(cluster: Cluster, propertyName: string): OrganizedNodes {
    const nodesByLayer = new Map<number, Node[]>();
    const typeCounters = new Map<string, number>();
    const nodesByTypeAndLayer = new Map<string, Node[]>();
    
    // First organize by layer
    this.organizeByLayer(cluster, nodesByLayer);
    
    // Then organize by property and layer
    this.organizeByPropertyAndLayer(nodesByLayer, propertyName, nodesByTypeAndLayer, typeCounters);
    
    return { nodesByLayer, nodesByTypeAndLayer, typeCounters };
  }

  /**
   * Sort property values by their node count
   */
  public sortByCount(typeCounters: Map<string, number>): string[] {
    const sortedTypes: string[] = [];
    typeCounters.forEach((_, nodeType) => {
      sortedTypes.push(nodeType);
    });
    
    // Use table.sort for stable sorting
    table.sort(sortedTypes, (a, b) => {
      const countA = typeCounters.get(a) || 0;
      const countB = typeCounters.get(b) || 0;
      return countB > countA;
    });
    
    return sortedTypes;
  }

  /**
   * Sort nodes within a group
   */
  public sortNodesAlphabetically(nodes: Node[]): void {
    table.sort(nodes, (a, b) => a.name < b.name);
  }

  /**
   * Get unique property values from nodes
   */
  public getUniquePropertyValues(nodes: Map<string, Node[]>, propertyName: string): Set<string> {
    const uniqueValues = new Set<string>();
    
    nodes.forEach(nodeList => {
      nodeList.forEach(node => {
        const value = resolvePropertyValue(node, propertyName);
        uniqueValues.add(value);
      });
    });
    
    return uniqueValues;
  }

  /**
   * Find max nodes for a type across all layers
   */
  public findMaxNodesInLayer(
    nodesByTypeAndLayer: Map<string, Node[]>, 
    nodeType: string, 
    numLayers: number
  ): number {
    let maxNodesInLayer = 0;
    
    for (let layer = 1; layer <= numLayers; layer++) {
      const key = `${nodeType}-${layer}`;
      const nodes = nodesByTypeAndLayer.get(key) || [];
      maxNodesInLayer = math.max(maxNodesInLayer, nodes.size());
    }
    
    return maxNodesInLayer;
  }

  /**
   * Organize nodes by layer
   */
  private organizeByLayer(cluster: Cluster, nodesByLayer: Map<number, Node[]>): void {
    cluster.groups.forEach(group => {
      group.nodes.forEach((node) => {
        const nodeWithLevel = node as Node & { level?: number };
        const layer = nodeWithLevel.level || 1;
        
        if (!nodesByLayer.has(layer)) {
          nodesByLayer.set(layer, []);
        }
        nodesByLayer.get(layer)!.push(node);
      });
    });
  }

  /**
   * Organize nodes by property value and layer
   */
  private organizeByPropertyAndLayer(
    nodesByLayer: Map<number, Node[]>,
    propertyName: string,
    nodesByTypeAndLayer: Map<string, Node[]>,
    typeCounters: Map<string, number>
  ): void {
    nodesByLayer.forEach((nodes, layer) => {
      nodes.forEach(node => {
        const propertyValue = resolvePropertyValue(node, propertyName);
        const key = `${propertyValue}-${layer}`;
        
        if (!nodesByTypeAndLayer.has(key)) {
          nodesByTypeAndLayer.set(key, []);
        }
        nodesByTypeAndLayer.get(key)!.push(node);
        
        // Track total count per property value
        typeCounters.set(propertyValue, (typeCounters.get(propertyValue) || 0) + 1);
      });
    });
  }
}