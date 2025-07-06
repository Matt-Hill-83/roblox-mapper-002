import { GUI_CONSTANTS } from "../constants";
import { createDropdown } from "./dropdown";

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

  const nodeTypeItems = [];
  for (let i = 1; i <= GUI_CONSTANTS.ENHANCED.DROPDOWN_ITEMS; i++) {
    nodeTypeItems.push(tostring(i));
  }

  createDropdown({
    parent: container,
    position: new UDim2(0, 165, 0, 35),
    size: new UDim2(0, 80, 0, 25),
    items: nodeTypeItems,
    defaultValue: tostring(numNodeTypes),
    onChange: (value) => {
      const num = tonumber(value);
      if (num) {
        onNodeTypesChange(num);
      }
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

  const linkTypeItems = [];
  for (let i = 1; i <= GUI_CONSTANTS.ENHANCED.DROPDOWN_ITEMS; i++) {
    linkTypeItems.push(tostring(i));
  }

  createDropdown({
    parent: container,
    position: new UDim2(0, 435, 0, 35),
    size: new UDim2(0, 80, 0, 25),
    items: linkTypeItems,
    defaultValue: tostring(numLinkTypes),
    onChange: (value) => {
      const num = tonumber(value);
      if (num) {
        onLinkTypesChange(num);
      }
    }
  });

  return container;
}