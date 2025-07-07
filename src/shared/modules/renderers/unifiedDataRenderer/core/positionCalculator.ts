/**
 * Position Calculator for Unified Data Renderer
 * 
 * Handles swim lane positioning and origin centering for nodes
 */

import { Cluster, Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { IPositionCalculator, SpacingConfig } from "../interfaces";
import { RENDERER_CONSTANTS } from "../../dataGeneratorRobloxRendererUtils/constants";

export class PositionCalculator implements IPositionCalculator {
  /**
   * Centers the bottom of the group at the specified origin
   */
  public centerBottomAtOrigin(cluster: Cluster, origin: Vector3): void {
    if (cluster.groups[0].nodes.size() === 0) return;
    
    // Find bounding box
    const bounds = this.calculateBounds(cluster);
    
    // Calculate offsets to center bottom at origin
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const offsetX = origin.X - centerX;
    const offsetY = origin.Y - bounds.minY; // Bottom of group at origin Y
    const offsetZ = origin.Z;
    
    // Ensure nodes stay above ground level (minimum Y = 5)
    const minFinalY = bounds.minY + offsetY;
    const groundClearanceAdjustment = minFinalY < 5 ? 5 - minFinalY : 0;
    const finalOffsetY = offsetY + groundClearanceAdjustment;
    
    // Debug ground clearance only if adjustment needed
    if (groundClearanceAdjustment > 0) {
      print(`🎯 Ground clearance applied: +${groundClearanceAdjustment} (final Y will be ${minFinalY + groundClearanceAdjustment})`);
    }
    
    // Apply offsets to all nodes
    this.applyOffsets(cluster, offsetX, finalOffsetY, offsetZ);
    
    print(`✅ Positioned ${cluster.groups[0].nodes.size()} nodes with swim lanes`);
  }

  /**
   * Calculates swim lane positions for layer-based data
   */
  public calculateLayerSwimLanePositions(cluster: Cluster, config: EnhancedGeneratorConfig): void {
    const spacing = this.getSpacingConfig(config);
    const numLayers = config.layers.size();
    
    // Organize nodes by layer and type
    const { nodesByTypeAndLayer, typeCounters } = this.organizeNodes(cluster);
    
    // Sort types by count
    const sortedTypes = this.sortTypesByCount(typeCounters);
    
    // Calculate type column positions
    const typeXPositions = this.calculateTypeColumnPositions(
      sortedTypes,
      nodesByTypeAndLayer,
      numLayers,
      spacing
    );
    
    // Assign positions to each node
    this.assignNodePositions(
      sortedTypes,
      nodesByTypeAndLayer,
      typeXPositions,
      numLayers,
      spacing,
      config
    );
  }

  /**
   * Calculate bounds of the cluster
   */
  private calculateBounds(cluster: Cluster): { minX: number, maxX: number, minY: number } {
    let minX = math.huge;
    let maxX = -math.huge;
    let minY = math.huge;
    
    cluster.groups[0].nodes.forEach(node => {
      minX = math.min(minX, node.position.x);
      maxX = math.max(maxX, node.position.x);
      minY = math.min(minY, node.position.y);
    });
    
    return { minX, maxX, minY };
  }

  /**
   * Apply position offsets to all nodes
   */
  private applyOffsets(cluster: Cluster, offsetX: number, offsetY: number, offsetZ: number): void {
    cluster.groups[0].nodes.forEach(node => {
      node.position.x += offsetX;
      node.position.y += offsetY;
      node.position.z += offsetZ;
    });
  }

  /**
   * Get spacing configuration
   */
  private getSpacingConfig(config: EnhancedGeneratorConfig): SpacingConfig {
    return config.spacing || {
      nodeHeight: RENDERER_CONSTANTS.HEXAGON.HEIGHT,
      nodeRadius: RENDERER_CONSTANTS.HEXAGON.WIDTH / 2,
      layerSpacing: RENDERER_CONSTANTS.POSITIONING.LEVEL_SPACING,
      nodeSpacing: RENDERER_CONSTANTS.POSITIONING.COLUMN_SPACING,
      swimlaneSpacing: RENDERER_CONSTANTS.POSITIONING.COLUMN_SPACING
    };
  }

  /**
   * Organize nodes by layer and type
   */
  private organizeNodes(cluster: Cluster) {
    const nodesByLayer = new Map<number, Node[]>();
    const typeCounters = new Map<string, number>();
    const nodesByTypeAndLayer = new Map<string, Node[]>();
    
    // First organize by layer
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
    
    // Then organize by type and layer
    nodesByLayer.forEach((nodes, layer) => {
      nodes.forEach(node => {
        const key = `${node.type}-${layer}`;
        if (!nodesByTypeAndLayer.has(key)) {
          nodesByTypeAndLayer.set(key, []);
        }
        nodesByTypeAndLayer.get(key)!.push(node);
        
        // Track total count per type
        typeCounters.set(node.type, (typeCounters.get(node.type) || 0) + 1);
      });
    });
    
    return { nodesByLayer, nodesByTypeAndLayer, typeCounters };
  }

  /**
   * Sort types by count (descending)
   */
  private sortTypesByCount(typeCounters: Map<string, number>): string[] {
    const sortedTypes: string[] = [];
    typeCounters.forEach((_, nodeType) => {
      sortedTypes.push(nodeType);
    });
    
    // Use table.sort instead of manual bubble sort
    table.sort(sortedTypes, (a, b) => {
      const countA = typeCounters.get(a) || 0;
      const countB = typeCounters.get(b) || 0;
      return countB > countA;
    });
    
    return sortedTypes;
  }

  /**
   * Calculate X positions for each type column
   */
  private calculateTypeColumnPositions(
    sortedTypes: string[],
    nodesByTypeAndLayer: Map<string, Node[]>,
    numLayers: number,
    spacing: SpacingConfig
  ): Map<string, number> {
    let typeXOffset = 0;
    const typeXPositions = new Map<string, number>();
    
    sortedTypes.forEach((nodeType, typeIndex) => {
      typeXPositions.set(nodeType, typeXOffset);
      
      // Find max nodes of this type in any layer
      let maxNodesInLayer = 0;
      for (let layer = 1; layer <= numLayers; layer++) {
        const key = `${nodeType}-${layer}`;
        const nodes = nodesByTypeAndLayer.get(key) || [];
        maxNodesInLayer = math.max(maxNodesInLayer, nodes.size());
      }
      
      // Move to next type column
      typeXOffset += maxNodesInLayer * spacing.nodeSpacing;
      if (typeIndex < sortedTypes.size() - 1) {
        typeXOffset += spacing.swimlaneSpacing; // Gap between swim lanes
      }
    });
    
    return typeXPositions;
  }

  /**
   * Assign positions to each node
   */
  private assignNodePositions(
    sortedTypes: string[],
    nodesByTypeAndLayer: Map<string, Node[]>,
    typeXPositions: Map<string, number>,
    numLayers: number,
    spacing: SpacingConfig,
    config: EnhancedGeneratorConfig
  ): void {
    const typeNodeCounters = new Map<string, number>();
    sortedTypes.forEach(nodeType => typeNodeCounters.set(nodeType, 0));
    
    for (let layer = 1; layer <= numLayers; layer++) {
      // Invert Y so layer 1 is at top
      const layerY = RENDERER_CONSTANTS.POSITIONING.BASE_Y + 
                    (numLayers - layer) * spacing.layerSpacing;
      
      sortedTypes.forEach(nodeType => {
        const key = `${nodeType}-${layer}`;
        const nodes = nodesByTypeAndLayer.get(key) || [];
        
        // Sort nodes alphabetically within type-layer group
        table.sort(nodes, (a, b) => a.name < b.name);
        
        nodes.forEach((node, index) => {
          const baseX = typeXPositions.get(nodeType)!;
          
          // Find max nodes of this type for centering
          let maxNodesForType = 0;
          for (let checkLayer = 1; checkLayer <= numLayers; checkLayer++) {
            const checkKey = `${nodeType}-${checkLayer}`;
            const checkNodes = nodesByTypeAndLayer.get(checkKey) || [];
            maxNodesForType = math.max(maxNodesForType, checkNodes.size());
          }
          
          // Calculate centering offset
          const laneWidth = maxNodesForType * spacing.nodeSpacing;
          const nodesWidth = nodes.size() * spacing.nodeSpacing;
          const centeringOffset = (laneWidth - nodesWidth) / 2;
          
          const x = baseX + centeringOffset + index * spacing.nodeSpacing;
          let z = 0;
          
          // Apply random Z offset if enabled
          if (config.visualization?.randomZOffset) {
            const offsetAmount = config.visualization.zOffsetAmount || 20;
            z = this.calculateRandomZOffset(node.uuid, offsetAmount);
          }
          
          // Update node position
          node.position = { x, y: layerY, z };
          
          // Add type number for labeling
          const typeCounter = typeNodeCounters.get(nodeType)! + 1;
          typeNodeCounters.set(nodeType, typeCounter);
          const paddedNumber = typeCounter < 10 ? `0${typeCounter}` : `${typeCounter}`;
          const nodeWithType = node as Node & { typeNumber?: string };
          nodeWithType.typeNumber = `${nodeType.lower()}${paddedNumber}`;
        });
      });
    }
  }

  /**
   * Calculate random Z offset for a node
   */
  private calculateRandomZOffset(uuid: string, offsetAmount: number): number {
    // Use node UUID as seed for deterministic randomness
    let seed = 0;
    for (let i = 0; i < uuid.size(); i++) {
      seed += string.byte(uuid, i + 1)[0];
    }
    math.randomseed(seed);
    
    // 50% chance to offset
    if (math.random() < 0.5) {
      // 50% chance for +offsetAmount or -offsetAmount
      const offsetDirection = math.random() < 0.5 ? -1 : 1;
      return offsetDirection * offsetAmount;
    }
    
    return 0;
  }
}