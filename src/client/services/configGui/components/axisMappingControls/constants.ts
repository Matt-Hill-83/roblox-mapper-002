// Available properties for axis mapping
export const AVAILABLE_PROPERTIES = [
  "type",
  "petType",
  "petColor",
  "age",
  "firstName",
  "lastName",
  "countryOfBirth",
  "countryOfResidence"
];

// Available properties for visual mapping (includes "none")
export const VISUAL_PROPERTIES = [
  "none",
  "type",
  "petType",
  "petColor",
  "age",
  "firstName",
  "lastName",
  "countryOfBirth",
  "countryOfResidence"
];

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
  X_AXIS: "type",
  Z_AXIS: "petType",
  BACKGROUND_COLOR: "none",
  BORDER_COLOR: "none",
  USE_LAYER_FOR_Y_AXIS: true
};