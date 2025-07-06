/**
 * Color Picker Controller
 * 
 * Provides a collapsible GUI for selecting multiple Roblox BrickColors
 * and outputs them as a TypeScript-compatible Color3 array.
 */

import { Players } from "@rbxts/services";

// GUI configuration
const GUI_CONFIG = {
  HEADER: {
    SIZE: new UDim2(0, 200, 0, 40),
    POSITION: new UDim2(0, 20, 1, -60), // Lower left corner
    COLOR: new Color3(0.2, 0.2, 0.2)
  },
  EXPANDED: {
    SIZE: new UDim2(0, 400, 0, 500),
    POSITION: new UDim2(0, 20, 1, -520) // Expands upward
  },
  BUTTON: {
    SIZE: new UDim2(0, 30, 0, 30),
    GRID_COLUMNS: 10,
    SELECTION_BORDER: {
      COLOR: new Color3(1, 1, 0), // Yellow
      SIZE: 3
    }
  },
  CONTROLS: {
    BUTTON_HEIGHT: 35,
    BUTTON_WIDTH: 80,
    PADDING: 10
  }
};

interface ColorButton {
  button: TextButton;
  brickColor: BrickColor;
  isSelected: boolean;
}

// Standard Roblox BrickColor names mapped to their numbers
const ROBLOX_BRICK_COLORS = [
  { name: "White", number: 1 },
  { name: "Grey", number: 2 },
  { name: "Light yellow", number: 3 },
  { name: "Brick yellow", number: 5 },
  { name: "Light green (Mint)", number: 6 },
  { name: "Light reddish violet", number: 9 },
  { name: "Pastel Blue", number: 11 },
  { name: "Light orange brown", number: 12 },
  { name: "Nougat", number: 18 },
  { name: "Bright red", number: 21 },
  { name: "Med. reddish violet", number: 22 },
  { name: "Bright blue", number: 23 },
  { name: "Bright yellow", number: 24 },
  { name: "Earth orange", number: 25 },
  { name: "Black", number: 26 },
  { name: "Dark grey", number: 27 },
  { name: "Dark green", number: 28 },
  { name: "Medium green", number: 29 },
  { name: "Lig. Yellowich orange", number: 36 },
  { name: "Bright green", number: 37 },
  { name: "Dark orange", number: 38 },
  { name: "Light bluish violet", number: 39 },
  { name: "Transparent", number: 40 },
  { name: "Tr. Red", number: 41 },
  { name: "Tr. Lg blue", number: 42 },
  { name: "Tr. Blue", number: 43 },
  { name: "Tr. Yellow", number: 44 },
  { name: "Light blue", number: 45 },
  { name: "Tr. Flu. Reddish orange", number: 47 },
  { name: "Tr. Green", number: 48 },
  { name: "Tr. Flu. Green", number: 49 },
  { name: "Phosph. White", number: 50 },
  { name: "Light red", number: 100 },
  { name: "Medium red", number: 101 },
  { name: "Medium blue", number: 102 },
  { name: "Light grey", number: 103 },
  { name: "Bright violet", number: 104 },
  { name: "Br. yellowish orange", number: 105 },
  { name: "Bright orange", number: 106 },
  { name: "Bright bluish green", number: 107 },
  { name: "Earth yellow", number: 108 },
  { name: "Bright bluish violet", number: 110 },
  { name: "Tr. Brown", number: 111 },
  { name: "Medium bluish violet", number: 112 },
  { name: "Tr. Medi. reddish violet", number: 113 },
  { name: "Med. yellowish green", number: 115 },
  { name: "Med. bluish green", number: 116 },
  { name: "Light bluish green", number: 118 },
  { name: "Br. yellowish green", number: 119 },
  { name: "Lig. yellowish green", number: 120 },
  { name: "Med. yellowish orange", number: 121 },
  { name: "Br. reddish orange", number: 123 },
  { name: "Bright reddish violet", number: 124 },
  { name: "Light orange", number: 125 },
  { name: "Tr. Bright bluish violet", number: 126 },
  { name: "Gold", number: 127 },
  { name: "Dark nougat", number: 128 },
  { name: "Silver", number: 131 },
  { name: "Neon orange", number: 133 },
  { name: "Neon green", number: 134 },
  { name: "Sand blue", number: 135 },
  { name: "Sand violet", number: 136 },
  { name: "Medium orange", number: 137 },
  { name: "Sand yellow", number: 138 },
  { name: "Earth blue", number: 140 },
  { name: "Earth green", number: 141 },
  { name: "Tr. Flu. Blue", number: 143 },
  { name: "Sand blue metallic", number: 145 },
  { name: "Sand violet metallic", number: 146 },
  { name: "Sand yellow metallic", number: 147 },
  { name: "Dark grey metallic", number: 148 },
  { name: "Black metallic", number: 149 },
  { name: "Light grey metallic", number: 150 },
  { name: "Sand green", number: 151 },
  { name: "Sand red", number: 153 },
  { name: "Dark red", number: 154 },
  { name: "Tr. Flu. Yellow", number: 157 },
  { name: "Tr. Flu. Red", number: 158 },
  { name: "Gun metallic", number: 168 },
  { name: "Red flip/flop", number: 176 },
  { name: "Yellow flip/flop", number: 177 },
  { name: "Silver flip/flop", number: 178 },
  { name: "Curry", number: 180 },
  { name: "Fire Yellow", number: 190 },
  { name: "Flame yellowish orange", number: 191 },
  { name: "Reddish brown", number: 192 },
  { name: "Flame reddish orange", number: 193 },
  { name: "Medium stone grey", number: 194 },
  { name: "Royal blue", number: 195 },
  { name: "Dark Royal blue", number: 196 },
  { name: "Bright reddish lilac", number: 198 },
  { name: "Dark stone grey", number: 199 },
  { name: "Lemon metalic", number: 200 },
  { name: "Light stone grey", number: 208 },
  { name: "Dark Curry", number: 209 },
  { name: "Faded green", number: 210 },
  { name: "Turquoise", number: 211 },
  { name: "Light Royal blue", number: 212 },
  { name: "Medium Royal blue", number: 213 },
  { name: "Rust", number: 216 },
  { name: "Brown", number: 217 },
  { name: "Reddish lilac", number: 218 },
  { name: "Lilac", number: 219 },
  { name: "Light lilac", number: 221 },
  { name: "Bright purple", number: 222 },
  { name: "Light purple", number: 223 },
  { name: "Light pink", number: 225 },
  { name: "Light brick yellow", number: 226 },
  { name: "Warm yellowish orange", number: 231 },
  { name: "Cool yellow", number: 226 },
  { name: "Dove blue", number: 232 },
  { name: "Medium lilac", number: 268 }
];

