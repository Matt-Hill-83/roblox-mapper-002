/**
 * Label Renderer for Swimlane Visualization
 * Creates text labels for X and Z axis swimlanes
 */

import { LABEL_CONSTANTS } from "../../constants/labelConstants";
import { Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { POSITION_CONSTANTS } from "../../constants/positionConstants";

export interface LabelConfig {
  text: string;
  position: Vector3;
  size?: number;
  color?: Color3;
  parent: Instance;
}

export class LabelRenderer {
  private defaultColor = LABEL_CONSTANTS.COLORS.DEFAULT_TEXT;
  
  /**
   * Create labels for X-axis swimlanes with SurfaceGui
   */
  public createXAxisLabels(
    nodesByType: Map<string, Node[]>,
    _typeBounds: Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>,
    _parent: Instance,
    _yPosition: number = 0,
    swimlaneBlocks?: Map<string, Part>,
    _platformBounds?: { minX: number; maxX: number; minZ: number; maxZ: number }
  ): void {
    nodesByType.forEach((_nodes, typeName) => {
      // const bounds = typeBounds.get(typeName)!;
      const swimlaneBlock = swimlaneBlocks?.get(typeName);
      
      // Floating labels disabled
      // const centerX = (bounds.minX + bounds.maxX) / 2;
      // const labelZ = platformBounds ? platformBounds.minZ - LABEL_CONSTANTS.OFFSETS.PLATFORM_EDGE_OFFSET : bounds.minZ - LABEL_CONSTANTS.OFFSETS.PLATFORM_EDGE_OFFSET;
      // 
      // this.createLabel({
      //   text: typeName,
      //   position: new Vector3(centerX, yPosition + LABEL_CONSTANTS.OFFSETS.POSITION_OFFSET, labelZ),
      //   parent: parent
      // });
      
      // Also create surface label if block is available
      if (swimlaneBlock) {
        this.createSurfaceLabel(swimlaneBlock, typeName, "Front");
      }
    });
  }
  
  /**
   * Create labels for Z-axis swimlanes with SurfaceGui
   */
  public createZAxisLabels(
    propertyValues: Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>,
    _parent: Instance,
    _yPosition: number = 0,
    swimlaneBlocks?: Map<string, Part>,
    _platformBounds?: { minX: number; maxX: number; minZ: number; maxZ: number }
  ): void {
    propertyValues.forEach((_bounds, value) => {
      const swimlaneBlock = swimlaneBlocks?.get(value);
      
      // Floating labels disabled
      // const labelX = platformBounds ? platformBounds.minX - LABEL_CONSTANTS.OFFSETS.PLATFORM_EDGE_OFFSET : bounds.minX - LABEL_CONSTANTS.OFFSETS.PLATFORM_EDGE_OFFSET;
      // const centerZ = (bounds.minZ + bounds.maxZ) / 2;
      // 
      // this.createLabel({
      //   text: value,
      //   position: new Vector3(labelX, yPosition + LABEL_CONSTANTS.OFFSETS.POSITION_OFFSET, centerZ),
      //   parent: parent
      // });
      
      // Also create surface label if block is available
      if (swimlaneBlock) {
        this.createSurfaceLabel(swimlaneBlock, value, "Left");
      }
    });
  }
  
  /**
   * Create a single label
   */
  private createLabel(config: LabelConfig): void {
    const { text, position, color = this.defaultColor, parent } = config;
    
    // Create part to hold the label
    const labelPart = new Instance("Part");
    labelPart.Name = `${LABEL_CONSTANTS.NAMES.LABEL_PREFIX}${text}`;
    labelPart.Size = new Vector3(LABEL_CONSTANTS.SIZES.PART_SIZE, LABEL_CONSTANTS.SIZES.PART_SIZE, LABEL_CONSTANTS.SIZES.PART_SIZE);
    labelPart.Position = position;
    labelPart.Transparency = LABEL_CONSTANTS.TRANSPARENCY.PART;
    labelPart.CanCollide = false;
    labelPart.Anchored = true;
    labelPart.Parent = parent;
    
    // Create BillboardGui
    const billboardGui = new Instance("BillboardGui");
    billboardGui.Size = new UDim2(0, LABEL_CONSTANTS.SIZES.BILLBOARD_WIDTH, 0, LABEL_CONSTANTS.SIZES.BILLBOARD_HEIGHT);
    billboardGui.StudsOffset = new Vector3(0, 0, 0);
    billboardGui.AlwaysOnTop = true;
    billboardGui.LightInfluence = 0;
    billboardGui.Parent = labelPart;
    
    // Create TextLabel with background
    const textLabel = new Instance("TextLabel");
    textLabel.Size = new UDim2(1, 0, 1, 0);
    textLabel.BackgroundTransparency = LABEL_CONSTANTS.TRANSPARENCY.BACKGROUND;
    textLabel.BackgroundColor3 = LABEL_CONSTANTS.COLORS.DEFAULT_BACKGROUND;
    textLabel.Text = text;
    textLabel.TextColor3 = color;
    textLabel.TextScaled = true;
    textLabel.Font = LABEL_CONSTANTS.FORMATTING.FONT;
    textLabel.TextStrokeTransparency = LABEL_CONSTANTS.TRANSPARENCY.TEXT_STROKE;
    textLabel.TextStrokeColor3 = LABEL_CONSTANTS.COLORS.SHADOW;
    textLabel.Parent = billboardGui;
    
    
  }
  
  /**
   * Create labels for property-based swimlanes
   */
  public createPropertyLabels(
    _propertyName: string,
    valuePositions: Map<string, number>,
    axis: "X" | "Z",
    parent: Instance,
    basePosition: Vector3
  ): void {
    valuePositions.forEach((position, value) => {
      let labelPosition: Vector3;
      
      if (axis === "X") {
        labelPosition = new Vector3(position, basePosition.Y + 10, basePosition.Z - POSITION_CONSTANTS.Z_DIMENSION_GROUP_SPACING);
      } else {
        labelPosition = new Vector3(basePosition.X - POSITION_CONSTANTS.Z_DIMENSION_GROUP_SPACING, basePosition.Y + 10, position);
      }
      
      this.createLabel({
        text: `${value}`,
        position: labelPosition,
        parent: parent
      });
    });
    

  }
  
  /**
   * Create a SurfaceGui label on a part
   */
  private createSurfaceLabel(part: Part, text: string, face: "Front" | "Left"): void {
    // Create SurfaceGui
    const surfaceGui = new Instance("SurfaceGui");
    surfaceGui.Name = `${LABEL_CONSTANTS.NAMES.SURFACE_GUI_PREFIX}${text}`;
    surfaceGui.Face = face === "Front" ? Enum.NormalId.Front : Enum.NormalId.Left;
    surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
    surfaceGui.PixelsPerStud = LABEL_CONSTANTS.FORMATTING.SURFACE_GUI_PIXELS_PER_STUD;
    surfaceGui.Parent = part;
    
    // Create Frame for background
    const frame = new Instance("Frame");
    frame.Size = new UDim2(1, 0, 1, 0);
    frame.BackgroundColor3 = LABEL_CONSTANTS.COLORS.DEFAULT_BACKGROUND;
    frame.BackgroundTransparency = 0.3;
    frame.BorderSizePixel = 0;
    frame.Parent = surfaceGui;
    
    // Create TextLabel
    const textLabel = new Instance("TextLabel");
    textLabel.Size = new UDim2(LABEL_CONSTANTS.SIZES.TEXT_SCALE_FACTOR, 0, LABEL_CONSTANTS.SIZES.TEXT_SCALE_FACTOR, 0);
    textLabel.Position = new UDim2((1 - LABEL_CONSTANTS.SIZES.TEXT_SCALE_FACTOR) / 2, 0, (1 - LABEL_CONSTANTS.SIZES.TEXT_SCALE_FACTOR) / 2, 0);
    textLabel.BackgroundTransparency = 1;
    textLabel.Font = LABEL_CONSTANTS.FORMATTING.FONT_BOLD;
    textLabel.Text = text;
    textLabel.TextColor3 = this.defaultColor;
    textLabel.TextScaled = true;
    textLabel.Parent = frame;
    
    
  }
}