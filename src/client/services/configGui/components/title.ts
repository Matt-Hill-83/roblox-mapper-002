import { GUI_CONSTANTS } from "../constants";

/**
 * Creates the title label for the configuration GUI
 */
export function createTitle(parent: Frame): TextLabel {
  const title = new Instance("TextLabel");
  title.Name = GUI_CONSTANTS.NAMES.TITLE;
  title.Size = new UDim2(1, 0, 0, GUI_CONSTANTS.TYPOGRAPHY.TITLE_HEIGHT);
  title.Position = new UDim2(0, 0, 0, 0);
  title.BackgroundTransparency = 1;
  title.Text = "Generator Configuration";
  title.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  title.TextScaled = true;
  title.Font = GUI_CONSTANTS.TYPOGRAPHY.TITLE_FONT;
  title.Parent = parent;
  
  return title;
}