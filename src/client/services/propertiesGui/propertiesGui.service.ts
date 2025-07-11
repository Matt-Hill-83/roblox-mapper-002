/**
 * Properties GUI Service
 * 
 * Displays property values in a draggable GUI
 * Shows the first property type and all its possible values
 */

import { Players } from "@rbxts/services";
import { BaseService } from "../../../shared/services/base/BaseService";

export interface PropertyInfo {
  propertyName: string;
  values: string[];
}

export class PropertiesGuiService extends BaseService {
  private gui?: ScreenGui;
  private frame?: Frame;
  private propertyInfo?: PropertyInfo;
  private isDragging = false;
  private dragStart?: Vector2;
  private dragStartPos?: UDim2;

  constructor() {
    super("PropertiesGuiService");
  }

  /**
   * Creates the properties GUI
   */
  public createGUI(propertyInfo: PropertyInfo): void {
    const player = Players.LocalPlayer;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

    // Create or get the ScreenGui
    this.gui = playerGui.FindFirstChild("PropertiesGUI") as ScreenGui;
    if (!this.gui) {
      this.gui = new Instance("ScreenGui");
      this.gui.Name = "PropertiesGUI";
      this.gui.ResetOnSpawn = false;
      this.gui.Parent = playerGui;
    }

    // Store property info
    this.propertyInfo = propertyInfo;

    // Create the main frame
    this.createMainFrame();
    
    // Populate with property data
    this.populateProperties();
  }

  /**
   * Creates the main draggable frame
   */
  private createMainFrame(): void {
    if (!this.gui) return;

    // Create main frame
    this.frame = new Instance("Frame");
    this.frame.Name = "PropertiesFrame";
    this.frame.Size = new UDim2(0, 200, 0, 300);
    this.frame.Position = new UDim2(0, 270, 1, -310); // Next to Link Types GUI
    this.frame.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
    this.frame.BorderSizePixel = 2;
    this.frame.BorderColor3 = new Color3(0.4, 0.4, 0.4);
    this.frame.Parent = this.gui;

    // Add corner radius
    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 8);
    corner.Parent = this.frame;

    // Create header for dragging
    const header = new Instance("TextLabel");
    header.Name = "Header";
    header.Size = new UDim2(1, 0, 0, 30);
    header.Position = new UDim2(0, 0, 0, 0);
    header.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
    header.BorderSizePixel = 0;
    header.Text = "Properties";
    header.TextColor3 = new Color3(1, 1, 1);
    header.TextScaled = true;
    header.Font = Enum.Font.SourceSansBold;
    header.Parent = this.frame;

    // Add header corner radius
    const headerCorner = new Instance("UICorner");
    headerCorner.CornerRadius = new UDim(0, 8);
    headerCorner.Parent = header;

    // Make header draggable
    this.setupDragging(header);

