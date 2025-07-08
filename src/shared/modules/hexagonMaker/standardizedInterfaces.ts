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

/**
 * Legacy hexagon configuration (for backward compatibility during migration)
 */
export interface HexagonConfigLegacy {
  id?: string | number;
  centerPosition?: [number, number, number];
  width?: number;
  height?: number;
  barProps?: {
    Color?: [number, number, number];
    Material?: string;
    Transparency?: number;
    [key: string]: any;
  };
  labels?: string[];
  stackIndex?: number;
  hexIndex?: number;
  guid?: string;
}

/**
 * Converts legacy config to standardized config
 */
export function convertLegacyHexagonConfig(legacy: HexagonConfigLegacy): IHexagonMakerConfig {
  const config: IHexagonMakerConfig = {
    id: legacy.id,
    width: legacy.width,
    height: legacy.height,
    labels: legacy.labels,
    stackIndex: legacy.stackIndex,
    hexIndex: legacy.hexIndex,
    guid: legacy.guid,
  };

  // Convert position
  if (legacy.centerPosition) {
    config.position = new Vector3(
      legacy.centerPosition[0],
      legacy.centerPosition[1],
      legacy.centerPosition[2]
    );
  }

  // Convert bar properties
  if (legacy.barProps) {
    if (legacy.barProps.Color) {
      config.barColor = new Color3(
        legacy.barProps.Color[0],
        legacy.barProps.Color[1],
        legacy.barProps.Color[2]
      );
    }
    if (legacy.barProps.Material) {
      config.barMaterial = legacy.barProps.Material as unknown as Enum.Material;
    }
    if (legacy.barProps.Transparency !== undefined) {
      config.barTransparency = legacy.barProps.Transparency;
    }
  }

  return config;
}