/**
 * Standardized interfaces for label block maker
 * Following the IMaker pattern
 */

import { ILabelMakerConfig } from "../../interfaces/IMaker";

/**
 * Label configuration for each face
 */
export interface IFaceLabelConfig {
  text: string;
  textColor?: Color3;
  backgroundColor?: Color3;
  borderColor?: Color3;
}

/**
 * Standardized configuration for label block creation
 */
export interface ILabelBlockMakerConfig extends ILabelMakerConfig {
  /** Size of the block (cube) */
  size?: number;
  
  /** Rotation of the block */
  rotation?: Vector3;
  
  /** Labels for each face */
  labels?: {
    front?: IFaceLabelConfig;
    back?: IFaceLabelConfig;
    left?: IFaceLabelConfig;
    right?: IFaceLabelConfig;
    top?: IFaceLabelConfig;
    bottom?: IFaceLabelConfig;
  };
  
  /** Block color */
  color?: Color3;
  
  /** Block material */
  material?: Enum.Material;
  
  /** Block transparency */
  transparency?: number;
  
  /** Whether the block is anchored */
  anchored?: boolean;
  
  /** Whether the block casts shadows */
  castShadow?: boolean;
  
  /** Override text box properties */
  textBoxOverrides?: {
    textSize?: number;
    font?: Enum.Font;
    borderSizePixel?: number;
  };
}

