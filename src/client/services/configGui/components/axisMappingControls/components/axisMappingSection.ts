import { UI_CONSTANTS, getAvailableProperties } from "../constants";
import { createButton, createLabel, createSectionLabel } from "../utils/layoutManager";

import { createDropdown } from "./dropdown";

interface AxisMappingSectionProps {
  parent: Frame;
  xAxisValue: string;
  zAxisValue: string;
  yAxisValue: string;
  onXAxisChange: (value: string) => void;
  onZAxisChange: (value: string) => void;
  onYAxisChange: (value: string) => void;
}

/**
 * Creates the axis mapping section of the controls
 */
export function createAxisMappingSection({
  parent,
  xAxisValue,
  zAxisValue,
  yAxisValue,
  onXAxisChange,
  onZAxisChange,
  onYAxisChange
}: AxisMappingSectionProps): void {
  const availableProps = getAvailableProperties();
  
  
  
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

  // Y position grouping row
  createLabel(
    parent,
    "Y group:",
    new UDim2(0, UI_CONSTANTS.SPACING.SECTION_MARGIN, 0, 75),
    50
  );

  const yAxisButton = createButton(
    parent,
    "YAxisButton",
    yAxisValue,
    new UDim2(0, 65, 0, 75),
    UI_CONSTANTS.SPACING.DROPDOWN_WIDTH
  );

  // Create dropdown functionality
  createDropdown({
    button: xAxisButton,
    currentValue: xAxisValue,
    onChange: onXAxisChange,
    parent: parent,
    properties: availableProps
  });

  createDropdown({
    button: zAxisButton,
    currentValue: zAxisValue,
    onChange: onZAxisChange,
    parent: parent,
    properties: availableProps
  });

  createDropdown({
    button: yAxisButton,
    currentValue: yAxisValue,
    onChange: onYAxisChange,
    parent: parent,
    properties: availableProps
  });
}