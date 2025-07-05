export const HEXAGON_CONSTANTS = {
  // Default values
  DEFAULT_CENTER_POSITION: [0, 2, 0] as [number, number, number],
  DEFAULT_WIDTH: 10,
  DEFAULT_HEIGHT: 0.5,
  DEFAULT_LABELS: ["Front", "Left", "Right"],
  
  // Hexagon properties
  NUM_BARS: 3,
  ROTATION_ANGLE: 60, // degrees between bars
  
  // Bar properties
  DEFAULT_BAR_COLOR: [0.9, 0.7, 0.3] as [number, number, number], // Golden
  
  // Center cube properties
  CENTER_CUBE: {
    SIZE: 0.1,
    TRANSPARENCY: 0.4,
    COLOR_RGB: [255, 255, 0] as [number, number, number] // Yellow
  },
  
  // Name prefixes
  NAME_PREFIXES: {
    HEXAGON: "h",
    STACK: "st",
    CENTER_CUBE: "centerCube",
    CENTER_ATTACHMENT: "att000"
  }
};