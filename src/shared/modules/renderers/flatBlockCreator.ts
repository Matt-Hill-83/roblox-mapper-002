/**
 * Flat Block Creator
 * Creates a large flat block under the node tree for visual foundation
 */

import { BLOCK_CONSTANTS } from "./constants/blockConstants";
import { POSITION_CONSTANTS } from "./constants/positionConstants";

export interface FlatBlockConfig {
  origin: Vector3;
  parent: Instance;
  height?: number;
  width?: number;
  depth?: number;
  color?: Color3;
}

export interface SwimLaneBlockConfig {
  position: Vector3;
  width: number;
  depth: number;
  height: number;
  color: Color3;
  typeName: string;
  parent: Instance;
  propertyName?: string;
}

export const FLAT_BLOCK_DEFAULTS = {
  height: BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_HEIGHT,
  width: BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_WIDTH,
  depth: BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_DEPTH,
  shadowColor: BLOCK_CONSTANTS.COLORS.SHADOW,
  platformColor: BLOCK_CONSTANTS.COLORS.PLATFORM,
  zFightingFix: BLOCK_CONSTANTS.DIMENSIONS.Z_FIGHTING_OFFSET,
};

/**
 * Creates platform and shadow blocks under the node tree
 * @param config Configuration for the blocks
 * @returns An object containing both the platform and shadow blocks
 */
export function createFlatBlocks(config: FlatBlockConfig): { platform: Part; shadow: Part } {
  const {
    origin,
    parent,
    width = FLAT_BLOCK_DEFAULTS.width,
    depth = FLAT_BLOCK_DEFAULTS.depth,
  } = config;

  // Create platform block first (will be parent)
  const platformBlock = new Instance("Part");
  platformBlock.Name = "PlatformBlock";
  
  // Platform has uniform shadow thickness for consistency
  // Platform has fixed size of 100x100 in X,Z dimensions
  platformBlock.Size = new Vector3(BLOCK_CONSTANTS.DIMENSIONS.PLATFORM_SIZE, BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS, BLOCK_CONSTANTS.DIMENSIONS.PLATFORM_SIZE);
  
  // Set platform material and appearance
  platformBlock.Material = BLOCK_CONSTANTS.MATERIALS.PLATFORM;
  platformBlock.Color = FLAT_BLOCK_DEFAULTS.platformColor;
  platformBlock.TopSurface = Enum.SurfaceType.Smooth;
  platformBlock.BottomSurface = Enum.SurfaceType.Smooth;
  
  // Add texture to platform block
  // const texture = new Instance("Texture");
  // texture.Texture = "rbxassetid://6372755229";
  // texture.Face = Enum.NormalId.Top;
  // texture.StudsPerTileU = 10;
  // texture.StudsPerTileV = 10;
  // texture.Parent = platformBlock;
  
  // Set platform physics properties
  platformBlock.Anchored = true;
  platformBlock.CanCollide = true;
  platformBlock.CastShadow = false;
  platformBlock.Transparency = 1; // Fully transparent
  
  // Position platform block at base level
  platformBlock.Position = new Vector3(
    origin.X,
    BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS / 2, // Center at ground level with uniform thickness
    origin.Z
  );
  
  // Parent platform block
  platformBlock.Parent = parent;
  
  // Create shadow block (will be child of platform)
  const shadowBlock = new Instance("Part");
  shadowBlock.Name = "GroupShadowBlock";
  
  // Set shadow size with buffer on all sides and uniform thickness
  shadowBlock.Size = new Vector3(width + BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER, BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS, depth + BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER);
  
  // Set shadow material and appearance
  shadowBlock.Material = BLOCK_CONSTANTS.MATERIALS.SHADOW;
  shadowBlock.Color = FLAT_BLOCK_DEFAULTS.shadowColor;
  shadowBlock.TopSurface = Enum.SurfaceType.Smooth;
  shadowBlock.BottomSurface = Enum.SurfaceType.Smooth;
  
  // Set shadow physics properties
  shadowBlock.Anchored = true;
  shadowBlock.CanCollide = true;
  shadowBlock.CastShadow = false;
  shadowBlock.Transparency = 0; // Fully opaque
  
  // Position shadow block - 0.1 units above platform
  shadowBlock.Position = new Vector3(
    origin.X,
    BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS + BLOCK_CONSTANTS.DIMENSIONS.Z_FIGHTING_OFFSET + BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS / 2, // 0.1 above platform top
    origin.Z
  );
  
  // Parent shadow block to platform block
  shadowBlock.Parent = platformBlock;
  
  
  
  return { platform: platformBlock, shadow: shadowBlock };
}

/**
 * Legacy function - creates a single flat block
 * @deprecated Use createFlatBlocks instead
 * @param config Configuration for the flat block
 * @returns The created part instance
 */
