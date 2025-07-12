/**
 * Standardized interfaces for block maker
 * Following the IMaker pattern
 */

// import { IVisualMakerConfig } from "../../interfaces/IMaker";

// Simplified interface for block maker
export interface IVisualMakerConfig {
  position?: Vector3;
  size?: Vector3 | [number, number, number];
  color?: Color3 | [number, number, number];
  material?: Enum.Material;
  transparency?: number;
  parent?: Instance;
  castShadow?: boolean;
}

/**
 * Standardized configuration for block creation
 */
export interface IBlockMakerConfig extends IVisualMakerConfig {
  /** Rotation of the block */
  rotation?: Vector3;
  
  /** Label text for the block */
  label?: string;
  
  /** Stack index for hierarchical organization */
  stackIndex?: number;
  
  /** Hexagon index within the stack */
  hexIndex?: number;
  
  /** Block index within the hexagon */
  blockIndex?: number;
  
  /** Background color for the label */
  backgroundColor?: Color3;
  
  /** Border color for the label */
  borderColor?: Color3;
  
  /** Text color for the label */
  textColor?: Color3;
  
  /** Whether the block is anchored */
  anchored?: boolean;
  
  /** Surface types */
  topSurface?: Enum.SurfaceType;
  bottomSurface?: Enum.SurfaceType;
}

