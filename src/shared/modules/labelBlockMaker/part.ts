/**
 * Main label block part creation logic
 */

import { createTextBox, createTextBoxWithCustomStyling } from "../TextBoxMaker";
import { 
  TextBoxProps, 
  LabelConfig, 
  LabelBlockConfig, 
  defaultProps 
} from "./interfaces";
import { padNumber } from "./utilities";

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
  block.Name = `labelBlock${padNumber(math.floor(tonumber(id) || 1), 3)}`;
  block.Size = new Vector3(size, size, size);
  block.Position = new Vector3(position.x, position.y, position.z);
  block.Orientation = new Vector3(rotation.x, rotation.y, rotation.z);
  block.Anchored = finalProps.Anchored!;
  block.Color = Color3.fromRGB(
    blockColor[0] * 255,
    blockColor[1] * 255,
    blockColor[2] * 255
  );
  block.Material = finalProps.Material as unknown as Enum.Material;
  block.TopSurface = Enum.SurfaceType.Smooth;
  block.BottomSurface = Enum.SurfaceType.Smooth;
  block.Transparency = finalProps.Transparency!;

  // Define face mapping
  const faceMap: [keyof LabelConfig, Enum.NormalId][] = [
    ["top", Enum.NormalId.Top],
    ["bottom", Enum.NormalId.Bottom],
    ["front", Enum.NormalId.Front],
    ["back", Enum.NormalId.Back],
    ["left", Enum.NormalId.Left],
    ["right", Enum.NormalId.Right],
  ];

  // Create labels for each specified face
  faceMap.forEach(([faceKey, normalId]) => {
    const labelConfig = labels[faceKey];
    if (labelConfig) {
      if (labelConfig.text) {
        // Merge textBoxOverrides with individual label config
        const mergedConfig = {
          ...textBoxOverrides,
          ...labelConfig,
          text: labelConfig.text, // Ensure text is not overridden
        };
        
        // Use custom styling if any styling properties are provided
        if (
          mergedConfig.textSize !== undefined ||
          mergedConfig.backgroundColor !== undefined ||
          mergedConfig.textColor !== undefined ||
          mergedConfig.font !== undefined ||
          mergedConfig.borderSizePixel !== undefined ||
          mergedConfig.borderColor !== undefined ||
          mergedConfig.textWrapped !== undefined
        ) {
          createTextBoxWithCustomStyling({
            part: block,
            face: normalId,
            text: mergedConfig.text,
            textSize: mergedConfig.textSize,
            backgroundColor: mergedConfig.backgroundColor,
            textColor: mergedConfig.textColor,
            font: mergedConfig.font,
            borderSizePixel: mergedConfig.borderSizePixel,
            borderColor: mergedConfig.borderColor,
            textWrapped: mergedConfig.textWrapped,
          });
        } else {
          // Use simple text box for basic text
          createTextBox({
            part: block,
            face: normalId,
            text: mergedConfig.text,
          });
        }
      }
    }
  });

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