export class ColorPickerController {
  private gui?: ScreenGui;
  private headerFrame?: Frame;
  private contentFrame?: Frame;
  private colorGrid?: ScrollingFrame;
  private toggleButton?: TextButton;
  private outputButton?: TextButton;
  private clearButton?: TextButton;
  private selectionLabel?: TextLabel;
  
  private selectedColors: Map<string, BrickColor> = new Map();
  private colorButtons: Map<string, ColorButton> = new Map();
  private isExpanded = false;

  /**
   * Initializes the color picker GUI
   */
  public initialize(): void {
    print("🎨 Initializing Color Picker...");
    this.createGUI();
  }

  /**
   * Creates the main GUI structure
   */
  private createGUI(): void {
    const player = Players.LocalPlayer;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

    // Create ScreenGui
    this.gui = new Instance("ScreenGui");
    this.gui.Name = "ColorPickerGUI";
    this.gui.ResetOnSpawn = false;

    // Create header frame (always visible)
    this.createHeader();

    // Create content frame (collapsible)
    this.createContent();

    // Parent to PlayerGui
    this.gui.Parent = playerGui;

    print("✅ Color Picker GUI created");
  }

  /**
   * Creates the header frame with toggle button
   */
  private createHeader(): void {
    if (!this.gui) return;

    this.headerFrame = new Instance("Frame");
    this.headerFrame.Size = GUI_CONFIG.HEADER.SIZE;
    this.headerFrame.Position = GUI_CONFIG.HEADER.POSITION;
    this.headerFrame.BackgroundColor3 = GUI_CONFIG.HEADER.COLOR;
    this.headerFrame.BorderSizePixel = 0;
    this.headerFrame.Parent = this.gui;

    // Add corner rounding
    const headerCorner = new Instance("UICorner");
    headerCorner.CornerRadius = new UDim(0, 8);
    headerCorner.Parent = this.headerFrame;

    // Create title label
    const titleLabel = new Instance("TextLabel");
    titleLabel.Size = new UDim2(0.7, 0, 1, 0);
    titleLabel.Position = new UDim2(0, 10, 0, 0);
    titleLabel.Text = "Color Picker";
    titleLabel.TextColor3 = new Color3(1, 1, 1);
    titleLabel.TextScaled = true;
    titleLabel.BackgroundTransparency = 1;
    titleLabel.Font = Enum.Font.SourceSansBold;
    titleLabel.TextXAlignment = Enum.TextXAlignment.Left;
    titleLabel.Parent = this.headerFrame;

    // Create toggle button
    this.toggleButton = new Instance("TextButton");
    this.toggleButton.Size = new UDim2(0, 30, 0, 30);
    this.toggleButton.Position = new UDim2(1, -35, 0.5, -15);
    this.toggleButton.Text = "▶";
    this.toggleButton.TextColor3 = new Color3(1, 1, 1);
    this.toggleButton.TextScaled = true;
    this.toggleButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
    this.toggleButton.BorderSizePixel = 0;
    this.toggleButton.Parent = this.headerFrame;

    // Add corner rounding to button
    const buttonCorner = new Instance("UICorner");
    buttonCorner.CornerRadius = new UDim(0, 4);
    buttonCorner.Parent = this.toggleButton;

    // Connect toggle event
    this.toggleButton.MouseButton1Click.Connect(() => this.toggleCollapse());
  }

