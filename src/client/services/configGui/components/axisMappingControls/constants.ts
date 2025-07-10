import { AXIS_DEFAULTS } from "../../../../../shared/constants/axisDefaults";

// Available properties for axis mapping - now dynamic
export let AVAILABLE_PROPERTIES: string[] = [
  // Will be populated dynamically from discovered properties
  // Fallback to legacy properties if no properties discovered
  "type",
  "petType",
  "petColor",
  "age",
  "firstName",
  "lastName",
  "countryOfBirth",
  "countryOfResidence"
];

// Available properties for visual mapping (includes "none") - now dynamic
export let VISUAL_PROPERTIES: string[] = [
  "none",
  // Will be populated dynamically from discovered properties
  // Fallback to legacy properties if no properties discovered
  "type",
  "petType",
  "petColor",
  "age",
  "firstName",
  "lastName",
  "countryOfBirth",
  "countryOfResidence"
];

/**
 * Updates the available properties from discovered data properties
 * @param discoveredProps - Array of property names discovered from data
 */
export function updateAvailableProperties(discoveredProps: string[]): void {
  if (discoveredProps && discoveredProps.size() > 0) {
    // Update axis mapping properties
    AVAILABLE_PROPERTIES = [...discoveredProps];
    
    // Update visual properties (include "none" option)
    VISUAL_PROPERTIES = ["none", ...discoveredProps];
    
    print(`[axisMappingControls] Updated available properties with ${discoveredProps.size()} discovered properties`);
  }
}

// UI Constants
export const UI_CONSTANTS = {
  FRAME: {
    WIDTH: 300,
    HEIGHT: 250,
    BACKGROUND_COLOR: new Color3(0.2, 0.2, 0.2),
    CORNER_RADIUS: 8
  },
  BUTTON: {
    HEIGHT: 20,
    BACKGROUND_COLOR: new Color3(0.3, 0.3, 0.3),
    HOVER_COLOR: new Color3(0.35, 0.35, 0.35),
    DISABLED_BACKGROUND_COLOR: new Color3(0.2, 0.2, 0.2),
    CORNER_RADIUS: 4
  },
  TEXT: {
    SECTION_COLOR: new Color3(0.6, 0.6, 0.6),
    LABEL_COLOR: new Color3(0.8, 0.8, 0.8),
    BUTTON_COLOR: new Color3(1, 1, 1),
    DISABLED_COLOR: new Color3(0.5, 0.5, 0.5),
    SECTION_SIZE: 12,
    LABEL_SIZE: 14
  },
  SPACING: {
    SECTION_MARGIN: 10,
    LABEL_WIDTH: 80,
    DROPDOWN_WIDTH: 180,
    DROPDOWN_OFFSET: 5,
    RADIO_SIZE: 16,
    RADIO_INNER_SIZE: 8
  },
  DROPDOWN: {
    MAX_VISIBLE_ITEMS: 8,
    ITEM_HEIGHT: 20,
    BACKGROUND_COLOR: new Color3(0.25, 0.25, 0.25),
    SCROLL_BAR_THICKNESS: 4
  }
};

// Default values
export const DEFAULTS = {
  X_AXIS: AXIS_DEFAULTS.LEGACY_X_AXIS,
  Z_AXIS: AXIS_DEFAULTS.LEGACY_Z_AXIS,
  BACKGROUND_COLOR: "none",
  BORDER_COLOR: "none",
  USE_LAYER_FOR_Y_AXIS: true
};