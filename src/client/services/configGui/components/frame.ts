import { GUI_CONSTANTS } from "../constants";
import { createUICorner } from "../utilities";

/**
 * Creates the main frame for the configuration GUI
 */
export function createMainFrame(parent: ScreenGui): Frame {
  const configFrame = new Instance("Frame");
  configFrame.Name = GUI_CONSTANTS.NAMES.MAIN_FRAME;
  configFrame.Size = new UDim2(0, GUI_CONSTANTS.FRAME.WIDTH, 0, GUI_CONSTANTS.FRAME.HEIGHT);
  configFrame.Position = GUI_CONSTANTS.FRAME.POSITION;
  configFrame.BackgroundColor3 = GUI_CONSTANTS.COLORS.BACKGROUND;
  configFrame.BorderSizePixel = 0;
  configFrame.Parent = parent;

  // Add corner rounding
  createUICorner(configFrame);

  return configFrame;
}