/**
 * Centralized constants for block rendering and positioning
 * Part of F002 refactoring to eliminate magic numbers
 */

export const BLOCK_CONSTANTS = {
  DIMENSIONS: {
    DEFAULT_HEIGHT: 3,
    DEFAULT_WIDTH: 200,
    DEFAULT_DEPTH: 200,
    PLATFORM_SIZE: 100,
    SHADOW_BUFFER: 2,
    Z_FIGHTING_OFFSET: 0.1,
    SHADOW_BLOCK_HEIGHT: 2,
    MIN_BLOCK_SIZE: 1,
    LABEL_Y_OFFSET: 0.001, // Prevents z-fighting with labels
    UNIFORM_SHADOW_THICKNESS: 1.0, // Uniform thickness for all shadow layers
    SHADOW_LAYER_DISPLACEMENT: 1, // Vertical displacement between shadow layer tops
  },
  COLORS: {
    SHADOW: new Color3(0.5, 0.7, 1),
    PLATFORM: new Color3(0.5, 0, 0.5), // Purple
    Z_AXIS_COLORS: [
      new Color3(0.8, 0.2, 0.2), // Red
      new Color3(0.2, 0.8, 0.2), // Green
      new Color3(0.2, 0.2, 0.8), // Blue
      new Color3(0.8, 0.8, 0.2), // Yellow
      new Color3(0.8, 0.2, 0.8), // Magenta
      new Color3(0.2, 0.8, 0.8), // Cyan
      new Color3(0.6, 0.3, 0.1), // Brown
      new Color3(1, 0.5, 0),     // Orange
      new Color3(0.5, 0, 0.5),   // Purple
      new Color3(0, 0.5, 0),     // Dark Green
    ],
  },
  TRANSPARENCY: {
    OPAQUE: 0,
    SEMI_TRANSPARENT: 0.5,
    FORCE_FIELD: 0.8,
  },
  MATERIALS: {
    SHADOW: Enum.Material.Concrete,
    PLATFORM: Enum.Material.Plastic,
    SWIMLANE: Enum.Material.Concrete,
  },
  POSITIONING: {
    MIN_GROUND_CLEARANCE: 5,
    Z_AXIS_SPACING: 5,
    LABEL_OFFSET: 8,
    SWIMLANE_Y_OFFSET: 0.1, // Raises Z-axis swimlanes to prevent occlusion
  },
};