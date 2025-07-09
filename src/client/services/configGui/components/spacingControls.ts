import { GUI_CONSTANTS } from "../constants";
import type { SpacingConfig } from "../../../../shared/interfaces/enhancedGenerator.interface";

interface SpacingControlsProps {
  parent: Frame;
  spacing: SpacingConfig;
  onSpacingChange: (field: keyof SpacingConfig, value: number) => void;
}

interface SpacingField {
  label: string;
  field: keyof SpacingConfig;
  min: number;
  max: number;
  default: number;
}

const SPACING_FIELDS: SpacingField[] = [
  { label: "Node Height:", field: "nodeHeight", min: 0.1, max: 100, default: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_HEIGHT },
  { label: "Node Radius:", field: "nodeRadius", min: 0.1, max: 20, default: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_RADIUS },
  { label: "Layer Spacing:", field: "layerSpacing", min: 0.1, max: 200, default: GUI_CONSTANTS.SPACING_DEFAULTS.LAYER_SPACING },
  { label: "Node Spacing:", field: "nodeSpacing", min: 0.1, max: 100, default: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_SPACING },
  { label: "Swimlane Spacing:", field: "swimlaneSpacing", min: 0.1, max: 100, default: GUI_CONSTANTS.SPACING_DEFAULTS.SWIMLANE_SPACING },
  { label: "Link Diameter:", field: "linkDiameter", min: 0.1, max: 10, default: GUI_CONSTANTS.SPACING_DEFAULTS.LINK_DIAMETER },
  { label: "Origin Y Offset:", field: "originYOffset", min: -100, max: 100, default: 0 }
];

export function createSpacingControls({
  parent,
  spacing,
  onSpacingChange
}: SpacingControlsProps): void {
  const rowHeight = 25;
  const labelWidth = 100;
  const inputWidth = 50;
  const startY = 35;
  const spacing_between = 5;
  const columnGap = 20;
  
  // Calculate column positions
  const col1X = 10;
  const col2X = col1X + labelWidth + inputWidth + columnGap;
  
  // Determine rows per column
  const itemsPerColumn = math.ceil(SPACING_FIELDS.size() / 2);

  SPACING_FIELDS.forEach((fieldDef, index) => {
    // Determine column and row
    const column = index < itemsPerColumn ? 0 : 1;
    const rowIndex = column === 0 ? index : index - itemsPerColumn;
    const yPos = startY + (rowIndex * (rowHeight + spacing_between));
    const xPos = column === 0 ? col1X : col2X;

    // Create label
    const label = new Instance("TextLabel");
    label.Size = new UDim2(0, labelWidth, 0, rowHeight);
    label.Position = new UDim2(0, xPos, 0, yPos);
    label.BackgroundTransparency = 1;
    label.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
    label.Text = fieldDef.label;
    label.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    label.TextScaled = true;
    label.TextXAlignment = Enum.TextXAlignment.Left;
    label.Parent = parent;

    // Create input box
    const input = new Instance("TextBox");
    input.Name = `${fieldDef.field}Input`;
    input.Size = new UDim2(0, inputWidth, 0, rowHeight);
    input.Position = new UDim2(0, xPos + labelWidth + 5, 0, yPos);
    input.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
    input.BorderSizePixel = 0;
    input.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
    input.Text = tostring(spacing[fieldDef.field] ?? fieldDef.default);
    input.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    input.TextScaled = true;
    input.Parent = parent;

    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 4);
    corner.Parent = input;

    // Input validation
    input.FocusLost.Connect(() => {
      const value = tonumber(input.Text);
      if (value && value >= fieldDef.min && value <= fieldDef.max) {
        // Keep decimal precision for all fields now that minimum is 0.1
        onSpacingChange(fieldDef.field, value);
        input.Text = tostring(value);
      } else {
        // Revert to current value
        input.Text = tostring(spacing[fieldDef.field] ?? fieldDef.default);
      }
    });
  });
}