export function createFlatBlock(config: FlatBlockConfig): Part {
  const {
    origin,
    parent,
    height = FLAT_BLOCK_DEFAULTS.height,
    width = FLAT_BLOCK_DEFAULTS.width,
    depth = FLAT_BLOCK_DEFAULTS.depth,
    color = FLAT_BLOCK_DEFAULTS.shadowColor,
  } = config;

  // Create the block
  const block = new Instance("Part");
  block.Name = "FlatBlockFoundation";
  
  // Set size
  block.Size = new Vector3(width, height, depth);
  
  // Set material and appearance
  block.Material = BLOCK_CONSTANTS.MATERIALS.SHADOW;
  block.Color = color;
  block.TopSurface = Enum.SurfaceType.Smooth;
  block.BottomSurface = Enum.SurfaceType.Smooth;
  
  // Set physics properties
  block.Anchored = true;
  block.CanCollide = true; // Changed to true to make the block solid
  block.CastShadow = false; // Optimize rendering
  block.Transparency = 0; // Fully opaque
  
  // Position the block
  // Center at origin X and Z, position bottom surface at Y=0 (ground level)
  // This ensures the block sits on the ground
  block.Position = new Vector3(
    origin.X,
    height / 2, // Bottom at Y=0, so center is at height/2
    origin.Z
  );
  
  // Parent the block
  block.Parent = parent;
  
  
  return block;
}

/**
 * Calculates appropriate block dimensions based on node tree bounds
 * @param nodeBounds The bounding box of the node tree
 * @param padding Additional padding beyond the bounds
 * @returns Recommended width and depth for the block
 */
export function calculateBlockDimensions(
  nodeBounds: { minX: number; maxX: number; minZ: number; maxZ: number },
  padding = 0
): { width: number; depth: number } {
  const nodeWidth = nodeBounds.maxX - nodeBounds.minX;
  const nodeDepth = nodeBounds.maxZ - nodeBounds.minZ;
  
  const width = nodeWidth + padding * 2;
  const depth = nodeDepth + padding * 2;
  
  // Ensure minimum size
  const minSize = BLOCK_CONSTANTS.DIMENSIONS.MIN_BLOCK_SIZE;
  const finalWidth = math.max(width, minSize);
  const finalDepth = math.max(depth, minSize);
  
  
  return {
    width: finalWidth,
    depth: finalDepth,
  };
}

/**
 * Creates Z-axis shadow blocks for pet type swimlanes
 * @param nodesByProperty Nodes grouped by property value
 * @param propertyBounds Bounds for each property value
 * @param parent Parent instance for the blocks
 * @param yPosition Y position for the blocks
 */
export function createZAxisShadowBlocks(
  nodesByProperty: Map<string, any[]>,
  propertyBounds: Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>,
  parent: Instance,
  yPosition: number = 0.5,
  blocksMap?: Map<string, Part>,
  origin?: Vector3
): void {
  let blockIndex = 0;
  
  nodesByProperty.forEach((nodes, propertyValue) => {
    const bounds = propertyBounds.get(propertyValue)!;
    
    // Calculate block dimensions
    const blockWidth = bounds.maxX - bounds.minX + POSITION_CONSTANTS.Z_AXIS_SPACING; // Add padding
    const blockDepth = bounds.maxZ - bounds.minZ + POSITION_CONSTANTS.Z_AXIS_SPACING;
    const centerX = origin?.X || 0; // Use origin.X for alignment with group shadow block
    const centerZ = (bounds.minZ + bounds.maxZ) / 2;
    
    // Create the block
    const block = new Instance("Part");
    block.Name = `ZAxisShadowBlock_${propertyValue}`;
    block.Size = new Vector3(blockWidth, BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS, blockDepth);
    block.Position = new Vector3(centerX, yPosition, centerZ);
    
    // Set appearance
    block.Material = BLOCK_CONSTANTS.MATERIALS.SHADOW;
    block.Transparency = BLOCK_CONSTANTS.TRANSPARENCY.OPAQUE;
    
    // Use different colors for different property values
    const colors = BLOCK_CONSTANTS.COLORS.Z_AXIS_COLORS;
    
    block.Color = colors[blockIndex % colors.size()];
    block.TopSurface = Enum.SurfaceType.Smooth;
    block.BottomSurface = Enum.SurfaceType.Smooth;
    
    // Set physics
    block.Anchored = true;
    block.CanCollide = false;
    block.CastShadow = false;
    
    // Parent the block
    block.Parent = parent;
    
    // Store in map if provided
    if (blocksMap) {
      blocksMap.set(propertyValue, block);
    }
    
    
    blockIndex++;
  });
  
}

/**
 * Creates a block under a swimlane
 * @param config Configuration for the swimlane block
 * @returns The created swimlane block
 */
export function createSwimLaneBlock(config: SwimLaneBlockConfig): Part {
  const { position, width, depth, height, color, typeName, parent } = config;
  
  // Create swimlane block
  const swimLaneBlock = new Instance("Part");
  swimLaneBlock.Name = `SwimlaneShadowBlock_${typeName}`;
  
  // Set size
  swimLaneBlock.Size = new Vector3(width, height, depth);
  
  // Set material and appearance
  swimLaneBlock.Material = BLOCK_CONSTANTS.MATERIALS.SWIMLANE;
  swimLaneBlock.Color = color;
  swimLaneBlock.TopSurface = Enum.SurfaceType.Smooth;
  swimLaneBlock.BottomSurface = Enum.SurfaceType.Smooth;
  swimLaneBlock.Transparency = 0; // Fully opaque
  
  // Set physics properties
  swimLaneBlock.Anchored = true;
  swimLaneBlock.CanCollide = false; // Don't interfere with player movement
  swimLaneBlock.CastShadow = false;
  
  // Position the block
  swimLaneBlock.Position = position;
  
  // Parent to shadow block
  swimLaneBlock.Parent = parent;
  
  
  return swimLaneBlock;
}