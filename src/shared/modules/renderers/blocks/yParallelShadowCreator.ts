/**
 * Y-Parallel Shadow Block Creator
 * Creates floating transparent shadow blocks at different Y levels
 * Part of F008 Vertical Swimlanes feature
 */

import { BaseBlockCreator } from "./baseBlockCreator";
import { BLOCK_CONSTANTS } from "../constants/blockConstants";
import { LAYOUT_CONSTANTS } from "../constants/layoutConstants";
import { POSITION_CONSTANTS } from "../constants/positionConstants";
import { Y_AXIS_COLORS } from "../constants/robloxColors";
import { RENDERER_CONSTANTS } from "../dataGeneratorRobloxRendererUtils/constants";
import { Node } from "../../../interfaces/simpleDataGenerator.interface";
import { PropertyValueResolver } from "../propertyValueResolver";

export interface YParallelShadowConfig {
  nodes: Node[];
  yAxisProperty: string;
  parent: Instance;
  shadowWidth?: number; // Optional: use group shadow width
  shadowDepth?: number; // Optional: use group shadow depth
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
  public createYParallelShadows(config: YParallelShadowConfig): Map<string, Part> {
    const { nodes, yAxisProperty, parent, shadowWidth, shadowDepth } = config;
    const shadows = new Map<string, Part>();

    // Group nodes by Y property value and calculate bounds
    const yGroupBounds = this.calculateYGroupBounds(nodes, yAxisProperty);

    // T9.8.3: Apply custom spacing between Y shadow blocks
    this.applyYShadowSpacing(yGroupBounds);

    // Create a shadow block for each Y group with different colors
    let colorIndex = 0;
    yGroupBounds.forEach((bounds, propertyValue) => {
      const color = Y_AXIS_COLORS[colorIndex % Y_AXIS_COLORS.size()] || new Color3(0.3, 0.3, 0.8);
      const shadow = this.createYShadowBlock(bounds, parent, shadowWidth, shadowDepth, color);
      shadows.set(propertyValue, shadow);
      
      print(`[YParallelShadow] Created shadow for ${propertyValue}: X(${string.format("%.1f", bounds.minX)},${string.format("%.1f", bounds.maxX)}) Z(${string.format("%.1f", bounds.minZ)},${string.format("%.1f", bounds.maxZ)}) Y=${string.format("%.1f", bounds.yPosition)} Height=${string.format("%.1f", bounds.maxY - bounds.minY)} Color=${colorIndex}`);
      colorIndex++;
    });

    return shadows;
  }

