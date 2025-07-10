/**
 * Centralized constants for block rendering and positioning
 * Part of F002 refactoring to eliminate magic numbers
 */

import { Z_AXIS_COLORS, X_AXIS_COLORS } from "./robloxColors";

export const BLOCK_CONSTANTS = {
  DIMENSIONS: {
    DEFAULT_HEIGHT: 3,
    DEFAULT_WIDTH: 200,
    DEFAULT_DEPTH: 200,
    PLATFORM_SIZE: 100,
    SHADOW_BUFFER: 2, // DEPRECATED: Use LAYOUT_CONSTANTS.SHADOW_PADDING instead
    Z_PARALLEL_LANE_BUFFER: 4, // Extra Z-dimension buffer for Z-parallel lanes (formerly "X-axis swimlanes")
    X_PARALLEL_LANE_BUFFER: 4, // Extra X-dimension buffer for X-parallel lanes (formerly "Z-axis swimlanes")
    Z_FIGHTING_OFFSET: 0.1,
    SHADOW_BLOCK_HEIGHT: 2,
    MIN_BLOCK_SIZE: 1,
    LABEL_Y_OFFSET: 0.001, // Prevents z-fighting with labels
    UNIFORM_SHADOW_THICKNESS: 1.0, // Uniform thickness for all shadow layers
    SHADOW_LAYER_DISPLACEMENT: 0.1, // Vertical displacement between shadow layer tops
  },
  COLORS: {
    SHADOW: new Color3(0.5, 0.7, 1),
    PLATFORM: new Color3(0.5, 0, 0.5), // Purple
    Z_AXIS_COLORS: Z_AXIS_COLORS,
    X_PARALLEL_LANE_COLORS: X_AXIS_COLORS,
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
    Z_DIMENSION_GROUP_SPACING: 5, // Spacing between groups along Z dimension
    LABEL_OFFSET: 8,
    X_PARALLEL_LANE_Y_OFFSET: 0.1, // Raises X-parallel lanes (formerly "Z-axis swimlanes") to prevent occlusion
  },
};
