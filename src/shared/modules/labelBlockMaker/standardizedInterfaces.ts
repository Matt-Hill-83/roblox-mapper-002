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

/**
 * Legacy label block configuration (for backward compatibility during migration)
 */
export interface LabelBlockConfigLegacy {
  id: string | number;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  props?: {
    Size?: number;
    Color?: [number, number, number];
    Material?: string;
    Anchored?: boolean;
    Transparency?: number;
    CastShadow?: boolean;
    [key: string]: any;
  };
  labels?: {
    [face: string]: {
      text: string;
      textColor?: Color3;
      backgroundColor?: Color3;
      borderColor?: Color3;
    };
  };
  textBoxOverrides?: {
    textSize?: number;
    font?: Enum.Font;
    borderSizePixel?: number;
  };
  parent?: Instance;
}

/**
 * Converts legacy config to standardized config
 */
export function convertLegacyLabelBlockConfig(legacy: LabelBlockConfigLegacy): ILabelBlockMakerConfig {
  const config: ILabelBlockMakerConfig = {
    id: legacy.id,
    parent: legacy.parent,
    text: "", // Will be set from labels
    textBoxOverrides: legacy.textBoxOverrides,
  };

  // Convert position
  if (legacy.position) {
    config.position = new Vector3(
      legacy.position.x,
      legacy.position.y,
      legacy.position.z
    );
  }

  // Convert rotation
  if (legacy.rotation) {
    config.rotation = new Vector3(
      legacy.rotation.x,
      legacy.rotation.y,
      legacy.rotation.z
    );
  }

  // Convert props
  if (legacy.props) {
    if (legacy.props.Size !== undefined) {
      config.size = legacy.props.Size;
    }
    if (legacy.props.Color) {
      config.color = new Color3(
        legacy.props.Color[0],
        legacy.props.Color[1],
        legacy.props.Color[2]
      );
    }
    if (legacy.props.Material) {
      config.material = legacy.props.Material as unknown as Enum.Material;
    }
    if (legacy.props.Transparency !== undefined) {
      config.transparency = legacy.props.Transparency;
    }
    if (legacy.props.Anchored !== undefined) {
      config.anchored = legacy.props.Anchored;
    }
    if (legacy.props.CastShadow !== undefined) {
      config.castShadow = legacy.props.CastShadow;
    }
  }

  // Convert labels
  if (legacy.labels) {
    config.labels = legacy.labels as any; // Labels are already in the right format
  }

  return config;
}