  /**
   * Creates the expandable content frame
   */
  private createContent(): void {
    if (!this.gui) return;

    this.contentFrame = new Instance("Frame");
    this.contentFrame.Size = GUI_CONFIG.EXPANDED.SIZE;
    this.contentFrame.Position = GUI_CONFIG.EXPANDED.POSITION;
    this.contentFrame.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
    this.contentFrame.BorderSizePixel = 0;
    this.contentFrame.Visible = false;
    this.contentFrame.Parent = this.gui;

    // Add corner rounding
    const contentCorner = new Instance("UICorner");
    contentCorner.CornerRadius = new UDim(0, 8);
    contentCorner.Parent = this.contentFrame;

    // Create color grid
    this.createColorGrid();

    // Create control panel
    this.createControlPanel();
  }

  /**
   * Creates the scrollable color grid
   */
  private createColorGrid(): void {
    if (!this.contentFrame) return;

    // Create scrolling frame
    this.colorGrid = new Instance("ScrollingFrame");
    this.colorGrid.Size = new UDim2(1, -20, 1, -70);
    this.colorGrid.Position = new UDim2(0, 10, 0, 10);
    this.colorGrid.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
    this.colorGrid.BorderSizePixel = 0;
    this.colorGrid.ScrollBarThickness = 8;
    this.colorGrid.Parent = this.contentFrame;

    // Add UIGridLayout
    const gridLayout = new Instance("UIGridLayout");
    gridLayout.CellSize = new UDim2(0, GUI_CONFIG.BUTTON.SIZE.X.Offset, 0, GUI_CONFIG.BUTTON.SIZE.Y.Offset);
    gridLayout.CellPadding = new UDim2(0, 5, 0, 5);
    gridLayout.FillDirection = Enum.FillDirection.Horizontal;
    gridLayout.Parent = this.colorGrid;

    // Generate color buttons
    this.generateColorButtons();
  }

