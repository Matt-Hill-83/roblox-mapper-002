/**
 * Constants for layout construction and lane dimensions
 * Part of F006 - ReDesign Layout Construction
 */

export const LAYOUT_CONSTANTS = {
  LANE_DIMENSIONS: {
    // Z-parallel lanes (vertical colored blocks)
    Z_PARALLEL_LANE_WIDTH: 20, // Fixed width for Z-parallel lanes
    
    // X-parallel lanes (horizontal blocks)
    X_PARALLEL_LANE_DEPTH: 4, // Fixed depth (Z dimension) for X-parallel lanes
    X_PARALLEL_LANE_HEIGHT: 1, // Fixed height for X-parallel lanes
  },
  
  LANE_SPACING: {
    Z_PARALLEL_LANE_SPACING: 5, // Space between Z-parallel lanes
  },
  
  SHADOW_PADDING: {
    X_PADDING: 5, // Padding on left/right of all content
    Z_PADDING: 5, // Padding on front/back of all content
  },
  
  NODE_SPACING: {
    X_DIRECTION_NODE_SPACING: 3, // Space between nodes along X axis
  }
};