import { Players } from "@rbxts/services";
import type { AxisMapping } from "../../../../shared/interfaces/enhancedGenerator.interface";

interface AxisMappingControlsProps {
  parent: Frame;
  axisMapping?: AxisMapping;
  onAxisMappingChange: (axis: "xAxis" | "zAxis", value: string) => void;
}

// Available properties for axis mapping
const AVAILABLE_PROPERTIES = ["type", "petType", "petColor", "age", "firstName", "lastName", "countryOfBirth", "countryOfResidence"];

// Store reference to the shared GUI
let axisDropdownGUI: ScreenGui | undefined;

export function createAxisMappingControls({
  parent,
  axisMapping,
  onAxisMappingChange
}: AxisMappingControlsProps): void {
  // Provide default axis mapping if not provided
  const mapping = axisMapping || {
    xAxis: "type",
    zAxis: "petType"
  };
  
  // Create or get the shared AxisDropdownGUI
  const player = Players.LocalPlayer;
  const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
  
  if (!axisDropdownGUI) {
    axisDropdownGUI = new Instance("ScreenGui");
    axisDropdownGUI.Name = "AxisDropdownGUI";
    axisDropdownGUI.ResetOnSpawn = false;
    axisDropdownGUI.Parent = playerGui;
  }
  
  // Create a single compact frame for both axis controls
  createCompactAxisControls({
    gui: axisDropdownGUI,
    xAxisValue: mapping.xAxis,
    zAxisValue: mapping.zAxis,
    onXAxisChange: (value) => onAxisMappingChange("xAxis", value),
    onZAxisChange: (value) => onAxisMappingChange("zAxis", value)
  });
}

interface CompactAxisControlsProps {
  gui: ScreenGui;
  xAxisValue: string;
  zAxisValue: string;
  onXAxisChange: (value: string) => void;
  onZAxisChange: (value: string) => void;
}

// Create compact axis controls
function createCompactAxisControls({
  gui,
  xAxisValue,
  zAxisValue,
  onXAxisChange,
  onZAxisChange
}: CompactAxisControlsProps): void {
  // Create main container frame
  const mainFrame = new Instance("Frame");
  mainFrame.Name = "AxisControlsFrame";
  mainFrame.Size = new UDim2(0, 200, 0, 70); // Compact height
  mainFrame.Position = new UDim2(0, 10, 0.5, -35); // Centered vertically
  mainFrame.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
  mainFrame.BorderSizePixel = 0;
  mainFrame.Parent = gui;

  const frameCorner = new Instance("UICorner");
  frameCorner.CornerRadius = new UDim(0, 8);
  frameCorner.Parent = mainFrame;

  // X-axis row
  const xAxisLabel = new Instance("TextLabel");
  xAxisLabel.Name = "XAxisLabel";
  xAxisLabel.Text = "x-axis:";
  xAxisLabel.Position = new UDim2(0, 10, 0, 10);
  xAxisLabel.Size = new UDim2(0, 50, 0, 20);
  xAxisLabel.BackgroundTransparency = 1;
  xAxisLabel.TextColor3 = new Color3(0.8, 0.8, 0.8);
  xAxisLabel.Font = Enum.Font.SourceSans;
  xAxisLabel.TextSize = 14;
  xAxisLabel.TextXAlignment = Enum.TextXAlignment.Left;
  xAxisLabel.Parent = mainFrame;

  const xAxisButton = new Instance("TextButton");
  xAxisButton.Name = "XAxisButton";
  xAxisButton.Text = xAxisValue;
  xAxisButton.Position = new UDim2(0, 65, 0, 10);
  xAxisButton.Size = new UDim2(0, 125, 0, 20);
  xAxisButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  xAxisButton.BorderSizePixel = 0;
  xAxisButton.TextColor3 = new Color3(1, 1, 1);
  xAxisButton.Font = Enum.Font.SourceSans;
  xAxisButton.TextSize = 14;
  xAxisButton.Parent = mainFrame;

  const xButtonCorner = new Instance("UICorner");
  xButtonCorner.CornerRadius = new UDim(0, 4);
  xButtonCorner.Parent = xAxisButton;

  // Z-axis row
  const zAxisLabel = new Instance("TextLabel");
  zAxisLabel.Name = "ZAxisLabel";
  zAxisLabel.Text = "z-axis:";
  zAxisLabel.Position = new UDim2(0, 10, 0, 40);
  zAxisLabel.Size = new UDim2(0, 50, 0, 20);
  zAxisLabel.BackgroundTransparency = 1;
  zAxisLabel.TextColor3 = new Color3(0.8, 0.8, 0.8);
  zAxisLabel.Font = Enum.Font.SourceSans;
  zAxisLabel.TextSize = 14;
  zAxisLabel.TextXAlignment = Enum.TextXAlignment.Left;
  zAxisLabel.Parent = mainFrame;

  const zAxisButton = new Instance("TextButton");
  zAxisButton.Name = "ZAxisButton";
  zAxisButton.Text = zAxisValue;
  zAxisButton.Position = new UDim2(0, 65, 0, 40);
  zAxisButton.Size = new UDim2(0, 125, 0, 20);
  zAxisButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  zAxisButton.BorderSizePixel = 0;
  zAxisButton.TextColor3 = new Color3(1, 1, 1);
  zAxisButton.Font = Enum.Font.SourceSans;
  zAxisButton.TextSize = 14;
  zAxisButton.Parent = mainFrame;

  const zButtonCorner = new Instance("UICorner");
  zButtonCorner.CornerRadius = new UDim(0, 4);
  zButtonCorner.Parent = zAxisButton;

  // Create dropdown functionality for X-axis
  createDropdownForButton(xAxisButton, xAxisValue, onXAxisChange, mainFrame, true);
  
  // Create dropdown functionality for Z-axis
  createDropdownForButton(zAxisButton, zAxisValue, onZAxisChange, mainFrame, false);
}