    // Create scrolling frame for content
    const scrollFrame = new Instance("ScrollingFrame");
    scrollFrame.Name = "ContentScroll";
    scrollFrame.Size = new UDim2(1, -10, 1, -40);
    scrollFrame.Position = new UDim2(0, 5, 0, 35);
    scrollFrame.BackgroundTransparency = 1;
    scrollFrame.BorderSizePixel = 0;
    scrollFrame.ScrollBarThickness = 6;
    scrollFrame.CanvasSize = new UDim2(0, 0, 0, 0);
    scrollFrame.Parent = this.frame;
  }

  /**
   * Sets up dragging functionality
   */
  private setupDragging(header: TextLabel): void {
    const userInputService = game.GetService("UserInputService");

    // Mouse button down
    header.InputBegan.Connect((input) => {
      if (input.UserInputType === Enum.UserInputType.MouseButton1) {
        this.isDragging = true;
        this.dragStart = new Vector2(input.Position.X, input.Position.Y);
        this.dragStartPos = this.frame!.Position;
      }
    });

    // Mouse button up
    userInputService.InputEnded.Connect((input) => {
      if (input.UserInputType === Enum.UserInputType.MouseButton1) {
        this.isDragging = false;
      }
    });

    // Mouse movement
    userInputService.InputChanged.Connect((input) => {
      if (this.isDragging && input.UserInputType === Enum.UserInputType.MouseMovement && this.frame && this.dragStart && this.dragStartPos) {
        const delta = new Vector2(input.Position.X, input.Position.Y).sub(this.dragStart);
        this.frame.Position = new UDim2(
          this.dragStartPos.X.Scale,
          this.dragStartPos.X.Offset + delta.X,
          this.dragStartPos.Y.Scale,
          this.dragStartPos.Y.Offset + delta.Y
        );
      }
    });
  }

  /**
   * Populates the GUI with property values
   */
  private populateProperties(): void {
    if (!this.frame || !this.propertyInfo) return;

    const scrollFrame = this.frame.FindFirstChild("ContentScroll") as ScrollingFrame;
    if (!scrollFrame) return;

    // Clear existing content
    scrollFrame.GetChildren().forEach((child) => {
      if (child.IsA("Frame") || child.IsA("TextLabel")) {
        child.Destroy();
      }
    });

    let yPos = 5;
    const rowHeight = 25;
    const spacing = 5;

    // Create property name header
    const propertyHeader = new Instance("TextLabel");
    propertyHeader.Name = "PropertyHeader";
    propertyHeader.Size = new UDim2(1, -10, 0, rowHeight + 5);
    propertyHeader.Position = new UDim2(0, 5, 0, yPos);
    propertyHeader.BackgroundColor3 = new Color3(0.15, 0.15, 0.3);
    propertyHeader.BorderSizePixel = 1;
    propertyHeader.BorderColor3 = new Color3(0.3, 0.3, 0.5);
    propertyHeader.Text = this.propertyInfo.propertyName;
    propertyHeader.TextColor3 = new Color3(1, 1, 1);
    propertyHeader.TextScaled = true;
    propertyHeader.Font = Enum.Font.SourceSansBold;
    propertyHeader.Parent = scrollFrame;

    yPos += rowHeight + spacing + 10;

    // Create rows for each value
    this.propertyInfo.values.forEach((value, index) => {
      const valueFrame = new Instance("Frame");
      valueFrame.Name = `Value_${index}`;
      valueFrame.Size = new UDim2(1, -10, 0, rowHeight);
      valueFrame.Position = new UDim2(0, 5, 0, yPos);
      valueFrame.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
      valueFrame.BorderSizePixel = 1;
      valueFrame.BorderColor3 = new Color3(0.3, 0.3, 0.3);
      valueFrame.Parent = scrollFrame;

      const valueLabel = new Instance("TextLabel");
      valueLabel.Size = new UDim2(1, -10, 1, 0);
      valueLabel.Position = new UDim2(0, 5, 0, 0);
      valueLabel.BackgroundTransparency = 1;
      valueLabel.Text = value;
      valueLabel.TextColor3 = new Color3(0.9, 0.9, 0.9);
      valueLabel.TextScaled = true;
      valueLabel.Font = Enum.Font.SourceSans;
      valueLabel.TextXAlignment = Enum.TextXAlignment.Left;
      valueLabel.Parent = valueFrame;

      yPos += rowHeight + spacing;
    });

    // Update canvas size
    scrollFrame.CanvasSize = new UDim2(0, 0, 0, yPos);
  }

  /**
   * Updates the displayed property information
   */
  public updatePropertyInfo(propertyInfo: PropertyInfo): void {
    this.propertyInfo = propertyInfo;
    this.populateProperties();
  }

  /**
   * Destroys the GUI
   */
  public destroy(): void {
    if (this.gui) {
      this.gui.Destroy();
      this.gui = undefined;
      this.frame = undefined;
    }
  }
}