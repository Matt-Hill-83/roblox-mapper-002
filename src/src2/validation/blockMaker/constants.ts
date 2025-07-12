export const BLOCK_CONSTANTS = {
  // Default dimensions
  DEFAULT_SIZE: [4, 4, 4] as [number, number, number],
  DEFAULT_COLOR: [0.5, 0.5, 0.5] as [number, number, number],

  // Formatting
  POINT_SIZE: 0.1,
  PAD_LENGTH: 3,

  // Naming prefixes
  NAME_PREFIXES: {
    BLOCK: "rx-cube",
    ATTACHMENT: "att",
    HEX: "h",
    STACK: "st",
  },
} as const;
