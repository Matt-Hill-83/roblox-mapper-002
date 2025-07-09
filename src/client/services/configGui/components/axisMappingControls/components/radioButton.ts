import { UI_CONSTANTS } from "../constants";
import type { RadioButtonProps } from "../types";

/**
 * Creates a radio button control
 */
export function createRadioButton({
  parent,
  position,
  text,
  selected,
  onSelect
}: RadioButtonProps): Frame {
  const container = new Instance("Frame");
  container.Name = "RadioButtonContainer";
  container.Position = position;
  container.Size = new UDim2(1, 0, 0, UI_CONSTANTS.SPACING.RADIO_SIZE);
  container.BackgroundTransparency = 1;
  container.Parent = parent;

  // Radio button circle
  const radioButton = new Instance("TextButton");
  radioButton.Name = "RadioButton";
  radioButton.Position = new UDim2(0, 0, 0, 0);
  radioButton.Size = new UDim2(0, UI_CONSTANTS.SPACING.RADIO_SIZE, 0, UI_CONSTANTS.SPACING.RADIO_SIZE);
  radioButton.BackgroundColor3 = UI_CONSTANTS.BUTTON.BACKGROUND_COLOR;
  radioButton.BorderSizePixel = 0;
  radioButton.Text = "";
  radioButton.Parent = container;

  const radioCorner = new Instance("UICorner");
  radioCorner.CornerRadius = new UDim(0.5, 0);
  radioCorner.Parent = radioButton;

  // Inner circle (visible when selected)
  const innerCircle = new Instance("Frame");
  innerCircle.Name = "InnerCircle";
  innerCircle.Position = new UDim2(0.5, 0, 0.5, 0);
  innerCircle.AnchorPoint = new Vector2(0.5, 0.5);
  innerCircle.Size = new UDim2(0, UI_CONSTANTS.SPACING.RADIO_INNER_SIZE, 0, UI_CONSTANTS.SPACING.RADIO_INNER_SIZE);
  innerCircle.BackgroundColor3 = UI_CONSTANTS.TEXT.BUTTON_COLOR;
  innerCircle.BorderSizePixel = 0;
  innerCircle.Visible = selected;
  innerCircle.Parent = radioButton;

  const innerCorner = new Instance("UICorner");
  innerCorner.CornerRadius = new UDim(0.5, 0);
  innerCorner.Parent = innerCircle;

  // Label
  const label = new Instance("TextLabel");
  label.Name = "RadioLabel";
  label.Text = text;
  label.Position = new UDim2(0, 25, 0, 0);
  label.Size = new UDim2(1, -25, 0, UI_CONSTANTS.SPACING.RADIO_SIZE);
  label.BackgroundTransparency = 1;
  label.TextColor3 = UI_CONSTANTS.TEXT.LABEL_COLOR;
  label.Font = Enum.Font.SourceSans;
  label.TextSize = UI_CONSTANTS.TEXT.LABEL_SIZE;
  label.TextXAlignment = Enum.TextXAlignment.Left;
  label.Parent = container;

  // Click handler
  radioButton.MouseButton1Click.Connect(() => {
    onSelect();
  });

  // Store reference to inner circle for external updates
  (container as any).InnerCircle = innerCircle;

  return container;
}

/**
 * Updates the selected state of a radio button
 */
export function updateRadioButtonState(radioContainer: Frame, selected: boolean): void {
  const innerCircle = (radioContainer as any).InnerCircle as Frame | undefined;
  if (innerCircle) {
    innerCircle.Visible = selected;
  }
}