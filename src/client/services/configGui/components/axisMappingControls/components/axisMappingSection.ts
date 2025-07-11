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
  
  // Format properties with counts - TEMPORARILY DISABLED
  const propsWithCounts = availableProps.map(prop => {
    // const count = getPropertyValueCount(prop);
    // return count > 0 ? `${prop} [${count}]` : prop;
    return prop; // Temporarily just return the property name without count
  });
  
  
  
  // Section label
  createSectionLabel(parent, "Spatial Grouping", 5);

  // X position grouping row
  createLabel(
    parent,
    "X group:",
    new UDim2(0, UI_CONSTANTS.SPACING.SECTION_MARGIN, 0, 25),
    50
  );

  // Helper to format button text with count - TEMPORARILY DISABLED
  const formatButtonText = (prop: string): string => {
    // const count = getPropertyValueCount(prop);
    // return count > 0 ? `${prop} [${count}]` : prop;
    return prop; // Temporarily just return the property name without count
  };

  const xAxisButton = createButton(
    parent,
    "XAxisButton",
    formatButtonText(xAxisValue),
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
    formatButtonText(zAxisValue),
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
    formatButtonText(yAxisValue),
    new UDim2(0, 65, 0, 75),
    UI_CONSTANTS.SPACING.DROPDOWN_WIDTH
  );

  // Helper to extract property name from display string
  const extractPropertyName = (displayValue: string): string => {
    // TEMPORARILY SIMPLIFIED - just return the value as-is
    print(`[AxisMapping] Property selected: "${displayValue}"`);
    return displayValue;
  };

  // Create dropdown functionality
  createDropdown({
    button: xAxisButton,
    currentValue: xAxisValue,
    onChange: (value) => {
      const propName = extractPropertyName(value);
      xAxisButton.Text = formatButtonText(propName);
      onXAxisChange(propName);
    },
    parent: parent,
    properties: propsWithCounts
  });

  createDropdown({
    button: zAxisButton,
    currentValue: zAxisValue,
    onChange: (value) => {
      const propName = extractPropertyName(value);
      zAxisButton.Text = formatButtonText(propName);
      onZAxisChange(propName);
    },
    parent: parent,
    properties: propsWithCounts
  });

  createDropdown({
    button: yAxisButton,
    currentValue: yAxisValue,
    onChange: (value) => {
      const propName = extractPropertyName(value);
      yAxisButton.Text = formatButtonText(propName);
      onYAxisChange(propName);
    },
    parent: parent,
    properties: propsWithCounts
  });
}