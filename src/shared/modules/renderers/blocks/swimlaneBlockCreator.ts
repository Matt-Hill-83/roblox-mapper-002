/**
 * Swimlane Block Creator
 * Creates swimlane blocks for visual grouping of nodes
 * Part of F002 Phase 2 refactoring - T6
 */

import { BaseBlockCreator } from "./baseBlockCreator";
import { BLOCK_CONSTANTS } from "../constants/blockConstants";

export interface SwimLaneBlockConfig {
  position: Vector3;
  width: number;
  depth: number;
  height: number;
  color: Color3;
  typeName: string;
  parent: Instance;
}

export class SwimLaneBlockCreator extends BaseBlockCreator {
  /**
   * Create a swimlane shadow block
   */
  public createSwimLaneBlock(config: SwimLaneBlockConfig): Part {
    const { position, width, depth, height, color, typeName, parent } = config;
    
    const swimLaneBlock = this.createBlock({
      name: `SwimlaneShadowBlock_${typeName}`,
      size: new Vector3(width, height, depth),
      position: position,
      material: BLOCK_CONSTANTS.MATERIALS.PLATFORM,
      color: color,
      transparency: BLOCK_CONSTANTS.TRANSPARENCY.OPAQUE,
      canCollide: false
    });

    swimLaneBlock.CastShadow = false;
    swimLaneBlock.Parent = parent;

    this.debug(`Created swimlane shadow block for ${typeName}:`);
    this.debug(`   - Position: (${position.X}, ${position.Y}, ${position.Z})`);
    this.debug(`   - Size: ${width} x ${height} x ${depth} (W x H x D)`);
    this.debug(`   - Color: (${color.R}, ${color.G}, ${color.B})`);

    return swimLaneBlock;
  }

  /**
   * Create swimlane blocks for multiple types
   */
  public createSwimLaneBlocks(
    typeBounds: Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>,
    yPosition: number,
    height: number,
    parent: Instance,
    colorMap?: Map<string, Color3>
  ): Map<string, Part> {
    const swimLaneBlocks = new Map<string, Part>();
    let colorIndex = 0;

    typeBounds.forEach((bounds, typeName) => {
      const color = colorMap?.get(typeName) || 
                   this.getColorFromArray(BLOCK_CONSTANTS.COLORS.Z_AXIS_COLORS, colorIndex);
      
      const dimensions = this.calculateBlockDimensions(bounds, BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER);
      
      const config: SwimLaneBlockConfig = {
        position: new Vector3(dimensions.position.X, yPosition, dimensions.position.Z),
        width: dimensions.size.X,
        depth: dimensions.size.Z,
        height: height,
        color: color,
        typeName: typeName,
        parent: parent
      };

      const block = this.createSwimLaneBlock(config);
      swimLaneBlocks.set(typeName, block);
      
      colorIndex++;
    });

    this.debug(`Created ${swimLaneBlocks.size()} swimlane blocks`);
    return swimLaneBlocks;
  }

  /**
   * Create X-axis swimlane blocks
   */
  public createXAxisSwimLaneBlocks(
    typeBounds: Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>,
    parent: Instance,
    yPosition: number = 0
  ): Map<string, Part> {
    const xAxisBlocks = new Map<string, Part>();
    let colorIndex = 0;

    typeBounds.forEach((bounds, typeName) => {
      const dimensions = this.calculateBlockDimensions(bounds, BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER);
      
      const block = this.createBlock({
        name: `XAxisShadowBlock_${typeName}`,
        size: new Vector3(
          dimensions.size.X,
          BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BLOCK_HEIGHT,
          dimensions.size.Z
        ),
        position: new Vector3(
          dimensions.position.X,
          yPosition,
          dimensions.position.Z
        ),
        material: BLOCK_CONSTANTS.MATERIALS.SWIMLANE,
        color: this.getColorFromArray(BLOCK_CONSTANTS.COLORS.Z_AXIS_COLORS, colorIndex),
        transparency: BLOCK_CONSTANTS.TRANSPARENCY.OPAQUE,
        canCollide: false
      });

      block.CastShadow = false;
      block.Parent = parent;
      xAxisBlocks.set(typeName, block);
      
      colorIndex++;
    });

    return xAxisBlocks;
  }
}