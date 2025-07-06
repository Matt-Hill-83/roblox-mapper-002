/**
 * Constants for rope label creation
 */

export const ROPE_LABEL_CONSTANTS = {
  // Dimensions
  LABEL: {
    HEIGHT: 1.5,
    DEPTH: 0.1,
    SPACING: 0.2,
    Z_OFFSET: -3
  },
  
  // Text configuration
  TEXT: {
    SIZE: 0.3,
    COLORS: {
      SOURCE: new Color3(0.5, 0.8, 1),    // Light blue
      RELATION: new Color3(1, 0.8, 0.5),   // Orange
      TARGET: new Color3(0.5, 1, 0.8)      // Light green
    }
  },
  
  // Parsing configuration
  PARSING: {
    SEPARATOR: "_",
    MIN_PARTS: 3,
    SOURCE_INDEX: 0,
    RELATION_INDEX: 1,
    TARGET_INDEX: 2
  },
  
  // Label defaults
  DEFAULTS: {
    SOURCE_TEXT: "source",
    RELATION_TEXT: "relation", 
    TARGET_TEXT: "target"
  }
};