/**
 * Position Mapper for calculating node positions
 * Part of F002 Phase 2 refactoring - T5
 */

import { Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { SpacingConfig } from "../interfaces";
import { POSITION_CONSTANTS } from "../../constants/positionConstants";
import { resolvePropertyValue } from "../../../../utils/nodePropertyHelpers";

export class PositionMapper {
  /**
   * Calculate X positions for each type column
   */
  public calculateTypeColumnPositions(
    sortedTypes: string[],
    nodesByTypeAndLayer: Map<string, Node[]>,
    numLayers: number,
    spacing: SpacingConfig,
    nodeOrganizer: { findMaxNodesInLayer: (nodes: Map<string, Node[]>, type: string, layers: number) => number }
  ): Map<string, number> {
    let typeXOffset = 0;
    const typeXPositions = new Map<string, number>();
    
    sortedTypes.forEach((nodeType, typeIndex) => {
      typeXPositions.set(nodeType, typeXOffset);
      
      // Find max nodes of this type in any layer
      const maxNodesInLayer = nodeOrganizer.findMaxNodesInLayer(
        nodesByTypeAndLayer, 
        nodeType, 
        numLayers
      );
      
      // Move to next type column
      typeXOffset += maxNodesInLayer * spacing.nodeSpacing;
      if (typeIndex < sortedTypes.size() - 1) {
        typeXOffset += spacing.swimlaneSpacing; // Gap between swim lanes
      }
    });
    
    return typeXPositions;
  }

  /**
   * Create position mapping for a property (Z-axis positioning)
   */
  public createPropertyPositionMap(
    nodesByTypeAndLayer: Map<string, Node[]>, 
    propertyName: string
  ): Map<string, number> {
    const uniqueValues = new Set<string>();
    
    // Collect all unique values for the property
    nodesByTypeAndLayer.forEach(nodes => {
      nodes.forEach(node => {
        const value = resolvePropertyValue(node, propertyName);
        uniqueValues.add(value);
      });
    });
    
    // Sort values and assign positions
    const sortedValues = [...uniqueValues].sort();
    const positionMap = new Map<string, number>();
    
    sortedValues.forEach((value, index) => {
      // Position values using constant spacing
      const position = (index - sortedValues.size() / 2) * POSITION_CONSTANTS.Z_DIMENSION_GROUP_SPACING;
      positionMap.set(value, position);
    });
    
    return positionMap;
  }

  /**
   * Calculate centering offset for nodes within a swimlane
   */
  public calculateCenteringOffset(
    maxNodesForType: number,
    actualNodeCount: number,
    spacing: SpacingConfig
  ): number {
    const laneWidth = maxNodesForType * spacing.nodeSpacing;
    const nodesWidth = actualNodeCount * spacing.nodeSpacing;
    return (laneWidth - nodesWidth) / POSITION_CONSTANTS.SWIMLANE.CENTERING_DIVISOR;
  }

  /**
   * Calculate layer Y position (inverted so layer 1 is at top)
   */
  public calculateLayerY(layer: number, numLayers: number, spacing: SpacingConfig): number {
    return POSITION_CONSTANTS.BASE_Y + (numLayers - layer) * spacing.layerSpacing;
  }

  /**
   * Apply offsets to cluster positions
   */
  public applyOffsetsToCluster(
    nodes: Node[], 
    offsetX: number, 
    offsetY: number, 
    offsetZ: number
  ): void {
    nodes.forEach(node => {
      if (!node.position) {
        warn(`[PositionMapper] Cannot apply offset to node ${node.name} - no position`);
        return;
      }
      
      node.position.x += offsetX;
      node.position.y += offsetY;
      node.position.z += offsetZ;
    });
  }

  /**
   * Calculate offsets to center cluster at origin
   */
  public calculateCenteringOffsets(
    bounds: { minX: number; maxX: number; minY: number },
    origin: Vector3,
    yOffset: number = 0
  ): { x: number; y: number; z: number } {
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const offsetX = origin.X - centerX;
    const offsetY = origin.Y - bounds.minY + yOffset;
    const offsetZ = origin.Z;
    
    return { x: offsetX, y: offsetY, z: offsetZ };
  }

  /**
   * Ensure minimum ground clearance
   */
  public ensureGroundClearance(offsetY: number, minY: number): number {
    const minFinalY = minY + offsetY;
    const groundClearanceAdjustment = minFinalY < POSITION_CONSTANTS.MIN_GROUND_CLEARANCE 
      ? POSITION_CONSTANTS.MIN_GROUND_CLEARANCE - minFinalY 
      : 0;
    
    if (groundClearanceAdjustment > 0) {
    }
    
    return offsetY + groundClearanceAdjustment;
  }

  /**
   * Generate type number for node labeling
   */
  public generateTypeNumber(nodeType: string, counter: number): string {
    const paddedNumber = counter < 10 ? `0${counter}` : `${counter}`;
    return `${nodeType.lower()}${paddedNumber}`;
  }
}