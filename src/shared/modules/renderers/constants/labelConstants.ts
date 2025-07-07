/**
 * Constants for label rendering
 * Part of F002 refactoring to eliminate magic numbers
 */

export const LABEL_CONSTANTS = {
  COLORS: {
    DEFAULT_TEXT: new Color3(1, 1, 1), // White
    DEFAULT_BACKGROUND: new Color3(0, 0, 0), // Black
    DEFAULT_BORDER: new Color3(0, 0, 0), // Black
    SHADOW: new Color3(0, 0, 0), // Black for text shadows
  },
  TRANSPARENCY: {
    BACKGROUND: 0.7,
    PART: 1, // Invisible label part
    TEXT_STROKE: 0.5,
  },
  SIZES: {
    BILLBOARD_WIDTH: 100,
    BILLBOARD_HEIGHT: 25,
    PART_SIZE: 0.1,
    FONT_SIZE: 75,
    BORDER_SIZE: 10,
    TEXT_SCALE_FACTOR: 0.9, // Text takes 90% of frame
  },
  OFFSETS: {
    POSITION_OFFSET: 2, // Y offset above blocks
    PLATFORM_EDGE_OFFSET: 8, // Distance from platform edge
  },
  FORMATTING: {
    FONT: Enum.Font.SourceSans,
    FONT_BOLD: Enum.Font.SourceSansBold,
    SURFACE_GUI_PIXELS_PER_STUD: 50,
  },
  NAMES: {
    LABEL_PREFIX: "Label_",
    SURFACE_GUI_PREFIX: "Label_",
  },
};