/**
 * Block Dimension Calculator
 * Calculates dimensions for various block types
 * Part of F002 Phase 2 refactoring - T6
 */

import { BLOCK_CONSTANTS } from "../constants/blockConstants";

export interface NodeBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface BlockDimensions {
  width: number;
  depth: number;
}

export class BlockDimensionCalculator {
  /**
   * Calculate block dimensions based on node bounds
   */
  public calculateBlockDimensions(
    nodeBounds: NodeBounds,
    padding: number = 0
  ): BlockDimensions {
    const nodeWidth = nodeBounds.maxX - nodeBounds.minX;
    const nodeDepth = nodeBounds.maxZ - nodeBounds.minZ;
    
    const width = nodeWidth + padding * 2;
    const depth = nodeDepth + padding * 2;
    
    // Ensure minimum size
    const finalWidth = math.max(width, BLOCK_CONSTANTS.DIMENSIONS.MIN_BLOCK_SIZE);
    const finalDepth = math.max(depth, BLOCK_CONSTANTS.DIMENSIONS.MIN_BLOCK_SIZE);
    
    return {
      width: finalWidth,
      depth: finalDepth,
    };
  }

  /**
   * Calculate swimlane dimensions with buffer
   */
  public calculateSwimlaneeDimensions(
    bounds: NodeBounds,
    buffer: number = BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER
  ): { size: Vector3; position: Vector3 } {
    const width = bounds.maxX - bounds.minX + buffer * 2;
    const depth = bounds.maxZ - bounds.minZ + buffer * 2;
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerZ = (bounds.minZ + bounds.maxZ) / 2;
    
    return {
      size: new Vector3(width, BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BLOCK_HEIGHT, depth),
      position: new Vector3(centerX, 0, centerZ) // Y will be set by caller
    };
  }

  /**
   * Calculate platform dimensions with bounds
   */
  public calculatePlatformDimensions(
    clusterBounds: NodeBounds,
    extraPadding: number = 50
  ): BlockDimensions {
    return this.calculateBlockDimensions(clusterBounds, extraPadding);
  }

  /**
   * Calculate shadow block dimensions
   */
  public calculateShadowDimensions(
    clusterBounds: NodeBounds,
    shadowBuffer: number = BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER
  ): BlockDimensions {
    return this.calculateBlockDimensions(clusterBounds, shadowBuffer);
  }

  /**
   * Calculate minimum bounding box for a set of bounds
   */
  public calculateCombinedBounds(boundsList: NodeBounds[]): NodeBounds {
    if (boundsList.size() === 0) {
      return { minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
    }

    let minX = math.huge;
    let maxX = -math.huge;
    let minZ = math.huge;
    let maxZ = -math.huge;

    boundsList.forEach(bounds => {
      minX = math.min(minX, bounds.minX);
      maxX = math.max(maxX, bounds.maxX);
      minZ = math.min(minZ, bounds.minZ);
      maxZ = math.max(maxZ, bounds.maxZ);
    });

    return { minX, maxX, minZ, maxZ };
  }

}