function createDropdownForButton(
  button: TextButton, 
  currentValue: string, 
  onChange: (value: string) => void,
  parent: Frame,
  isXAxis: boolean
): void {
  let isOpen = false;
  let optionsFrame: Frame | undefined;

  button.MouseButton1Click.Connect(() => {
    if (!isOpen) {
      // Create options frame
      optionsFrame = new Instance("Frame");
      optionsFrame.Name = isXAxis ? "XAxisOptions" : "ZAxisOptions";
      optionsFrame.Position = new UDim2(0, isXAxis ? 65 : 65, 0, isXAxis ? 30 : 60);
      optionsFrame.Size = new UDim2(0, 125, 0, math.min(AVAILABLE_PROPERTIES.size() * 20, 160));
      optionsFrame.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
      optionsFrame.BorderSizePixel = 0;
      optionsFrame.ZIndex = 10;
      optionsFrame.Parent = parent;

      const optionsCorner = new Instance("UICorner");
      optionsCorner.CornerRadius = new UDim(0, 4);
      optionsCorner.Parent = optionsFrame;

      // Create scrolling frame if needed
      const scrollFrame = new Instance("ScrollingFrame");
      scrollFrame.Size = new UDim2(1, 0, 1, 0);
      scrollFrame.Position = new UDim2(0, 0, 0, 0);
      scrollFrame.BackgroundTransparency = 1;
      scrollFrame.BorderSizePixel = 0;
      scrollFrame.ScrollBarThickness = 4;
      scrollFrame.CanvasSize = new UDim2(0, 0, 0, AVAILABLE_PROPERTIES.size() * 20);
      scrollFrame.Parent = optionsFrame;

      // Create option buttons
      AVAILABLE_PROPERTIES.forEach((property, index) => {
        const optionButton = new Instance("TextButton");
        optionButton.Name = `Option_${property}`;
        optionButton.Text = property;
        optionButton.Position = new UDim2(0, 0, 0, index * 20);
        optionButton.Size = new UDim2(1, -4, 0, 20);
        optionButton.BackgroundTransparency = 1;
        optionButton.TextColor3 = new Color3(0.9, 0.9, 0.9);
        optionButton.Font = Enum.Font.SourceSans;
        optionButton.TextSize = 14;
        optionButton.BorderSizePixel = 0;
        optionButton.ZIndex = 100;
        optionButton.Parent = scrollFrame;

        // Hover effect
        optionButton.MouseEnter.Connect(() => {
          optionButton.BackgroundTransparency = 0;
          optionButton.BackgroundColor3 = new Color3(0.35, 0.35, 0.35);
        });

        optionButton.MouseLeave.Connect(() => {
          optionButton.BackgroundTransparency = 1;
        });

        // Selection
        optionButton.MouseButton1Click.Connect(() => {
          button.Text = property;
          onChange(property);
          if (optionsFrame) {
            optionsFrame.Destroy();
            optionsFrame = undefined;
          }
          isOpen = false;
        });
      });

      isOpen = true;
    } else {
      // Close dropdown
      if (optionsFrame) {
        optionsFrame.Destroy();
        optionsFrame = undefined;
      }
      isOpen = false;
    }
  });

  // Close when clicking elsewhere
  game.GetService("UserInputService").InputBegan.Connect((input) => {
    if (input.UserInputType === Enum.UserInputType.MouseButton1 && isOpen && optionsFrame) {
      wait(0.1);
      optionsFrame.Destroy();
      optionsFrame = undefined;
      isOpen = false;
    }
  });
}

