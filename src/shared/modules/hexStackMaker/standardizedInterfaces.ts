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
export interface HexStackConfigLegacy {
  id?: string | number;
  centerPosition?: [number, number, number];
  width?: number;
  height?: number;
  count?: number;
  colors?: [number, number, number][];
  stackIndex?: number;
}

/**
 * Converts legacy config to standardized config
 */
export function convertLegacyHexStackConfig(legacy: HexStackConfigLegacy): IHexStackMakerConfig {
  const config: IHexStackMakerConfig = {
    id: legacy.id,
    width: legacy.width,
    height: legacy.height,
    count: legacy.count,
    stackIndex: legacy.stackIndex,
  };

  // Convert position
  if (legacy.centerPosition) {
    config.position = new Vector3(
      legacy.centerPosition[0],
      legacy.centerPosition[1],
      legacy.centerPosition[2]
    );
  }

  // Convert colors
  if (legacy.colors) {
    config.colors = legacy.colors.map(color => 
      new Color3(color[0], color[1], color[2])
    );
  }

  return config;
}