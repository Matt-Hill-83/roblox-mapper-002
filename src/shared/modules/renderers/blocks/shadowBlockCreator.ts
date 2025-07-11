/**
 * Shadow Block Creator
 * Creates shadow blocks for visual depth and grouping
 * Part of F002 Phase 2 refactoring - T6
 */

import { BaseBlockCreator } from "./baseBlockCreator";
import { BLOCK_CONSTANTS } from "../constants/blockConstants";
import { LAYOUT_CONSTANTS } from "../constants/layoutConstants";
import { EndcapBlockCreator } from "./endcapBlockCreator";

export interface ShadowBlockConfig {
  origin: Vector3;
  parent: Instance;
  height?: number;
  width?: number;
  depth?: number;
  buffer?: number; // DEPRECATED: Padding is handled by LAYOUT_CONSTANTS.SHADOW_PADDING
}

export class ShadowBlockCreator extends BaseBlockCreator {
  private endcapCreator: EndcapBlockCreator;

  constructor() {
    super();
    this.endcapCreator = new EndcapBlockCreator();
  }
  /**
   * Create a group shadow block
   */
  public createGroupShadowBlock(config: ShadowBlockConfig): Part {
    const {
      origin,
      parent,
      width = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_WIDTH,
      depth = BLOCK_CONSTANTS.DIMENSIONS.DEFAULT_DEPTH,
    } = config;

    // Note: buffer parameter is deprecated - padding is handled by LAYOUT_CONSTANTS.SHADOW_PADDING
    const shadowBlock = this.createBlock({
      name: "GroupShadowBlock",
      size: new Vector3(
        width,
        BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS,
        depth
      ),
      position: new Vector3(
        origin.X,
        BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS / 2 +
          BLOCK_CONSTANTS.DIMENSIONS.Z_FIGHTING_OFFSET, // Raised by 0.1 to prevent z-fighting
        origin.Z
      ),
      material: BLOCK_CONSTANTS.MATERIALS.SHADOW,
      color: BLOCK_CONSTANTS.COLORS.SHADOW,
      transparency: BLOCK_CONSTANTS.TRANSPARENCY.OPAQUE,
      canCollide: true,
    });

    shadowBlock.CastShadow = false;
    shadowBlock.Parent = parent;

    return shadowBlock;
  }

  /**
   * Create X-parallel shadow blocks (run along X axis, grouped by Z position)
   */
  public createXParallelShadowBlocks(
    nodesByProperty: Map<string, any[]>,
    propertyBounds: Map<
      string,
      { minX: number; maxX: number; minZ: number; maxZ: number }
    >,
    parent: Instance,
    yPosition: number = 0.5,
    blocksMap?: Map<string, Part>,
    propertyName?: string,
    origin?: Vector3
  ): void {
    // First, calculate the collective bounds of all pet lanes
    let collectiveMinZ = math.huge;
    let collectiveMaxZ = -math.huge;

    propertyBounds.forEach((bounds, propertyValue) => {
      collectiveMinZ = math.min(collectiveMinZ, bounds.minZ);
      collectiveMaxZ = math.max(collectiveMaxZ, bounds.maxZ);
    });

    // Calculate the center of the collective pet lanes
    const collectiveCenter = (collectiveMinZ + collectiveMaxZ) / 2;

    // The group shadow block is centered at Z=0, so we need to offset the pet lanes
    const offsetZ = 0 - collectiveCenter;

    let blockIndex = 0;

    nodesByProperty.forEach((nodes, propertyValue) => {
      const bounds = propertyBounds.get(propertyValue);
      if (!bounds) {
        warn(
          `[ShadowBlockCreator] No bounds found for property value: ${propertyValue}`
        );
        return;
      }
      const block = this.createXParallelBlock(
        propertyValue,
        bounds,
        yPosition,
        blockIndex,
        propertyName,
        offsetZ
      );
      block.Parent = parent;

      // Create swimlane model with endcaps
      this.endcapCreator.createSwimlaneWithEndcaps({
        swimlaneBlock: block,
        swimlaneName: propertyValue,
        parent: parent,
        gap: 1,
        isZAxis: true,
      });

      if (blocksMap) {
        blocksMap.set(propertyValue, block);
      }

      blockIndex++;
    });
  }