  /**
   * Calculate bounds for each Y property group
   */
  private calculateYGroupBounds(nodes: Node[], yAxisProperty: string): Map<string, YGroupBounds> {
    const boundsMap = new Map<string, YGroupBounds>();
    const nodeRadius = 0.5; // Default node radius

    // Initialize bounds for each Y property value
    nodes.forEach(node => {
      const yValue = this.propertyResolver.getPropertyValue(node, yAxisProperty);
      
      if (!boundsMap.has(yValue)) {
        boundsMap.set(yValue, {
          minX: math.huge,
          maxX: -math.huge,
          minZ: math.huge,
          maxZ: -math.huge,
          yPosition: node.position.y,
          propertyValue: yValue,
          minY: node.position.y,
          maxY: node.position.y
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
   * Apply layer-based Y positions to Y shadow blocks
   */
  private applyYShadowSpacing(yGroupBounds: Map<string, YGroupBounds>): void {
    // Use the same layer spacing as nodes
    const layerSpacing = RENDERER_CONSTANTS.POSITIONING.LEVEL_SPACING;
    
    print(`[YParallelShadow] Applying layer-based Y positions with spacing of ${layerSpacing} units`);
    
    // Collect bounds and determine which layer each belongs to
    const boundsArray: YGroupBounds[] = [];
    yGroupBounds.forEach((bounds) => {
      boundsArray.push(bounds);
      print(`[YParallelShadow] Original Y position for ${bounds.propertyValue}: ${bounds.yPosition}`);
    });
    
    // Group by Y position to determine layers
    const yPositionGroups = new Map<number, YGroupBounds[]>();
    boundsArray.forEach((bounds) => {
      const y = bounds.yPosition;
      if (!yPositionGroups.has(y)) {
        yPositionGroups.set(y, []);
      }
      yPositionGroups.get(y)!.push(bounds);
    });
    
    // Sort Y positions to determine layer order
    const yPositions: number[] = [];
    yPositionGroups.forEach((_, yPos) => {
      yPositions.push(yPos);
    });
    yPositions.sort((a: number, b: number) => b > a); // Descending (top to bottom)
    
    // Assign layer-based Y positions (matching node layers)
    const numLayers = yPositions.size();
    yPositions.forEach((yPos: number, index: number) => {
      // Calculate layer Y position (layer 1 at top)
      const layerY = POSITION_CONSTANTS.BASE_Y + (numLayers - (index + 1)) * layerSpacing;
      
      // Apply to all bounds at this Y position
      const boundsAtY = yPositionGroups.get(yPos)!;
      boundsAtY.forEach((bounds: YGroupBounds) => {
        print(`[YParallelShadow] Assigning ${bounds.propertyValue} to layer ${index + 1} at Y=${layerY}`);
        bounds.yPosition = layerY;
      });
    });
  }

  /**
   * Create a single Y-parallel shadow block
   */
  private createYShadowBlock(bounds: YGroupBounds, parent: Instance, shadowWidth?: number, shadowDepth?: number, color?: Color3): Part {
    // T9.8.1: Y shadows start from vertical wall and extend 10 units away
    const shadowExtension = 10; // Units to extend from wall
    let width: number;
    let depth: number;
    let positionX: number;
    let positionZ: number;
    
    if (shadowWidth !== undefined && shadowDepth !== undefined) {
      // Position Y shadows to start from vertical wall edge
      // Assume platform is centered at origin, so wall is at +shadowWidth/2
      const wallPosition = shadowWidth / 2;
      
      // Y shadow extends from wall position outward by shadowExtension
      width = shadowExtension;
      depth = shadowDepth;
      positionX = wallPosition + shadowExtension / 2; // Center of extended shadow
      positionZ = 0; // Center at origin in Z direction
    } else {
      // Fallback: Calculate from node bounds with padding
      const padding = LAYOUT_CONSTANTS.SHADOW_PADDING.Y_SHADOW_PADDING;
      width = bounds.maxX - bounds.minX + padding * 2;
      depth = bounds.maxZ - bounds.minZ + padding * 2;
      positionX = (bounds.minX + bounds.maxX) / 2;
      positionZ = (bounds.minZ + bounds.maxZ) / 2;
    }
    
    // Calculate height based on the Y range of nodes in this group
    const nodeHeight = bounds.maxY - bounds.minY;
    const shadowHeight = nodeHeight > 0 ? nodeHeight : (BLOCK_CONSTANTS.DIMENSIONS.Y_SHADOW_THICKNESS || 5);
    
    // Create the shadow block
    const shadow = this.createBlock({
      name: `YShadow_${bounds.propertyValue}`,
      size: new Vector3(
        width,
        shadowHeight, // Use height from nodes
        depth
      ),
      position: new Vector3(
        positionX,
        bounds.yPosition - (BLOCK_CONSTANTS.DIMENSIONS.Y_SHADOW_OFFSET || 2), // Position slightly below nodes
        positionZ
      ),
      color: color || BLOCK_CONSTANTS.COLORS.Y_SHADOW_COLOR || new Color3(0.5, 0.5, 0.5),
      transparency: BLOCK_CONSTANTS.TRANSPARENCY.Y_SHADOW || 0, // Fully opaque
      material: Enum.Material.Concrete,
      canCollide: false
    });

    shadow.Parent = parent;

    // Add label
    this.addLabel(shadow, bounds.propertyValue);

    return shadow;
  }

  /**
   * Add labels to all faces of the Y shadow block with different colors
   */
  private addLabel(shadow: Part, text: string): void {
    // Define colors for each face
    const faceColors = new Map<Enum.NormalId, Color3>([
      [Enum.NormalId.Top, new Color3(1, 1, 1)],       // White
      [Enum.NormalId.Bottom, new Color3(0.8, 0.8, 0.8)], // Light gray
      [Enum.NormalId.Front, new Color3(1, 0.8, 0.8)],  // Light red
      [Enum.NormalId.Back, new Color3(0.8, 1, 0.8)],   // Light green
      [Enum.NormalId.Left, new Color3(0.8, 0.8, 1)],   // Light blue
      [Enum.NormalId.Right, new Color3(1, 1, 0.8)]     // Light yellow
    ]);

    // Add label to each face
    faceColors.forEach((color, face) => {
      const surfaceGui = new Instance("SurfaceGui");
      surfaceGui.Face = face;
      surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
      surfaceGui.PixelsPerStud = 50;
      surfaceGui.Parent = shadow;

      const label = new Instance("TextLabel");
      label.Size = new UDim2(1, 0, 1, 0);
      label.BackgroundTransparency = 1;
      label.Text = text;
      label.TextColor3 = color;
      label.TextScaled = true;
      label.Font = Enum.Font.SourceSansBold;
      label.TextStrokeTransparency = 0;
      label.TextStrokeColor3 = new Color3(0, 0, 0);
      label.Parent = surfaceGui;
    });
  }
}