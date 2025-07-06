/**
 * Main label block part creation logic
 */

import { 
  TextBoxProps, 
  LabelConfig, 
  LabelBlockConfig, 
  defaultProps 
} from "./interfaces";
import { createLabelsForBlock } from "./utilities";
import { LABEL_BLOCK_CONSTANTS } from "./constants";
import { padNumber } from "../../utils/stringUtils";

export function makeLabelBlock({
  id,
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0 },
  props = {},
  labels = {},
  textBoxOverrides = {},
  parent,
}: LabelBlockConfig): Part {
  const finalProps = {
    ...defaultProps,
    ...props,
  };

  const size = finalProps.Size!;
  const blockColor = finalProps.Color!;

  // Create the cube part
  const block = new Instance("Part");
  block.Name = `${LABEL_BLOCK_CONSTANTS.NAME_PREFIX}${padNumber(
    math.floor(tonumber(id) || 1), 
    LABEL_BLOCK_CONSTANTS.PAD_LENGTH
  )}`;
  
  // Apply default properties first
  block.Size = new Vector3(size, size, size);
  block.Position = new Vector3(position.x, position.y, position.z);
  block.Orientation = new Vector3(rotation.x, rotation.y, rotation.z);
  block.Anchored = finalProps.Anchored!;
  block.TopSurface = Enum.SurfaceType.Smooth;
  block.BottomSurface = Enum.SurfaceType.Smooth;
  block.CastShadow = false;
  
  // Handle Color specially since it needs RGB conversion
  if (finalProps.Color) {
    block.Color = Color3.fromRGB(
      blockColor[0] * 255,
      blockColor[1] * 255,
      blockColor[2] * 255
    );
  }
  
  // Apply all other properties from finalProps
  for (const [key, value] of pairs(finalProps)) {
    // Skip properties we've already handled
    if (key === "Size" || key === "Color" || key === "Anchored") continue;
    
    // Try to apply the property to the block
    try {
      (block as unknown as Record<string, unknown>)[key] = value;
    } catch (e) {
      // Property may not exist or be writable, skip it
    }
  }

  // Use face mapping from constants
  const faceMap = LABEL_BLOCK_CONSTANTS.FACE_MAP as [keyof LabelConfig, Enum.NormalId][];

  // Create labels using utility function
  createLabelsForBlock(block, labels, textBoxOverrides, faceMap);

  // Set parent if provided
  if (parent) {
    block.Parent = parent;
  }

  // Count labels manually for Lua compatibility
  let labelCount = 0;
  for (const [_, config] of pairs(labels)) {
    if ((config as TextBoxProps).text) {
      labelCount++;
    }
  }
  print(`✅ Created label block "${block.Name}" with ${labelCount} labels`);

  return block;
}

// Helper function to create a label block with the same text on all faces
export function makeLabelBlockAllFaces({
  id,
  position,
  rotation,
  props,
  text,
  textProps = {},
  textBoxOverrides,
  parent,
}: Omit<LabelBlockConfig, "labels"> & {
  text: string;
  textProps?: Omit<TextBoxProps, "text">;
}): Part {
  const labels: LabelConfig = {
    top: { text, ...textProps },
    bottom: { text, ...textProps },
    front: { text, ...textProps },
    back: { text, ...textProps },
    left: { text, ...textProps },
    right: { text, ...textProps },
  };

  return makeLabelBlock({
    id,
    position,
    rotation,
    props,
    labels,
    textBoxOverrides,
    parent,
  });
}