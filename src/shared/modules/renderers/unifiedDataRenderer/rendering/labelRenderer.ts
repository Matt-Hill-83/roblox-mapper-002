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
   * Create labels for X-axis swimlanes
   */
  public createXAxisLabels(
    nodesByType: Map<string, Node[]>,
    typeBounds: Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>,
    parent: Instance,
    yPosition: number = 0
  ): void {
    nodesByType.forEach((nodes, typeName) => {
      const bounds = typeBounds.get(typeName)!;
      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerZ = bounds.minZ - 5; // Position label in front of swimlane
      
      this.createLabel({
        text: typeName,
        position: new Vector3(centerX, yPosition + 10, centerZ),
        parent: parent
      });
    });
  }
  
  /**
   * Create labels for Z-axis swimlanes
   */
  public createZAxisLabels(
    propertyValues: Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>,
    parent: Instance,
    yPosition: number = 0
  ): void {
    propertyValues.forEach((bounds, value) => {
      const centerX = bounds.minX - 5; // Position label to the left of swimlane
      const centerZ = (bounds.minZ + bounds.maxZ) / 2;
      
      this.createLabel({
        text: value,
        position: new Vector3(centerX, yPosition + 10, centerZ),
        parent: parent
      });
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
    billboardGui.Size = new UDim2(0, 200, 0, 50);
    billboardGui.StudsOffset = new Vector3(0, 2, 0);
    billboardGui.AlwaysOnTop = true;
    billboardGui.Parent = labelPart;
    
    // Create TextLabel
    const textLabel = new Instance("TextLabel");
    textLabel.Size = new UDim2(1, 0, 1, 0);
    textLabel.BackgroundTransparency = 1;
    textLabel.Text = text;
    textLabel.TextColor3 = color;
    textLabel.TextScaled = true;
    textLabel.Font = Enum.Font.SourceSans;
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
}