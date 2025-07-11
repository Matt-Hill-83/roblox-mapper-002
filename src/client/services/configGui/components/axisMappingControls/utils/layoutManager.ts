import { UI_CONSTANTS } from "../constants";

/**
 * Creates a section label
 */
export function createSectionLabel(parent: Frame, text: string, yPosition: number): TextLabel {
  const label = new Instance("TextLabel");
  label.Name = `${text.gsub(" ", "")[0]}Label`;
  label.Text = text;
  label.Position = new UDim2(0, UI_CONSTANTS.SPACING.SECTION_MARGIN, 0, yPosition);
  label.Size = new UDim2(1, -UI_CONSTANTS.SPACING.SECTION_MARGIN * 2, 0, 15);
  label.BackgroundTransparency = 1;
  label.TextColor3 = UI_CONSTANTS.TEXT.SECTION_COLOR;
  label.Font = Enum.Font.SourceSans;
  label.TextSize = UI_CONSTANTS.TEXT.SECTION_SIZE;
  label.TextXAlignment = Enum.TextXAlignment.Left;
  label.Parent = parent;
  
  return label;
}

/**
 * Creates a label for a control
 */
export function createLabel(parent: Frame, text: string, position: UDim2, width: number): TextLabel {
  const label = new Instance("TextLabel");
  label.Name = `${text.gsub(" ", "")[0]}Label`;
  label.Text = text;
  label.Position = position;
  label.Size = new UDim2(0, width, 0, UI_CONSTANTS.BUTTON.HEIGHT);
  label.BackgroundTransparency = 1;
  label.TextColor3 = UI_CONSTANTS.TEXT.LABEL_COLOR;
  label.Font = Enum.Font.SourceSans;
  label.TextSize = UI_CONSTANTS.TEXT.LABEL_SIZE;
  label.TextXAlignment = Enum.TextXAlignment.Left;
  label.Parent = parent;
  
  return label;
}

/**
 * Creates a styled button
 */
export function createButton(parent: Frame, name: string, text: string, position: UDim2, width: number): TextButton {
  const button = new Instance("TextButton");
  button.Name = name;
  button.Text = text;
  button.Position = position;
  button.Size = new UDim2(0, width, 0, UI_CONSTANTS.BUTTON.HEIGHT);
  button.BackgroundColor3 = UI_CONSTANTS.BUTTON.BACKGROUND_COLOR;
  button.BorderSizePixel = 0;
  button.TextColor3 = UI_CONSTANTS.TEXT.BUTTON_COLOR;
  button.Font = Enum.Font.SourceSans;
  button.TextSize = UI_CONSTANTS.TEXT.LABEL_SIZE;
  button.Parent = parent;

  // Corner radius removed with applyCornerRadius function
  
  return button;
}

/**
 * Applies corner radius to a GUI object
 */

/**
 * Creates the main container frame
 */
export function createMainFrame(gui: ScreenGui): Frame {
  const mainFrame = new Instance("Frame");
  mainFrame.Name = "AxisControlsFrame";
  mainFrame.Size = new UDim2(0, UI_CONSTANTS.FRAME.WIDTH, 0, UI_CONSTANTS.FRAME.HEIGHT);
  mainFrame.Position = new UDim2(1, -UI_CONSTANTS.FRAME.WIDTH - 10, 0.5, -UI_CONSTANTS.FRAME.HEIGHT / 2);
  mainFrame.BackgroundColor3 = UI_CONSTANTS.FRAME.BACKGROUND_COLOR;
  mainFrame.BorderSizePixel = 0;
  mainFrame.Parent = gui;

  // Corner radius removed with applyCornerRadius function
  
  return mainFrame;
}

/**
 * Sets button enabled state
 */
export function setButtonEnabled(button: TextButton, enabled: boolean): void {
  button.Active = enabled;
  button.BackgroundColor3 = enabled 
    ? UI_CONSTANTS.BUTTON.BACKGROUND_COLOR 
    : UI_CONSTANTS.BUTTON.DISABLED_BACKGROUND_COLOR;
  button.TextColor3 = enabled 
    ? UI_CONSTANTS.TEXT.BUTTON_COLOR 
    : UI_CONSTANTS.TEXT.DISABLED_COLOR;
}