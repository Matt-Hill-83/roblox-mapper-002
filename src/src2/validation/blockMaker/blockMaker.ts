/**
 * Standardized block maker following IMaker pattern
 */

import { IBlockMakerConfig } from "./standardizedInterfaces";
import {
  generateAttachmentName,
  makeAttachment,
} from "./utilities";
import { createTextLabel } from "../../shared/modules/TextLabelMaker";

/**
 * Default values for block properties
 */
const BLOCK_DEFAULTS = {
  size: new Vector3(0.5, 0.5, 4),
  color: new Color3(0.5, 0.5, 0.5),
  material: Enum.Material.Concrete,
  transparency: 0,
  anchored: true,
  topSurface: Enum.SurfaceType.Smooth,
  bottomSurface: Enum.SurfaceType.Smooth,
  rotation: new Vector3(0, 0, 0),
};

/**
 * Creates a block part with standardized configuration
 * @param config - Standardized block configuration
 * @returns The created block part
 */
export function makeBlock(config: IBlockMakerConfig): Part {
  // Extract configuration with defaults
  const {
    position = new Vector3(0, 0, 0),
    rotation = BLOCK_DEFAULTS.rotation,
    size = BLOCK_DEFAULTS.size,
    color = BLOCK_DEFAULTS.color,
    material = BLOCK_DEFAULTS.material,
    transparency = BLOCK_DEFAULTS.transparency,
    anchored = BLOCK_DEFAULTS.anchored,
    topSurface = BLOCK_DEFAULTS.topSurface,
    bottomSurface = BLOCK_DEFAULTS.bottomSurface,
    // label = "Block",
    stackIndex = 1,
    hexIndex = 1,
    blockIndex = 1,
    // backgroundColor,
    // borderColor,
    // textColor,
    parent,
    castShadow = false,
    nameSuffix,
    nameStub = "rx",
    labels,
    labelBackgroundTransparency,
    labelProps,
  } = config;

  const blockLength = typeIs(size, "Vector3") ? size.Z : size[2];
  const frontFaceOffset = blockLength / 2;
  const backFaceOffset = -blockLength / 2;

  const block = new Instance("Part");

  // If nameSuffix is provided, use nameStub-suffix format
  // Otherwise use the generated name
  if (nameSuffix) {
    block.Name = `${nameStub}-${nameSuffix}`;
  } else {
    block.Name = `${nameStub}`;
  }
  block.Size = typeIs(size, "Vector3")
    ? size
    : new Vector3(size[0], size[1], size[2]);
  block.Position = position;
  block.Orientation = rotation;
  block.Anchored = anchored;
  block.Color = typeIs(color, "Color3")
    ? color
    : new Color3(color[0], color[1], color[2]);
  block.Material = material;
  block.TopSurface = topSurface;
  block.BottomSurface = bottomSurface;
  block.Transparency = transparency;
  block.CastShadow = castShadow;
  block.CanCollide = false;

  // Create attachments
  const frontAttachment = makeAttachment(
    "FrontAttachment",
    frontFaceOffset,
    generateAttachmentName((blockIndex - 1) * 2 + 1, hexIndex, stackIndex)
  );
  const backAttachment = makeAttachment(
    "BackAttachment",
    backFaceOffset,
    generateAttachmentName((blockIndex - 1) * 2 + 2, hexIndex, stackIndex)
  );

  frontAttachment.Parent = block;
  backAttachment.Parent = block;

  // Create labels if provided
  if (labels) {
    const blockColor = typeIs(color, "Color3") ? color : new Color3(color[0], color[1], color[2]);
    
    // Helper to create label with common properties
    const createLabel = (face: Enum.NormalId, text: string) => {
      createTextLabel({
        part: block,
        face: face,
        text: text,
        backgroundColor: blockColor,
        textColor: new Color3(1, 1, 1),
        backgroundTransparency: labelBackgroundTransparency,
        labelProps: labelProps,
      });
    };
    
    if (labels.front) createLabel(Enum.NormalId.Front, labels.front);
    if (labels.back) createLabel(Enum.NormalId.Back, labels.back);
    if (labels.left) createLabel(Enum.NormalId.Left, labels.left);
    if (labels.right) createLabel(Enum.NormalId.Right, labels.right);
    if (labels.top) createLabel(Enum.NormalId.Top, labels.top);
    if (labels.bottom) createLabel(Enum.NormalId.Bottom, labels.bottom);
  }

  // Set parent if provided
  if (parent) {
    block.Parent = parent;
  }

  return block;
}
