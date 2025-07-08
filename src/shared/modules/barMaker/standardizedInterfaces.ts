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

/**
 * Legacy bar configuration (for backward compatibility during migration)
 */
export interface BarConfigLegacy {
  id: string | number;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  props?: {
    Size?: [number, number, number];
    Color?: [number, number, number];
    Material?: string;
    Anchored?: boolean;
    TopSurface?: string;
    BottomSurface?: string;
    Transparency?: number;
    BackgroundColor?: Color3;
    BorderColor?: Color3;
    [key: string]: any;
  };
  label?: string;
  stackIndex?: number;
  hexIndex?: number;
  barIndex?: number;
}

/**
 * Converts legacy config to standardized config
 */
export function convertLegacyBarConfig(legacy: BarConfigLegacy): IBarMakerConfig {
  const config: IBarMakerConfig = {
    id: legacy.id,
    label: legacy.label,
    stackIndex: legacy.stackIndex,
    hexIndex: legacy.hexIndex,
    barIndex: legacy.barIndex,
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
    if (legacy.props.Size) {
      config.size = new Vector3(
        legacy.props.Size[0],
        legacy.props.Size[1],
        legacy.props.Size[2]
      );
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
    if (legacy.props.TopSurface) {
      config.topSurface = legacy.props.TopSurface as unknown as Enum.SurfaceType;
    }
    if (legacy.props.BottomSurface) {
      config.bottomSurface = legacy.props.BottomSurface as unknown as Enum.SurfaceType;
    }
    config.backgroundColor = legacy.props.BackgroundColor;
    config.borderColor = legacy.props.BorderColor;
  }

  return config;
}