  /**
   * Generates buttons for all BrickColors
   */
  private generateColorButtons(): void {
    if (!this.colorGrid) return;

    // Use the predefined Roblox BrickColor names
    ROBLOX_BRICK_COLORS.forEach((colorData) => {
      // Create BrickColor from number
      const [success, brickColor] = pcall(() => new BrickColor(colorData.number));
      if (success && brickColor) {
        const button = this.createColorButton(brickColor, colorData.name);
        
        const colorButton: ColorButton = {
          button: button,
          brickColor: brickColor,
          isSelected: false
        };

        this.colorButtons.set(colorData.name, colorButton);
        button.Parent = this.colorGrid;
      } else {
        print(`⚠️ Failed to create BrickColor: ${colorData.name} (${colorData.number})`);
      }
    });

    // Adjust canvas size
    const gridLayout = this.colorGrid.FindFirstChildOfClass("UIGridLayout");
    if (gridLayout) {
      const rows = math.ceil(ROBLOX_BRICK_COLORS.size() / GUI_CONFIG.BUTTON.GRID_COLUMNS);
      const canvasHeight = rows * (GUI_CONFIG.BUTTON.SIZE.Y.Offset + 5);
      this.colorGrid.CanvasSize = new UDim2(0, 0, 0, canvasHeight);
    }
  }

  /**
   * Creates a single color button
   */
  private createColorButton(brickColor: BrickColor, displayName: string): TextButton {
    const button = new Instance("TextButton");
    button.Size = GUI_CONFIG.BUTTON.SIZE;
    button.BackgroundColor3 = brickColor.Color;
    button.BorderSizePixel = 2;
    button.BorderColor3 = new Color3(0, 0, 0);
    button.Text = "";
    button.Name = `Color_${displayName}`;

    // Add hover effect
    button.MouseEnter.Connect(() => {
      button.BorderColor3 = new Color3(0.5, 0.5, 0.5);
    });

    button.MouseLeave.Connect(() => {
      const colorButton = this.colorButtons.get(displayName);
      if (colorButton && !colorButton.isSelected) {
        button.BorderColor3 = new Color3(0, 0, 0);
      }
    });

    // Add click handler
    button.MouseButton1Click.Connect(() => {
      this.toggleColorSelection(displayName);
    });

    return button;
  }

  /**
   * Creates the control panel with buttons
   */
  private createControlPanel(): void {
    if (!this.contentFrame) return;

    // Create control frame
    const controlFrame = new Instance("Frame");
    controlFrame.Size = new UDim2(1, -20, 0, 50);
    controlFrame.Position = new UDim2(0, 10, 1, -60);
    controlFrame.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
    controlFrame.BorderSizePixel = 0;
    controlFrame.Parent = this.contentFrame;

    // Add corner rounding
    const controlCorner = new Instance("UICorner");
    controlCorner.CornerRadius = new UDim(0, 4);
    controlCorner.Parent = controlFrame;

    // Create selection counter
    this.selectionLabel = new Instance("TextLabel");
    this.selectionLabel.Size = new UDim2(0.3, 0, 1, 0);
    this.selectionLabel.Position = new UDim2(0, 10, 0, 0);
    this.selectionLabel.Text = "Selected: 0";
    this.selectionLabel.TextColor3 = new Color3(1, 1, 1);
    this.selectionLabel.TextScaled = true;
    this.selectionLabel.BackgroundTransparency = 1;
    this.selectionLabel.Font = Enum.Font.SourceSans;
    this.selectionLabel.TextXAlignment = Enum.TextXAlignment.Left;
    this.selectionLabel.Parent = controlFrame;

    // Create output button
    this.outputButton = new Instance("TextButton");
    this.outputButton.Size = new UDim2(0, GUI_CONFIG.CONTROLS.BUTTON_WIDTH, 0, GUI_CONFIG.CONTROLS.BUTTON_HEIGHT);
    this.outputButton.Position = new UDim2(1, -GUI_CONFIG.CONTROLS.BUTTON_WIDTH * 2 - GUI_CONFIG.CONTROLS.PADDING * 2, 0.5, -GUI_CONFIG.CONTROLS.BUTTON_HEIGHT / 2);
    this.outputButton.Text = "Output";
    this.outputButton.TextColor3 = new Color3(1, 1, 1);
    this.outputButton.TextScaled = true;
    this.outputButton.BackgroundColor3 = new Color3(0.2, 0.6, 0.2);
    this.outputButton.BorderSizePixel = 0;
    this.outputButton.Font = Enum.Font.SourceSansBold;
    this.outputButton.Parent = controlFrame;

    // Add corner rounding to output button
    const outputCorner = new Instance("UICorner");
    outputCorner.CornerRadius = new UDim(0, 4);
    outputCorner.Parent = this.outputButton;

    // Create clear button
    this.clearButton = new Instance("TextButton");
    this.clearButton.Size = new UDim2(0, GUI_CONFIG.CONTROLS.BUTTON_WIDTH, 0, GUI_CONFIG.CONTROLS.BUTTON_HEIGHT);
    this.clearButton.Position = new UDim2(1, -GUI_CONFIG.CONTROLS.BUTTON_WIDTH - GUI_CONFIG.CONTROLS.PADDING, 0.5, -GUI_CONFIG.CONTROLS.BUTTON_HEIGHT / 2);
    this.clearButton.Text = "Clear";
    this.clearButton.TextColor3 = new Color3(1, 1, 1);
    this.clearButton.TextScaled = true;
    this.clearButton.BackgroundColor3 = new Color3(0.6, 0.2, 0.2);
    this.clearButton.BorderSizePixel = 0;
    this.clearButton.Font = Enum.Font.SourceSansBold;
    this.clearButton.Parent = controlFrame;

    // Add corner rounding to clear button
    const clearCorner = new Instance("UICorner");
    clearCorner.CornerRadius = new UDim(0, 4);
    clearCorner.Parent = this.clearButton;

    // Connect button events
    this.outputButton.MouseButton1Click.Connect(() => this.outputColors());
    this.clearButton.MouseButton1Click.Connect(() => this.clearSelection());
  }

