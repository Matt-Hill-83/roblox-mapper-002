/**
 * Enhanced Position Calculator with validation and guards
 * Part of F002 refactoring for improved error handling
 */

import { Cluster, Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { IPositionCalculator, SpacingConfig } from "../interfaces";
import { RENDERER_CONSTANTS } from "../../dataGeneratorRobloxRendererUtils/constants";
import { POSITION_CONSTANTS } from "../../constants/positionConstants";
import { resolvePropertyValue } from "../../../../utils/nodePropertyHelpers";

export class PositionCalculatorWithValidation implements IPositionCalculator {
  /**
   * Validate cluster structure
   */
  private validateCluster(cluster: Cluster): boolean {
    if (!cluster) {
      warn("[PositionCalculator] Invalid cluster: cluster is null or undefined");
      return false;
    }
    
    if (!cluster.groups || cluster.groups.size() === 0) {
      warn("[PositionCalculator] Invalid cluster: no groups found");
      return false;
    }
    
    if (!cluster.groups[0].nodes) {
      warn("[PositionCalculator] Invalid cluster: first group has no nodes array");
      return false;
    }
    
    return true;
  }
  
  /**
   * Validate configuration
   */
  private validateConfig(config: EnhancedGeneratorConfig): boolean {
    if (!config) {
      warn("[PositionCalculator] Invalid configuration: config is null or undefined");
      return false;
    }
    
    if (!config.layers || config.layers.size() === 0) {
      warn("[PositionCalculator] Invalid configuration: no layers defined");
      return false;
    }
    
    return true;
  }
  
  /**
   * Get bounds of the cluster with validation
   */
  public getClusterBounds(cluster: Cluster): { minX: number, maxX: number, minY: number, minZ: number, maxZ: number } {
    if (!this.validateCluster(cluster)) {
      return {
        minX: 0,
        maxX: 0,
        minY: 0,
        minZ: 0,
        maxZ: 0
      };
    }
    
    const bounds = this.calculateBounds(cluster);
    print(`🔍 Cluster bounds calculated:`);
    print(`   - X: [${bounds.minX}, ${bounds.maxX}]`);
    print(`   - Y: [${bounds.minY}]`);
    print(`   - Z: [${bounds.minZ}, ${bounds.maxZ}]`);
    print(`   - Total nodes: ${cluster.groups[0].nodes.size()}`);
    return bounds;
  }

  /**
   * Centers the bottom of the group at the specified origin with validation
   */
  public centerBottomAtOrigin(cluster: Cluster, origin: Vector3, config?: EnhancedGeneratorConfig): void {
    if (!this.validateCluster(cluster)) {
      return;
    }
    
    if (cluster.groups[0].nodes.size() === 0) {
      print("[PositionCalculator] No nodes to position");
      return;
    }
    
    if (!origin) {
      warn("[PositionCalculator] Invalid origin vector provided");
      return;
    }
    
    // Find bounding box
    const bounds = this.calculateBounds(cluster);
    
    // Calculate offsets to center bottom at origin
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const offsetX = origin.X - centerX;
    
    // Apply origin Y offset if configured
    const yOffset = config?.spacing?.originYOffset || 0;
    const offsetY = origin.Y - bounds.minY + yOffset;
    const offsetZ = origin.Z;
    
    // Ensure nodes stay above ground level
    const minFinalY = bounds.minY + offsetY;
    const groundClearanceAdjustment = minFinalY < POSITION_CONSTANTS.MIN_GROUND_CLEARANCE 
      ? POSITION_CONSTANTS.MIN_GROUND_CLEARANCE - minFinalY 
      : 0;
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
   * Calculates swim lane positions for layer-based data with validation
   */
  public calculateLayerSwimLanePositions(cluster: Cluster, config: EnhancedGeneratorConfig): void {
    if (!this.validateCluster(cluster) || !this.validateConfig(config)) {
      return;
    }
    
    const spacing = this.getSpacingConfig(config);
    const numLayers = config.layers.size();
    
    // Validate axis mapping
    const xAxisProperty = config.axisMapping?.xAxis || "type";
    const zAxisProperty = config.axisMapping?.zAxis || "petType";
    
    if (!xAxisProperty || !zAxisProperty) {
      warn("[PositionCalculator] Invalid axis mapping properties");
      return;
    }
    
    // Organize nodes by layer and x-axis property
    const { nodesByTypeAndLayer, typeCounters } = this.organizeNodesByProperty(cluster, xAxisProperty);
    
    // Sort values by count
    const sortedTypes = this.sortTypesByCount(typeCounters);
    
    // Calculate type column positions
    const typeXPositions = this.calculateTypeColumnPositions(
      sortedTypes,
      nodesByTypeAndLayer,
      numLayers,
      spacing
    );
    
    // Assign positions to each node
    this.assignNodePositionsWithProperties(
      sortedTypes,
      nodesByTypeAndLayer,
      typeXPositions,
      numLayers,
      spacing,
      config,
      xAxisProperty,
      zAxisProperty
    );
  }

  /**
   * Calculate bounds of the cluster with safety checks
   */
  private calculateBounds(cluster: Cluster): { minX: number, maxX: number, minY: number, minZ: number, maxZ: number } {
    let minX = POSITION_CONSTANTS.BOUNDS.INITIAL_MIN;
    let maxX = POSITION_CONSTANTS.BOUNDS.INITIAL_MAX;
    let minY = POSITION_CONSTANTS.BOUNDS.INITIAL_MIN;
    let minZ = POSITION_CONSTANTS.BOUNDS.INITIAL_MIN;
    let maxZ = POSITION_CONSTANTS.BOUNDS.INITIAL_MAX;
    
    cluster.groups[0].nodes.forEach(node => {
      if (!node.position) {
        warn(`[PositionCalculator] Node ${node.name} has no position`);
        return;
      }
      
      minX = math.min(minX, node.position.x);
      maxX = math.max(maxX, node.position.x);
      minY = math.min(minY, node.position.y);
      minZ = math.min(minZ, node.position.z);
      maxZ = math.max(maxZ, node.position.z);
    });
    
    // Handle case where no valid positions were found
    if (minX === POSITION_CONSTANTS.BOUNDS.INITIAL_MIN) {
      return { minX: 0, maxX: 0, minY: 0, minZ: 0, maxZ: 0 };
    }
    
    return { minX, maxX, minY, minZ, maxZ };
  }

  /**
   * Apply position offsets to all nodes with validation
   */
  private applyOffsets(cluster: Cluster, offsetX: number, offsetY: number, offsetZ: number): void {
    cluster.groups[0].nodes.forEach(node => {
      if (!node.position) {
        warn(`[PositionCalculator] Cannot apply offset to node ${node.name} - no position`);
        return;
      }
      
      node.position.x += offsetX;
      node.position.y += offsetY;
      node.position.z += offsetZ;
    });
  }

  /**
   * Get spacing configuration with defaults
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
   * Get property value from node using type-safe resolver
   */
  private getNodePropertyValue(node: Node, propertyName: string): string {
    return resolvePropertyValue(node, propertyName);
  }

  /**
   * Organize nodes by layer and property with validation
   */
  private organizeNodesByProperty(cluster: Cluster, propertyName: string) {
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
    
    // Then organize by property and layer
    nodesByLayer.forEach((nodes, layer) => {
      nodes.forEach(node => {
        const propertyValue = this.getNodePropertyValue(node, propertyName);
        const key = `${propertyValue}-${layer}`;
        
        if (!nodesByTypeAndLayer.has(key)) {
          nodesByTypeAndLayer.set(key, []);
        }
        nodesByTypeAndLayer.get(key)!.push(node);
        
        // Track total count per property value
        typeCounters.set(propertyValue, (typeCounters.get(propertyValue) || 0) + 1);
      });
    });
    
    return { nodesByLayer, nodesByTypeAndLayer, typeCounters };
  }

  /**
   * Sort types by count (descending) with stable sort
   */
  private sortTypesByCount(typeCounters: Map<string, number>): string[] {
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
   * Calculate X positions for each type column with validation
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
   * Assign positions to nodes with property-based positioning and validation
   */
  private assignNodePositionsWithProperties(
    sortedTypes: string[],
    nodesByTypeAndLayer: Map<string, Node[]>,
    typeXPositions: Map<string, number>,
    numLayers: number,
    spacing: SpacingConfig,
    config: EnhancedGeneratorConfig,
    xAxisProperty: string,
    zAxisProperty: string
  ): void {
    const typeNodeCounters = new Map<string, number>();
    sortedTypes.forEach(nodeType => typeNodeCounters.set(nodeType, 0));
    
    // Create Z position mapping for the z-axis property
    const zPositionMap = this.createPropertyPositionMap(nodesByTypeAndLayer, zAxisProperty);
    
    for (let layer = 1; layer <= numLayers; layer++) {
      // Invert Y so layer 1 is at top
      const layerY = POSITION_CONSTANTS.BASE_Y + 
                    (numLayers - layer) * spacing.layerSpacing;
      
      sortedTypes.forEach(xValue => {
        const key = `${xValue}-${layer}`;
        const nodes = nodesByTypeAndLayer.get(key) || [];
        
        if (nodes.size() === 0) return;
        
        // Sort nodes alphabetically within type-layer group
        table.sort(nodes, (a, b) => a.name < b.name);
        
        nodes.forEach((node, index) => {
          const baseX = typeXPositions.get(xValue);
          if (baseX === undefined) {
            warn(`[PositionCalculator] No X position for type ${xValue}`);
            return;
          }
          
          // Find max nodes of this type for centering
          let maxNodesForType = 0;
          for (let checkLayer = 1; checkLayer <= numLayers; checkLayer++) {
            const checkKey = `${xValue}-${checkLayer}`;
            const checkNodes = nodesByTypeAndLayer.get(checkKey) || [];
            maxNodesForType = math.max(maxNodesForType, checkNodes.size());
          }
          
          // Calculate centering offset
          const laneWidth = maxNodesForType * spacing.nodeSpacing;
          const nodesWidth = nodes.size() * spacing.nodeSpacing;
          const centeringOffset = (laneWidth - nodesWidth) / POSITION_CONSTANTS.SWIMLANE.CENTERING_DIVISOR;
          
          const x = baseX + centeringOffset + index * spacing.nodeSpacing;
          
          // Get Z position based on z-axis property
          const zValue = this.getNodePropertyValue(node, zAxisProperty);
          const z = zPositionMap.get(zValue) || 0;
          
          // Update node position
          node.position = { x, y: layerY, z };
          
          // Add type number for labeling
          const typeCounter = typeNodeCounters.get(xValue)! + 1;
          typeNodeCounters.set(xValue, typeCounter);
          const paddedNumber = typeCounter < 10 ? `0${typeCounter}` : `${typeCounter}`;
          const nodeWithType = node as Node & { typeNumber?: string };
          nodeWithType.typeNumber = `${xValue.lower()}${paddedNumber}`;
        });
      });
    }
  }
  
  /**
   * Create position mapping for a property with validation
   */
  private createPropertyPositionMap(nodesByTypeAndLayer: Map<string, Node[]>, propertyName: string): Map<string, number> {
    const uniqueValues = new Set<string>();
    
    // Collect all unique values for the property
    nodesByTypeAndLayer.forEach(nodes => {
      nodes.forEach(node => {
        const value = this.getNodePropertyValue(node, propertyName);
        uniqueValues.add(value);
      });
    });
    
    // Sort values and assign positions
    const sortedValues = [...uniqueValues].sort();
    const positionMap = new Map<string, number>();
    
    sortedValues.forEach((value, index) => {
      // Position values using constant spacing
      positionMap.set(value, (index - sortedValues.size() / 2) * POSITION_CONSTANTS.Z_AXIS_SPACING);
    });
    
    return positionMap;
  }
}