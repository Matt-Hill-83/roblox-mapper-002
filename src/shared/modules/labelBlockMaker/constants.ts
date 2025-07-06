/**
 * Constants for label block creation
 */

export const LABEL_BLOCK_CONSTANTS = {
  // Default block properties
  DEFAULT_SIZE: 8,
  DEFAULT_COLOR: [0.5, 0.5, 0.5] as [number, number, number],
  DEFAULT_MATERIAL: "SmoothPlastic",
  DEFAULT_TRANSPARENCY: 0,
  DEFAULT_ANCHORED: true,
  
  // Formatting
  PAD_LENGTH: 3,
  NAME_PREFIX: "labelBlock",
  
  // Face mapping for label placement
  FACE_MAP: [
    ["top", Enum.NormalId.Top],
    ["bottom", Enum.NormalId.Bottom],
    ["front", Enum.NormalId.Front],
    ["back", Enum.NormalId.Back],
    ["left", Enum.NormalId.Left],
    ["right", Enum.NormalId.Right],
  ] as [string, Enum.NormalId][],
} as const;