import { Players } from "@rbxts/services";
import type { AxisMapping } from "../../../../shared/interfaces/enhancedGenerator.interface";

interface AxisMappingControlsProps {
  parent: Frame;
  axisMapping?: AxisMapping;
  onAxisMappingChange: (axis: "xAxis" | "zAxis", value: string) => void;
}

// Available properties for axis mapping
const AVAILABLE_PROPERTIES = ["type", "petType", "petColor", "age", "firstName", "lastName", "countryOfBirth", "countryOfResidence"];

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
  
  // Create the X-axis dropdown as a separate GUI
  createXAxisDropdownServiceStyle({
    parent: parent, // This will be overridden inside the function
    label: "X-Axis Property:",
    position: new UDim2(0, 10, 0, 30),
    currentValue: mapping.xAxis,
    onValueChange: (value) => onAxisMappingChange("xAxis", value)
  });

  // Create the Z-axis dropdown as a separate GUI
  createZAxisDropdownServiceStyle({
    parent: parent, // This will be overridden inside the function
    label: "Z-Axis Property:",
    position: new UDim2(0.5, 10, 0, 30),
    currentValue: mapping.zAxis,
    onValueChange: (value) => onAxisMappingChange("zAxis", value)
  });
}

interface AxisDropdownProps {
  parent: Frame;
  label: string;
  position: UDim2;
  currentValue: string;
  onValueChange: (value: string) => void;
}

