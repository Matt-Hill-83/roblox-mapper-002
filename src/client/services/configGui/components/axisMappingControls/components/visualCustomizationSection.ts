import { VISUAL_PROPERTIES, UI_CONSTANTS } from "../constants";
import { createDropdown } from "./dropdown";
import { createSectionLabel, createLabel, createButton } from "../utils/layoutManager";

interface VisualCustomizationSectionProps {
  parent: Frame;
  backgroundColorValue: string;
  borderColorValue: string;
  onBackgroundColorChange: (value: string) => void;
  onBorderColorChange: (value: string) => void;
}

/**
 * Creates the visual customization section of the controls
 */
export function createVisualCustomizationSection({
  parent,
  backgroundColorValue,
  borderColorValue,
  onBackgroundColorChange,
  onBorderColorChange
}: VisualCustomizationSectionProps): void {
  // Section label
  createSectionLabel(parent, "Visual Customization", 85);

  // Background color row
  createLabel(
    parent,
    "background:",
    new UDim2(0, UI_CONSTANTS.SPACING.SECTION_MARGIN, 0, 105),
    UI_CONSTANTS.SPACING.LABEL_WIDTH
  );

  const bgColorButton = createButton(
    parent,
    "BgColorButton",
    backgroundColorValue,
    new UDim2(0, 95, 0, 105),
    150
  );

  // Border color row
  createLabel(
    parent,
    "border:",
    new UDim2(0, UI_CONSTANTS.SPACING.SECTION_MARGIN, 0, 130),
    UI_CONSTANTS.SPACING.LABEL_WIDTH
  );

  const borderColorButton = createButton(
    parent,
    "BorderColorButton",
    borderColorValue,
    new UDim2(0, 95, 0, 130),
    150
  );

  // Create dropdown functionality
  createDropdown({
    button: bgColorButton,
    currentValue: backgroundColorValue,
    onChange: onBackgroundColorChange,
    parent: parent,
    properties: VISUAL_PROPERTIES
  });

  createDropdown({
    button: borderColorButton,
    currentValue: borderColorValue,
    onChange: onBorderColorChange,
    parent: parent,
    properties: VISUAL_PROPERTIES
  });
}