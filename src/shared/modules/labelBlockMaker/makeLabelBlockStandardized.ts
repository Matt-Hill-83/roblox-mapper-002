/**
 * Standardized label block maker following IMaker pattern
 */

import { ILabelBlockMakerConfig } from "./standardizedInterfaces";
import { createLabelsForBlock } from "./utilities";
import { LABEL_BLOCK_CONSTANTS } from "./constants";
import { padNumber } from "../../utils/stringUtils";

/**
 * Default values for label block properties
 */
const LABEL_BLOCK_DEFAULTS = {
  size: 4,
  color: new Color3(0.5, 0.5, 0.5),
  material: Enum.Material.SmoothPlastic,
  transparency: 0,
  anchored: true,
  castShadow: false,
  position: new Vector3(0, 0, 0),
  rotation: new Vector3(0, 0, 0),
};

/**
 * Creates a label block part with standardized configuration
 * @param config - Standardized label block configuration
 * @returns The created label block part
 */
export function makeLabelBlockStandardized(config: ILabelBlockMakerConfig): Part {
  // Extract configuration with defaults
  const {
    id = 1,
    position = LABEL_BLOCK_DEFAULTS.position,
    rotation = LABEL_BLOCK_DEFAULTS.rotation,
    size = LABEL_BLOCK_DEFAULTS.size,
    color = LABEL_BLOCK_DEFAULTS.color,
    material = LABEL_BLOCK_DEFAULTS.material,
    transparency = LABEL_BLOCK_DEFAULTS.transparency,
    anchored = LABEL_BLOCK_DEFAULTS.anchored,
    castShadow = LABEL_BLOCK_DEFAULTS.castShadow,
    labels = {},
    textBoxOverrides = {},
    parent,
  } = config;

  // Create the cube part
  const block = new Instance("Part");
  block.Name = `${LABEL_BLOCK_CONSTANTS.NAME_PREFIX}${padNumber(
    math.floor(tonumber(id) || 1), 
    LABEL_BLOCK_CONSTANTS.PAD_LENGTH
  )}`;
  
  // Apply properties
  block.Size = new Vector3(size, size, size);
  block.Position = position;
  block.Orientation = rotation;
  block.Anchored = anchored;
  block.TopSurface = Enum.SurfaceType.Smooth;
  block.BottomSurface = Enum.SurfaceType.Smooth;
  block.CastShadow = castShadow;
  block.Color = color;
  block.Material = material;
  block.Transparency = transparency;
  
  // Apply any additional properties that might be passed
  // (removed the generic property application for type safety)
  
  // Set parent if provided
  if (parent) {
    block.Parent = parent;
  }
  
  // Add labels to each face
  // Check if labels object has any entries
  const labelKeys = [];
  for (const [key] of pairs(labels)) {
    labelKeys.push(key);
  }
  
  if (labels && labelKeys.size() > 0) {
    // Create face mapping
    const faceMap: [keyof typeof labels, Enum.NormalId][] = [
      ["front", Enum.NormalId.Front],
      ["back", Enum.NormalId.Back],
      ["left", Enum.NormalId.Left],
      ["right", Enum.NormalId.Right],
      ["top", Enum.NormalId.Top],
      ["bottom", Enum.NormalId.Bottom],
    ];
    createLabelsForBlock(block, labels as any, textBoxOverrides, faceMap);
  }
  
  return block;
}