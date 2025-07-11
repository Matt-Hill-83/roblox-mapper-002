/**
 * Standardized interfaces for hexagon maker
 * Following the IMaker pattern
 */

import { IVisualMakerConfig } from "../../interfaces/IMaker";

/**
 * Standardized configuration for hexagon creation
 */
export interface IHexagonMakerConfig extends IVisualMakerConfig {
  /** Width of the hexagon */
  width?: number;
  
  /** Height of the hexagon */
  height?: number;
  
  /** Labels for the hexagon bars */
  labels?: string[];
  
  /** Stack index for hierarchical organization */
  stackIndex?: number;
  
  /** Hexagon index within the stack */
  hexIndex?: number;
  
  /** Optional GUID for tracking */
  guid?: string;
  
  /** Properties for the bars */
  barColor?: Color3;
  barMaterial?: Enum.Material;
  barTransparency?: number;
}

