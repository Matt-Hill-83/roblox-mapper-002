/**
 * Refactored Position Calculator using extracted constants
 * Part of F002 Phase 2 refactoring - T2
 * 
 * This is a demonstration of how the existing positionCalculator.ts
 * should be updated to use the new constants
 */

import { Cluster, Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { IPositionCalculator, SpacingConfig } from "../interfaces";
import { RENDERER_CONSTANTS } from "../../dataGeneratorRobloxRendererUtils/constants";
import { POSITION_CONSTANTS } from "../../constants/positionConstants";
import { PropertyValueResolver } from "../../propertyValueResolver";
import { BoundsCalculator } from "./boundsCalculator";
import { NodeOrganizer } from "./nodeOrganizer";
import { PositionMapper } from "./positionMapper";

export class PositionCalculatorRefactored implements IPositionCalculator {
  private boundsCalculator: BoundsCalculator;
  private nodeOrganizer: NodeOrganizer;
  private positionMapper: PositionMapper;
  private propertyResolver: PropertyValueResolver;

  constructor() {
    this.boundsCalculator = new BoundsCalculator();
    this.nodeOrganizer = new NodeOrganizer();
    this.positionMapper = new PositionMapper();
    this.propertyResolver = new PropertyValueResolver();
  }

  /**
   * Get bounds of the cluster (public method for external use)
   */
  public getClusterBounds(cluster: Cluster): { minX: number, maxX: number, minY: number, minZ: number, maxZ: number } {
    return this.boundsCalculator.calculateClusterBounds(cluster);
  }

  /**
   * Centers the bottom of the group at the specified origin
   */
  public centerBottomAtOrigin(cluster: Cluster, origin: Vector3, config?: EnhancedGeneratorConfig): void {
    if (cluster.groups[0].nodes.size() === 0) return;
    
    // Find bounding box
    const bounds = this.boundsCalculator.calculateClusterBounds(cluster);
    
    // Calculate offsets
    const yOffset = config?.spacing?.originYOffset || 0;
    const offsets = this.positionMapper.calculateCenteringOffsets(bounds, origin, yOffset);
    
    // Ensure ground clearance using constant
    const finalOffsetY = this.positionMapper.ensureGroundClearance(offsets.y, bounds.minY);
    
    // Apply offsets to all nodes
    this.positionMapper.applyOffsetsToCluster(
      cluster.groups[0].nodes,
      offsets.x,
      finalOffsetY,
      offsets.z
    );
    
    print(`✅ Positioned ${cluster.groups[0].nodes.size()} nodes with swim lanes`);
  }

  /**
   * Calculates swim lane positions for layer-based data
   */
  public calculateLayerSwimLanePositions(cluster: Cluster, config: EnhancedGeneratorConfig): void {
    const spacing = this.getSpacingConfig(config);
    const numLayers = config.layers.size();
    
    // Use axis mapping if available, otherwise default to type/petType
    const xAxisProperty = config.axisMapping?.xAxis || "type";
    const zAxisProperty = config.axisMapping?.zAxis || "petType";
    
    // Organize nodes using the new NodeOrganizer
    const organized = this.nodeOrganizer.organizeByLayerAndProperty(cluster, xAxisProperty);
    
    // Sort values by count
    const sortedTypes = this.nodeOrganizer.sortByCount(organized.typeCounters);
    
    // Calculate type column positions using PositionMapper
    const typeXPositions = this.positionMapper.calculateTypeColumnPositions(
      sortedTypes,
      organized.nodesByTypeAndLayer,
      numLayers,
      spacing,
      this.nodeOrganizer
    );
    
    // Assign positions to each node
    this.assignNodePositionsWithProperties(
      sortedTypes,
      organized.nodesByTypeAndLayer,
      typeXPositions,
      numLayers,
      spacing,
      config,
      xAxisProperty,
      zAxisProperty
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
    
    // Create Z position mapping using PositionMapper
    const zPositionMap = this.positionMapper.createPropertyPositionMap(nodesByTypeAndLayer, zAxisProperty);
    
    for (let layer = 1; layer <= numLayers; layer++) {
      // Calculate layer Y using PositionMapper
      const layerY = this.positionMapper.calculateLayerY(layer, numLayers, spacing);
      
      sortedTypes.forEach(xValue => {
        const key = `${xValue}-${layer}`;
        const nodes = nodesByTypeAndLayer.get(key) || [];
        
        // Sort nodes alphabetically
        this.nodeOrganizer.sortNodesAlphabetically(nodes);
        
        // Find max nodes for centering
        const maxNodesForType = this.nodeOrganizer.findMaxNodesInLayer(
          nodesByTypeAndLayer,
          xValue,
          numLayers
        );
        
        nodes.forEach((node, index) => {
          const baseX = typeXPositions.get(xValue)!;
          
          // Calculate centering offset using PositionMapper
          const centeringOffset = this.positionMapper.calculateCenteringOffset(
            maxNodesForType,
            nodes.size(),
            spacing
          );
          
          const x = baseX + centeringOffset + index * spacing.nodeSpacing;
          
          // Get Z position based on z-axis property using PropertyValueResolver
          const zValue = this.propertyResolver.getPropertyValue(node, zAxisProperty);
          const z = zPositionMap.get(zValue) || 0;
          
          // Update node position
          node.position = { x, y: layerY, z };
          
          // Generate type number using PositionMapper
          const typeCounter = typeNodeCounters.get(xValue)! + 1;
          typeNodeCounters.set(xValue, typeCounter);
          const nodeWithType = node as Node & { typeNumber?: string };
          nodeWithType.typeNumber = this.positionMapper.generateTypeNumber(xValue, typeCounter);
        });
      });
    }
  }
}