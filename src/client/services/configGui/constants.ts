export const GUI_CONSTANTS = {
  // Dimensions
  FRAME: {
    WIDTH: 350,
    HEIGHT: 285,
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
    FADE_TIME: 0.3
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
  }
};