/**
 * Label Renderer for Swimlane Visualization
 * Creates text labels for X and Z axis swimlanes
 */

import { Node } from "../../../../interfaces/simpleDataGenerator.interface";

export interface LabelConfig {
  text: string;
  position: Vector3;
  size?: number;
  color?: Color3;
  parent: Instance;
}

export class LabelRenderer {
  private defaultColor = new Color3(1, 1, 1); // White
  
  /**
   * Create labels for X-axis swimlanes with SurfaceGui
   */
  public createXAxisLabels(
    nodesByType: Map<string, Node[]>,
    typeBounds: Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>,
    parent: Instance,
    yPosition: number = 0,
    swimlaneBlocks?: Map<string, Part>,
    platformBounds?: { minX: number; maxX: number; minZ: number; maxZ: number }
  ): void {
    nodesByType.forEach((nodes, typeName) => {
      const bounds = typeBounds.get(typeName)!;
      const swimlaneBlock = swimlaneBlocks?.get(typeName);
      
      // Always create floating label
      const centerX = (bounds.minX + bounds.maxX) / 2;
      // Use platform edge if available, otherwise use node bounds
      const labelZ = platformBounds ? platformBounds.minZ - 8 : bounds.minZ - 8;
      
      this.createLabel({
        text: typeName,
        position: new Vector3(centerX, yPosition + 2, labelZ),
        parent: parent
      });
      
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
    parent: Instance,
    yPosition: number = 0,
    swimlaneBlocks?: Map<string, Part>,
    platformBounds?: { minX: number; maxX: number; minZ: number; maxZ: number }
  ): void {
    propertyValues.forEach((bounds, value) => {
      const swimlaneBlock = swimlaneBlocks?.get(value);
      
      // Always create floating label
      // Use platform edge if available, otherwise use node bounds
      const labelX = platformBounds ? platformBounds.minX - 8 : bounds.minX - 8;
      const centerZ = (bounds.minZ + bounds.maxZ) / 2;
      
      this.createLabel({
        text: value,
        position: new Vector3(labelX, yPosition + 2, centerZ),
        parent: parent
      });
      
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
    labelPart.Name = `Label_${text}`;
    labelPart.Size = new Vector3(0.1, 0.1, 0.1);
    labelPart.Position = position;
    labelPart.Transparency = 1;
    labelPart.CanCollide = false;
    labelPart.Anchored = true;
    labelPart.Parent = parent;
    
    // Create BillboardGui
    const billboardGui = new Instance("BillboardGui");
    billboardGui.Size = new UDim2(0, 100, 0, 25);  // Half the size
    billboardGui.StudsOffset = new Vector3(0, 0, 0);
    billboardGui.AlwaysOnTop = true;
    billboardGui.LightInfluence = 0;
    billboardGui.Parent = labelPart;
    
    // Create TextLabel with background
    const textLabel = new Instance("TextLabel");
    textLabel.Size = new UDim2(1, 0, 1, 0);
    textLabel.BackgroundTransparency = 0.7;
    textLabel.BackgroundColor3 = new Color3(0, 0, 0);
    textLabel.Text = text;
    textLabel.TextColor3 = color;
    textLabel.TextScaled = true;
    textLabel.Font = Enum.Font.SourceSans;
    textLabel.TextStrokeTransparency = 0.5;
    textLabel.TextStrokeColor3 = new Color3(0, 0, 0);
    textLabel.Parent = billboardGui;
    
    print(`🏷️ Created label: ${text} at (${position.X}, ${position.Y}, ${position.Z})`);
  }
  
  /**
   * Create labels for property-based swimlanes
   */
  public createPropertyLabels(
    propertyName: string,
    valuePositions: Map<string, number>,
    axis: "X" | "Z",
    parent: Instance,
    basePosition: Vector3
  ): void {
    valuePositions.forEach((position, value) => {
      let labelPosition: Vector3;
      
      if (axis === "X") {
        labelPosition = new Vector3(position, basePosition.Y + 10, basePosition.Z - 5);
      } else {
        labelPosition = new Vector3(basePosition.X - 5, basePosition.Y + 10, position);
      }
      
      this.createLabel({
        text: `${value}`,
        position: labelPosition,
        parent: parent
      });
    });
    
    print(`✅ Created ${valuePositions.size()} labels for ${propertyName} on ${axis} axis`);
  }
  
  /**
   * Create a SurfaceGui label on a part
   */
  private createSurfaceLabel(part: Part, text: string, face: "Front" | "Left"): void {
    // Create SurfaceGui
    const surfaceGui = new Instance("SurfaceGui");
    surfaceGui.Name = `Label_${text}`;
    surfaceGui.Face = face === "Front" ? Enum.NormalId.Front : Enum.NormalId.Left;
    surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
    surfaceGui.PixelsPerStud = 50;
    surfaceGui.Parent = part;
    
    // Create Frame for background
    const frame = new Instance("Frame");
    frame.Size = new UDim2(1, 0, 1, 0);
    frame.BackgroundColor3 = new Color3(0, 0, 0);
    frame.BackgroundTransparency = 0.3;
    frame.BorderSizePixel = 0;
    frame.Parent = surfaceGui;
    
    // Create TextLabel
    const textLabel = new Instance("TextLabel");
    textLabel.Size = new UDim2(0.9, 0, 0.9, 0);
    textLabel.Position = new UDim2(0.05, 0, 0.05, 0);
    textLabel.BackgroundTransparency = 1;
    textLabel.Font = Enum.Font.SourceSansBold;
    textLabel.Text = text;
    textLabel.TextColor3 = this.defaultColor;
    textLabel.TextScaled = true;
    textLabel.Parent = frame;
    
    print(`🏷️ Created SurfaceGui label: ${text} on ${face} face`);
  }
}