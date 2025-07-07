/**
 * Shadow Block Creator
 * Creates shadow blocks for visual depth and grouping
 * Part of F002 Phase 2 refactoring - T6
 */

import { BaseBlockCreator } from "./baseBlockCreator";
import { BLOCK_CONSTANTS } from "../constants/blockConstants";

export interface ShadowBlockConfig {
  origin: Vector3;
  parent: Instance;
  height?: number;
  width?: number;
  depth?: number;
  buffer?: number;
}

export class ShadowBlockCreator extends BaseBlockCreator {
  /**
   * Create a group shadow block
   */
  public createGroupShadowBlock(config: ShadowBlockConfig): Part {
    const {
      origin,
      parent,
      height = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_HEIGHT,
      width = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_WIDTH,
      depth = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_DEPTH,
      buffer = BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER
    } = config;

    const shadowBlock = this.createBlock({
      name: "GroupShadowBlock",
      size: new Vector3(width + buffer, height, depth + buffer),
      position: new Vector3(
        origin.X,
        height / 2 + BLOCK_CONSTANTS.DIMENSIONS.Z_FIGHTING_OFFSET, // Raised by 0.1 to prevent z-fighting
        origin.Z
      ),
      material: BLOCK_CONSTANTS.MATERIALS.SHADOW,
      color: BLOCK_CONSTANTS.COLORS.SHADOW,
      transparency: BLOCK_CONSTANTS.TRANSPARENCY.OPAQUE,
      canCollide: true
    });

    shadowBlock.CastShadow = false;
    shadowBlock.Parent = parent;

    this.debug(`Created shadow block:`);
    this.debug(`   - Position: (${shadowBlock.Position.X}, ${shadowBlock.Position.Y}, ${shadowBlock.Position.Z})`);
    this.debug(`   - Size: ${width + buffer} x ${height} x ${depth + buffer} (W x H x D)`);
    this.debug(`   - Parent: ${shadowBlock.Parent?.Name}`);

    return shadowBlock;
  }

  /**
   * Create Z-axis shadow blocks for property-based swimlanes
   */
  public createZAxisShadowBlocks(
    nodesByProperty: Map<string, any[]>,
    propertyBounds: Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>,
    parent: Instance,
    yPosition: number = 0.5,
    blocksMap?: Map<string, Part>
  ): void {
    let blockIndex = 0;
    
    nodesByProperty.forEach((nodes, propertyValue) => {
      const bounds = propertyBounds.get(propertyValue);
      if (!bounds) {
        warn(`[ShadowBlockCreator] No bounds found for property value: ${propertyValue}`);
        return;
      }
      
      const block = this.createZAxisBlock(propertyValue, bounds, yPosition, blockIndex);
      block.Parent = parent;
      
      if (blocksMap) {
        blocksMap.set(propertyValue, block);
      }
      
      blockIndex++;
    });
    
    this.debug(`Created ${nodesByProperty.size()} Z-axis shadow blocks`);
  }

  /**
   * Create a single Z-axis shadow block
   */
  private createZAxisBlock(
    propertyValue: string,
    bounds: { minX: number; maxX: number; minZ: number; maxZ: number },
    yPosition: number,
    colorIndex: number
  ): Part {
    const dimensions = this.calculateBlockDimensions(bounds, BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER);
    
    const block = this.createBlock({
      name: `ZAxisShadowBlock_${propertyValue}`,
      size: new Vector3(dimensions.size.X, BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BLOCK_HEIGHT, dimensions.size.Z),
      position: new Vector3(dimensions.position.X, yPosition, dimensions.position.Z),
      material: BLOCK_CONSTANTS.MATERIALS.SWIMLANE,
      color: this.getColorFromArray(BLOCK_CONSTANTS.COLORS.Z_AXIS_COLORS, colorIndex),
      transparency: BLOCK_CONSTANTS.TRANSPARENCY.OPAQUE,
      canCollide: false
    });

    block.CastShadow = false;

    this.debug(`Created Z-axis shadow block for ${propertyValue}:`);
    this.debug(`   - Position: (${dimensions.position.X}, ${yPosition}, ${dimensions.position.Z})`);
    this.debug(`   - Size: ${dimensions.size.X} x ${BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BLOCK_HEIGHT} x ${dimensions.size.Z}`);

    return block;
  }
}