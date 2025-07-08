import { GUI_CONSTANTS } from "../constants";
import type { VisualizationOptions } from "../../../../shared/interfaces/enhancedGenerator.interface";

interface VisualizationControlsProps {
  parent: Frame;
  visualization: VisualizationOptions;
  onVisualizationChange: (field: keyof VisualizationOptions, value: boolean | number) => void;
}

interface CheckboxField {
  label: string;
  field: keyof VisualizationOptions;
  default: boolean;
}

const CHECKBOX_FIELDS: CheckboxField[] = [
  { label: "Show nodes", field: "showNodes", default: true },
  { label: "Show link labels", field: "showLinkLabels", default: false },
  { label: "Show connectors", field: "showConnectors", default: true },
  { label: "Create same-layer links", field: "allowSameLevelLinks", default: false },
  { label: "Rand Z", field: "randomZOffset", default: false }
];

export function createVisualizationControls({
  parent,
  visualization,
  onVisualizationChange
}: VisualizationControlsProps): Frame {
  // Create container - now positioned above the buttons due to narrower width
  const container = new Instance("Frame");
  container.Name = "VisualizationControls";
  container.Size = new UDim2(1, 0, 1, 0); // Use full size of parent
  // Position above the buttons
  container.Position = new UDim2(0, 0, 0, 0); // Position will be set by layout manager
  container.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
  container.BorderSizePixel = 0;
  container.Parent = parent;

  const containerCorner = new Instance("UICorner");
  containerCorner.CornerRadius = new UDim(0, 4);
  containerCorner.Parent = container;

  const rowHeight = 30;
  const checkboxSize = 20;
  const labelOffset = 30;
  const startY = 20;
  const spacing_between = 10;
  const columnsPerRow = 2;
  const columnWidth = (1 / columnsPerRow);

  // Add title
  const title = new Instance("TextLabel");
  title.Name = "Title";
  title.Size = new UDim2(1, -20, 0, 20);
  title.Position = new UDim2(0, 10, 0, 0);
  title.BackgroundTransparency = 1;
  title.Text = "Visualization Options";
  title.TextColor3 = new Color3(0.9, 0.9, 0.9);
  title.TextScaled = false;
  title.TextSize = 14;
  title.Font = Enum.Font.SourceSansBold;
  title.TextXAlignment = Enum.TextXAlignment.Left;
  title.Parent = container;

  CHECKBOX_FIELDS.forEach((fieldDef, index) => {
    const row = math.floor(index / columnsPerRow);
    const col = index % columnsPerRow;
    const xPos = col * columnWidth;
    const yPos = startY + (row * (rowHeight + spacing_between));

    // Create checkbox frame
    const checkboxFrame = new Instance("Frame");
    checkboxFrame.Name = `${fieldDef.field}Frame`;
    checkboxFrame.Size = new UDim2(columnWidth, -10, 0, rowHeight);
    checkboxFrame.Position = new UDim2(xPos, 10, 0, yPos);
    checkboxFrame.BackgroundTransparency = 1;
    checkboxFrame.Parent = container;

    // Create checkbox button
    const checkbox = new Instance("TextButton");
    checkbox.Name = `${fieldDef.field}Checkbox`;
    checkbox.Size = new UDim2(0, checkboxSize, 0, checkboxSize);
    checkbox.Position = new UDim2(0, 0, 0.5, -checkboxSize/2);
    checkbox.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
    checkbox.BorderSizePixel = 0;
    checkbox.Text = "";
    checkbox.Parent = checkboxFrame;

    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 4);
    corner.Parent = checkbox;

    // Create checkmark
    const checkmark = new Instance("TextLabel");
    checkmark.Name = "Checkmark";
    checkmark.Size = new UDim2(1, 0, 1, 0);
    checkmark.BackgroundTransparency = 1;
    checkmark.Font = Enum.Font.SourceSansBold;
    checkmark.Text = "✓";
    checkmark.TextColor3 = GUI_CONSTANTS.COLORS.SUCCESS;
    checkmark.TextScaled = true;
    checkmark.Visible = visualization[fieldDef.field] as boolean;
    checkmark.Parent = checkbox;

    // Create label
    const label = new Instance("TextLabel");
    label.Size = new UDim2(1, -labelOffset, 1, 0);
    label.Position = new UDim2(0, labelOffset, 0, 0);
    label.BackgroundTransparency = 1;
    label.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
    label.Text = fieldDef.label;
    label.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    label.TextSize = 14;
    label.TextXAlignment = Enum.TextXAlignment.Left;
    label.Parent = checkboxFrame;

    // Handle checkbox click
    checkbox.MouseButton1Click.Connect(() => {
      const newValue = !(visualization[fieldDef.field] as boolean);
      (visualization as any)[fieldDef.field] = newValue;
      checkmark.Visible = newValue;
      onVisualizationChange(fieldDef.field, newValue);
      
      // Update Z offset input visibility if this is the randomZOffset checkbox
      if (fieldDef.field === "randomZOffset") {
        const zOffsetInput = container.FindFirstChild("ZOffsetInput") as TextBox;
        if (zOffsetInput) {
          zOffsetInput.TextEditable = newValue;
          zOffsetInput.TextColor3 = newValue ? GUI_CONSTANTS.COLORS.TEXT : new Color3(0.5, 0.5, 0.5);
        }
      }
    });
  });

  // Add Z offset input field after the Random Z checkbox
  const zOffsetY = startY + (CHECKBOX_FIELDS.size() * (rowHeight + spacing_between)) + 5;
  
  // Create Z offset label
  const zOffsetLabel = new Instance("TextLabel");
  zOffsetLabel.Size = new UDim2(0, 60, 0, rowHeight);
  zOffsetLabel.Position = new UDim2(0, 10, 0, zOffsetY);
  zOffsetLabel.BackgroundTransparency = 1;
  zOffsetLabel.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
  zOffsetLabel.Text = "Z Offset:";
  zOffsetLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  zOffsetLabel.TextSize = 14;
  zOffsetLabel.TextXAlignment = Enum.TextXAlignment.Left;
  zOffsetLabel.Parent = container;
  
  // Create Z offset input
  const zOffsetInput = new Instance("TextBox");
  zOffsetInput.Name = "ZOffsetInput";
  zOffsetInput.Size = new UDim2(0, 50, 0, rowHeight);
  zOffsetInput.Position = new UDim2(0, 75, 0, zOffsetY);
  zOffsetInput.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
  zOffsetInput.BorderSizePixel = 0;
  zOffsetInput.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
  zOffsetInput.Text = tostring(visualization.zOffsetAmount || 5);
  zOffsetInput.TextColor3 = visualization.randomZOffset ? GUI_CONSTANTS.COLORS.TEXT : new Color3(0.5, 0.5, 0.5);
  zOffsetInput.TextScaled = true;
  zOffsetInput.TextEditable = visualization.randomZOffset;
  zOffsetInput.Parent = container;
  
  const zOffsetCorner = new Instance("UICorner");
  zOffsetCorner.CornerRadius = new UDim(0, 4);
  zOffsetCorner.Parent = zOffsetInput;
  
  // Handle Z offset input changes
  zOffsetInput.FocusLost.Connect(() => {
    const value = tonumber(zOffsetInput.Text);
    if (value && value >= 0 && value <= 100) {
      visualization.zOffsetAmount = value;
      onVisualizationChange("zOffsetAmount", value);
      zOffsetInput.Text = tostring(value);
    } else {
      // Reset to current value if invalid
      zOffsetInput.Text = tostring(visualization.zOffsetAmount || 5);
    }
  });
  
  return container;
}