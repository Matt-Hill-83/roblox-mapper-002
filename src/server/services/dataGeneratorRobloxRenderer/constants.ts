/**
 * Constants for the Data Generator Roblox Renderer
 */

export const RENDERER_CONSTANTS = {
  // Positioning constants for Roblox viewing
  POSITIONING: {
    COLUMN_SPACING: 10,  // 10 studs between columns (hexagons are 8 wide)
    LEVEL_SPACING: 5,    // 5 studs between levels vertically
    BASE_Y: 20,          // Start 20 studs above ground in the up/down axis
  },
  
  // Hexagon dimensions
  HEXAGON: {
    WIDTH: 8,
    HEIGHT: 1.5,
  },
  
  // Rope properties
  ROPE: {
    THICKNESS: 0.4,
    LENGTH_MULTIPLIER: 1.0, // No sag - exact distance
  },
  
  // Link color mapping
  LINK_COLORS: {
    "Parent-Child": new BrickColor("Black"),
    "Owns": new BrickColor("Brown"),
    "Wants": new BrickColor("Bright violet"),
    "Eats": new BrickColor("Bright yellow"),
    "Link4": new BrickColor("Cyan"),
    "Link5": new BrickColor("Bright red"),
    "Link6": new BrickColor("Bright violet"),
    "Link7": new BrickColor("Brown"),
    "Link8": new BrickColor("Medium stone grey"),
    "Link9": new BrickColor("Bright orange"),
    "Link10": new BrickColor("Light blue"),
  },
  
  // Draw.io constants
  DRAWIO: {
    SCALE: {
      X: 10,      // X-axis scale factor
      Y: 10,      // Y-axis scale factor (doubled from 5)
      Y_OFFSET: 400, // Y-axis offset for inversion
    },
    NODE: {
      WIDTH: 120,
      HEIGHT: 60,
    },
    EDGE_COLORS: {
      "Parent-Child": "#000000",
      "Owns": "#8B4513",
      "Wants": "#9370DB",
      "Eats": "#FFD700",
      "Link4": "#00FFFF",
      "Link5": "#FF0000",
      "Link6": "#9370DB",
      "Link7": "#8B4513",
      "Link8": "#808080",
      "Link9": "#FFA500",
      "Link10": "#ADD8E6",
    },
    NODE_COLORS: {
      People: "#4A90E2",
      Animals: "#F5A623",
    },
  },
  
  // Default fallback color
  DEFAULT_COLOR: new BrickColor("Bright red"),
  DEFAULT_DRAWIO_COLOR: "#FF0000",
};