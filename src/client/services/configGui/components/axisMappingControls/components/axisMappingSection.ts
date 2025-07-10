import { AVAILABLE_PROPERTIES, UI_CONSTANTS } from "../constants";
import { createDropdown } from "./dropdown";
import { createSectionLabel, createLabel, createButton } from "../utils/layoutManager";

interface AxisMappingSectionProps {
  parent: Frame;
  xAxisValue: string;
  zAxisValue: string;
  onXAxisChange: (value: string) => void;
  onZAxisChange: (value: string) => void;
}

/**
 * Creates the axis mapping section of the controls
 */
export function createAxisMappingSection({
  parent,
  xAxisValue,
  zAxisValue,
  onXAxisChange,
  onZAxisChange
}: AxisMappingSectionProps): void {
  // Section label
  createSectionLabel(parent, "Spatial Grouping", 5);

  // X position grouping row
  createLabel(
    parent,
    "X group:",
    new UDim2(0, UI_CONSTANTS.SPACING.SECTION_MARGIN, 0, 25),
    50
  );

  const xAxisButton = createButton(
    parent,
    "XAxisButton",
    xAxisValue,
    new UDim2(0, 65, 0, 25),
    UI_CONSTANTS.SPACING.DROPDOWN_WIDTH
  );

  // Z position grouping row
  createLabel(
    parent,
    "Z group:",
    new UDim2(0, UI_CONSTANTS.SPACING.SECTION_MARGIN, 0, 50),
    50
  );

  const zAxisButton = createButton(
    parent,
    "ZAxisButton",
    zAxisValue,
    new UDim2(0, 65, 0, 50),
    UI_CONSTANTS.SPACING.DROPDOWN_WIDTH
  );

  // Create dropdown functionality
  createDropdown({
    button: xAxisButton,
    currentValue: xAxisValue,
    onChange: onXAxisChange,
    parent: parent,
    properties: AVAILABLE_PROPERTIES
  });

  createDropdown({
    button: zAxisButton,
    currentValue: zAxisValue,
    onChange: onZAxisChange,
    parent: parent,
    properties: AVAILABLE_PROPERTIES
  });
}