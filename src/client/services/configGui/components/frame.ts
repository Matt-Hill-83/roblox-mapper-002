import { GUI_CONSTANTS } from "../constants";
import { createUICorner } from "../utilities";

interface FrameOptions {
  name: string;
  parent: Instance;
  position?: UDim2;
  size?: UDim2;
  backgroundColor?: Color3;
  borderSizePixel?: number;
}

/**
 * Creates a generic frame with the given options
 */
export function createFrame(options: FrameOptions): Frame {
  const frame = new Instance("Frame");
  frame.Name = options.name;
  frame.Size = options.size || new UDim2(1, 0, 1, 0);
  frame.Position = options.position || new UDim2(0, 0, 0, 0);
  frame.BackgroundColor3 = options.backgroundColor || GUI_CONSTANTS.COLORS.BACKGROUND;
  frame.BorderSizePixel = options.borderSizePixel !== undefined ? options.borderSizePixel : 0;
  frame.Parent = options.parent;

  // Add corner rounding if using default border
  if (options.borderSizePixel === undefined || options.borderSizePixel === 0) {
    createUICorner(frame);
  }

  return frame;
}

/**
 * Creates the main frame for the configuration GUI
 */
export function createMainFrame(parent: ScreenGui, size?: UDim2): Frame {
  const configFrame = new Instance("Frame");
  configFrame.Name = GUI_CONSTANTS.NAMES.MAIN_FRAME;
  configFrame.Size = size || new UDim2(0, GUI_CONSTANTS.FRAME.WIDTH, 0, GUI_CONSTANTS.FRAME.HEIGHT);
  configFrame.Position = GUI_CONSTANTS.FRAME.POSITION;
  configFrame.BackgroundColor3 = GUI_CONSTANTS.COLORS.BACKGROUND;
  configFrame.BorderSizePixel = 0;
  configFrame.Parent = parent;

  // Add corner rounding
  createUICorner(configFrame);

  return configFrame;
}