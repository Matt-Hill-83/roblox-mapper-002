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

export interface PropertiesData {
  [propertyName: string]: string[];
}

export interface FilterState {
  [propertyName: string]: Set<string>;
}

export class PropertiesGuiService extends BaseService {
  private gui?: ScreenGui;
  private frame?: Frame;
  private propertiesData?: PropertiesData;
  private filterState: FilterState = {};
  private toggleButtons: Map<string, TextButton> = new Map();
  private isDragging = false;
  private dragStart?: Vector2;
  private dragStartPos?: UDim2;
  private onFilterChange?: (filters: FilterState) => void;
  private isCollapsed = false;
  private expandedSize?: UDim2;
  private scrollFrame?: ScrollingFrame;

  constructor() {
    super("PropertiesGuiService");
  }

  /**
   * Check if GUI is already created
   */
  public isGuiCreated(): boolean {
    return this.gui !== undefined && this.frame !== undefined;
  }

  /**
   * Creates the properties GUI
   */
  public createGUI(propertiesData: PropertiesData, onFilterChange?: (filters: FilterState) => void): void {
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

    // Store property data and callback
    this.propertiesData = propertiesData;
    this.onFilterChange = onFilterChange;

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

    // Create main frame - full height and twice as wide
    this.frame = new Instance("Frame");
    this.frame.Name = "PropertiesFrame";
    this.frame.Size = new UDim2(0, 1200, 1, -20); // Twice as wide (was 600)
    this.frame.Position = new UDim2(0, 270, 0, 10); // Next to Link Types GUI, top of screen
    this.expandedSize = this.frame.Size; // Store expanded size
    this.frame.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
    this.frame.BorderSizePixel = 2;
    this.frame.BorderColor3 = new Color3(0.4, 0.4, 0.4);
    this.frame.Parent = this.gui;

    // Add corner radius
    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 8);
    corner.Parent = this.frame;

    // Create header frame for dragging
    const headerFrame = new Instance("Frame");
    headerFrame.Name = "HeaderFrame";
    headerFrame.Size = new UDim2(1, 0, 0, 30);
    headerFrame.Position = new UDim2(0, 0, 0, 0);
    headerFrame.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
    headerFrame.BorderSizePixel = 0;
    headerFrame.Parent = this.frame;

    // Create header label
    const header = new Instance("TextLabel");
    header.Name = "Header";
    header.Size = new UDim2(1, -30, 1, 0);
    header.Position = new UDim2(0, 0, 0, 0);
    header.BackgroundTransparency = 1;
    header.Text = "Properties";
    header.TextColor3 = new Color3(1, 1, 1);
    header.TextSize = 18; // Slightly smaller
    header.Font = Enum.Font.SourceSansBold;
    header.Parent = headerFrame;

    // Create collapse button
    const collapseButton = new Instance("TextButton");
    collapseButton.Name = "CollapseButton";
    collapseButton.Size = new UDim2(0, 30, 1, 0);
    collapseButton.Position = new UDim2(1, -30, 0, 0);
    collapseButton.BackgroundTransparency = 1;
    collapseButton.Text = "−"; // Minus sign for expanded state
    collapseButton.TextColor3 = new Color3(1, 1, 1);
    collapseButton.TextScaled = true;
    collapseButton.Font = Enum.Font.SourceSansBold;
    collapseButton.Parent = headerFrame;

    // Add header corner radius
    const headerCorner = new Instance("UICorner");
    headerCorner.CornerRadius = new UDim(0, 8);
    headerCorner.Parent = headerFrame;

    // Make header draggable
    this.setupDragging(headerFrame);
    
