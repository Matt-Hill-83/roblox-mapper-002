/**
 * GUI Layout Manager
 * Manages automatic positioning of GUI components to prevent overlaps
 */

import { GUI_CONSTANTS } from "./constants";

export class GuiLayoutManager {
  private currentY: number = 40; // Start after title
  private readonly padding: number = 10;
  private readonly parent: Frame;

  constructor(parent: Frame) {
    this.parent = parent;
  }

  /**
   * Get next Y position and update current position
   */
  public getNextPosition(componentHeight: number): UDim2 {
    const position = new UDim2(0, 10, 0, this.currentY);
    this.currentY += componentHeight + this.padding;
    return position;
  }

  /**
   * Get current Y position without updating
   */
  public getCurrentY(): number {
    return this.currentY;
  }

  /**
   * Reset layout to initial position
   */
  public reset(): void {
    this.currentY = 40;
  }

  /**
   * Add extra spacing
   */
  public addSpacing(pixels: number): void {
    this.currentY += pixels;
  }

  /**
   * Create a scrolling frame if content exceeds available space
   */
  public createScrollingFrame(): Frame {
    const scrollFrame = new Instance("ScrollingFrame");
    scrollFrame.Name = "ContentScrollFrame";
    scrollFrame.Size = new UDim2(1, 0, 1, -120); // Leave more space for buttons at bottom
    scrollFrame.Position = new UDim2(0, 0, 0, 40); // Start after title
    scrollFrame.BackgroundTransparency = 1;
    scrollFrame.BorderSizePixel = 0;
    scrollFrame.ScrollBarThickness = 8;
    scrollFrame.ScrollBarImageColor3 = new Color3(0.3, 0.3, 0.3);
    scrollFrame.CanvasSize = new UDim2(0, 0, 0, this.currentY);
    scrollFrame.Parent = this.parent;
    
    // Cast to Frame for compatibility with component APIs
    return scrollFrame as unknown as Frame;
  }

  /**
   * Update canvas size based on content
   */
  public updateCanvasSize(scrollFrame: Frame): void {
    if (scrollFrame.IsA("ScrollingFrame")) {
      scrollFrame.CanvasSize = new UDim2(0, 0, 0, this.currentY + 20); // Add some bottom padding
    }
  }
}

/**
 * Component heights for layout calculation
 */
export const COMPONENT_HEIGHTS = {
  GLOBAL_SETTINGS: GUI_CONSTANTS.ENHANCED.GLOBAL_SETTINGS_HEIGHT,
  NODE_TYPES: 145, // Increased for 3 rows (node types, link types, pet types)
  LAYER_GRID_HEADER: GUI_CONSTANTS.ENHANCED.GRID_HEADER_HEIGHT,
  LAYER_ROW: GUI_CONSTANTS.ENHANCED.GRID_ROW_HEIGHT,
  AXIS_MAPPING: 120, // Height for axis mapping controls
  VISUAL_CUSTOMIZATION: 160, // Height for visual customization
  Y_AXIS_CONTROLS: 80, // Height for Y-axis controls
  VISUALIZATION_CONTROLS: 280, // Height for visualization controls
  STATUS_AREA: 30,
  SPACING: 10
};