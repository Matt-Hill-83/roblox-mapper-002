/**
 * Y-Parallel Shadow Block Creator
 * Creates floating transparent shadow blocks at different Y levels
 * Part of F008 Vertical Swimlanes feature
 */

import { BaseBlockCreator } from "./baseBlockCreator";
import { BLOCK_CONSTANTS } from "../constants/blockConstants";
import { LAYOUT_CONSTANTS } from "../constants/layoutConstants";
import { Y_AXIS_COLORS } from "../constants/robloxColors";
import { Node } from "../../../interfaces/simpleDataGenerator.interface";
import { PropertyValueResolver } from "../propertyValueResolver";

export interface YParallelShadowConfig {
  nodes: Node[];
  yAxisProperty: string;
  parent: Instance;
  shadowWidth?: number; // Optional: use group shadow width
  shadowDepth?: number; // Optional: use group shadow depth
  side?: "left" | "right" | "back"; // Optional: which side to place shadows (default: "right")
}

export interface YGroupBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  yPosition: number;
  propertyValue: string;
  minY: number;
  maxY: number;
}

export class YParallelShadowCreator extends BaseBlockCreator {
  private propertyResolver: PropertyValueResolver;

  constructor() {
    super();
    this.propertyResolver = new PropertyValueResolver();
  }

  /**
   * Create Y-parallel shadow blocks for each Y property value
   */
  public createYParallelShadows(
    config: YParallelShadowConfig
  ): Map<string, Part> {
    const {
      nodes,
      yAxisProperty,
      parent,
      shadowWidth,
      shadowDepth,
      side = "right",
    } = config;
    const shadows = new Map<string, Part>();

    // Group nodes by Y property value and calculate bounds
    const yGroupBounds = this.calculateYGroupBounds(nodes, yAxisProperty);

    // Don't apply layer-based spacing - use the actual node Y positions

    // Create a shadow block for each Y group with different colors
    let colorIndex = 0;
    yGroupBounds.forEach((bounds, propertyValue) => {
      const color =
        Y_AXIS_COLORS[colorIndex % Y_AXIS_COLORS.size()] ||
        new Color3(0.3, 0.3, 0.8);
      const shadow = this.createYShadowBlock(
        bounds,
        parent,
        shadowWidth,
        shadowDepth,
        color,
        side
      );
      shadows.set(propertyValue, shadow);

      colorIndex++;
    });

    return shadows;
  }

  /**
   * Calculate bounds for each Y property group
   */
  private calculateYGroupBounds(
    nodes: Node[],
    yAxisProperty: string
  ): Map<string, YGroupBounds> {
    const boundsMap = new Map<string, YGroupBounds>();
    const nodeRadius = 0.5; // Default node radius

    // Initialize bounds for each Y property value
    nodes.forEach((node) => {
      const yValue = this.propertyResolver.getPropertyValue(
        node,
        yAxisProperty
      );

      // Log first few unique values
      if (!boundsMap.has(yValue) && boundsMap.size() < 3) {
      }

      if (!boundsMap.has(yValue)) {
        boundsMap.set(yValue, {
          minX: math.huge,
          maxX: -math.huge,
          minZ: math.huge,
          maxZ: -math.huge,
          yPosition: node.position.y,
          propertyValue: yValue,
          minY: node.position.y,
          maxY: node.position.y,
        });
      }

      const bounds = boundsMap.get(yValue)!;
      // Account for node radius when calculating bounds
      bounds.minX = math.min(bounds.minX, node.position.x - nodeRadius);
      bounds.maxX = math.max(bounds.maxX, node.position.x + nodeRadius);
      bounds.minZ = math.min(bounds.minZ, node.position.z - nodeRadius);
      bounds.maxZ = math.max(bounds.maxZ, node.position.z + nodeRadius);
      // Track Y bounds for height calculation
      bounds.minY = math.min(bounds.minY, node.position.y);
      bounds.maxY = math.max(bounds.maxY, node.position.y);
      // Y position should be consistent for all nodes with same property value
      bounds.yPosition = node.position.y;
    });

    return boundsMap;
  }

