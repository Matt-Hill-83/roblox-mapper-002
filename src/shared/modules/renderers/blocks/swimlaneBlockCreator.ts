/**
 * Swimlane Block Creator
 * Creates swimlane blocks for visual grouping of nodes
 * Part of F002 Phase 2 refactoring - T6
 */

import { BaseBlockCreator } from "./baseBlockCreator";
import { BLOCK_CONSTANTS } from "../constants/blockConstants";
import { LAYOUT_CONSTANTS } from "../constants/layoutConstants";

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
   * Create a Z-parallel lane shadow block (runs along Z axis)
   */
  public createSwimLaneBlock(config: SwimLaneBlockConfig): Part {
    const {
      position,
      width,
      depth,
      height,
      color,
      typeName,
      parent,
      propertyName,
    } = config;

    // Generate unique ID for the lane
    const laneId = `${propertyName || "default"}_${typeName}`;
    const blockName = `ZParallel_Lane_${laneId}`;
    
    // Debug: Print width of actual swimlane
    print(`[SWIMLANE] ${typeName}: width=${width}, depth=${depth}`)

    const swimLaneBlock = this.createBlock({
      name: blockName,
      size: new Vector3(width, height, depth),
      position: position,
      material: BLOCK_CONSTANTS.MATERIALS.PLATFORM,
      color: color,
      transparency: BLOCK_CONSTANTS.TRANSPARENCY.OPAQUE,
      canCollide: true,
    });

    swimLaneBlock.CastShadow = false;
    swimLaneBlock.Parent = parent;

    // Add surface labels to all faces
    this.addSurfaceLabelsToAllFaces(swimLaneBlock, typeName);

    return swimLaneBlock;
  }

  /**
   * Create Z-parallel lane blocks for multiple types
   */
  public createZParallelLaneBlocks(
    typeBounds: Map<
      string,
      { minX: number; maxX: number; minZ: number; maxZ: number }
    >,
    yPosition: number,
    height: number,
    parent: Instance,
    colorMap?: Map<string, Color3>
  ): Map<string, Part> {
    const swimLaneBlocks = new Map<string, Part>();
    let colorIndex = 0;

    typeBounds.forEach((bounds, typeName) => {
      const color =
        colorMap?.get(typeName) ||
        this.getColorFromArray(
          BLOCK_CONSTANTS.COLORS.Z_AXIS_COLORS,
          colorIndex
        );

      const dimensions = this.calculateBlockDimensions(
        bounds,
        BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER
      );

      const config: SwimLaneBlockConfig = {
        position: new Vector3(
          dimensions.position.X,
          yPosition,
          dimensions.position.Z
        ),
        width: dimensions.size.X,
        depth: dimensions.size.Z,
        height: height,
        color: color,
        typeName: typeName,
        parent: parent,
      };

      const block = this.createSwimLaneBlock(config);
      swimLaneBlocks.set(typeName, block);

      colorIndex++;
    });

    return swimLaneBlocks;
  }

  /**
   * Create Z-parallel lane blocks grouped by X position
   */
  public createXAxisSwimLaneBlocks(
    typeBounds: Map<
      string,
      { minX: number; maxX: number; minZ: number; maxZ: number }
    >,
    parent: Instance,
    yPosition: number = 0
  ): Map<string, Part> {
    const zParallelBlocks = new Map<string, Part>();
    let colorIndex = 0;
    let currentX = 0;

    typeBounds.forEach((bounds, typeName) => {
      // Use fixed width from layout constants
      const width = LAYOUT_CONSTANTS.LANE_DIMENSIONS.Z_PARALLEL_LANE_WIDTH;
      const depth =
        bounds.maxZ -
        bounds.minZ +
        BLOCK_CONSTANTS.DIMENSIONS.Z_PARALLEL_LANE_BUFFER * 2;

      // Position lanes with fixed spacing
      const centerX = currentX;
      const centerZ = (bounds.minZ + bounds.maxZ) / 2;
      currentX += width + LAYOUT_CONSTANTS.LANE_SPACING.Z_PARALLEL_LANE_SPACING;

      const blockName = `ZParallelShadowBlock_${typeName}`;
      const blockSize = new Vector3(
        width,
        BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BLOCK_HEIGHT,
        depth
      );

      // Log shadow block creation

      const block = this.createBlock({
        name: blockName,
        size: blockSize,
        position: new Vector3(centerX, yPosition, centerZ),
        material: BLOCK_CONSTANTS.MATERIALS.SWIMLANE,
        color: this.getColorFromArray(
          BLOCK_CONSTANTS.COLORS.Z_AXIS_COLORS,
          colorIndex
        ),
        transparency: BLOCK_CONSTANTS.TRANSPARENCY.OPAQUE,
        canCollide: true,
      });

      block.CastShadow = false;
      block.Parent = parent;
      zParallelBlocks.set(typeName, block);

      colorIndex++;
    });

    // Verify all shadow blocks after creation
    zParallelBlocks.forEach((block, typeName) => {});

    // Also find all shadow blocks in parent
    const allShadowBlocks = parent
      .GetChildren()
      .filter(
        (child): child is Part =>
          child.IsA("Part") && child.Name.match("ShadowBlock")[0] !== undefined
      );
    allShadowBlocks.forEach((block) => {});

    return zParallelBlocks;
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
      Enum.NormalId.Bottom,
    ];

    // Check if this is a Z-parallel block
    const isZParallel = block.Name.match("^ZParallel_Lane_")[0] !== undefined;
    

    faces.forEach((face) => {
      // Skip Front face (red labels) for Z-parallel blocks
      if (isZParallel && face === Enum.NormalId.Front) {
        return;
      }
      // Create SurfaceGui
      const surfaceGui = new Instance("SurfaceGui");
      surfaceGui.Name = `SurfaceGui_${face.Name}`;
      surfaceGui.Face = face;
      surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
      surfaceGui.PixelsPerStud = 50;
      surfaceGui.Parent = block;

      // Create TextLabel directly in SurfaceGui
      const textLabel = new Instance("TextLabel");
      textLabel.Size = new UDim2(1, 0, 1, 0); // Full size as requested
      textLabel.Position = new UDim2(0, 0, 0, 0);
      textLabel.BackgroundTransparency = BLOCK_CONSTANTS.LABEL_STYLING.BACKGROUND_TRANSPARENCY;
      textLabel.BackgroundColor3 = block.Color; // Same color as the underlying block
      textLabel.BorderSizePixel = BLOCK_CONSTANTS.LABEL_STYLING.BORDER_SIZE_PIXEL;
      textLabel.BorderColor3 = BLOCK_CONSTANTS.LABEL_STYLING.BORDER_COLOR;
      textLabel.BorderMode = BLOCK_CONSTANTS.LABEL_STYLING.BORDER_MODE;
      textLabel.Font = BLOCK_CONSTANTS.LABEL_STYLING.FONT;
      textLabel.Text = text;
      
      // Use different colors for each face (for testing)
      const faceColors: { [key: string]: Color3 } = {
        Front: new Color3(1, 0, 0),     // Red
        Back: new Color3(0, 1, 0),      // Green
        Left: new Color3(0, 0, 1),      // Blue
        Right: new Color3(1, 1, 0),     // Yellow
        Top: new Color3(1, 0, 1),       // Magenta
        Bottom: new Color3(0, 1, 1),    // Cyan
      };
      
      textLabel.TextColor3 = faceColors[face.Name] || new Color3(1, 1, 1); // Default to white
      textLabel.TextScaled = BLOCK_CONSTANTS.LABEL_STYLING.TEXT_SCALED;
      textLabel.Parent = surfaceGui;
    });
  }
}
