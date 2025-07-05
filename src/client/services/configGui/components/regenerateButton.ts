/**
 * Creates the regenerate button for the configuration GUI
 * 
 * Part of the Screen GUI specification defined in:
 * 000ProjectSpecification/002ScreenGuiSpec.md
 */

import { RegenerateButtonProps } from "../interfaces";
import { GUI_CONSTANTS } from "../constants";
import { createUICorner, animateButtonClick } from "../utilities";

/**
 * Creates the regenerate button
 */
export function createRegenerateButton(params: RegenerateButtonProps): void {
  const { configFrame, onRegenerateClick } = params;
  
  const button = new Instance("TextButton");
  button.Name = GUI_CONSTANTS.NAMES.REGENERATE_BUTTON;
  button.Size = new UDim2(0.8, 0, 0, 30);
  button.Position = new UDim2(0.1, 0, 1, -40);
  button.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.DEFAULT;
  button.BorderSizePixel = 0;
  button.Text = "Regenerate";
  button.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  button.TextScaled = true;
  button.Font = GUI_CONSTANTS.TYPOGRAPHY.BUTTON_FONT;
  button.Parent = configFrame;

  // Add corner rounding
  createUICorner(button, new UDim(0, 6));

  // Add hover effect
  button.MouseEnter.Connect(() => {
    button.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.HOVER;
  });

  button.MouseLeave.Connect(() => {
    button.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.DEFAULT;
  });

  // Handle click
  button.MouseButton1Click.Connect(() => {
    animateButtonClick(button);
    onRegenerateClick();
  });
}