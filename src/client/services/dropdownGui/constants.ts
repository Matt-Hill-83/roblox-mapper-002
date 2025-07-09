export const GUI_CONSTANTS = {
  // Frame dimensions
  FRAME: {
    WIDTH: 200,
    HEIGHT: 150,
    POSITION: new UDim2(1, -210, 0.5, -75), // Far right of screen (10px margin)
    BACKGROUND_COLOR: new Color3(0.2, 0.2, 0.2),
    CORNER_RADIUS: new UDim(0, 8)
  },
  
  // Dropdown button
  DROPDOWN: {
    HEIGHT: 30,
    POSITION: new UDim2(0, 10, 0, 40),
    SIZE: new UDim2(1, -20, 0, 30),
    BACKGROUND_COLOR: new Color3(0.3, 0.3, 0.3),
    HOVER_COLOR: new Color3(0.35, 0.35, 0.35),
    TEXT_COLOR: new Color3(1, 1, 1),
    DEFAULT_TEXT: "Select Option"
  },
  
  // Option list
  OPTIONS: {
    POSITION: new UDim2(0, 10, 0, 75),
    SIZE: new UDim2(1, -20, 0, 90),
    BACKGROUND_COLOR: new Color3(0.25, 0.25, 0.25),
    OPTION_HEIGHT: 30,
    OPTIONS: ["a", "b", "c"]
  },
  
  // Title
  TITLE: {
    TEXT: "Dropdown Test",
    POSITION: new UDim2(0, 0, 0, 5),
    SIZE: new UDim2(1, 0, 0, 30),
    TEXT_COLOR: new Color3(1, 1, 1),
    FONT: Enum.Font.SourceSansBold,
    TEXT_SIZE: 18
  },
  
  // General
  NAMES: {
    SCREEN_GUI: "DropdownTestGUI",
    MAIN_FRAME: "MainFrame",
    DROPDOWN_BUTTON: "DropdownButton",
    OPTIONS_FRAME: "OptionsFrame",
    TITLE_LABEL: "TitleLabel"
  }
};