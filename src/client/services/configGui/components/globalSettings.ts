import { GUI_CONSTANTS } from "../constants";

interface GlobalSettingsProps {
  parent: Frame;
  numNodeTypes: number;
  numLinkTypes: number;
  onNodeTypesChange: (value: number) => void;
  onLinkTypesChange: (value: number) => void;
}

export function createGlobalSettings({
  parent,
  numNodeTypes,
  numLinkTypes,
  onNodeTypesChange,
  onLinkTypesChange
}: GlobalSettingsProps): Frame {
  // Create container
  const container = new Instance("Frame");
  container.Name = "GlobalSettings";
  container.Size = new UDim2(1, -20, 0, GUI_CONSTANTS.ENHANCED.GLOBAL_SETTINGS_HEIGHT);
  container.Position = new UDim2(0, 10, 0, 40);
  container.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
  container.BorderSizePixel = 0;
  container.Parent = parent;

  const containerCorner = new Instance("UICorner");
  containerCorner.CornerRadius = new UDim(0, 4);
  containerCorner.Parent = container;

  // Title
  const title = new Instance("TextLabel");
  title.Size = new UDim2(1, -10, 0, 25);
  title.Position = new UDim2(0, 5, 0, 5);
  title.BackgroundTransparency = 1;
  title.Font = GUI_CONSTANTS.TYPOGRAPHY.TITLE_FONT;
  title.Text = "Global Settings";
  title.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  title.TextScaled = true;
  title.Parent = container;

  // Node types setting
  const nodeTypesLabel = new Instance("TextLabel");
  nodeTypesLabel.Size = new UDim2(0, 150, 0, 25);
  nodeTypesLabel.Position = new UDim2(0, 10, 0, 35);
  nodeTypesLabel.BackgroundTransparency = 1;
  nodeTypesLabel.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
  nodeTypesLabel.Text = "Number of Node Types:";
  nodeTypesLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  nodeTypesLabel.TextScaled = true;
  nodeTypesLabel.TextXAlignment = Enum.TextXAlignment.Left;
  nodeTypesLabel.Parent = container;

  // Node types input box
  const nodeTypesInput = new Instance("TextBox");
  nodeTypesInput.Name = "NodeTypesInput";
  nodeTypesInput.Size = new UDim2(0, 80, 0, 25);
  nodeTypesInput.Position = new UDim2(0, 165, 0, 35);
  nodeTypesInput.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
  nodeTypesInput.BorderSizePixel = 0;
  nodeTypesInput.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
  nodeTypesInput.Text = tostring(numNodeTypes);
  nodeTypesInput.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  nodeTypesInput.TextScaled = true;
  nodeTypesInput.Parent = container;

  const nodeTypesCorner = new Instance("UICorner");
  nodeTypesCorner.CornerRadius = new UDim(0, 4);
  nodeTypesCorner.Parent = nodeTypesInput;

  // Input validation
  nodeTypesInput.FocusLost.Connect(() => {
    const value = tonumber(nodeTypesInput.Text);
    if (value && value >= 1 && value <= GUI_CONSTANTS.ENHANCED.DROPDOWN_ITEMS) {
      onNodeTypesChange(math.floor(value));
      nodeTypesInput.Text = tostring(math.floor(value));
    } else {
      nodeTypesInput.Text = tostring(numNodeTypes);
    }
  });

  // Link types setting
  const linkTypesLabel = new Instance("TextLabel");
  linkTypesLabel.Size = new UDim2(0, 150, 0, 25);
  linkTypesLabel.Position = new UDim2(0, 280, 0, 35);
  linkTypesLabel.BackgroundTransparency = 1;
  linkTypesLabel.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
  linkTypesLabel.Text = "Number of Link Types:";
  linkTypesLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  linkTypesLabel.TextScaled = true;
  linkTypesLabel.TextXAlignment = Enum.TextXAlignment.Left;
  linkTypesLabel.Parent = container;

  // Link types input box
  const linkTypesInput = new Instance("TextBox");
  linkTypesInput.Name = "LinkTypesInput";
  linkTypesInput.Size = new UDim2(0, 80, 0, 25);
  linkTypesInput.Position = new UDim2(0, 435, 0, 35);
  linkTypesInput.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
  linkTypesInput.BorderSizePixel = 0;
  linkTypesInput.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
  linkTypesInput.Text = tostring(numLinkTypes);
  linkTypesInput.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  linkTypesInput.TextScaled = true;
  linkTypesInput.Parent = container;

  const linkTypesCorner = new Instance("UICorner");
  linkTypesCorner.CornerRadius = new UDim(0, 4);
  linkTypesCorner.Parent = linkTypesInput;

  // Input validation
  linkTypesInput.FocusLost.Connect(() => {
    const value = tonumber(linkTypesInput.Text);
    if (value && value >= 1 && value <= GUI_CONSTANTS.ENHANCED.DROPDOWN_ITEMS) {
      onLinkTypesChange(math.floor(value));
      linkTypesInput.Text = tostring(math.floor(value));
    } else {
      linkTypesInput.Text = tostring(numLinkTypes);
    }
  });

  return container;
}