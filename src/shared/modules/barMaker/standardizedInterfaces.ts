/**
 * Standardized interfaces for bar maker
 * Following the IMaker pattern
 */

import { IVisualMakerConfig } from "../../interfaces/IMaker";

/**
 * Standardized configuration for bar creation
 */
export interface IBarMakerConfig extends IVisualMakerConfig {
  /** Rotation of the bar */
  rotation?: Vector3;
  
  /** Label text for the bar */
  label?: string;
  
  /** Stack index for hierarchical organization */
  stackIndex?: number;
  
  /** Hexagon index within the stack */
  hexIndex?: number;
  
  /** Bar index within the hexagon */
  barIndex?: number;
  
  /** Background color for the label */
  backgroundColor?: Color3;
  
  /** Border color for the label */
  borderColor?: Color3;
  
  /** Text color for the label */
  textColor?: Color3;
  
  /** Whether the bar is anchored */
  anchored?: boolean;
  
  /** Surface types */
  topSurface?: Enum.SurfaceType;
  bottomSurface?: Enum.SurfaceType;
}