  /**
   * Create a single Y-parallel shadow block
   */
  private createYShadowBlock(
    bounds: YGroupBounds,
    parent: Instance,
    shadowWidth?: number,
    shadowDepth?: number,
    color?: Color3,
    side: "left" | "right" | "back" = "right"
  ): Part {
    // T9.8.1: Y shadows start from vertical wall and extend 10 units away
    const shadowExtension = 10; // Units to extend from wall
    let width: number;
    let depth: number;
    let positionX: number;
    let positionZ: number;

    if (shadowWidth !== undefined && shadowDepth !== undefined) {
      // Position Y shadows to start from vertical wall edge
      if (side === "right") {
        // The right wall is at shadowWidth/2
        const wallPosition = shadowWidth / 2;
        // Y shadow starts at wall position and extends outward to the right (positive X)
        width = shadowExtension;
        depth = shadowDepth;
        positionX = wallPosition + shadowExtension / 2 - 2; // Center of extended shadow (extends right) - 2 units offset
        positionZ = 0; // Center at origin in Z direction
      } else if (side === "left") {
        // The left wall is at -shadowWidth/2
        const wallPosition = -shadowWidth / 2;
        // Y shadow starts at wall position and extends inward by 1 unit
        width = shadowExtension;
        depth = shadowDepth;
        positionX = wallPosition - shadowExtension / 2 + 1; // Center of extended shadow (extends left) + 1 unit into node area
        positionZ = 0; // Center at origin in Z direction
      } else {
        // The back wall is at shadowDepth/2
        const wallPosition = shadowDepth / 2;
        // Y shadow starts at wall position and extends forward (negative Z) by 1 unit into node area
        width = shadowWidth; // Full width along X axis
        depth = shadowExtension;
        positionX = 0; // Center at origin in X direction
        positionZ = wallPosition - shadowExtension / 2 + 1; // Center of extended shadow (extends forward) + 1 unit into node area
      }
    } else {
      // Fallback: Calculate from node bounds with padding
      const padding = LAYOUT_CONSTANTS.SHADOW_PADDING.Y_SHADOW_PADDING;
      width = bounds.maxX - bounds.minX + padding * 2;
      depth = bounds.maxZ - bounds.minZ + padding * 2;
      positionX = (bounds.minX + bounds.maxX) / 2;
      positionZ = (bounds.minZ + bounds.maxZ) / 2;
    }

    // Use fixed height for Y shadows
    const shadowHeight = BLOCK_CONSTANTS.DIMENSIONS.Y_SHADOW_THICKNESS || 5;

    // Create the shadow block
    const shadow = this.createBlock({
      name: `YShadow_${side}_${bounds.propertyValue}`,
      size: new Vector3(
        width,
        shadowHeight, // Use height from nodes
        depth
      ),
      position: new Vector3(
        positionX,
        bounds.yPosition, // Use layer Y position
        positionZ
      ),
      color:
        color ||
        BLOCK_CONSTANTS.COLORS.Y_SHADOW_COLOR ||
        new Color3(0.5, 0.5, 0.5),
      transparency: BLOCK_CONSTANTS.TRANSPARENCY.Y_SHADOW || 0, // Fully opaque
      material: Enum.Material.Concrete,
      canCollide: false,
    });

    shadow.Parent = parent;

    // Add label
    this.addLabel(shadow, bounds.propertyValue);

    return shadow;
  }

  /**
   * Add labels to all faces of the Y shadow block with black color
   */
  private addLabel(shadow: Part, text: string): void {
    // All faces use black text color
    const faces = [
      Enum.NormalId.Top,
      Enum.NormalId.Bottom,
      Enum.NormalId.Front,
      Enum.NormalId.Back,
      Enum.NormalId.Left,
      Enum.NormalId.Right,
    ];

    // Add label to each face
    faces.forEach((face) => {
      const surfaceGui = new Instance("SurfaceGui");
      surfaceGui.Face = face;
      surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
      surfaceGui.PixelsPerStud = 50;
      surfaceGui.Parent = shadow;

      const label = new Instance("TextLabel");
      label.Size = new UDim2(1, 0, 1, 0);
      label.BackgroundTransparency = 1;
      label.Text = text;
      label.TextColor3 = new Color3(0, 0, 0); // Black text color
      label.TextScaled = true;
      label.Font = Enum.Font.SourceSansBold;
      label.TextStrokeTransparency = 0;
      label.TextStrokeColor3 = new Color3(0, 0, 0);
      label.Parent = surfaceGui;
    });
  }
}
