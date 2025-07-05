export const BAR_CONSTANTS = {
  // Default dimensions
  DEFAULT_SIZE: [4, 2, 8] as [number, number, number],
  DEFAULT_COLOR: [0.2, 0.4, 0.8] as [number, number, number],
  
  // Formatting
  POINT_SIZE: 0.1,
  PAD_LENGTH: 3,
  
  // Naming prefixes
  NAME_PREFIXES: {
    BAR: "bar",
    ATTACHMENT: "att",
    HEX: "h",
    STACK: "st"
  },
  
  // Circle colors
  FRONT_CIRCLE_COLOR: [0, 1, 0] as [number, number, number], // Green
  BACK_CIRCLE_COLOR: [1, 0, 0] as [number, number, number], // Red
} as const;