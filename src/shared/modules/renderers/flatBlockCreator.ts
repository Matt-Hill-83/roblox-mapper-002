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
  height: 5,
  width: 200,  // Large enough to extend beyond typical node trees
  depth: 200,
  color: new Color3(0.5, 0.7, 1), // Light blue
};

/**
 * Creates a large flat block positioned under the node tree
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
    color = FLAT_BLOCK_DEFAULTS.color,
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
  block.CanCollide = false; // Prevent interference with node interactions
  block.CastShadow = false; // Optimize rendering
  
  // Position the block
  // Center at origin X and Z, position top surface at origin Y
  // This puts the block below the origin point
  block.Position = new Vector3(
    origin.X,
    origin.Y - height / 2, // Top surface at origin Y
    origin.Z
  );
  
  // Parent the block
  block.Parent = parent;
  
  print(`🟦 Created flat block foundation at origin (${origin.X}, ${origin.Y}, ${origin.Z})`);
  
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
  padding = 50
): { width: number; depth: number } {
  const width = (nodeBounds.maxX - nodeBounds.minX) + padding * 2;
  const depth = (nodeBounds.maxZ - nodeBounds.minZ) + padding * 2;
  
  // Ensure minimum size
  const minSize = 100;
  return {
    width: math.max(width, minSize),
    depth: math.max(depth, minSize),
  };
}