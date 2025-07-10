/**
 * Block Creator Adapter
 * Provides compatibility layer between old flatBlockCreator API and new modular block creators
 * Part of F002 Phase 3 integration
 */

import { PlatformBlockCreator } from "./blocks/platformBlockCreator";
import { ShadowBlockCreator } from "./blocks/shadowBlockCreator";
import { SwimLaneBlockCreator } from "./blocks/swimlaneBlockCreator";
import { BlockDimensionCalculator } from "./blocks/blockDimensionCalculator";
import { BLOCK_CONSTANTS } from "./constants/blockConstants";
import type { FlatBlockConfig, SwimLaneBlockConfig } from "./flatBlockCreator";

// Create singleton instances
const platformCreator = new PlatformBlockCreator();
const shadowCreator = new ShadowBlockCreator();
const swimlaneCreator = new SwimLaneBlockCreator();
const dimensionCalculator = new BlockDimensionCalculator();

/**
 * Creates platform and shadow blocks using new modular creators
 * Adapter for createFlatBlocks function
 */
export function createFlatBlocksAdapter(config: FlatBlockConfig): {
  platform: Part;
  shadow: Part;
} {
  const {
    origin,
    parent,
    height = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_HEIGHT,
    width = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_WIDTH,
    depth = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_DEPTH,
  } = config;

  // Create platform block
  const platform = platformCreator.createPlatformBlock({
    origin,
    parent,
    height,
    size: BLOCK_CONSTANTS.DIMENSIONS.PLATFORM_SIZE,
  });

  // Create shadow block as child of platform
  const shadow = shadowCreator.createGroupShadowBlock({
    origin,
    parent: platform, // Parent to platform block as per original
    height,
    width,
    depth,
    buffer: BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER,
  });

  return { platform, shadow };
}

/**
 * Legacy single flat block creation
 * Adapter for createFlatBlock function
 */
export function createFlatBlockAdapter(config: FlatBlockConfig): Part {
  const {
    origin,
    parent,
    height = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_HEIGHT,
    width = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_WIDTH,
    depth = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_DEPTH,
    color = BLOCK_CONSTANTS.COLORS.SHADOW,
  } = config;

  // Use shadow creator for legacy flat block
  const block = shadowCreator.createGroupShadowBlock({
    origin,
    parent,
    height,
    width,
    depth,
    buffer: 0, // No buffer for legacy flat block
  });

  // Override color if specified
  if (color) {
    block.Color = color;
  }

  block.Name = "FlatBlockFoundation";

  return block;
}

/**
 * Calculate block dimensions adapter
 */
export function calculateBlockDimensionsAdapter(
  nodeBounds: { minX: number; maxX: number; minZ: number; maxZ: number },
  padding = 0
): { width: number; depth: number } {
  return dimensionCalculator.calculateBlockDimensions(nodeBounds, padding);
}

/**
 * Create X-parallel shadow blocks adapter
 */
export function createXParallelShadowBlocksAdapter(
  nodesByProperty: Map<string, any[]>,
  propertyBounds: Map<
    string,
    { minX: number; maxX: number; minZ: number; maxZ: number }
  >,
  parent: Instance,
  yPosition: number = 0.5,
  blocksMap?: Map<string, Part>,
  propertyName?: string,
  origin?: Vector3
): void {
  shadowCreator.createXParallelShadowBlocks(
    nodesByProperty,
    propertyBounds,
    parent,
    yPosition,
    blocksMap,
    propertyName,
    origin
  );
}

/**
 * Create swimlane block adapter
 */
export function createSwimLaneBlockAdapter(config: SwimLaneBlockConfig): Part {
  return swimlaneCreator.createSwimLaneBlock({
    position: config.position,
    width: config.width,
    depth: config.depth,
    height: config.height,
    color: config.color,
    typeName: config.typeName,
    parent: config.parent,
    propertyName: config.propertyName,
  });
}

// Export constants for compatibility
export { FLAT_BLOCK_DEFAULTS } from "./flatBlockCreator";
