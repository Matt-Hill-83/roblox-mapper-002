/**
 * Standardized bar maker following IMaker pattern
 */

import { IBarMakerConfig } from "./standardizedInterfaces";
import { generateAttachmentName, generateBarName, makeAttachment } from "./utilities";
import { createTextLabel } from "../TextLabelMaker";

/**
 * Default values for bar properties
 */
const BAR_DEFAULTS = {
  size: new Vector3(0.5, 0.5, 4),
  color: new Color3(0.5, 0.5, 0.5),
  material: Enum.Material.SmoothPlastic,
  transparency: 0,
  anchored: true,
  topSurface: Enum.SurfaceType.Smooth,
  bottomSurface: Enum.SurfaceType.Smooth,
  rotation: new Vector3(0, -30, 0),
};

/**
 * Creates a bar part with standardized configuration
 * @param config - Standardized bar configuration
 * @returns The created bar part
 */
export function makeBarStandardized(config: IBarMakerConfig): Part {
  // Extract configuration with defaults
  const {
    position = new Vector3(0, 0, 0),
    rotation = BAR_DEFAULTS.rotation,
    size = BAR_DEFAULTS.size,
    color = BAR_DEFAULTS.color,
    material = BAR_DEFAULTS.material,
    transparency = BAR_DEFAULTS.transparency,
    anchored = BAR_DEFAULTS.anchored,
    topSurface = BAR_DEFAULTS.topSurface,
    bottomSurface = BAR_DEFAULTS.bottomSurface,
    label = "Bar",
    stackIndex = 1,
    hexIndex = 1,
    barIndex = 1,
    backgroundColor,
    borderColor,
    textColor,
    parent,
    castShadow = false,
  } = config;

  const barLength = typeIs(size, "Vector3") ? size.Z : size[2];
  const frontFaceOffset = barLength / 2;
  const backFaceOffset = -barLength / 2;

  const barName = generateBarName(stackIndex, hexIndex, barIndex);
  const bar = new Instance("Part");
  bar.Name = barName;
  bar.Size = typeIs(size, "Vector3") ? size : new Vector3(size[0], size[1], size[2]);
  bar.Position = position;
  bar.Orientation = rotation;
  bar.Anchored = anchored;
  bar.Color = typeIs(color, "Color3") ? color : new Color3(color[0], color[1], color[2]);
  bar.Material = material;
  bar.TopSurface = topSurface;
  bar.BottomSurface = bottomSurface;
  bar.Transparency = transparency;
  bar.CastShadow = castShadow;

  // Create attachments
  const frontAttachment = makeAttachment(
    "FrontAttachment",
    frontFaceOffset,
    generateAttachmentName((barIndex - 1) * 2 + 1, hexIndex, stackIndex)
  );
  const backAttachment = makeAttachment(
    "BackAttachment",
    backFaceOffset,
    generateAttachmentName((barIndex - 1) * 2 + 2, hexIndex, stackIndex)
  );

  frontAttachment.Parent = bar;
  backAttachment.Parent = bar;

  // Create labels
  createTextLabel({
    part: bar,
    face: Enum.NormalId.Front,
    text: label,
    backgroundColor: backgroundColor || (typeIs(color, "Color3") ? color : new Color3(color[0], color[1], color[2])),
    borderColor: borderColor,
    textColor: textColor || borderColor,
  });

  createTextLabel({
    part: bar,
    face: Enum.NormalId.Back,
    text: label,
    backgroundColor: backgroundColor || (typeIs(color, "Color3") ? color : new Color3(color[0], color[1], color[2])),
    borderColor: borderColor,
    textColor: textColor || borderColor,
  });

  // Set parent if provided
  if (parent) {
    bar.Parent = parent;
  }

  return bar;
}