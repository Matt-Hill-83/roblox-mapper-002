import { GUI_CONSTANTS } from "../constants";

interface TitleOptions {
  text: string;
  parent: Frame;
  position?: UDim2;
  size?: UDim2;
}

/**
 * Creates a title label with the given options
 */
export function createTitle(options: TitleOptions): TextLabel {
  const title = new Instance("TextLabel");
  title.Name = GUI_CONSTANTS.NAMES.TITLE;
  title.Size = options.size || new UDim2(1, 0, 0, GUI_CONSTANTS.TYPOGRAPHY.TITLE_HEIGHT);
  title.Position = options.position || new UDim2(0, 0, 0, 0);
  title.BackgroundTransparency = 1;
  title.Text = options.text;
  title.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  title.TextScaled = true;
  title.Font = GUI_CONSTANTS.TYPOGRAPHY.TITLE_FONT;
  title.Parent = options.parent;
  
  return title;
}