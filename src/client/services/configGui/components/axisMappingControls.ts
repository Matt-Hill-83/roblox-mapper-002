import { GUI_CONSTANTS } from "../constants";
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
}: AxisMappingControlsProps): Frame {
  // Provide default axis mapping if not provided
  const mapping = axisMapping || {
    xAxis: "type",
    zAxis: "petType"
  };
  
  // Create container WITHOUT clipping for dropdowns to show
  const container = new Instance("Frame");
  container.Name = "AxisMappingControls";
  container.Size = new UDim2(1, -20, 0, 80);
  container.Position = new UDim2(0, 0, 0, 0); // Position will be set by layout manager
  container.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
  container.BorderSizePixel = 0;
  container.ClipsDescendants = false; // Disable clipping so dropdowns can extend outside
  container.ZIndex = 2; // Ensure container is above other elements
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

  // Dropdown list container (hidden by default) - opens upward
  const dropdownList = new Instance("Frame");
  const itemHeight = 25;
  const maxItems = 6; // Show max 6 items before scrolling
  const actualHeight = math.min(AVAILABLE_PROPERTIES.size() * itemHeight, maxItems * itemHeight);
  dropdownList.Size = new UDim2(1, 0, 0, actualHeight);
  dropdownList.Position = new UDim2(0, 0, 0, -actualHeight - 5); // Position above button with gap
  dropdownList.BackgroundColor3 = new Color3(0.1, 0.1, 0.1); // Darker background
  dropdownList.BorderSizePixel = 1;
  dropdownList.BorderColor3 = new Color3(0.3, 0.3, 0.3); // Add border for visibility
  dropdownList.Visible = false;
  dropdownList.ZIndex = 5;
  dropdownList.Parent = dropdownButton;

  const listCorner = new Instance("UICorner");
  listCorner.CornerRadius = new UDim(0, 4);
  listCorner.Parent = dropdownList;

  // Create scrolling frame for dropdown options if needed
  const needsScroll = AVAILABLE_PROPERTIES.size() > maxItems;
  const optionParent = needsScroll ? new Instance("ScrollingFrame") : dropdownList;
  
  if (needsScroll && optionParent.IsA("ScrollingFrame")) {
    optionParent.Size = new UDim2(1, 0, 1, 0);
    optionParent.Position = new UDim2(0, 0, 0, 0);
    optionParent.BackgroundTransparency = 1;
    optionParent.BorderSizePixel = 0;
    optionParent.ScrollBarThickness = 4;
    optionParent.ScrollBarImageColor3 = new Color3(0.5, 0.5, 0.5);
    optionParent.CanvasSize = new UDim2(0, 0, 0, AVAILABLE_PROPERTIES.size() * itemHeight);
    optionParent.Parent = dropdownList;
  }

  // Create option buttons
  AVAILABLE_PROPERTIES.forEach((property, index) => {
    const optionButton = new Instance("TextButton");
    optionButton.Size = new UDim2(1, needsScroll ? -10 : 0, 0, itemHeight);
    optionButton.Position = new UDim2(0, 0, 0, index * itemHeight);
    optionButton.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
    optionButton.BackgroundTransparency = 0; // Solid background
    optionButton.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
    optionButton.Text = property;
    optionButton.TextColor3 = new Color3(0.9, 0.9, 0.9); // Brighter text
    optionButton.TextSize = 14;
    optionButton.TextXAlignment = Enum.TextXAlignment.Center;
    optionButton.BorderSizePixel = 0;
    optionButton.Parent = optionParent;

    // Hover effect
    optionButton.MouseEnter.Connect(() => {
      optionButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
      optionButton.TextColor3 = new Color3(1, 1, 1); // Even brighter on hover
    });

    optionButton.MouseLeave.Connect(() => {
      optionButton.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
      optionButton.TextColor3 = new Color3(0.9, 0.9, 0.9);
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