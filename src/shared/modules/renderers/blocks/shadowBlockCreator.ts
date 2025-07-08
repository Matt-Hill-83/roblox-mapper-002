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
      width = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_WIDTH,
      depth = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_DEPTH,
      buffer = BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER
    } = config;

    const shadowBlock = this.createBlock({
      name: "GroupShadowBlock",
      size: new Vector3(width + buffer, BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS, depth + buffer),
      position: new Vector3(
        origin.X,
        BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS / 2 + BLOCK_CONSTANTS.DIMENSIONS.Z_FIGHTING_OFFSET, // Raised by 0.1 to prevent z-fighting
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
    this.debug(`   - Size: ${width + buffer} x ${BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS} x ${depth + buffer} (W x H x D)`);
    this.debug(`   - Actual Y Height: ${shadowBlock.Size.Y}`);
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
    blocksMap?: Map<string, Part>,
    propertyName?: string
  ): void {
    let blockIndex = 0;
    
    nodesByProperty.forEach((nodes, propertyValue) => {
      const bounds = propertyBounds.get(propertyValue);
      if (!bounds) {
        warn(`[ShadowBlockCreator] No bounds found for property value: ${propertyValue}`);
        return;
      }
      
      const block = this.createZAxisBlock(propertyValue, bounds, yPosition, blockIndex, propertyName);
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
    colorIndex: number,
    propertyName?: string
  ): Part {
    const dimensions = this.calculateBlockDimensions(bounds, BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER);
    
    const blockName = propertyName 
      ? `ZAxis_SwimLaneShadow_${propertyName}_${propertyValue}`
      : `ZAxis_SwimLaneShadow_${propertyValue}`;
    
    const block = this.createBlock({
      name: blockName,
      size: new Vector3(dimensions.size.X, BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS, dimensions.size.Z),
      position: new Vector3(dimensions.position.X, yPosition, dimensions.position.Z),
      material: BLOCK_CONSTANTS.MATERIALS.SWIMLANE,
      color: this.getColorFromArray(BLOCK_CONSTANTS.COLORS.Z_AXIS_COLORS, colorIndex),
      transparency: BLOCK_CONSTANTS.TRANSPARENCY.OPAQUE,
      canCollide: false
    });

    block.CastShadow = false;

    // Add surface labels to all faces
    this.addSurfaceLabelsToAllFaces(block, propertyValue);

    this.debug(`Created Z-axis shadow block for ${propertyValue}:`);
    this.debug(`   - Position: (${dimensions.position.X}, ${yPosition}, ${dimensions.position.Z})`);
    this.debug(`   - Size: ${dimensions.size.X} x ${BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS} x ${dimensions.size.Z}`);

    return block;
  }

  /**
   * Add surface labels to all faces of a block
   */
  private addSurfaceLabelsToAllFaces(block: Part, text: string): void {
    const faces: Enum.NormalId[] = [
      Enum.NormalId.Front,
      Enum.NormalId.Back,
      Enum.NormalId.Left,
      Enum.NormalId.Right,
      Enum.NormalId.Top,
      Enum.NormalId.Bottom
    ];

    faces.forEach(face => {
      // Create SurfaceGui
      const surfaceGui = new Instance("SurfaceGui");
      surfaceGui.Name = `SurfaceGui_${face.Name}`;
      surfaceGui.Face = face;
      surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
      surfaceGui.PixelsPerStud = 50;
      surfaceGui.Parent = block;

      // Create Frame for background
      const frame = new Instance("Frame");
      frame.Size = new UDim2(1, 0, 1, 0);
      frame.BackgroundColor3 = new Color3(0, 0, 0);
      frame.BackgroundTransparency = 1; // Fully transparent background
      frame.BorderSizePixel = 0;
      frame.Parent = surfaceGui;

      // Create TextLabel
      const textLabel = new Instance("TextLabel");
      textLabel.Size = new UDim2(0.9, 0, 0.9, 0);
      textLabel.Position = new UDim2(0.05, 0, 0.05, 0);
      textLabel.BackgroundTransparency = 1;
      textLabel.Font = Enum.Font.SourceSansBold;
      textLabel.Text = text;
      textLabel.TextColor3 = new Color3(0, 0, 0); // Black text
      textLabel.TextScaled = true;
      textLabel.Parent = frame;
    });
  }
}