  /**
   * Toggles the GUI between expanded and collapsed states
   */
  private toggleCollapse(): void {
    this.isExpanded = !this.isExpanded;

    if (this.contentFrame) {
      this.contentFrame.Visible = this.isExpanded;
    }

    if (this.toggleButton) {
      this.toggleButton.Text = this.isExpanded ? "▼" : "▶";
    }
  }

  /**
   * Toggles color selection
   */
  private toggleColorSelection(colorName: string): void {
    const colorButton = this.colorButtons.get(colorName);
    if (!colorButton) return;

    colorButton.isSelected = !colorButton.isSelected;

    if (colorButton.isSelected) {
      this.selectedColors.set(colorName, colorButton.brickColor);
      colorButton.button.BorderColor3 = GUI_CONFIG.BUTTON.SELECTION_BORDER.COLOR;
      colorButton.button.BorderSizePixel = GUI_CONFIG.BUTTON.SELECTION_BORDER.SIZE;
    } else {
      this.selectedColors.delete(colorName);
      colorButton.button.BorderColor3 = new Color3(0, 0, 0);
      colorButton.button.BorderSizePixel = 2;
    }

    this.updateSelectionCount();
  }

  /**
   * Updates the selection counter display
   */
  private updateSelectionCount(): void {
    if (this.selectionLabel) {
      this.selectionLabel.Text = `Selected: ${this.selectedColors.size()}`;
    }
  }

  /**
   * Outputs selected colors to console
   */
  private outputColors(): void {
    if (this.selectedColors.size() === 0) {
      print("⚠️ No colors selected");
      return;
    }

    const output = this.formatOutput();
    print("\n🎨 Color Picker Output:");
    print("=====================");
    print(output);
    print("=====================\n");
  }

  /**
   * Formats the selected colors as TypeScript array
   */
  private formatOutput(): string {
    const colorNames: string[] = [];
    this.selectedColors.forEach((brickColor, colorName) => {
      colorNames.push(colorName);
    });

    const colorStrings: string[] = [];
    colorNames.forEach((colorName) => {
      colorStrings.push(`  "${colorName}"`);
    });

    return `const selectedBrickColors: string[] = [\n${colorStrings.join(",\n")}\n];`;
  }

  /**
   * Clears all color selections
   */
  private clearSelection(): void {
    this.colorButtons.forEach((colorButton) => {
      if (colorButton.isSelected) {
        colorButton.isSelected = false;
        colorButton.button.BorderColor3 = new Color3(0, 0, 0);
        colorButton.button.BorderSizePixel = 2;
      }
    });

    this.selectedColors.clear();
    this.updateSelectionCount();
    print("🧹 Selection cleared");
  }

  /**
   * Cleans up the GUI
   */
  public destroy(): void {
    if (this.gui) {
      this.gui.Destroy();
      this.gui = undefined;
    }
    
    this.selectedColors.clear();
    this.colorButtons.clear();
  }
}