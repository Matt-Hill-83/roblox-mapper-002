import { Players } from "@rbxts/services";
import type { AxisMapping, VisualMapping } from "../../../../shared/interfaces/enhancedGenerator.interface";

interface AxisMappingControlsProps {
  parent: Frame;
  axisMapping?: AxisMapping;
  visualMapping?: VisualMapping;
  useLayerForYAxis?: boolean;
  yAxisProperty?: string;
  onAxisMappingChange: (axis: "xAxis" | "zAxis", value: string) => void;
  onVisualMappingChange: (mapping: keyof VisualMapping, value: string) => void;
  onYAxisModeChange?: (useLayer: boolean) => void;
  onYAxisPropertyChange?: (property: string) => void;
}

// Available properties for axis mapping
const AVAILABLE_PROPERTIES = ["type", "petType", "petColor", "age", "firstName", "lastName", "countryOfBirth", "countryOfResidence"];

// Available properties for visual mapping (includes "none")
const VISUAL_PROPERTIES = ["none", "type", "petType", "petColor", "age", "firstName", "lastName", "countryOfBirth", "countryOfResidence"];

// Store reference to the shared GUI
let axisDropdownGUI: ScreenGui | undefined;

export function createAxisMappingControls({
  parent,
  axisMapping,
  visualMapping,
  useLayerForYAxis = true,
  yAxisProperty,
  onAxisMappingChange,
  onVisualMappingChange,
  onYAxisModeChange,
  onYAxisPropertyChange
}: AxisMappingControlsProps): void {
  // Provide default axis mapping if not provided
  const mapping = axisMapping || {
    xAxis: "type",
    zAxis: "petType"
  };
  
  // Provide default visual mapping if not provided
  const visMapping = visualMapping || {
    backgroundColor: "none",
    borderColor: "none"
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
  
  // Create a single compact frame for all controls
  createCompactAxisControls({
    gui: axisDropdownGUI,
    xAxisValue: mapping.xAxis,
    zAxisValue: mapping.zAxis,
    backgroundColorValue: visMapping.backgroundColor || "none",
    borderColorValue: visMapping.borderColor || "none",
    useLayerForYAxis: useLayerForYAxis,
    yAxisProperty: yAxisProperty,
    onXAxisChange: (value) => onAxisMappingChange("xAxis", value),
    onZAxisChange: (value) => onAxisMappingChange("zAxis", value),
    onBackgroundColorChange: (value) => onVisualMappingChange("backgroundColor", value),
    onBorderColorChange: (value) => onVisualMappingChange("borderColor", value),
    onYAxisModeChange: onYAxisModeChange,
    onYAxisPropertyChange: onYAxisPropertyChange
  });
}

interface CompactAxisControlsProps {
  gui: ScreenGui;
  xAxisValue: string;
  zAxisValue: string;
  backgroundColorValue: string;
  borderColorValue: string;
  useLayerForYAxis: boolean;
  yAxisProperty?: string;
  onXAxisChange: (value: string) => void;
  onZAxisChange: (value: string) => void;
  onBackgroundColorChange: (value: string) => void;
  onBorderColorChange: (value: string) => void;
  onYAxisModeChange?: (useLayer: boolean) => void;
  onYAxisPropertyChange?: (property: string) => void;
}

// Create compact axis controls
function createCompactAxisControls({
  gui,
  xAxisValue,
  zAxisValue,
  backgroundColorValue,
  borderColorValue,
  useLayerForYAxis,
  yAxisProperty,
  onXAxisChange,
  onZAxisChange,
  onBackgroundColorChange,
  onBorderColorChange,
  onYAxisModeChange,
  onYAxisPropertyChange
}: CompactAxisControlsProps): void {
  // Create main container frame
  const mainFrame = new Instance("Frame");
  mainFrame.Name = "AxisControlsFrame";
  mainFrame.Size = new UDim2(0, 300, 0, 250); // Increased height for Y-axis section
  mainFrame.Position = new UDim2(0, 10, 0.5, -125); // Centered vertically
  mainFrame.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
  mainFrame.BorderSizePixel = 0;
  mainFrame.Parent = gui;

  const frameCorner = new Instance("UICorner");
  frameCorner.CornerRadius = new UDim(0, 8);
  frameCorner.Parent = mainFrame;

  // Axis Mapping section label
  const axisSectionLabel = new Instance("TextLabel");
  axisSectionLabel.Name = "AxisSectionLabel";
  axisSectionLabel.Text = "Axis Mapping";
  axisSectionLabel.Position = new UDim2(0, 10, 0, 5);
  axisSectionLabel.Size = new UDim2(1, -20, 0, 15);
  axisSectionLabel.BackgroundTransparency = 1;
  axisSectionLabel.TextColor3 = new Color3(0.6, 0.6, 0.6);
  axisSectionLabel.Font = Enum.Font.SourceSans;
  axisSectionLabel.TextSize = 12;
  axisSectionLabel.TextXAlignment = Enum.TextXAlignment.Left;
  axisSectionLabel.Parent = mainFrame;

  // X-axis row
  const xAxisLabel = new Instance("TextLabel");
  xAxisLabel.Name = "XAxisLabel";
  xAxisLabel.Text = "x-axis:";
  xAxisLabel.Position = new UDim2(0, 10, 0, 25);
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
  xAxisButton.Position = new UDim2(0, 65, 0, 25);
  xAxisButton.Size = new UDim2(0, 180, 0, 20);
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
  zAxisLabel.Position = new UDim2(0, 10, 0, 50);
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
  zAxisButton.Position = new UDim2(0, 65, 0, 50);
  zAxisButton.Size = new UDim2(0, 180, 0, 20);
  zAxisButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  zAxisButton.BorderSizePixel = 0;
  zAxisButton.TextColor3 = new Color3(1, 1, 1);
  zAxisButton.Font = Enum.Font.SourceSans;
  zAxisButton.TextSize = 14;
  zAxisButton.Parent = mainFrame;

  const zButtonCorner = new Instance("UICorner");
  zButtonCorner.CornerRadius = new UDim(0, 4);
  zButtonCorner.Parent = zAxisButton;

  // Visual Customization section label
  const visualSectionLabel = new Instance("TextLabel");
  visualSectionLabel.Name = "VisualSectionLabel";
  visualSectionLabel.Text = "Visual Customization";
  visualSectionLabel.Position = new UDim2(0, 10, 0, 85);
  visualSectionLabel.Size = new UDim2(1, -20, 0, 15);
  visualSectionLabel.BackgroundTransparency = 1;
  visualSectionLabel.TextColor3 = new Color3(0.6, 0.6, 0.6);
  visualSectionLabel.Font = Enum.Font.SourceSans;
  visualSectionLabel.TextSize = 12;
  visualSectionLabel.TextXAlignment = Enum.TextXAlignment.Left;
  visualSectionLabel.Parent = mainFrame;

  // Background color row
  const bgColorLabel = new Instance("TextLabel");
  bgColorLabel.Name = "BgColorLabel";
  bgColorLabel.Text = "background:";
  bgColorLabel.Position = new UDim2(0, 10, 0, 105);
  bgColorLabel.Size = new UDim2(0, 80, 0, 20);
  bgColorLabel.BackgroundTransparency = 1;
  bgColorLabel.TextColor3 = new Color3(0.8, 0.8, 0.8);
  bgColorLabel.Font = Enum.Font.SourceSans;
  bgColorLabel.TextSize = 14;
  bgColorLabel.TextXAlignment = Enum.TextXAlignment.Left;
  bgColorLabel.Parent = mainFrame;

  const bgColorButton = new Instance("TextButton");
  bgColorButton.Name = "BgColorButton";
  bgColorButton.Text = backgroundColorValue;
  bgColorButton.Position = new UDim2(0, 95, 0, 105);
  bgColorButton.Size = new UDim2(0, 150, 0, 20);
  bgColorButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  bgColorButton.BorderSizePixel = 0;
  bgColorButton.TextColor3 = new Color3(1, 1, 1);
  bgColorButton.Font = Enum.Font.SourceSans;
  bgColorButton.TextSize = 14;
  bgColorButton.Parent = mainFrame;

  const bgButtonCorner = new Instance("UICorner");
  bgButtonCorner.CornerRadius = new UDim(0, 4);
  bgButtonCorner.Parent = bgColorButton;

  // Border color row
  const borderColorLabel = new Instance("TextLabel");
  borderColorLabel.Name = "BorderColorLabel";
  borderColorLabel.Text = "border:";
  borderColorLabel.Position = new UDim2(0, 10, 0, 130);
  borderColorLabel.Size = new UDim2(0, 80, 0, 20);
  borderColorLabel.BackgroundTransparency = 1;
  borderColorLabel.TextColor3 = new Color3(0.8, 0.8, 0.8);
  borderColorLabel.Font = Enum.Font.SourceSans;
  borderColorLabel.TextSize = 14;
  borderColorLabel.TextXAlignment = Enum.TextXAlignment.Left;
  borderColorLabel.Parent = mainFrame;

  const borderColorButton = new Instance("TextButton");
  borderColorButton.Name = "BorderColorButton";
  borderColorButton.Text = borderColorValue;
  borderColorButton.Position = new UDim2(0, 95, 0, 130);
  borderColorButton.Size = new UDim2(0, 150, 0, 20);
  borderColorButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  borderColorButton.BorderSizePixel = 0;
  borderColorButton.TextColor3 = new Color3(1, 1, 1);
  borderColorButton.Font = Enum.Font.SourceSans;
  borderColorButton.TextSize = 14;
  borderColorButton.Parent = mainFrame;

  const borderButtonCorner = new Instance("UICorner");
  borderButtonCorner.CornerRadius = new UDim(0, 4);
  borderButtonCorner.Parent = borderColorButton;

  // Create dropdown functionality for X-axis
  createDropdownForButton(xAxisButton, xAxisValue, onXAxisChange, mainFrame, AVAILABLE_PROPERTIES);
  
  // Create dropdown functionality for Z-axis
  createDropdownForButton(zAxisButton, zAxisValue, onZAxisChange, mainFrame, AVAILABLE_PROPERTIES);
  
  // Create dropdown functionality for background color (using visual properties which include "none")
  createDropdownForButton(bgColorButton, backgroundColorValue, onBackgroundColorChange, mainFrame, VISUAL_PROPERTIES);
  
  // Create dropdown functionality for border color
  createDropdownForButton(borderColorButton, borderColorValue, onBorderColorChange, mainFrame, VISUAL_PROPERTIES);
  
  // Y-Axis Configuration section
  const yAxisSectionLabel = new Instance("TextLabel");
  yAxisSectionLabel.Name = "YAxisSectionLabel";
  yAxisSectionLabel.Text = "Y-Axis Configuration";
  yAxisSectionLabel.Position = new UDim2(0, 10, 0, 165);
  yAxisSectionLabel.Size = new UDim2(1, -20, 0, 15);
  yAxisSectionLabel.BackgroundTransparency = 1;
  yAxisSectionLabel.TextColor3 = new Color3(0.6, 0.6, 0.6);
  yAxisSectionLabel.Font = Enum.Font.SourceSans;
  yAxisSectionLabel.TextSize = 12;
  yAxisSectionLabel.TextXAlignment = Enum.TextXAlignment.Left;
  yAxisSectionLabel.Parent = mainFrame;
  
  // Radio button container
  const radioContainer = new Instance("Frame");
  radioContainer.Name = "RadioContainer";
  radioContainer.Position = new UDim2(0, 10, 0, 185);
  radioContainer.Size = new UDim2(1, -20, 0, 50);
  radioContainer.BackgroundTransparency = 1;
  radioContainer.Parent = mainFrame;
  
  // Use Layer option
  const useLayerFrame = new Instance("Frame");
  useLayerFrame.Name = "UseLayerFrame";
  useLayerFrame.Position = new UDim2(0, 0, 0, 0);
  useLayerFrame.Size = new UDim2(1, 0, 0, 20);
  useLayerFrame.BackgroundTransparency = 1;
  useLayerFrame.Parent = radioContainer;
  
  const useLayerRadio = new Instance("TextButton");
  useLayerRadio.Name = "UseLayerRadio";
  useLayerRadio.Position = new UDim2(0, 0, 0, 0);
  useLayerRadio.Size = new UDim2(0, 16, 0, 16);
  useLayerRadio.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  useLayerRadio.BorderSizePixel = 0;
  useLayerRadio.Text = "";
  useLayerRadio.Parent = useLayerFrame;
  
  const useLayerRadioCorner = new Instance("UICorner");
  useLayerRadioCorner.CornerRadius = new UDim(0.5, 0);
  useLayerRadioCorner.Parent = useLayerRadio;
  
  const useLayerInner = new Instance("Frame");
  useLayerInner.Name = "InnerCircle";
  useLayerInner.Position = new UDim2(0.5, 0, 0.5, 0);
  useLayerInner.AnchorPoint = new Vector2(0.5, 0.5);
  useLayerInner.Size = new UDim2(0, 8, 0, 8);
  useLayerInner.BackgroundColor3 = new Color3(1, 1, 1);
  useLayerInner.BorderSizePixel = 0;
  useLayerInner.Visible = useLayerForYAxis;
  useLayerInner.Parent = useLayerRadio;
  
  const useLayerInnerCorner = new Instance("UICorner");
  useLayerInnerCorner.CornerRadius = new UDim(0.5, 0);
  useLayerInnerCorner.Parent = useLayerInner;
  
  const useLayerLabel = new Instance("TextLabel");
  useLayerLabel.Name = "UseLayerLabel";
  useLayerLabel.Text = "Use Layer for Y Position";
  useLayerLabel.Position = new UDim2(0, 25, 0, 0);
  useLayerLabel.Size = new UDim2(1, -25, 0, 16);
  useLayerLabel.BackgroundTransparency = 1;
  useLayerLabel.TextColor3 = new Color3(0.8, 0.8, 0.8);
  useLayerLabel.Font = Enum.Font.SourceSans;
  useLayerLabel.TextSize = 14;
  useLayerLabel.TextXAlignment = Enum.TextXAlignment.Left;
  useLayerLabel.Parent = useLayerFrame;
  
  // Use Property option
  const usePropertyFrame = new Instance("Frame");
  usePropertyFrame.Name = "UsePropertyFrame";
  usePropertyFrame.Position = new UDim2(0, 0, 0, 25);
  usePropertyFrame.Size = new UDim2(1, 0, 0, 20);
  usePropertyFrame.BackgroundTransparency = 1;
  usePropertyFrame.Parent = radioContainer;
  
  const usePropertyRadio = new Instance("TextButton");
  usePropertyRadio.Name = "UsePropertyRadio";
  usePropertyRadio.Position = new UDim2(0, 0, 0, 0);
  usePropertyRadio.Size = new UDim2(0, 16, 0, 16);
  usePropertyRadio.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  usePropertyRadio.BorderSizePixel = 0;
  usePropertyRadio.Text = "";
  usePropertyRadio.Parent = usePropertyFrame;
  
  const usePropertyRadioCorner = new Instance("UICorner");
  usePropertyRadioCorner.CornerRadius = new UDim(0.5, 0);
  usePropertyRadioCorner.Parent = usePropertyRadio;
  
  const usePropertyInner = new Instance("Frame");
  usePropertyInner.Name = "InnerCircle";
  usePropertyInner.Position = new UDim2(0.5, 0, 0.5, 0);
  usePropertyInner.AnchorPoint = new Vector2(0.5, 0.5);
  usePropertyInner.Size = new UDim2(0, 8, 0, 8);
  usePropertyInner.BackgroundColor3 = new Color3(1, 1, 1);
  usePropertyInner.BorderSizePixel = 0;
  usePropertyInner.Visible = !useLayerForYAxis;
  usePropertyInner.Parent = usePropertyRadio;
  
  const usePropertyInnerCorner = new Instance("UICorner");
  usePropertyInnerCorner.CornerRadius = new UDim(0.5, 0);
  usePropertyInnerCorner.Parent = usePropertyInner;
  
  const usePropertyLabel = new Instance("TextLabel");
  usePropertyLabel.Name = "UsePropertyLabel";
  usePropertyLabel.Text = "Use Property:";
  usePropertyLabel.Position = new UDim2(0, 25, 0, 0);
  usePropertyLabel.Size = new UDim2(0, 80, 0, 16);
  usePropertyLabel.BackgroundTransparency = 1;
  usePropertyLabel.TextColor3 = new Color3(0.8, 0.8, 0.8);
  usePropertyLabel.Font = Enum.Font.SourceSans;
  usePropertyLabel.TextSize = 14;
  usePropertyLabel.TextXAlignment = Enum.TextXAlignment.Left;
  usePropertyLabel.Parent = usePropertyFrame;
  
  // Property dropdown button
  const yAxisPropertyButton = new Instance("TextButton");
  yAxisPropertyButton.Name = "YAxisPropertyButton";
  yAxisPropertyButton.Text = yAxisProperty || "Select Property";
  yAxisPropertyButton.Position = new UDim2(0, 110, 0, -2);
  yAxisPropertyButton.Size = new UDim2(0, 170, 0, 20);
  yAxisPropertyButton.BackgroundColor3 = useLayerForYAxis ? new Color3(0.2, 0.2, 0.2) : new Color3(0.3, 0.3, 0.3);
  yAxisPropertyButton.BorderSizePixel = 0;
  yAxisPropertyButton.TextColor3 = useLayerForYAxis ? new Color3(0.5, 0.5, 0.5) : new Color3(1, 1, 1);
  yAxisPropertyButton.Font = Enum.Font.SourceSans;
  yAxisPropertyButton.TextSize = 14;
  yAxisPropertyButton.Active = !useLayerForYAxis;
  yAxisPropertyButton.Parent = usePropertyFrame;
  
  const yPropertyButtonCorner = new Instance("UICorner");
  yPropertyButtonCorner.CornerRadius = new UDim(0, 4);
  yPropertyButtonCorner.Parent = yAxisPropertyButton;
  
  
  // Variable to track current Y-axis mode
  let currentUseLayer = useLayerForYAxis;
  
  // Create dropdown for Y-axis property when property mode is selected
  if (!currentUseLayer && onYAxisPropertyChange) {
    createDropdownForButton(yAxisPropertyButton, yAxisProperty || "type", onYAxisPropertyChange, mainFrame, AVAILABLE_PROPERTIES);
  }
  
  // Update the radio button handlers to track mode
  useLayerRadio.MouseButton1Click.Connect(() => {
    if (!currentUseLayer) {
      currentUseLayer = true;
      useLayerInner.Visible = true;
      usePropertyInner.Visible = false;
      yAxisPropertyButton.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
      yAxisPropertyButton.TextColor3 = new Color3(0.5, 0.5, 0.5);
      yAxisPropertyButton.Active = false;
      if (onYAxisModeChange) {
        onYAxisModeChange(true);
      }
    }
  });
  
  usePropertyRadio.MouseButton1Click.Connect(() => {
    if (currentUseLayer) {
      currentUseLayer = false;
      useLayerInner.Visible = false;
      usePropertyInner.Visible = true;
      yAxisPropertyButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
      yAxisPropertyButton.TextColor3 = new Color3(1, 1, 1);
      yAxisPropertyButton.Active = true;
      if (onYAxisModeChange) {
        onYAxisModeChange(false);
      }
      // Create dropdown when switching to property mode
      if (onYAxisPropertyChange) {
        createDropdownForButton(yAxisPropertyButton, yAxisPropertyButton.Text, onYAxisPropertyChange, mainFrame, AVAILABLE_PROPERTIES);
      }
    }
  });
}

function createDropdownForButton(
  button: TextButton, 
  _currentValue: string, 
  onChange: (value: string) => void,
  parent: Frame,
  properties: string[]
): void {
  let isOpen = false;
  let optionsFrame: Frame | undefined;

  button.MouseButton1Click.Connect(() => {
    if (!isOpen) {
      // Create options frame
      optionsFrame = new Instance("Frame");
      optionsFrame.Name = button.Name + "Options";
      // Position dropdown below the button
      const buttonPosition = button.Position;
      const buttonSize = button.Size;
      optionsFrame.Position = new UDim2(
        buttonPosition.X.Scale,
        buttonPosition.X.Offset,
        buttonPosition.Y.Scale,
        buttonPosition.Y.Offset + buttonSize.Y.Offset + 5
      );
      optionsFrame.Size = new UDim2(0, button.Size.X.Offset, 0, math.min(properties.size() * 20, 160));
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
      scrollFrame.CanvasSize = new UDim2(0, 0, 0, properties.size() * 20);
      scrollFrame.Parent = optionsFrame;

      // Create option buttons
      properties.forEach((property, index) => {
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

