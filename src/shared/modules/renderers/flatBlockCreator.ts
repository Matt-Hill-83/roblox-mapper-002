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

export interface SwimLaneBlockConfig {
  position: Vector3;
  width: number;
  depth: number;
  height: number;
  color: Color3;
  typeName: string;
  parent: Instance;
}

export const FLAT_BLOCK_DEFAULTS = {
  height: 3,  // Changed from 5 to 3 units as requested
  width: 200,  // Large enough to extend beyond typical node trees
  depth: 200,
  shadowColor: new Color3(0.5, 0.7, 1), // Light blue for shadow block
  platformColor: new Color3(0.5, 1, 0.5), // Light green for platform block
  zFightingFix: 0.1, // Vertical offset to prevent Z-fighting between overlapping blocks
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
  
  // Platform has same height as shadow block but positioned 0.1 lower
  // Platform has fixed size of 100x100 in X,Z dimensions
  platformBlock.Size = new Vector3(100, height, 100);
  
  // Set platform material and appearance
  platformBlock.Material = Enum.Material.Concrete;
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
  platformBlock.Transparency = 0; // Fully opaque
  
  // Position platform block - zFightingFix units lower than shadow block
  platformBlock.Position = new Vector3(
    origin.X,
    (height / 2) - FLAT_BLOCK_DEFAULTS.zFightingFix, // zFightingFix units lower than shadow block
    origin.Z
  );
  
  // Parent platform block
  platformBlock.Parent = parent;
  
  // Create shadow block (will be child of platform)
  const shadowBlock = new Instance("Part");
  shadowBlock.Name = "GroupShadowBlock";
  
  // Set shadow size with 1 unit buffer on all sides
  shadowBlock.Size = new Vector3(width + 2, height, depth + 2);
  
  // Set shadow material and appearance
  shadowBlock.Material = Enum.Material.Concrete;
  shadowBlock.Color = FLAT_BLOCK_DEFAULTS.shadowColor;
  shadowBlock.TopSurface = Enum.SurfaceType.Smooth;
  shadowBlock.BottomSurface = Enum.SurfaceType.Smooth;
  
  // Set shadow physics properties
  shadowBlock.Anchored = true;
  shadowBlock.CanCollide = true;
  shadowBlock.CastShadow = false;
  shadowBlock.Transparency = 0; // Fully opaque
  
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
  print(`   - Size: 100 x ${height} x 100 (W x H x D)`);
  
  print(`🟦 Created shadow block:`);
  print(`   - Position: (${shadowBlock.Position.X}, ${shadowBlock.Position.Y}, ${shadowBlock.Position.Z})`);
  print(`   - Size: ${width + 2} x ${height} x ${depth + 2} (W x H x D)`);
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
  blocksMap?: Map<string, Part>
): void {
  let blockIndex = 0;
  
  nodesByProperty.forEach((nodes, propertyValue) => {
    const bounds = propertyBounds.get(propertyValue)!;
    
    // Calculate block dimensions
    const blockWidth = bounds.maxX - bounds.minX + 5; // Add padding
    const blockDepth = bounds.maxZ - bounds.minZ + 5;
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerZ = (bounds.minZ + bounds.maxZ) / 2;
    
    // Create the block
    const block = new Instance("Part");
    block.Name = `ZAxisShadowBlock_${propertyValue}`;
    block.Size = new Vector3(blockWidth, 2, blockDepth);
    block.Position = new Vector3(centerX, yPosition, centerZ);
    
    // Set appearance
    block.Material = Enum.Material.ForceField;
    block.Transparency = 0.8;
    
    // Use different colors for different property values
    const colors = [
      new Color3(0.8, 0.2, 0.2), // Red
      new Color3(0.2, 0.8, 0.2), // Green
      new Color3(0.2, 0.2, 0.8), // Blue
      new Color3(0.8, 0.8, 0.2), // Yellow
      new Color3(0.8, 0.2, 0.8), // Magenta
      new Color3(0.2, 0.8, 0.8), // Cyan
      new Color3(0.5, 0.5, 0.5), // Gray
    ];
    
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
    
    print(`🟦 Created Z-axis shadow block for ${propertyValue}:`);
    print(`   - Position: (${centerX}, ${yPosition}, ${centerZ})`);
    print(`   - Size: ${blockWidth} x 2 x ${blockDepth}`);
    
    blockIndex++;
  });
  
  print(`✅ Created ${nodesByProperty.size()} Z-axis shadow blocks`);
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
  swimLaneBlock.Material = Enum.Material.Concrete;
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
  
  print(`🏊 Created swimlane shadow block for ${typeName}:`);
  print(`   - Position: (${position.X}, ${position.Y}, ${position.Z})`);
  print(`   - Size: ${width} x ${height} x ${depth} (W x H x D)`);
  print(`   - Color: (${color.R}, ${color.G}, ${color.B})`);
  
  return swimLaneBlock;
}