// X-Axis dropdown using DropdownGuiService pattern
function createXAxisDropdownServiceStyle({
  parent,
  label,
  position,
  currentValue,
  onValueChange
}: AxisDropdownProps): void {
  const player = Players.LocalPlayer;
  const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

  // Create a separate ScreenGui for the X-axis dropdown
  const gui = new Instance("ScreenGui");
  gui.Name = "XAxisDropdownGUI";
  gui.ResetOnSpawn = false;
  gui.Parent = playerGui;

  // Create main frame positioned near the dropdown test
  const mainFrame = new Instance("Frame");
  mainFrame.Name = "XAxisDropdownFrame";
  mainFrame.Size = new UDim2(0, 200, 0, 280); // Increased height to accommodate dropdown
  mainFrame.Position = new UDim2(0, 10, 0.5, 90); // Position below the dropdown test
  mainFrame.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
  mainFrame.BorderSizePixel = 0;
  mainFrame.Parent = gui;

  const frameCorner = new Instance("UICorner");
  frameCorner.CornerRadius = new UDim(0, 8);
  frameCorner.Parent = mainFrame;

  // Title
  const titleLabel = new Instance("TextLabel");
  titleLabel.Name = "TitleLabel";
  titleLabel.Text = "X-Axis Dropdown";
  titleLabel.Position = new UDim2(0, 0, 0, 5);
  titleLabel.Size = new UDim2(1, 0, 0, 30);
  titleLabel.BackgroundTransparency = 1;
  titleLabel.TextColor3 = new Color3(1, 1, 1);
  titleLabel.Font = Enum.Font.SourceSansBold;
  titleLabel.TextScaled = false;
  titleLabel.TextSize = 18;
  titleLabel.Parent = mainFrame;

  // Dropdown button (DropdownGuiService style)
  const dropdownButton = new Instance("TextButton");
  dropdownButton.Name = "XAxisDropdownButton";
  dropdownButton.Size = new UDim2(1, -20, 0, 30);
  dropdownButton.Position = new UDim2(0, 10, 0, 40);
  dropdownButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  dropdownButton.BorderSizePixel = 0;
  dropdownButton.Font = Enum.Font.SourceSans;
  dropdownButton.Text = currentValue + " ▼";
  dropdownButton.TextColor3 = new Color3(1, 1, 1);
  dropdownButton.TextSize = 16;
  dropdownButton.TextScaled = false;
  dropdownButton.Parent = mainFrame;

  const buttonCorner = new Instance("UICorner");
  buttonCorner.CornerRadius = new UDim(0, 4);
  buttonCorner.Parent = dropdownButton;

  // Add hover effect
  dropdownButton.MouseEnter.Connect(() => {
    dropdownButton.BackgroundColor3 = new Color3(0.35, 0.35, 0.35);
  });

  dropdownButton.MouseLeave.Connect(() => {
    dropdownButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  });

  // Create options frame (DropdownGuiService style)
  const optionsFrame = new Instance("Frame");
  optionsFrame.Name = "XAxisOptionsFrame";
  optionsFrame.Position = new UDim2(0, 10, 0, 75);
  optionsFrame.Size = new UDim2(1, -20, 0, math.min(AVAILABLE_PROPERTIES.size() * 30, 180));
  optionsFrame.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
  optionsFrame.BorderSizePixel = 0;
  optionsFrame.Visible = false;
  optionsFrame.Parent = mainFrame;

  const optionsCorner = new Instance("UICorner");
  optionsCorner.CornerRadius = new UDim(0, 4);
  optionsCorner.Parent = optionsFrame;

  // Create option buttons
  let isDropdownOpen = false;
  
  AVAILABLE_PROPERTIES.forEach((property, index) => {
    const optionButton = new Instance("TextButton");
    optionButton.Name = `Option_${property}`;
    optionButton.Text = property;
    optionButton.Position = new UDim2(0, 5, 0, index * 30 + 5);
    optionButton.Size = new UDim2(1, -10, 0, 25);
    optionButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
    optionButton.TextColor3 = new Color3(1, 1, 1);
    optionButton.Font = Enum.Font.SourceSans;
    optionButton.TextScaled = false;
    optionButton.TextSize = 16;
    optionButton.BorderSizePixel = 0;
    optionButton.Parent = optionsFrame;

    // Add corner radius
    const optionCorner = new Instance("UICorner");
    optionCorner.CornerRadius = new UDim(0, 4);
    optionCorner.Parent = optionButton;

    // Add hover effect
    optionButton.MouseEnter.Connect(() => {
      optionButton.BackgroundColor3 = new Color3(0.35, 0.35, 0.35);
    });

    optionButton.MouseLeave.Connect(() => {
      optionButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
    });

    // Click handler
    optionButton.MouseButton1Click.Connect(() => {
      dropdownButton.Text = property + " ▼";
      optionsFrame.Visible = false;
      isDropdownOpen = false;
      onValueChange(property);
    });
  });

  // Toggle dropdown on button click
  dropdownButton.MouseButton1Click.Connect(() => {
    isDropdownOpen = !isDropdownOpen;
    optionsFrame.Visible = isDropdownOpen;
  });

  // Close dropdown when clicking elsewhere
  const userInputService = game.GetService("UserInputService");
  userInputService.InputBegan.Connect((input) => {
    if (input.UserInputType === Enum.UserInputType.MouseButton1 && isDropdownOpen) {
      wait(0.1); // Small delay to allow button clicks to register
      isDropdownOpen = false;
      optionsFrame.Visible = false;
    }
  });
}

