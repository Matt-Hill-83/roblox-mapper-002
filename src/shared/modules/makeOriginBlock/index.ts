/**
 * Standardized origin block maker following IMaker patterns
 */

import { makeLabelBlock } from "../labelBlockMaker";
import { IVisualMakerConfig, IMakerFunction } from "../../interfaces/IMaker";

/**
 * Configuration for origin block creation
 */
export interface OriginBlockConfig extends IVisualMakerConfig {
  /** Origin position */
  origin: { x: number; y: number; z: number };
  
  /** Parent instance (required) */
  parent: Instance;
  
  /** Offset from origin */
  offset?: { x: number; y: number; z: number };
  
  /** Size of the block */
  blockSize?: number;
}

/**
 * Default configuration values
 */
const ORIGIN_BLOCK_DEFAULTS = {
  offset: { x: 0, y: 0, z: 0 },
  blockSize: 4,
  castShadow: false,
  transparency: 0.2,
  material: Enum.Material.SmoothPlastic,
} as const;

/**
 * Creates an orientation reference block to help users understand the 3D space
 * The block has labeled faces (FRONT, BACK, LEFT, RIGHT, TOP, BOTTOM) with color coding
 * 
 * @param config - Configuration for the origin block
 * @returns The created part instance
 */
export const makeOriginBlock: IMakerFunction<OriginBlockConfig, Part> = (config) => {
  // Apply defaults
  const { 
    origin,
    parent,
    offset = ORIGIN_BLOCK_DEFAULTS.offset,
    blockSize = ORIGIN_BLOCK_DEFAULTS.blockSize,
    castShadow = ORIGIN_BLOCK_DEFAULTS.castShadow,
    transparency = ORIGIN_BLOCK_DEFAULTS.transparency,
    material = ORIGIN_BLOCK_DEFAULTS.material,
    name = "OrientationReference"
  } = config;

  // Create container folder
  const orientationFolder = new Instance("Folder");
  orientationFolder.Name = name as string;
  orientationFolder.Parent = parent;

  // Create the labeled block
  const block = makeLabelBlock({
    id: "orientation-ref",
    position: {
      x: origin.x + offset.x,
      y: origin.y + offset.y,
      z: origin.z + offset.z,
    },
    props: {
      Size: blockSize,
      Color: [0.3, 0.3, 0.3], // Dark gray
      Transparency: transparency,
      Material: material.Name,
      CanCollide: false,
      CastShadow: castShadow,
    },
    labels: {
      front: {
        text: "FRONT",
        textColor: new Color3(0, 0, 0.8), // Dark blue text
        backgroundColor: new Color3(0.5, 0.5, 0.8), // Medium blue background
        borderColor: new Color3(0, 0, 0.3), // Very dark blue border
      },
      back: {
        text: "BACK",
        textColor: new Color3(0, 0, 0.8), // Dark blue text
        backgroundColor: new Color3(0.5, 0.5, 0.8), // Medium blue background
        borderColor: new Color3(0, 0, 0.3), // Very dark blue border
      },
      left: {
        text: "LEFT",
        textColor: new Color3(0.8, 0, 0), // Dark red text
        backgroundColor: new Color3(0.8, 0.5, 0.5), // Medium red background
        borderColor: new Color3(0.3, 0, 0), // Very dark red border
      },
      right: {
        text: "RIGHT",
        textColor: new Color3(0.8, 0, 0), // Dark red text
        backgroundColor: new Color3(0.8, 0.5, 0.5), // Medium red background
        borderColor: new Color3(0.3, 0, 0), // Very dark red border
      },
      top: {
        text: "TOP",
        textColor: new Color3(0, 0.8, 0), // Dark green text
        backgroundColor: new Color3(0.5, 0.8, 0.5), // Medium green background
        borderColor: new Color3(0, 0.3, 0), // Very dark green border
      },
      bottom: {
        text: "BOTTOM",
        textColor: new Color3(0, 0.8, 0), // Dark green text
        backgroundColor: new Color3(0.5, 0.8, 0.5), // Medium green background
        borderColor: new Color3(0, 0.3, 0), // Very dark green border
      },
    },
    textBoxOverrides: {
      textSize: 100, // Maximum font size in Roblox
      font: Enum.Font.SourceSansBold,
      borderSizePixel: 10, // Wider borders for better visibility
    },
    parent: orientationFolder,
  });

  print("🧭 Created orientation reference block");
  
  return block;
};

/**
 * Validates origin block configuration
 */
export function validateOriginBlockConfig(config: unknown): config is OriginBlockConfig {
  if (!typeIs(config, "table")) return false;
  
  const cfg = config as Record<string, unknown>;
  
  // Check required fields
  if (!cfg.origin || !typeIs(cfg.origin, "table")) return false;
  if (!cfg.parent || !typeIs(cfg.parent, "Instance")) return false;
  
  const origin = cfg.origin as Record<string, unknown>;
  if (!typeIs(origin.x, "number") || !typeIs(origin.y, "number") || !typeIs(origin.z, "number")) {
    return false;
  }
  
  // Check optional fields if present
  if (cfg.offset && !typeIs(cfg.offset, "table")) return false;
  if (cfg.blockSize && !typeIs(cfg.blockSize, "number")) return false;
  
  return true;
}

/**
 * Gets default configuration for origin block
 */
export function getOriginBlockDefaults(): Partial<OriginBlockConfig> {
  return { ...ORIGIN_BLOCK_DEFAULTS };
}