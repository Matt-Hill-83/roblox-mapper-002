/**
 * Endcap Block Creator
 * Creates endcap blocks for swimlane shadows
 * Part of T10: Add endcaps to swimlane shadows
 */

import { BaseBlockCreator } from "./baseBlockCreator";

export interface EndcapConfig {
  swimlaneBlock: Part;
  swimlaneName: string;
  parent: Instance;
  gap?: number;
  isZAxis?: boolean;
  color?: Color3;
}

export class EndcapBlockCreator extends BaseBlockCreator {
  private readonly ENDCAP_WIDTH = 1;
  private readonly DEFAULT_GAP = 1;

  /**
   * Create endcaps for a swimlane and wrap everything in a model
   */
  public createSwimlaneWithEndcaps(config: EndcapConfig): Model {
    const {
      swimlaneBlock,
      swimlaneName,
      parent,
      gap = this.DEFAULT_GAP,
      isZAxis = false,
      color = swimlaneBlock.Color // Use swimlane color by default
    } = config;

    const swimlanePos = swimlaneBlock.Position;
    const swimlaneSize = swimlaneBlock.Size;

    // Create a model to contain the swimlane and its endcaps
    const swimlaneModel = new Instance("Model");
    swimlaneModel.Name = `${swimlaneName}_Swimlane`;
    swimlaneModel.Parent = parent;

    // Parent the swimlane block to the model
    swimlaneBlock.Parent = swimlaneModel;

    // Calculate endcap dimensions
    const endcapWidth = this.ENDCAP_WIDTH;
    const endcapHeight = swimlaneSize.Y; // Match swimlane height

    let endcapSize: Vector3;
    let leftPos: Vector3;
    let rightPos: Vector3;

    if (isZAxis) {
      // Z-axis property swimlanes run in X direction, so endcaps at left and right
      endcapSize = new Vector3(endcapWidth, endcapHeight, swimlaneSize.Z);
      
      // Left endcap (negative X)
      leftPos = new Vector3(
        swimlanePos.X - (swimlaneSize.X / 2) - gap - (endcapWidth / 2),
        swimlanePos.Y,
        swimlanePos.Z
      );
      
      // Right endcap (positive X)
      rightPos = new Vector3(
        swimlanePos.X + (swimlaneSize.X / 2) + gap + (endcapWidth / 2),
        swimlanePos.Y,
        swimlanePos.Z
      );
    } else {
      // X-axis property swimlanes run in Z direction, so endcaps at front and back
      endcapSize = new Vector3(swimlaneSize.X, endcapHeight, endcapWidth);
      
      // Front endcap (negative Z)
      leftPos = new Vector3(
        swimlanePos.X,
        swimlanePos.Y,
        swimlanePos.Z - (swimlaneSize.Z / 2) - gap - (endcapWidth / 2)
      );
      
      // Back endcap (positive Z)
      rightPos = new Vector3(
        swimlanePos.X,
        swimlanePos.Y,
        swimlanePos.Z + (swimlaneSize.Z / 2) + gap + (endcapWidth / 2)
      );
    }

    // Create left/front endcap
    this.createEndcapBlock(
      `${swimlaneName}_${isZAxis ? 'Left' : 'Front'}Endcap`,
      endcapSize,
      leftPos,
      swimlaneName,
      swimlaneModel, // Parent to the model
      isZAxis,
      color
    );

    // Create right/back endcap
    this.createEndcapBlock(
      `${swimlaneName}_${isZAxis ? 'Right' : 'Back'}Endcap`,
      endcapSize,
      rightPos,
      swimlaneName,
      swimlaneModel, // Parent to the model
      isZAxis,
      color
    );

    return swimlaneModel;
  }

  /**
   * Create a single endcap block
   */
  private createEndcapBlock(
    name: string,
    size: Vector3,
    position: Vector3,
    label: string,
    parent: Instance,
    isZAxis: boolean,
    color: Color3
  ): Part {
    // Create the endcap block
    const endcap = this.createBlock({
      name: name,
      size: size,
      position: position,
      material: Enum.Material.Concrete,
      color: color, // Use swimlane color
      transparency: 0,
      canCollide: false
    });

    // Add labels to all faces
    this.addLabelsToAllFaces(endcap, label, isZAxis);

    endcap.Parent = parent;
    return endcap;
  }

  /**
   * Add surface labels to all faces of the endcap
   */
  private addLabelsToAllFaces(block: Part, text: string, isZAxis: boolean): void {
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
      surfaceGui.Name = `EndcapLabel_${face.Name}`;
      surfaceGui.Face = face;
      surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
      surfaceGui.PixelsPerStud = 50;
      surfaceGui.Parent = block;

      // Create Frame for background
      const frame = new Instance("Frame");
      frame.Size = new UDim2(1, 0, 1, 0);
      frame.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
      frame.BackgroundTransparency = 1; // Fully transparent background
      frame.BorderSizePixel = 5;
      frame.BorderColor3 = new Color3(0, 0, 0); // Black border
      frame.Parent = surfaceGui;

      // Create TextLabel
      const textLabel = new Instance("TextLabel");
      textLabel.Size = new UDim2(0.9, 0, 0.9, 0);
      textLabel.Position = new UDim2(0.05, 0, 0.05, 0);
      textLabel.BackgroundTransparency = 1;
      textLabel.Font = Enum.Font.SourceSansBold;
      textLabel.Text = text;
      textLabel.TextColor3 = new Color3(0, 0, 0); // Black text
      textLabel.TextScaled = false;
      textLabel.TextSize = 36; // Increased by 50% from 24
      
      // Rotate text on top face for X-axis swimlanes (person endcaps)
      if (face === Enum.NormalId.Top && !isZAxis) {
        textLabel.Rotation = 90;
      }
      
      textLabel.Parent = frame;
    });
  }
}