import { GUI_CONSTANTS } from "../constants";

interface NodeTypesSectionProps {
  parent: Frame;
  numNodeTypes: number;
  numLinkTypes: number;
  numPetTypes?: number;
  onNodeTypesChange: (value: number) => void;
  onLinkTypesChange: (value: number) => void;
  onPetTypesChange?: (value: number) => void;
}

export function createNodeTypesSection({
  parent,
  numNodeTypes,
  numLinkTypes,
  numPetTypes = 2,
  onNodeTypesChange,
  onLinkTypesChange,
  onPetTypesChange
}: NodeTypesSectionProps): Frame {
  // Create container - increased height for pet types
  const container = new Instance("Frame");
  container.Name = "NodeTypesSection";
  container.Size = new UDim2(1, -20, 0, 145); // Increased height for 3 rows
  container.Position = new UDim2(0, 0, 0, 0); // Position will be set by layout manager
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
  title.Text = "Node/Link Types";
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
  nodeTypesInput.Size = new UDim2(0, 60, 0, 25);
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

  // Link types setting - now positioned below node types
  const linkTypesLabel = new Instance("TextLabel");
  linkTypesLabel.Size = new UDim2(0, 150, 0, 25);
  linkTypesLabel.Position = new UDim2(0, 10, 0, 70); // Moved down
  linkTypesLabel.BackgroundTransparency = 1;
  linkTypesLabel.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
  linkTypesLabel.Text = "Number of Link Types:";
  linkTypesLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  linkTypesLabel.TextScaled = true;
  linkTypesLabel.TextXAlignment = Enum.TextXAlignment.Left;
  linkTypesLabel.Parent = container;

  // Link types input box - now positioned below node types
  const linkTypesInput = new Instance("TextBox");
  linkTypesInput.Name = "LinkTypesInput";
  linkTypesInput.Size = new UDim2(0, 60, 0, 25);
  linkTypesInput.Position = new UDim2(0, 165, 0, 70); // Same X as node types, moved down Y
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

  // Pet types setting - positioned below link types
  const petTypesLabel = new Instance("TextLabel");
  petTypesLabel.Size = new UDim2(0, 150, 0, 25);
  petTypesLabel.Position = new UDim2(0, 10, 0, 105); // Below link types
  petTypesLabel.BackgroundTransparency = 1;
  petTypesLabel.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
  petTypesLabel.Text = "Number of Pet Types:";
  petTypesLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  petTypesLabel.TextScaled = true;
  petTypesLabel.TextXAlignment = Enum.TextXAlignment.Left;
  petTypesLabel.Parent = container;

  // Pet types input box
  const petTypesInput = new Instance("TextBox");
  petTypesInput.Name = "PetTypesInput";
  petTypesInput.Size = new UDim2(0, 60, 0, 25);
  petTypesInput.Position = new UDim2(0, 165, 0, 105); // Same X alignment
  petTypesInput.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
  petTypesInput.BorderSizePixel = 0;
  petTypesInput.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
  petTypesInput.Text = tostring(numPetTypes);
  petTypesInput.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  petTypesInput.TextScaled = true;
  petTypesInput.Parent = container;

  const petTypesCorner = new Instance("UICorner");
  petTypesCorner.CornerRadius = new UDim(0, 4);
  petTypesCorner.Parent = petTypesInput;

  // Input validation
  petTypesInput.FocusLost.Connect(() => {
    const value = tonumber(petTypesInput.Text);
    if (value && value >= 1 && value <= GUI_CONSTANTS.ENHANCED.DROPDOWN_ITEMS) {
      if (onPetTypesChange) {
        onPetTypesChange(math.floor(value));
      }
      petTypesInput.Text = tostring(math.floor(value));
    } else {
      petTypesInput.Text = tostring(numPetTypes);
    }
  });

  return container;
}