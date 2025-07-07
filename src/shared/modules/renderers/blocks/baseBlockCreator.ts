/**
 * Base class for block creation with common functionality
 * Part of F002 refactoring to consolidate block creation logic
 */

import { BLOCK_CONSTANTS } from "../constants/blockConstants";

export abstract class BaseBlockCreator {
  /**
   * Create a base Part with standard properties
   */
  protected createBasePart(name: string, size: Vector3, position: Vector3): Part {
    const part = new Instance("Part");
    part.Name = name;
    part.Size = size;
    part.Position = position;
    part.Anchored = true;
    part.TopSurface = Enum.SurfaceType.Smooth;
    part.BottomSurface = Enum.SurfaceType.Smooth;
    part.CanCollide = true;
    return part;
  }
  
  /**
   * Apply material, color, and transparency to a part
   */
  protected applyMaterial(
    part: Part, 
    material: Enum.Material, 
    color: Color3, 
    transparency: number
  ): void {
    part.Material = material;
    part.Color = color;
    part.Transparency = transparency;
  }
  
  /**
   * Create a block with full configuration
   */
  protected createBlock(config: {
    name: string;
    size: Vector3;
    position: Vector3;
    material: Enum.Material;
    color: Color3;
    transparency: number;
    canCollide?: boolean;
  }): Part {
    const part = this.createBasePart(config.name, config.size, config.position);
    this.applyMaterial(part, config.material, config.color, config.transparency);
    
    if (config.canCollide !== undefined) {
      part.CanCollide = config.canCollide;
    }
    
    return part;
  }
  
  /**
   * Calculate block dimensions with buffer
   */
  protected calculateBlockDimensions(
    bounds: { minX: number; maxX: number; minZ: number; maxZ: number },
    height: number = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_HEIGHT,
    buffer: number = BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER
  ): { size: Vector3; position: Vector3 } {
    const width = bounds.maxX - bounds.minX + buffer * 2;
    const depth = bounds.maxZ - bounds.minZ + buffer * 2;
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerZ = (bounds.minZ + bounds.maxZ) / 2;
    
    return {
      size: new Vector3(width, height, depth),
      position: new Vector3(centerX, 0, centerZ) // Y will be set by caller
    };
  }
  
  /**
   * Get color from array with wraparound
   */
  protected getColorFromArray(colors: Color3[], index: number): Color3 {
    return colors[index % colors.size()];
  }
  
  /**
   * Print debug information
   */
  protected debug(message: string, ...args: unknown[]): void {
    print(`[BaseBlockCreator] ${message}`, ...args);
  }
}