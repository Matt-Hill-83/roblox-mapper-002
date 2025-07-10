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
      // Use larger buffer for person types (man, woman, child, grandparent)
      const isPersonType = ["man", "woman", "child", "grandparent"].includes(typeName.lower());
      const xBuffer = isPersonType ? 20 : BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER;
      const zBuffer = BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BUFFER; // Always use default for Z-axis
      
      // Calculate dimensions with different buffers for X and Z
      const width = bounds.maxX - bounds.minX + xBuffer * 2;
      const depth = bounds.maxZ - bounds.minZ + zBuffer * 2;
      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerZ = (bounds.minZ + bounds.maxZ) / 2;
      
      const blockName = `XAxisShadowBlock_${typeName}`;
      const blockSize = new Vector3(
        width,
        BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BLOCK_HEIGHT,
        depth
      );
      
      // Log shadow block creation
      print(`Creating shadow block: ${blockName}`);
      print(`  - Bounds: X[${bounds.minX}, ${bounds.maxX}], Z[${bounds.minZ}, ${bounds.maxZ}]`);
      print(`  - Is Person Type: ${isPersonType}`);
      print(`  - X Buffer: ${xBuffer}, Z Buffer: ${zBuffer}`);
      print(`  - Calculated Size: X=${width}, Y=${BLOCK_CONSTANTS.DIMENSIONS.SHADOW_BLOCK_HEIGHT}, Z=${depth}`);
      
      const block = this.createBlock({
        name: blockName,
        size: blockSize,
        position: new Vector3(
          centerX,
          yPosition,
          centerZ
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

    // Verify all shadow blocks after creation
    print("\n=== Verifying Shadow Blocks After Creation ===");
    xAxisBlocks.forEach((block, typeName) => {
      print(`Shadow block: ${block.Name}`);
      print(`  - Type: ${typeName}`);
      print(`  - Actual Size: X=${block.Size.X}, Y=${block.Size.Y}, Z=${block.Size.Z}`);
      print(`  - Position: X=${block.Position.X}, Y=${block.Position.Y}, Z=${block.Position.Z}`);
    });
    
    // Also find all shadow blocks in parent
    print("\n=== All Shadow Blocks in Parent ===");
    const allShadowBlocks = parent.GetChildren().filter((child): child is Part => 
      child.IsA("Part") && child.Name.match("ShadowBlock")[0] !== undefined
    );
    allShadowBlocks.forEach(block => {
      print(`Found shadow block: ${block.Name}`);
      print(`  - Size: X=${block.Size.X}, Y=${block.Size.Y}, Z=${block.Size.Z}`);
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

      // Create TextLabel directly in SurfaceGui
      const textLabel = new Instance("TextLabel");
      textLabel.Size = new UDim2(1, 0, 1, 0); // Full size as requested
      textLabel.Position = new UDim2(0, 0, 0, 0);
      textLabel.BackgroundTransparency = 0; // Opaque background to show border
      textLabel.BackgroundColor3 = block.Color; // Same color as the underlying block
      textLabel.BorderSizePixel = 10; // 10px border
      textLabel.BorderColor3 = new Color3(0, 0, 0); // Black border
      textLabel.BorderMode = Enum.BorderMode.Inset; // Internal border so it doesn't overflow
      textLabel.Font = Enum.Font.SourceSansBold;
      textLabel.Text = text;
      textLabel.TextColor3 = new Color3(0, 0, 0); // Black text
      textLabel.TextScaled = true;
      textLabel.Parent = surfaceGui;
    });
  }
}