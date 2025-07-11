/**
 * Position Calculator for Unified Data Renderer
 * 
 * Handles swim lane positioning and origin centering for nodes
 * Refactored into modular internal classes for better organization
 */

import { Cluster, Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { IPositionCalculator, SpacingConfig } from "../interfaces";
import { RENDERER_CONSTANTS } from "../../dataGeneratorRobloxRendererUtils/constants";
import { PropertyValueResolver } from "../../propertyValueResolver";
import { POSITION_CONSTANTS } from "../../constants/positionConstants";
import { getDefaultXAxis, getDefaultZAxis } from "../../../../constants/axisDefaults";

/**
 * Bounds Calculator - Handles cluster boundary calculations
 */
class BoundsCalculator {
  /**
   * Calculate bounds of the cluster
   */
  public calculateBounds(cluster: Cluster): { minX: number, maxX: number, minY: number, minZ: number, maxZ: number } {
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
}

/**
 * Position Mapper - Handles position transformations and property mapping
 */
class PositionMapper {
  private propertyResolver: PropertyValueResolver;

  constructor(propertyResolver: PropertyValueResolver) {
    this.propertyResolver = propertyResolver;
  }

  /**
   * Apply position offsets to all nodes
   */
  public applyOffsets(cluster: Cluster, offsetX: number, offsetY: number, offsetZ: number): void {
    cluster.groups[0].nodes.forEach(node => {
      node.position.x += offsetX;
      node.position.y += offsetY;
      node.position.z += offsetZ;
    });
  }

  /**
   * Create position mapping for a property
   */
  public createPropertyPositionMap(nodesByTypeAndLayer: Map<string, Node[]>, propertyName: string, isYAxis: boolean = false): Map<string, number> {
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

/**
 * Node Organizer - Handles node organization and sorting
 */
class NodeOrganizer {
  private propertyResolver: PropertyValueResolver;

  constructor(propertyResolver: PropertyValueResolver) {
    this.propertyResolver = propertyResolver;
  }

  /**
   * Organize nodes by layer and property
   */
  public organizeNodesByProperty(cluster: Cluster, propertyName: string) {
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
  public sortTypesByCount(typeCounters: Map<string, number>): string[] {
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
}

/**
 * Swim Lane Calculator - Handles swim lane positioning calculations
 */
class SwimLaneCalculator {
  private propertyResolver: PropertyValueResolver;

  constructor(propertyResolver: PropertyValueResolver) {
    this.propertyResolver = propertyResolver;
  }

  /**
   * Calculate X positions for each type column
   */
  public calculateTypeColumnPositions(
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
  public assignNodePositionsWithProperties(
    sortedTypes: string[],
    nodesByTypeAndLayer: Map<string, Node[]>,
    typeXPositions: Map<string, number>,
    numLayers: number,
    spacing: SpacingConfig,
    config: EnhancedGeneratorConfig,
    zAxisProperty: string,
    zPositionMap: Map<string, number>,
    yPositionMap?: Map<string, number>
  ): void {
    const typeNodeCounters = new Map<string, number>();
    sortedTypes.forEach(nodeType => typeNodeCounters.set(nodeType, 0));
    
    // Check if Y-axis should use property-based positioning
    const yAxisFromMapping = config.axisMapping?.yAxis;
    const useLayerForY = !yAxisFromMapping || yAxisFromMapping === "none";
    const yAxisProperty = yAxisFromMapping || "type";
    
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
}

/**
 * Main PositionCalculator - Orchestrates all modules
 */
export class PositionCalculator implements IPositionCalculator {
  private propertyResolver: PropertyValueResolver;
  private boundsCalculator: BoundsCalculator;
  private positionMapper: PositionMapper;
  private nodeOrganizer: NodeOrganizer;
  private swimLaneCalculator: SwimLaneCalculator;

  constructor() {
    this.propertyResolver = new PropertyValueResolver();
    this.boundsCalculator = new BoundsCalculator();
    this.positionMapper = new PositionMapper(this.propertyResolver);
    this.nodeOrganizer = new NodeOrganizer(this.propertyResolver);
    this.swimLaneCalculator = new SwimLaneCalculator(this.propertyResolver);
  }

  /**
   * Get bounds of the cluster (public method for external use)
   */
  public getClusterBounds(cluster: Cluster): { minX: number, maxX: number, minY: number, minZ: number, maxZ: number } {
    return this.boundsCalculator.calculateBounds(cluster);
  }

  /**
   * Centers the bottom of the group at the specified origin
   */
  public centerBottomAtOrigin(cluster: Cluster, origin: Vector3, config?: EnhancedGeneratorConfig): void {
    if (cluster.groups[0].nodes.size() === 0) return;
    
    // Find bounding box
    const bounds = this.boundsCalculator.calculateBounds(cluster);
    
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
    
    // Apply offsets to all nodes
    this.positionMapper.applyOffsets(cluster, offsetX, finalOffsetY, offsetZ);
  }

  /**
   * Calculates swim lane positions for layer-based data
   */
  public calculateLayerSwimLanePositions(cluster: Cluster, config: EnhancedGeneratorConfig): void {
    const spacing = this.getSpacingConfig(config);
    const numLayers = config.layers.size();
    
    // Use spatial grouping properties if available, otherwise use dynamic defaults
    const discoveredProperties = cluster.discoveredProperties;
    const xAxisProperty = config.axisMapping?.xAxis || getDefaultXAxis(discoveredProperties);
    const zAxisProperty = config.axisMapping?.zAxis || getDefaultZAxis(discoveredProperties);
    
    // Organize nodes by layer and X grouping property
    const { nodesByTypeAndLayer, typeCounters } = this.nodeOrganizer.organizeNodesByProperty(cluster, xAxisProperty);
    
    // Sort values by count
    const sortedTypes = this.nodeOrganizer.sortTypesByCount(typeCounters);
    
    // Calculate type column positions
    const typeXPositions = this.swimLaneCalculator.calculateTypeColumnPositions(
      sortedTypes,
      nodesByTypeAndLayer,
      numLayers,
      spacing
    );
    
    // Create Z position mapping for the z-axis property
    const zPositionMap = this.positionMapper.createPropertyPositionMap(nodesByTypeAndLayer, zAxisProperty);
    
    // Create Y position mapping if using property-based Y-axis
    const yAxisFromMapping = config.axisMapping?.yAxis;
    const yPositionMap = (!yAxisFromMapping || yAxisFromMapping === "none") 
      ? undefined 
      : this.positionMapper.createPropertyPositionMap(nodesByTypeAndLayer, yAxisFromMapping, true);
    
    // Assign positions to each node
    this.swimLaneCalculator.assignNodePositionsWithProperties(
      sortedTypes,
      nodesByTypeAndLayer,
      typeXPositions,
      numLayers,
      spacing,
      config,
      zAxisProperty,
      zPositionMap,
      yPositionMap
    );
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
}