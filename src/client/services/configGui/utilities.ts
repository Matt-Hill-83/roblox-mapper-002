import { GeneratorConfig } from "../../../shared/interfaces/simpleDataGenerator.interface";
import { GUI_CONSTANTS } from "./constants";

/**
 * Validates and returns the numeric value from input
 */
export function validateInput(
  value: string,
  min: number,
  max: number
): { isValid: boolean; value: number } {
  const numValue = tonumber(value);
  if (numValue !== undefined && numValue >= min && numValue <= max) {
    return { isValid: true, value: math.floor(numValue) };
  }
  return { isValid: false, value: min };
}

/**
 * Flashes a GUI element with a color for visual feedback
 */
export function flashColor(
  element: GuiObject & { BackgroundColor3?: Color3; TextColor3?: Color3 },
  flashColor: Color3,
  duration: number,
  property: "BackgroundColor3" | "TextColor3" = "BackgroundColor3"
): void {
  const originalColor = element[property];
  if (originalColor) {
    element[property] = flashColor;
    wait(duration);
    element[property] = originalColor;
  }
}

/**
 * Creates a UICorner instance with standard radius
 */
export function createUICorner(parent: GuiObject, radius?: UDim): UICorner {
  const corner = new Instance("UICorner");
  corner.CornerRadius = radius || GUI_CONSTANTS.FRAME.CORNER_RADIUS;
  corner.Parent = parent;
  return corner;
}

/**
 * Validates and updates an input field value
 */
export function validateAndUpdateInput(
  input: TextBox,
  currentConfig: GeneratorConfig,
  key: keyof GeneratorConfig,
  min: number,
  max: number
): boolean {
  const validation = validateInput(input.Text, min, max);
  
  if (validation.isValid) {
    currentConfig[key] = validation.value;
    input.Text = tostring(validation.value);
    input.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    return true;
  } else {
    // Reset to current valid value
    input.Text = tostring(currentConfig[key]);
    input.TextColor3 = GUI_CONSTANTS.COLORS.ERROR;
    
    // Flash red briefly
    flashColor(input, GUI_CONSTANTS.COLORS.TEXT, GUI_CONSTANTS.ANIMATION.FLASH_DURATION, "TextColor3");
    return false;
  }
}

/**
 * Provides visual feedback for button clicks
 */
export function animateButtonClick(button: TextButton): void {
  const originalColor = button.BackgroundColor3;
  button.BackgroundColor3 = GUI_CONSTANTS.COLORS.SUCCESS;
  wait(GUI_CONSTANTS.ANIMATION.BUTTON_FEEDBACK);
  button.BackgroundColor3 = originalColor;
}