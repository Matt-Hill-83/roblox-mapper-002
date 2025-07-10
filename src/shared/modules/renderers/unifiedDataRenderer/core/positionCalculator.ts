/**
 * Position Calculator for Unified Data Renderer
 * 
 * Handles swim lane positioning and origin centering for nodes
 */

import { Cluster, Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { IPositionCalculator, SpacingConfig } from "../interfaces";
import { RENDERER_CONSTANTS } from "../../dataGeneratorRobloxRendererUtils/constants";
import { PropertyValueResolver } from "../../propertyValueResolver";
import { POSITION_CONSTANTS } from "../../constants/positionConstants";

export class PositionCalculator implements IPositionCalculator {
  private propertyResolver: PropertyValueResolver;

  constructor() {
    this.propertyResolver = new PropertyValueResolver();
  }
  /**
   * Get bounds of the cluster (public method for external use)
   */
  public getClusterBounds(cluster: Cluster): { minX: number, maxX: number, minY: number, minZ: number, maxZ: number } {
    const bounds = this.calculateBounds(cluster);
    return bounds;
  }

  /**
   * Centers the bottom of the group at the specified origin
   */
  public centerBottomAtOrigin(cluster: Cluster, origin: Vector3, config?: EnhancedGeneratorConfig): void {
    if (cluster.groups[0].nodes.size() === 0) return;
    
    // Find bounding box
    const bounds = this.calculateBounds(cluster);
    
    // Calculate offsets to center bottom at origin
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const offsetX = origin.X - centerX;
    
    // Apply origin Y offset if configured
    const yOffset = config?.spacing?.originYOffset || 0;
    const offsetY = origin.Y - bounds.minY + yOffset; // Bottom of group at origin Y + offset
    const offsetZ = origin.Z;
    
    // Ensure nodes stay above ground level
    const minFinalY = bounds.minY + offsetY;
    const groundClearanceAdjustment = minFinalY < POSITION_CONSTANTS.MIN_GROUND_CLEARANCE ? POSITION_CONSTANTS.MIN_GROUND_CLEARANCE - minFinalY : 0;
    const finalOffsetY = offsetY + groundClearanceAdjustment;
    
    // Apply ground clearance if needed
    
    // Apply offsets to all nodes
    this.applyOffsets(cluster, offsetX, finalOffsetY, offsetZ);
  }

  /**
   * Calculates swim lane positions for layer-based data
   */
  public calculateLayerSwimLanePositions(cluster: Cluster, config: EnhancedGeneratorConfig): void {
    const spacing = this.getSpacingConfig(config);
    const numLayers = config.layers.size();
    
    // Use spatial grouping properties if available, otherwise default to type/petType
    const xAxisProperty = config.axisMapping?.xAxis || "type";
    const zAxisProperty = config.axisMapping?.zAxis || "petType";
    
    // Organize nodes by layer and X grouping property
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
   * Calculate bounds of the cluster
   */
  private calculateBounds(cluster: Cluster): { minX: number, maxX: number, minY: number, minZ: number, maxZ: number } {
    let minX = math.huge;
    let maxX = -math.huge;
    let minY = math.huge;
    let minZ = math.huge;
    let maxZ = -math.huge;
    
    cluster.groups[0].nodes.forEach(node => {
      minX = math.min(minX, node.position.x);
      maxX = math.max(maxX, node.position.x);
      minY = math.min(minY, node.position.y);
      minZ = math.min(minZ, node.position.z);
      maxZ = math.max(maxZ, node.position.z);
    });
    
    return { minX, maxX, minY, minZ, maxZ };
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
   * Organize nodes by layer and property
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
        const propertyValue = this.propertyResolver.getPropertyValue(node, propertyName);
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
   * Assign positions to nodes with property-based positioning
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
    
    // Check if Y-axis should use property-based positioning
    const useLayerForY = !config.yAxisConfig || config.yAxisConfig.useLayer;
    const yAxisProperty = config.yAxisConfig?.property || "type";
    
    // Create Y position mapping if using property-based Y-axis
    const yPositionMap = useLayerForY ? undefined : this.createPropertyPositionMap(nodesByTypeAndLayer, yAxisProperty, true);
    
    for (let layer = 1; layer <= numLayers; layer++) {
      // Invert Y so layer 1 is at top
      const layerY = RENDERER_CONSTANTS.POSITIONING.BASE_Y + 
                    (numLayers - layer) * spacing.layerSpacing;
      
      sortedTypes.forEach(xValue => {
        const key = `${xValue}-${layer}`;
        const nodes = nodesByTypeAndLayer.get(key) || [];
        
        // Sort nodes alphabetically within type-layer group
        table.sort(nodes, (a, b) => a.name < b.name);
        
        nodes.forEach((node, index) => {
          const baseX = typeXPositions.get(xValue)!;
          
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
          const centeringOffset = (laneWidth - nodesWidth) / 2;
          
          const x = baseX + centeringOffset + index * spacing.nodeSpacing;
          
          // Get Z position based on z-axis property
          const zValue = this.propertyResolver.getPropertyValue(node, zAxisProperty);
          const z = zPositionMap.get(zValue) || 0;
          
          // Get Y position based on Y-axis configuration
          const y = useLayerForY 
            ? layerY 
            : (yPositionMap!.get(this.propertyResolver.getPropertyValue(node, yAxisProperty)) || 0) * spacing.layerSpacing + RENDERER_CONSTANTS.POSITIONING.BASE_Y;
          
          // Update node position
          node.position = { x, y, z };
          
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
   * Create position mapping for a property
   */
  private createPropertyPositionMap(nodesByTypeAndLayer: Map<string, Node[]>, propertyName: string, isYAxis: boolean = false): Map<string, number> {
    const uniqueValues = new Set<string>();
    
    // Collect all unique values for the property
    nodesByTypeAndLayer.forEach(nodes => {
      nodes.forEach(node => {
        const value = this.propertyResolver.getPropertyValue(node, propertyName);
        uniqueValues.add(value);
      });
    });
    
    // Sort values and assign positions
    const sortedValues = [...uniqueValues].sort();
    const positionMap = new Map<string, number>();
    
    sortedValues.forEach((value, index) => {
      if (isYAxis) {
        // For Y-axis, position values vertically
        positionMap.set(value, index);
      } else {
        // Position values apart on the Z axis
        positionMap.set(value, (index - sortedValues.size() / 2) * POSITION_CONSTANTS.Z_DIMENSION_GROUP_SPACING);
      }
    });
    
    return positionMap;
  }


}