  /**
   * Create a single X-parallel shadow block
   */
  private createXParallelBlock(
    propertyValue: string,
    bounds: { minX: number; maxX: number; minZ: number; maxZ: number },
    yPosition: number,
    colorIndex: number,
    propertyName?: string,
    offsetZ: number = 0
  ): Part {
    // Use actual bounds for dimensions - NO BUFFER to match actual content
    const width = bounds.maxX - bounds.minX + 4; // Add 4 to length as requested
    // Use the correct depth for X-parallel lanes
    const depth = LAYOUT_CONSTANTS.LANE_DIMENSIONS.X_PARALLEL_LANE_DEPTH;

    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerZ = (bounds.minZ + bounds.maxZ) / 2;

    // Generate unique ID for the lane
    const laneId = `${propertyName || "default"}_${propertyValue}`;
    const blockName = `XParallel_Lane_${laneId}`;

    // Apply the offset to center the collection of lanes
    const adjustedZPosition = centerZ + offsetZ;

    const block = this.createBlock({
      name: blockName,
      size: new Vector3(
        width,
        LAYOUT_CONSTANTS.LANE_DIMENSIONS.X_PARALLEL_LANE_HEIGHT,
        depth
      ),
      position: new Vector3(centerX, yPosition, adjustedZPosition),
      material: BLOCK_CONSTANTS.MATERIALS.SWIMLANE,
      color: this.getColorFromArray(
        BLOCK_CONSTANTS.COLORS.X_PARALLEL_LANE_COLORS,
        colorIndex
      ),
      transparency: BLOCK_CONSTANTS.TRANSPARENCY.OPAQUE,
      canCollide: true,
    });

    block.CastShadow = false;

    // Add surface labels to all faces
    this.addSurfaceLabelsToAllFaces(block, propertyValue);

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
      Enum.NormalId.Bottom,
    ];

    // Check if this is an X-parallel block
    const isXParallel = block.Name.match("^XParallel_Lane_")[0] !== undefined;

    faces.forEach((face) => {
      // Skip Front face (red labels), Back face (green labels), and Left face (blue labels) for X-parallel blocks
      if (
        isXParallel &&
        (face === Enum.NormalId.Front ||
          face === Enum.NormalId.Back ||
          face === Enum.NormalId.Left)
      ) {
        return;
      }
      // Create SurfaceGui
      const surfaceGui = new Instance("SurfaceGui");
      surfaceGui.Name = `SurfaceGui_${face.Name}`;
      surfaceGui.Face = face;
      surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
      surfaceGui.PixelsPerStud = 50;
      surfaceGui.Parent = block;

      // Create Frame for background with border
      const frame = new Instance("Frame");
      frame.Size = new UDim2(1, 0, 1, 0);
      frame.BackgroundColor3 = block.Color; // Match block color
      frame.BackgroundTransparency =
        BLOCK_CONSTANTS.LABEL_STYLING.BACKGROUND_TRANSPARENCY;
      frame.BorderSizePixel = BLOCK_CONSTANTS.LABEL_STYLING.BORDER_SIZE_PIXEL;
      frame.BorderColor3 = BLOCK_CONSTANTS.LABEL_STYLING.BORDER_COLOR;
      frame.Parent = surfaceGui;

      // Create TextLabel
      const textLabel = new Instance("TextLabel");
      textLabel.Size = new UDim2(0.9, 0, 0.9, 0);
      textLabel.Position = new UDim2(0.05, 0, 0.05, 0);
      textLabel.BackgroundTransparency = 1;
      textLabel.Font = BLOCK_CONSTANTS.LABEL_STYLING.FONT;
      textLabel.Text = text;

      // Use different colors for each face (for testing)
      const faceColors: { [key: string]: Color3 } = {
        Front: new Color3(1, 0, 0), // Red
        Back: new Color3(0, 1, 0), // Green
        Left: new Color3(0, 0, 1), // Blue
        Right: new Color3(1, 1, 0), // Yellow
        Top: new Color3(1, 0, 1), // Magenta
        Bottom: new Color3(0, 1, 1), // Cyan
      };

      textLabel.TextColor3 = faceColors[face.Name] || new Color3(1, 1, 1); // Default to white
      textLabel.TextScaled = BLOCK_CONSTANTS.LABEL_STYLING.TEXT_SCALED;
      textLabel.Rotation = 90; // Rotate 90 degrees clockwise
      textLabel.Parent = frame;
    });
  }
}
