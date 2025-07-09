import { GUI_CONSTANTS } from "../constants";

interface YAxisControlsProps {
  parent: Frame;
  useLayerForYAxis: boolean;
  yAxisProperty?: string;
  onYAxisModeChange: (useLayer: boolean) => void;
  onYAxisPropertyChange: (property: string) => void;
}

// Available properties for Y-axis mapping (excluding layer)
const Y_AXIS_PROPERTIES = ["type", "petType", "petColor", "age", "firstName", "lastName", "countryOfBirth", "countryOfResidence"];

export function createYAxisControls({
  parent,
  useLayerForYAxis,
  yAxisProperty,
  onYAxisModeChange,
  onYAxisPropertyChange
}: YAxisControlsProps): Frame {
  // Create container WITHOUT clipping for dropdowns to show
  const container = new Instance("Frame");
  container.Name = "YAxisControls";
  container.Size = new UDim2(1, -20, 0, 80);
  container.Position = new UDim2(0, 0, 0, 0); // Position will be set by layout manager
  container.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
  container.BorderSizePixel = 0;
  container.ClipsDescendants = false; // Disable clipping so dropdowns can extend
  container.ZIndex = 2;
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
  title.Text = "Y-Axis Configuration";
  title.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  title.TextSize = 16;
  title.TextXAlignment = Enum.TextXAlignment.Left;
  title.Parent = container;

  // Toggle frame
  const toggleFrame = new Instance("Frame");
  toggleFrame.Size = new UDim2(0.5, -20, 0, 40);
  toggleFrame.Position = new UDim2(0, 10, 0, 30);
  toggleFrame.BackgroundTransparency = 1;
  toggleFrame.Parent = container;

  // Toggle label
  const toggleLabel = new Instance("TextLabel");
  toggleLabel.Size = new UDim2(0.6, 0, 0, 20);
  toggleLabel.Position = new UDim2(0, 0, 0, 0);
  toggleLabel.BackgroundTransparency = 1;
  toggleLabel.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
  toggleLabel.Text = "Use Layer:";
  toggleLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  toggleLabel.TextSize = 14;
  toggleLabel.TextXAlignment = Enum.TextXAlignment.Left;
  toggleLabel.Parent = toggleFrame;

  // Toggle checkbox
  const checkbox = new Instance("TextButton");
  checkbox.Size = new UDim2(0, 25, 0, 25);
  checkbox.Position = new UDim2(0.6, 0, 0, -2);
  checkbox.BackgroundColor3 = useLayerForYAxis 
    ? GUI_CONSTANTS.COLORS.BUTTON.DEFAULT 
    : new Color3(0.3, 0.3, 0.3);
  checkbox.BorderSizePixel = 2;
  checkbox.BorderColor3 = new Color3(0.5, 0.5, 0.5);
  checkbox.Text = useLayerForYAxis ? "✓" : "";
  checkbox.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  checkbox.TextScaled = true;
  checkbox.Font = GUI_CONSTANTS.TYPOGRAPHY.BUTTON_FONT;
  checkbox.Parent = toggleFrame;

  const checkboxCorner = new Instance("UICorner");
  checkboxCorner.CornerRadius = new UDim(0, 4);
  checkboxCorner.Parent = checkbox;

  // Property dropdown (only visible when not using layer)
  const dropdownFrame = new Instance("Frame");
  dropdownFrame.Size = new UDim2(0.5, -20, 0, 40);
  dropdownFrame.Position = new UDim2(0.5, 10, 0, 30);
  dropdownFrame.BackgroundTransparency = 1;
  dropdownFrame.Visible = !useLayerForYAxis;
  dropdownFrame.Parent = container;

  // Property dropdown
  createYAxisDropdown({
    parent: dropdownFrame,
    label: "Y-Axis Property:",
    currentValue: yAxisProperty || "type",
    onValueChange: onYAxisPropertyChange
  });

  // Toggle handler
  checkbox.MouseButton1Click.Connect(() => {
    const newUseLayer = !useLayerForYAxis;
    
    // Update checkbox appearance
    checkbox.BackgroundColor3 = newUseLayer 
      ? GUI_CONSTANTS.COLORS.BUTTON.DEFAULT 
      : new Color3(0.3, 0.3, 0.3);
    checkbox.Text = newUseLayer ? "✓" : "";
    
    // Toggle dropdown visibility
    dropdownFrame.Visible = !newUseLayer;
    
    // Notify parent
    onYAxisModeChange(newUseLayer);
  });

  return container;
}

