/**
 * Platform and Shadow Manager
 * Handles creation of platform and shadow blocks
 */

import { PlatformBlockCreator } from "../../blocks/platformBlockCreator";
import { ShadowBlockCreator } from "../../blocks/shadowBlockCreator";
import { BLOCK_CONSTANTS } from "../../constants/blockConstants";
import { LAYOUT_CONSTANTS } from "../../constants/layoutConstants";
import {
  LaneBounds,
  PlatformShadowResult
} from "../types";

export class PlatformShadowManager {
  private platformCreator: PlatformBlockCreator;
  private shadowCreator: ShadowBlockCreator;

  constructor() {
    this.platformCreator = new PlatformBlockCreator();
    this.shadowCreator = new ShadowBlockCreator();
  }

  /**
   * Creates platform and shadow blocks based on lane bounds
   */
  public createPlatformAndShadow(
    targetOrigin: Vector3,
    parentFolder: Folder,
    allLaneBounds: LaneBounds
  ): PlatformShadowResult {
    // Create platform block
    const platform = this.platformCreator.createPlatformBlock({
      origin: targetOrigin,
      parent: parentFolder,
      height: BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS,
      size: BLOCK_CONSTANTS.DIMENSIONS.PLATFORM_SIZE
    });

    // Create shadow block sized to encompass all lanes
    const shadow = this.shadowCreator.createGroupShadowBlock({
      origin: targetOrigin,
      parent: platform,
      height: BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS,
      width: allLaneBounds.width + LAYOUT_CONSTANTS.SHADOW_PADDING.X_PADDING * 2,
      depth: allLaneBounds.depth + LAYOUT_CONSTANTS.SHADOW_PADDING.Z_PADDING * 2,
      buffer: BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER
    });

    return { platform, shadow };
  }

  /**
   * Cleans up any existing platform and shadow blocks
   */
  public cleanupExistingBlocks(parentFolder: Folder): void {
    // Delete any existing platform and shadow blocks
    const existingPlatform = parentFolder.FindFirstChild("PlatformBlock");
    if (existingPlatform) {
      existingPlatform.Destroy();
    }

    // Also check for legacy flat block
    const existingBlock = parentFolder.FindFirstChild("FlatBlockFoundation");
    if (existingBlock) {
      existingBlock.Destroy();
    }
  }
}