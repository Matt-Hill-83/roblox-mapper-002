/**
 * Flat Block Creator
 * Creates a large flat block under the node tree for visual foundation
 */

export interface FlatBlockConfig {
  origin: Vector3;
  parent: Instance;
  height?: number;
  width?: number;
  depth?: number;
  color?: Color3;
}

const FLAT_BLOCK_DEFAULTS = {
  height: 3,  // Changed from 5 to 3 units as requested
  width: 200,  // Large enough to extend beyond typical node trees
  depth: 200,
  shadowColor: new Color3(0.5, 0.7, 1), // Light blue for shadow block
  platformColor: new Color3(0.5, 1, 0.5), // Light green for platform block
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
    height = FLAT_BLOCK_DEFAULTS.height,
    width = FLAT_BLOCK_DEFAULTS.width,
    depth = FLAT_BLOCK_DEFAULTS.depth,
  } = config;

  // Create platform block first (will be parent)
  const platformBlock = new Instance("Part");
  platformBlock.Name = "PlatformBlock";
  
  // Set platform size - 0.1 units thinner to prevent Z-fighting
  const platformHeight = height - 0.1;
  // Platform has fixed size of 100x100 in X,Z dimensions
  platformBlock.Size = new Vector3(100, platformHeight, 100);
  
  // Set platform material and appearance
  platformBlock.Material = Enum.Material.Grass;
  platformBlock.Color = FLAT_BLOCK_DEFAULTS.platformColor;
  platformBlock.TopSurface = Enum.SurfaceType.Smooth;
  platformBlock.BottomSurface = Enum.SurfaceType.Smooth;
  
  // Set platform physics properties
  platformBlock.Anchored = true;
  platformBlock.CanCollide = true;
  platformBlock.CastShadow = false;
  
  // Position platform block
  platformBlock.Position = new Vector3(
    origin.X,
    platformHeight / 2, // Bottom at Y=0, so center is at height/2
    origin.Z
  );
  
  // Parent platform block
  platformBlock.Parent = parent;
  
  // Create shadow block (will be child of platform)
  const shadowBlock = new Instance("Part");
  shadowBlock.Name = "ShadowBlock";
  
  // Set shadow size
  shadowBlock.Size = new Vector3(width, height, depth);
  
  // Set shadow material and appearance
  shadowBlock.Material = Enum.Material.Concrete;
  shadowBlock.Color = FLAT_BLOCK_DEFAULTS.shadowColor;
  shadowBlock.TopSurface = Enum.SurfaceType.Smooth;
  shadowBlock.BottomSurface = Enum.SurfaceType.Smooth;
  
  // Set shadow physics properties
  shadowBlock.Anchored = true;
  shadowBlock.CanCollide = true;
  shadowBlock.CastShadow = false;
  
  // Position shadow block - same position as platform
  shadowBlock.Position = new Vector3(
    origin.X,
    height / 2, // Bottom at Y=0, so center is at height/2
    origin.Z
  );
  
  // Parent shadow block to platform block
  shadowBlock.Parent = platformBlock;
  
  print(`🟩 Created platform block:`);
  print(`   - Position: (${platformBlock.Position.X}, ${platformBlock.Position.Y}, ${platformBlock.Position.Z})`);
  print(`   - Size: 100 x ${platformHeight} x 100 (W x H x D)`);
  
  print(`🟦 Created shadow block:`);
  print(`   - Position: (${shadowBlock.Position.X}, ${shadowBlock.Position.Y}, ${shadowBlock.Position.Z})`);
  print(`   - Size: ${width} x ${height} x ${depth} (W x H x D)`);
  print(`   - Parent: ${shadowBlock.Parent?.Name}`);
  
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
  block.Material = Enum.Material.Concrete;
  block.Color = color;
  block.TopSurface = Enum.SurfaceType.Smooth;
  block.BottomSurface = Enum.SurfaceType.Smooth;
  
  // Set physics properties
  block.Anchored = true;
  block.CanCollide = true; // Changed to true to make the block solid
  block.CastShadow = false; // Optimize rendering
  
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
  
  print(`🟦 Created flat block foundation:`);
  print(`   - Position: (${block.Position.X}, ${block.Position.Y}, ${block.Position.Z})`);
  print(`   - Size: ${width} x ${height} x ${depth} (W x H x D)`);
  print(`   - Origin was: (${origin.X}, ${origin.Y}, ${origin.Z})`);
  
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
  const minSize = 1;
  const finalWidth = math.max(width, minSize);
  const finalDepth = math.max(depth, minSize);
  
  print(`📏 Calculating block dimensions:`);
  print(`   - Node bounds: X[${nodeBounds.minX}, ${nodeBounds.maxX}] Z[${nodeBounds.minZ}, ${nodeBounds.maxZ}]`);
  print(`   - Node size: ${nodeWidth} x ${nodeDepth} (W x D)`);
  print(`   - With padding: ${width} x ${depth}`);
  print(`   - Final size: ${finalWidth} x ${finalDepth}`);
  
  return {
    width: finalWidth,
    depth: finalDepth,
  };
}