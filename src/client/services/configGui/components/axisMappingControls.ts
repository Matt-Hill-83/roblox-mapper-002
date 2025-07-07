import { GUI_CONSTANTS } from "../constants";
import type { AxisMapping } from "../../../../shared/interfaces/enhancedGenerator.interface";

interface AxisMappingControlsProps {
  parent: Frame;
  axisMapping?: AxisMapping;
  onAxisMappingChange: (axis: "xAxis" | "zAxis", value: string) => void;
}

// Available properties for axis mapping
const AVAILABLE_PROPERTIES = ["type", "petType", "petColor", "age", "firstName", "lastName"];

export function createAxisMappingControls({
  parent,
  axisMapping,
  onAxisMappingChange
}: AxisMappingControlsProps): Frame {
  // Provide default axis mapping if not provided
  const mapping = axisMapping || {
    xAxis: "type",
    zAxis: "petType"
  };
  
  // Create container
  const container = new Instance("Frame");
  container.Name = "AxisMappingControls";
  container.Size = new UDim2(1, -20, 0, 80);
  container.Position = new UDim2(0, 10, 1, -290);
  container.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
  container.BorderSizePixel = 0;
  container.Parent = parent;

  const containerCorner = new Instance("UICorner");
  containerCorner.CornerRadius = new UDim(0, 4);
  containerCorner.Parent = container;

  // Title
  const title = new Instance("TextLabel");
  title.Size = new UDim2(1, -20, 0, 20);
  title.Position = new UDim2(0, 10, 0, 5);
  title.BackgroundTransparency = 1;
  title.Font = GUI_CONSTANTS.TYPOGRAPHY.TITLE_FONT;
  title.Text = "Axis Property Mapping";
  title.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  title.TextSize = 16;
  title.TextXAlignment = Enum.TextXAlignment.Left;
  title.Parent = container;

  // X-Axis dropdown
  createAxisDropdown({
    parent: container,
    label: "X-Axis Property:",
    position: new UDim2(0, 10, 0, 30),
    currentValue: mapping.xAxis,
    onValueChange: (value) => onAxisMappingChange("xAxis", value)
  });

  // Z-Axis dropdown
  createAxisDropdown({
    parent: container,
    label: "Z-Axis Property:",
    position: new UDim2(0.5, 10, 0, 30),
    currentValue: mapping.zAxis,
    onValueChange: (value) => onAxisMappingChange("zAxis", value)
  });

  return container;
}

interface AxisDropdownProps {
  parent: Frame;
  label: string;
  position: UDim2;
  currentValue: string;
  onValueChange: (value: string) => void;
}

function createAxisDropdown({
  parent,
  label,
  position,
  currentValue,
  onValueChange
}: AxisDropdownProps): void {
  // Container for label and dropdown
  const dropdownContainer = new Instance("Frame");
  dropdownContainer.Size = new UDim2(0.5, -20, 0, 40);
  dropdownContainer.Position = position;
  dropdownContainer.BackgroundTransparency = 1;
  dropdownContainer.Parent = parent;

  // Label
  const dropdownLabel = new Instance("TextLabel");
  dropdownLabel.Size = new UDim2(1, 0, 0, 20);
  dropdownLabel.Position = new UDim2(0, 0, 0, 0);
  dropdownLabel.BackgroundTransparency = 1;
  dropdownLabel.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
  dropdownLabel.Text = label;
  dropdownLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  dropdownLabel.TextSize = 14;
  dropdownLabel.TextXAlignment = Enum.TextXAlignment.Left;
  dropdownLabel.Parent = dropdownContainer;

  // Dropdown button
  const dropdownButton = new Instance("TextButton");
  dropdownButton.Size = new UDim2(1, 0, 0, 25);
  dropdownButton.Position = new UDim2(0, 0, 0, 20);
  dropdownButton.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
  dropdownButton.BorderSizePixel = 0;
  dropdownButton.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
  dropdownButton.Text = currentValue + " ▼";
  dropdownButton.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  dropdownButton.TextSize = 14;
  dropdownButton.Parent = dropdownContainer;

  const buttonCorner = new Instance("UICorner");
  buttonCorner.CornerRadius = new UDim(0, 4);
  buttonCorner.Parent = dropdownButton;

  // Dropdown list (hidden by default)
  const dropdownList = new Instance("Frame");
  dropdownList.Size = new UDim2(1, 0, 0, AVAILABLE_PROPERTIES.size() * 25);
  dropdownList.Position = new UDim2(0, 0, 1, 0);
  dropdownList.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
  dropdownList.BorderSizePixel = 0;
  dropdownList.Visible = false;
  dropdownList.ZIndex = 10;
  dropdownList.Parent = dropdownButton;

  const listCorner = new Instance("UICorner");
  listCorner.CornerRadius = new UDim(0, 4);
  listCorner.Parent = dropdownList;

  // Create option buttons
  AVAILABLE_PROPERTIES.forEach((property, index) => {
    const optionButton = new Instance("TextButton");
    optionButton.Size = new UDim2(1, -10, 0, 25);
    optionButton.Position = new UDim2(0, 5, 0, index * 25);
    optionButton.BackgroundTransparency = 1;
    optionButton.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
    optionButton.Text = property;
    optionButton.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    optionButton.TextSize = 14;
    optionButton.TextXAlignment = Enum.TextXAlignment.Left;
    optionButton.Parent = dropdownList;

    // Hover effect
    optionButton.MouseEnter.Connect(() => {
      optionButton.BackgroundTransparency = 0.8;
      optionButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
    });

    optionButton.MouseLeave.Connect(() => {
      optionButton.BackgroundTransparency = 1;
    });

    // Selection
    optionButton.MouseButton1Click.Connect(() => {
      dropdownButton.Text = property + " ▼";
      dropdownList.Visible = false;
      onValueChange(property);
    });
  });

  // Create a connection variable to track the close handler
  let closeConnection: RBXScriptConnection | undefined;
  
  // Toggle dropdown
  dropdownButton.MouseButton1Click.Connect(() => {
    const isOpening = !dropdownList.Visible;
    dropdownList.Visible = isOpening;
    
    // If opening, set up the close handler
    if (isOpening) {
      // Disconnect previous handler if it exists
      if (closeConnection) {
        closeConnection.Disconnect();
      }
      
      // Wait a frame to avoid immediate closing
      game.GetService("RunService").Heartbeat.Wait();
      
      // Set up new close handler
      const userInputService = game.GetService("UserInputService");
      closeConnection = userInputService.InputBegan.Connect((input, gameProcessed) => {
        if (input.UserInputType === Enum.UserInputType.MouseButton1 && !gameProcessed) {
          // Check if click is outside the dropdown
          const mouse = game.GetService("Players").LocalPlayer.GetMouse();
          const target = mouse.Target;
          
          // Close if clicking outside dropdown area
          if (!target || !target.IsDescendantOf(dropdownButton)) {
            dropdownList.Visible = false;
            if (closeConnection) {
              closeConnection.Disconnect();
              closeConnection = undefined;
            }
          }
        }
      });
    } else if (closeConnection) {
      // If closing, disconnect the handler
      closeConnection.Disconnect();
      closeConnection = undefined;
    }
  });
}