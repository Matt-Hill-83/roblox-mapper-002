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
  propertyName?: string;
}

export class SwimLaneBlockCreator extends BaseBlockCreator {
  /**
   * Create a swimlane shadow block
   */
  public createSwimLaneBlock(config: SwimLaneBlockConfig): Part {
    const { position, width, depth, height, color, typeName, parent, propertyName } = config;
    
    const blockName = propertyName 
      ? `XAxis_SwimLaneShadow_${propertyName}_${typeName}`
      : `XAxis_SwimLaneShadow_${typeName}`;
    
    const swimLaneBlock = this.createBlock({
      name: blockName,
      size: new Vector3(width, height, depth),
      position: position,
      material: BLOCK_CONSTANTS.MATERIALS.PLATFORM,
      color: color,
      transparency: BLOCK_CONSTANTS.TRANSPARENCY.OPAQUE,
      canCollide: true
    });

    swimLaneBlock.CastShadow = false;
    swimLaneBlock.Parent = parent;

    // Add surface labels to all faces
    this.addSurfaceLabelsToAllFaces(swimLaneBlock, typeName);


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
        canCollide: true
      });

      block.CastShadow = false;
      block.Parent = parent;
      xAxisBlocks.set(typeName, block);
      
      colorIndex++;
    });

    return xAxisBlocks;
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
      textLabel.BackgroundTransparency = 0; // Opaque background to show border
      textLabel.BackgroundColor3 = new Color3(1, 1, 1); // White background
      textLabel.BorderSizePixel = 10; // 10px border
      textLabel.BorderColor3 = new Color3(0, 0, 0); // Black border
      textLabel.Font = Enum.Font.SourceSansBold;
      textLabel.Text = text;
      textLabel.TextColor3 = new Color3(0, 0, 0); // Black text
      textLabel.TextScaled = true;
      textLabel.Parent = frame;
    });
  }
}