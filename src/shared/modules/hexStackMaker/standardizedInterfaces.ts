/**
 * Standardized interfaces for hex stack maker
 * Following the IMaker pattern
 */

import { IVisualMakerConfig } from "../../interfaces/IMaker";

/**
 * Standardized configuration for hex stack creation
 */
export interface IHexStackMakerConfig extends IVisualMakerConfig {
  /** Width of each hexagon in the stack */
  width?: number;
  
  /** Height of each hexagon in the stack */
  height?: number;
  
  /** Number of hexagons to stack */
  count?: number;
  
  /** Colors for each level (cycles if fewer than count) */
  colors?: Color3[];
  
  /** Stack index for hierarchical organization */
  stackIndex?: number;
  
  /** Labels for the hexagons */
  labels?: string[];
}

/**
 * Legacy hex stack configuration (for backward compatibility during migration)
 */

/**
 * Converts legacy config to standardized config
 */
