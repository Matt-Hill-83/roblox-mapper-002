import { createTextBox, createTextBoxWithCustomStyling } from "./TextBoxMaker";

interface TextBoxProps {
  text?: string;
  textSize?: number;
  backgroundColor?: Color3;
  textColor?: Color3;
  font?: Enum.Font;
  borderSizePixel?: number;
  textWrapped?: boolean;
}

interface LabelConfig {
  top?: TextBoxProps;
  bottom?: TextBoxProps;
  front?: TextBoxProps;
  back?: TextBoxProps;
  left?: TextBoxProps;
  right?: TextBoxProps;
}

interface LabelBlockProps {
  Size?: number; // Cube dimension (n x n x n)
  Anchored?: boolean;
  Color?: [number, number, number];
  Material?: string;
  Transparency?: number;
}

interface LabelBlockConfig {
  id: string;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  props?: LabelBlockProps;
  labels?: LabelConfig;
  parent?: Instance;
}

const defaultProps: LabelBlockProps = {
  Size: 8, // Default cube size
  Anchored: true,
  Color: [0.5, 0.5, 0.5], // Gray default
  Material: "Concrete",
  Transparency: 0,
};

function padNumber(num: number, length: number): string {
  const str = tostring(num);
  let result = str;
  while (result.size() < length) {
    result = "0" + result;
  }
  return result;
}

export function makeLabelBlock({
  id,
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0 },
  props = {},
  labels = {},
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
        // Use custom styling if any styling properties are provided
        if (
          labelConfig.textSize !== undefined ||
          labelConfig.backgroundColor !== undefined ||
          labelConfig.textColor !== undefined ||
          labelConfig.font !== undefined ||
          labelConfig.borderSizePixel !== undefined ||
          labelConfig.textWrapped !== undefined
        ) {
          createTextBoxWithCustomStyling({
            part: block,
            face: normalId,
            text: labelConfig.text,
            textSize: labelConfig.textSize,
            backgroundColor: labelConfig.backgroundColor,
            textColor: labelConfig.textColor,
            font: labelConfig.font,
            borderSizePixel: labelConfig.borderSizePixel,
            textWrapped: labelConfig.textWrapped,
          });
        } else {
          // Use simple text box for basic text
          createTextBox({
            part: block,
            face: normalId,
            text: labelConfig.text,
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
    parent,
  });
}