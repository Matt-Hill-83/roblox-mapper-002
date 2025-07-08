/**
 * Platform Block Creator
 * Creates platform blocks for node visualization foundation
 * Part of F002 Phase 2 refactoring - T6
 */

import { BaseBlockCreator } from "./baseBlockCreator";
import { BLOCK_CONSTANTS } from "../constants/blockConstants";

export interface PlatformBlockConfig {
  origin: Vector3;
  parent: Instance;
  height?: number;
  size?: number;
}

export class PlatformBlockCreator extends BaseBlockCreator {
  /**
   * Create a platform block with fixed size
   */
  public createPlatformBlock(config: PlatformBlockConfig): Part {
    const {
      origin,
      parent,
      height = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_HEIGHT,
      size = BLOCK_CONSTANTS.DIMENSIONS.PLATFORM_SIZE
    } = config;

    const platformBlock = this.createBlock({
      name: "PlatformBlock",
      size: new Vector3(size, height, size),
      position: new Vector3(
        origin.X,
        (height / 2) - BLOCK_CONSTANTS.DIMENSIONS.Z_FIGHTING_OFFSET,
        origin.Z
      ),
      material: BLOCK_CONSTANTS.MATERIALS.PLATFORM,
      color: BLOCK_CONSTANTS.COLORS.PLATFORM,
      transparency: 1, // Fully transparent
      canCollide: false
    });

    // Additional platform-specific properties
    platformBlock.CastShadow = false;
    platformBlock.Parent = parent;

    this.debug(`Created platform block:`);
    this.debug(`   - Position: (${platformBlock.Position.X}, ${platformBlock.Position.Y}, ${platformBlock.Position.Z})`);
    this.debug(`   - Size: ${size} x ${height} x ${size} (W x H x D)`);
    this.debug(`   - Transparency: ${platformBlock.Transparency}`);
    this.debug(`   - Color: (${platformBlock.Color.R}, ${platformBlock.Color.G}, ${platformBlock.Color.B})`);

    return platformBlock;
  }

  /**
   * Add texture to platform block
   */
  public addTextureToPlatform(platformBlock: Part, textureId?: string): void {
    if (!textureId) return;

    const texture = new Instance("Texture");
    texture.Texture = textureId;
    texture.Face = Enum.NormalId.Top;
    texture.StudsPerTileU = 10;
    texture.StudsPerTileV = 10;
    texture.Parent = platformBlock;

    this.debug(`Added texture to platform block: ${textureId}`);
  }
}