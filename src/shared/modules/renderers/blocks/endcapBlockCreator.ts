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
}

export class EndcapBlockCreator extends BaseBlockCreator {
  private readonly ENDCAP_WIDTH = 1;
  private readonly DEFAULT_GAP = 1;

  /**
   * Create endcaps for a swimlane
   */
  public createEndcaps(config: EndcapConfig): { left: Part; right: Part } {
    const {
      swimlaneBlock,
      swimlaneName,
      parent,
      gap = this.DEFAULT_GAP,
      isZAxis = false
    } = config;

    const swimlanePos = swimlaneBlock.Position;
    const swimlaneSize = swimlaneBlock.Size;

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
    const leftEndcap = this.createEndcapBlock(
      `${swimlaneName}_${isZAxis ? 'Left' : 'Front'}Endcap`,
      endcapSize,
      leftPos,
      swimlaneName,
      parent,
      isZAxis
    );

    // Create right/back endcap
    const rightEndcap = this.createEndcapBlock(
      `${swimlaneName}_${isZAxis ? 'Right' : 'Back'}Endcap`,
      endcapSize,
      rightPos,
      swimlaneName,
      parent,
      isZAxis
    );

    return { left: leftEndcap, right: rightEndcap };
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
    isZAxis: boolean
  ): Part {
    // Create the endcap block
    const endcap = this.createBlock({
      name: name,
      size: size,
      position: position,
      material: Enum.Material.Neon,
      color: new Color3(0.2, 0.2, 0.2), // Dark gray
      transparency: 0.3,
      canCollide: false
    });

    // Add debug print statements
    print(`🔚 Creating endcap: ${name}`);
    print(`   - Position: (${string.format("%.2f", position.X)}, ${string.format("%.2f", position.Y)}, ${string.format("%.2f", position.Z)})`);
    print(`   - Size: ${string.format("%.2f", size.X)} x ${string.format("%.2f", size.Y)} x ${string.format("%.2f", size.Z)} (W x H x D)`);
    print(`   - Axis: ${isZAxis ? 'Z-axis' : 'X-axis'}`);
    print(`   - Label: ${label}`);

    // Add labels to all faces
    this.addLabelsToAllFaces(endcap, label);

    endcap.Parent = parent;
    return endcap;
  }

  /**
   * Add surface labels to all faces of the endcap
   */
  private addLabelsToAllFaces(block: Part, text: string): void {
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
      frame.BackgroundTransparency = 0.5;
      frame.BorderSizePixel = 0;
      frame.Parent = surfaceGui;

      // Create TextLabel
      const textLabel = new Instance("TextLabel");
      textLabel.Size = new UDim2(0.9, 0, 0.9, 0);
      textLabel.Position = new UDim2(0.05, 0, 0.05, 0);
      textLabel.BackgroundTransparency = 1;
      textLabel.Font = Enum.Font.SourceSansBold;
      textLabel.Text = text;
      textLabel.TextColor3 = new Color3(1, 1, 1); // White text
      textLabel.TextScaled = true;
      textLabel.Parent = frame;
    });
  }
}