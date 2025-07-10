/**
 * Y-Parallel Shadow Block Creator
 * Creates floating transparent shadow blocks at different Y levels
 * Part of F008 Vertical Swimlanes feature
 */

import { BaseBlockCreator } from "./baseBlockCreator";
import { BLOCK_CONSTANTS } from "../constants/blockConstants";
import { LAYOUT_CONSTANTS } from "../constants/layoutConstants";
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

    // Create a shadow block for each Y group
    yGroupBounds.forEach((bounds, propertyValue) => {
      const shadow = this.createYShadowBlock(bounds, parent, shadowWidth, shadowDepth);
      shadows.set(propertyValue, shadow);
      
      print(`[YParallelShadow] Created shadow for ${propertyValue}: X(${string.format("%.1f", bounds.minX)},${string.format("%.1f", bounds.maxX)}) Z(${string.format("%.1f", bounds.minZ)},${string.format("%.1f", bounds.maxZ)}) Y=${string.format("%.1f", bounds.yPosition)}`);
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
          propertyValue: yValue
        });
      }

      const bounds = boundsMap.get(yValue)!;
      // Account for node radius when calculating bounds
      bounds.minX = math.min(bounds.minX, node.position.x - nodeRadius);
      bounds.maxX = math.max(bounds.maxX, node.position.x + nodeRadius);
      bounds.minZ = math.min(bounds.minZ, node.position.z - nodeRadius);
      bounds.maxZ = math.max(bounds.maxZ, node.position.z + nodeRadius);
      // Y position should be consistent for all nodes with same property value
      bounds.yPosition = node.position.y;
    });

    return boundsMap;
  }

  /**
   * Create a single Y-parallel shadow block
   */
  private createYShadowBlock(bounds: YGroupBounds, parent: Instance, shadowWidth?: number, shadowDepth?: number): Part {
    // Use provided shadow dimensions or calculate from bounds
    let width: number;
    let depth: number;
    
    if (shadowWidth !== undefined && shadowDepth !== undefined) {
      // Use group shadow dimensions
      width = shadowWidth;
      depth = shadowDepth;
    } else {
      // Calculate from node bounds with padding
      const padding = LAYOUT_CONSTANTS.SHADOW_PADDING.Y_SHADOW_PADDING;
      width = bounds.maxX - bounds.minX + padding * 2;
      depth = bounds.maxZ - bounds.minZ + padding * 2;
    }
    
    // Create the shadow block
    const shadow = this.createBlock({
      name: `YShadow_${bounds.propertyValue}`,
      size: new Vector3(
        width,
        BLOCK_CONSTANTS.DIMENSIONS.Y_SHADOW_THICKNESS || 0.5,
        depth
      ),
      position: new Vector3(
        shadowWidth !== undefined ? 0 : (bounds.minX + bounds.maxX) / 2, // Center at origin if using group shadow size
        bounds.yPosition - (BLOCK_CONSTANTS.DIMENSIONS.Y_SHADOW_OFFSET || 2), // Position slightly below nodes
        shadowDepth !== undefined ? 0 : (bounds.minZ + bounds.maxZ) / 2 // Center at origin if using group shadow size
      ),
      color: BLOCK_CONSTANTS.COLORS.Y_SHADOW_COLOR || new Color3(0.5, 0.5, 0.5),
      transparency: BLOCK_CONSTANTS.TRANSPARENCY.Y_SHADOW || 0.7, // 70% transparent as per requirements
      material: Enum.Material.ForceField
    });

    shadow.Parent = parent;

    // Add label
    this.addLabel(shadow, bounds.propertyValue);

    return shadow;
  }

  /**
   * Add a label to the Y shadow block
   */
  private addLabel(shadow: Part, text: string): void {
    const surfaceGui = new Instance("SurfaceGui");
    surfaceGui.Face = Enum.NormalId.Top;
    surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
    surfaceGui.PixelsPerStud = 50;
    surfaceGui.Parent = shadow;

    const label = new Instance("TextLabel");
    label.Size = new UDim2(1, 0, 1, 0);
    label.BackgroundTransparency = 1;
    label.Text = text;
    label.TextColor3 = new Color3(1, 1, 1);
    label.TextScaled = true;
    label.Font = Enum.Font.SourceSansBold;
    label.TextStrokeTransparency = 0;
    label.TextStrokeColor3 = new Color3(0, 0, 0);
    label.Parent = surfaceGui;
  }
}