export const GUI_CONSTANTS = {
  // Dimensions
  FRAME: {
    WIDTH: 350,
    HEIGHT: 285,
    ENHANCED_WIDTH: 650, // Doubled from 325
    ENHANCED_HEIGHT: 0, // Will be calculated as 90% of screen height
    ENHANCED_HEIGHT_SCALE: 0.9, // 90% of screen height
    POSITION: new UDim2(0, 10, 0, 10), // Upper left corner
    CORNER_RADIUS: new UDim(0, 8)
  },
  
  // Colors
  COLORS: {
    BACKGROUND: new Color3(0.2, 0.2, 0.2),
    TEXT: new Color3(1, 1, 1),
    ERROR: new Color3(1, 0.5, 0.5),
    SUCCESS: new Color3(0.1, 0.4, 0.1),
    BUTTON: {
      DEFAULT: new Color3(0.1, 0.3, 0.5),
      HOVER: new Color3(0.15, 0.35, 0.55),
      ACTIVE: new Color3(0.05, 0.25, 0.45)
    }
  },
  
  // Typography
  TYPOGRAPHY: {
    TITLE_FONT: Enum.Font.SourceSansBold,
    TITLE_HEIGHT: 30,
    INPUT_FONT: Enum.Font.SourceSans,
    BUTTON_FONT: Enum.Font.SourceSansSemibold,
    LABEL_FONT: Enum.Font.SourceSans
  },
  
  // Animation
  ANIMATION: {
    FLASH_DURATION: 0.5,
    BUTTON_FEEDBACK: 0.2,
    FADE_TIME: 0.3,
    COLLAPSE_DURATION: 0.3
  },
  
  // Component names
  NAMES: {
    SCREEN_GUI: "ConfigurationGUI",
    MAIN_FRAME: "ConfigFrame",
    TITLE: "Title",
    REGENERATE_BUTTON: "RegenerateButton",
    INPUT_PREFIX: "Input_",
    LABEL_PREFIX: "Label_"
  },
  
  // Input configuration
  INPUT: {
    HEIGHT: 25,
    SPACING: 5,
    LABEL_WIDTH: 0.5,
    INPUT_WIDTH: 0.4,
    START_Y: 40
  },
  
  // Enhanced mode configuration
  ENHANCED: {
    GLOBAL_SETTINGS_HEIGHT: 140, // Reduced height due to 2-column layout
    NODE_LINK_TYPES_HEIGHT: 110, // Increased for vertical stacking of node/link types
    GRID_HEADER_HEIGHT: 30,
    GRID_ROW_HEIGHT: 30,
    GRID_PADDING: 10,
    COLUMN_WIDTHS: {
      LAYER: 30, // Reduced for narrower GUI
      NODES: 40, // Reduced for narrower GUI
      CONNECTIONS: 50, // Reduced for narrower GUI
      NODE_TYPE: 60, // Reduced for narrower GUI
      LINK_TYPE: 60, // Reduced for narrower GUI
      DELETE: 30 // Reduced for narrower GUI
    },
    MAX_LAYERS: 10,
    DROPDOWN_ITEMS: 10
  },
  
  // Default spacing values
  SPACING_DEFAULTS: {
    NODE_HEIGHT: 1,
    NODE_RADIUS: 0.5,
    LAYER_SPACING: 2,
    NODE_SPACING: 1,
    SWIMLANE_SPACING: 1,
    LINK_DIAMETER: 0.5
  },
  
  // Button configuration
  BUTTON: {
    HEIGHT: 30,
    SPACING: 10,
    WIDTH: 90 // Reduced from 120 to fit narrower GUI
  },
  
  // Validation limits
  VALIDATION: {
    MAX_LAYERS: 10,
    MAX_NODES_PER_LAYER: 500,
    MAX_CONNECTIONS_PER_NODE: 5,
    MAX_TOTAL_NODES: 5000,
    MAX_TOTAL_CONNECTIONS: 5000,
    MAX_STRING_LENGTH: 50
  }
};