// Z-Axis dropdown using DropdownGuiService pattern
function createZAxisDropdownServiceStyle({
  parent,
  label,
  position,
  currentValue,
  onValueChange
}: AxisDropdownProps): void {
  const player = Players.LocalPlayer;
  const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

  // Create a separate ScreenGui for the Z-axis dropdown
  const gui = new Instance("ScreenGui");
  gui.Name = "ZAxisDropdownGUI";
  gui.ResetOnSpawn = false;
  gui.Parent = playerGui;

  // Create main frame positioned below X-axis dropdown
  const mainFrame = new Instance("Frame");
  mainFrame.Name = "ZAxisDropdownFrame";
  mainFrame.Size = new UDim2(0, 200, 0, 280); // Same size as X-axis
  mainFrame.Position = new UDim2(0, 10, 0.5, 380); // Position below X-axis dropdown
  mainFrame.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
  mainFrame.BorderSizePixel = 0;
  mainFrame.Parent = gui;

  const frameCorner = new Instance("UICorner");
  frameCorner.CornerRadius = new UDim(0, 8);
  frameCorner.Parent = mainFrame;

  // Title
  const titleLabel = new Instance("TextLabel");
  titleLabel.Name = "TitleLabel";
  titleLabel.Text = "Z-Axis Dropdown";
  titleLabel.Position = new UDim2(0, 0, 0, 5);
  titleLabel.Size = new UDim2(1, 0, 0, 30);
  titleLabel.BackgroundTransparency = 1;
  titleLabel.TextColor3 = new Color3(1, 1, 1);
  titleLabel.Font = Enum.Font.SourceSansBold;
  titleLabel.TextScaled = false;
  titleLabel.TextSize = 18;
  titleLabel.Parent = mainFrame;

  // Dropdown button (DropdownGuiService style)
  const dropdownButton = new Instance("TextButton");
  dropdownButton.Name = "ZAxisDropdownButton";
  dropdownButton.Size = new UDim2(1, -20, 0, 30);
  dropdownButton.Position = new UDim2(0, 10, 0, 40);
  dropdownButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  dropdownButton.BorderSizePixel = 0;
  dropdownButton.Font = Enum.Font.SourceSans;
  dropdownButton.Text = currentValue + " ▼";
  dropdownButton.TextColor3 = new Color3(1, 1, 1);
  dropdownButton.TextSize = 16;
  dropdownButton.TextScaled = false;
  dropdownButton.Parent = mainFrame;

  const buttonCorner = new Instance("UICorner");
  buttonCorner.CornerRadius = new UDim(0, 4);
  buttonCorner.Parent = dropdownButton;

  // Add hover effect
  dropdownButton.MouseEnter.Connect(() => {
    dropdownButton.BackgroundColor3 = new Color3(0.35, 0.35, 0.35);
  });

  dropdownButton.MouseLeave.Connect(() => {
    dropdownButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  });

  // Create options frame (DropdownGuiService style)
  const optionsFrame = new Instance("Frame");
  optionsFrame.Name = "ZAxisOptionsFrame";
  optionsFrame.Position = new UDim2(0, 10, 0, 75);
  optionsFrame.Size = new UDim2(1, -20, 0, math.min(AVAILABLE_PROPERTIES.size() * 30, 180));
  optionsFrame.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
  optionsFrame.BorderSizePixel = 0;
  optionsFrame.Visible = false;
  optionsFrame.Parent = mainFrame;

  const optionsCorner = new Instance("UICorner");
  optionsCorner.CornerRadius = new UDim(0, 4);
  optionsCorner.Parent = optionsFrame;

  // Create option buttons
  let isDropdownOpen = false;
  
  AVAILABLE_PROPERTIES.forEach((property, index) => {
    const optionButton = new Instance("TextButton");
    optionButton.Name = `Option_${property}`;
    optionButton.Text = property;
    optionButton.Position = new UDim2(0, 5, 0, index * 30 + 5);
    optionButton.Size = new UDim2(1, -10, 0, 25);
    optionButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
    optionButton.TextColor3 = new Color3(1, 1, 1);
    optionButton.Font = Enum.Font.SourceSans;
    optionButton.TextScaled = false;
    optionButton.TextSize = 16;
    optionButton.BorderSizePixel = 0;
    optionButton.Parent = optionsFrame;

    // Add corner radius
    const optionCorner = new Instance("UICorner");
    optionCorner.CornerRadius = new UDim(0, 4);
    optionCorner.Parent = optionButton;

    // Add hover effect
    optionButton.MouseEnter.Connect(() => {
      optionButton.BackgroundColor3 = new Color3(0.35, 0.35, 0.35);
    });

    optionButton.MouseLeave.Connect(() => {
      optionButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
    });

    // Click handler
    optionButton.MouseButton1Click.Connect(() => {
      dropdownButton.Text = property + " ▼";
      optionsFrame.Visible = false;
      isDropdownOpen = false;
      onValueChange(property);
    });
  });

  // Toggle dropdown on button click
  dropdownButton.MouseButton1Click.Connect(() => {
    isDropdownOpen = !isDropdownOpen;
    optionsFrame.Visible = isDropdownOpen;
  });

  // Close dropdown when clicking elsewhere
  const userInputService = game.GetService("UserInputService");
  userInputService.InputBegan.Connect((input) => {
    if (input.UserInputType === Enum.UserInputType.MouseButton1 && isDropdownOpen) {
      wait(0.1); // Small delay to allow button clicks to register
      isDropdownOpen = false;
      optionsFrame.Visible = false;
    }
  });
}