interface YAxisDropdownProps {
  parent: Frame;
  label: string;
  currentValue: string;
  onValueChange: (value: string) => void;
}

function createYAxisDropdown({
  parent,
  label,
  currentValue,
  onValueChange
}: YAxisDropdownProps): void {
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
  dropdownLabel.Parent = parent;

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
  dropdownButton.Parent = parent;

  const buttonCorner = new Instance("UICorner");
  buttonCorner.CornerRadius = new UDim(0, 4);
  buttonCorner.Parent = dropdownButton;

  // Dropdown list - always use ScrollingFrame for consistency
  const itemHeight = 25;
  const maxItems = 6;
  const actualHeight = math.min(Y_AXIS_PROPERTIES.size() * itemHeight, maxItems * itemHeight);
  
  const dropdownList = new Instance("ScrollingFrame");
  dropdownList.Size = new UDim2(1, 0, 0, actualHeight);
  dropdownList.Position = new UDim2(0, 0, 0, -actualHeight - 5); // Position above button with gap
  dropdownList.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
  dropdownList.BorderSizePixel = 1;
  dropdownList.BorderColor3 = new Color3(0.3, 0.3, 0.3);
  dropdownList.ScrollBarThickness = 4;
  dropdownList.ScrollBarImageColor3 = new Color3(0.5, 0.5, 0.5);
  dropdownList.CanvasSize = new UDim2(0, 0, 0, Y_AXIS_PROPERTIES.size() * itemHeight);
  dropdownList.Visible = false;
  dropdownList.ZIndex = 100; // Higher z-index
  dropdownList.Parent = dropdownButton;

  const listCorner = new Instance("UICorner");
  listCorner.CornerRadius = new UDim(0, 4);
  listCorner.Parent = dropdownList;

  // Create option buttons
  Y_AXIS_PROPERTIES.forEach((property, index) => {
    const optionButton = new Instance("TextButton");
    optionButton.Size = new UDim2(1, -10, 0, itemHeight); // Always account for scrollbar
    optionButton.Position = new UDim2(0, 0, 0, index * itemHeight);
    optionButton.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
    optionButton.BackgroundTransparency = 0;
    optionButton.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
    optionButton.Text = property;
    optionButton.TextColor3 = new Color3(0.9, 0.9, 0.9);
    optionButton.TextSize = 14;
    optionButton.TextXAlignment = Enum.TextXAlignment.Center;
    optionButton.BorderSizePixel = 0;
    optionButton.Parent = dropdownList; // Parent directly to dropdownList

    // Hover effect
    optionButton.MouseEnter.Connect(() => {
      optionButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
      optionButton.TextColor3 = new Color3(1, 1, 1);
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

  // Toggle dropdown
  let closeConnection: RBXScriptConnection | undefined;
  
  dropdownButton.MouseButton1Click.Connect(() => {
    const isOpening = !dropdownList.Visible;
    dropdownList.Visible = isOpening;
    
    if (isOpening) {
      if (closeConnection) {
        closeConnection.Disconnect();
      }
      
      game.GetService("RunService").Heartbeat.Wait();
      
      const userInputService = game.GetService("UserInputService");
      closeConnection = userInputService.InputBegan.Connect((input, gameProcessed) => {
        if (input.UserInputType === Enum.UserInputType.MouseButton1 && !gameProcessed) {
          const mouse = game.GetService("Players").LocalPlayer.GetMouse();
          const target = mouse.Target;
          
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
      closeConnection.Disconnect();
      closeConnection = undefined;
    }
  });
}