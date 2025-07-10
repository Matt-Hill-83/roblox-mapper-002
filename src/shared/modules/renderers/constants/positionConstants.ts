/**
 * Constants for position calculation and node arrangement
 * Part of F002 refactoring to eliminate magic numbers
 */

export const POSITION_CONSTANTS = {
  MIN_GROUND_CLEARANCE: 5,
  Z_DIMENSION_GROUP_SPACING: 5, // Spacing between groups along Z dimension
  BASE_Y: 20, // Default base Y position for nodes
  
  AGE_RANGES: {
    CHILD: { min: 0, max: 19, label: "0-19" },
    YOUNG_ADULT: { min: 20, max: 39, label: "20-39" },
    MIDDLE_AGED: { min: 40, max: 59, label: "40-59" },
    SENIOR: { min: 60, max: 79, label: "60-79" },
    ELDERLY: { min: 80, max: 999, label: "80+" },
  },
  
  BOUNDS: {
    INITIAL_MIN: math.huge,
    INITIAL_MAX: -math.huge,
  },
  
  LABEL: {
    Y_OFFSET: 2,
    X_OFFSET: -8,
    Z_OFFSET: -8,
    PLATFORM_EDGE_OFFSET: 8,
  },
  
  SWIMLANE: {
    GAP_MULTIPLIER: 1, // Additional gap between swimlanes
    CENTERING_DIVISOR: 2,
  },
};