    // Setup collapse functionality
    this.setupCollapse(collapseButton);

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
    this.scrollFrame = scrollFrame;
  }

  /**
   * Sets up dragging functionality
   */
  private setupDragging(header: Frame): void {
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
   * Sets up collapse/expand functionality
   */
  private setupCollapse(button: TextButton): void {
    button.MouseButton1Click.Connect(() => {
      if (!this.frame || !this.scrollFrame) return;
      
      this.isCollapsed = !this.isCollapsed;
      
      if (this.isCollapsed) {
        // Collapse to just header
        this.frame.Size = new UDim2(0, 200, 0, 30);
        this.scrollFrame.Visible = false;
        button.Text = "+";
      } else {
        // Expand to full size
        this.frame.Size = this.expandedSize!;
        this.scrollFrame.Visible = true;
        button.Text = "−";
      }
    });
  }

  /**
   * Populates the GUI with property values in a 2D grid
   */
  private populateProperties(): void {
    if (!this.frame || !this.propertiesData) return;

    const scrollFrame = this.frame.FindFirstChild("ContentScroll") as ScrollingFrame;
    if (!scrollFrame) return;

    // Clear existing content
    scrollFrame.GetChildren().forEach((child) => {
      if (child.IsA("Frame") || child.IsA("TextLabel")) {
        child.Destroy();
      }
    });

    // Clear toggle buttons
    this.toggleButtons.clear();

    // Get all properties, excluding system ones
    const properties: string[] = [];
    const systemProps = new Set(["treeLevel", "size", "path"]);
    
    for (const [propName, _] of pairs(this.propertiesData)) {
      if (typeIs(propName, "string") && !systemProps.has(propName)) {
        properties.push(propName);
      }
    }
    properties.sort();

    const columnWidth = 120;
    const headerHeight = 30;
    const buttonHeight = 25;
    const spacing = 5;
    const columnPadding = 10;

    // Create columns for each property
    properties.forEach((propName, colIndex) => {
      const xPos = colIndex * (columnWidth + columnPadding) + spacing;
      
      // Create property header
      const headerLabel = new Instance("TextLabel");
      headerLabel.Name = `Header_${propName}`;
      headerLabel.Size = new UDim2(0, columnWidth, 0, headerHeight);
      headerLabel.Position = new UDim2(0, xPos, 0, spacing);
      headerLabel.BackgroundColor3 = new Color3(0.15, 0.15, 0.3);
      headerLabel.BorderSizePixel = 1;
      headerLabel.BorderColor3 = new Color3(0.3, 0.3, 0.5);
      headerLabel.Text = propName;
      headerLabel.TextColor3 = new Color3(1, 1, 1);
      headerLabel.TextSize = 16; // Reduced from default ~18
      headerLabel.Font = Enum.Font.SourceSansBold;
      headerLabel.Parent = scrollFrame;

      // Initialize filter state for this property
      if (!this.filterState[propName]) {
        this.filterState[propName] = new Set<string>();
      }

      // Create toggle buttons for each value
      const values = this.propertiesData ? this.propertiesData[propName] || [] : [];
      values.forEach((value, valueIndex) => {
        const yPos = headerHeight + spacing * 2 + valueIndex * (buttonHeight + spacing);
        
        const toggleButton = new Instance("TextButton");
        toggleButton.Name = `Toggle_${propName}_${value}`;
        toggleButton.Size = new UDim2(0, columnWidth, 0, buttonHeight);
        toggleButton.Position = new UDim2(0, xPos, 0, yPos);
        toggleButton.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
        toggleButton.BorderSizePixel = 1;
        toggleButton.BorderColor3 = new Color3(0.4, 0.4, 0.4);
        toggleButton.Text = value;
        toggleButton.TextColor3 = new Color3(1, 1, 1);
        toggleButton.TextSize = 12; // Reduced from default ~14
        toggleButton.Font = Enum.Font.SourceSans;
        toggleButton.Parent = scrollFrame;

        // Store button reference
        const buttonKey = `${propName}:${value}`;
        this.toggleButtons.set(buttonKey, toggleButton);
        
        // Restore filter state if this value was filtered
        if (this.filterState[propName] && this.filterState[propName].has(value)) {
          toggleButton.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
          toggleButton.TextColor3 = new Color3(0.5, 0.5, 0.5);
        }

        // Add click handler
        toggleButton.MouseButton1Click.Connect(() => {
          this.toggleFilter(propName, value, toggleButton);
        });
      });
    });

    // Update canvas size
    const totalWidth = properties.size() * (columnWidth + columnPadding);
    const maxValues = math.max(...properties.map(p => (this.propertiesData![p] || []).size()));
    const totalHeight = headerHeight + spacing * 2 + maxValues * (buttonHeight + spacing);
    
    scrollFrame.CanvasSize = new UDim2(0, totalWidth, 0, totalHeight);
  }

  /**
   * Toggle a filter value
   */
  private toggleFilter(propertyName: string, value: string, button: TextButton): void {
    if (!this.filterState[propertyName]) {
      this.filterState[propertyName] = new Set<string>();
    }

    const filterSet = this.filterState[propertyName];
    
    if (filterSet.has(value)) {
      // Remove from filter (unfiltered)
      filterSet.delete(value);
      button.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
      button.TextColor3 = new Color3(1, 1, 1);
    } else {
      // Add to filter (filtered out)
      filterSet.add(value);
      button.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
      button.TextColor3 = new Color3(0.5, 0.5, 0.5);
    }

    // Notify of filter change
    if (this.onFilterChange) {
      this.onFilterChange(this.filterState);
    }
  }

  /**
   * Updates the displayed property information
   */
  public updatePropertiesData(propertiesData: PropertiesData): void {
    this.propertiesData = propertiesData;
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