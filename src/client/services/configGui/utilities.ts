import { GUI_CONSTANTS } from "./constants";



/**
 * Creates a UICorner instance with standard radius
 */
export function createUICorner(parent: GuiObject, radius?: UDim): UICorner {
  const corner = new Instance("UICorner");
  corner.CornerRadius = radius || GUI_CONSTANTS.FRAME.CORNER_RADIUS;
  corner.Parent = parent;
  return corner;
}


