import { createTextBox } from "./TextBoxMaker";

interface BarProps {
  Size: [number, number, number];
  Anchored: boolean;
  Color: [number, number, number];
  Material: string;
  Shape: string;
  TopSurface: string;
  BottomSurface: string;
  Transparency: number;
}

interface BarConfig {
  id: string;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  props?: Partial<BarProps>;
  label?: string;
  stackIndex?: number;
  hexIndex?: number;
  barIndex?: number;
}

const defaultProps: BarProps = {
  Size: [4, 2, 8],
  Anchored: true,
  Color: [0.2, 0.4, 0.8],
  Material: "Concrete",
  Shape: "Block",
  TopSurface: "Smooth",
  BottomSurface: "Smooth",
  Transparency: 0,
};

const pointSize = 0.1;

function makeAttachment(name: string, offset: number, id: string) {
  const attachment = new Instance("Attachment");
  attachment.Name = id;
  attachment.Position = new Vector3(0, 0, offset);
  return attachment;
}

function makeCircle(
  name: string,
  x: number,
  y: number,
  z: number,
  color: [number, number, number]
) {
  const circle = new Instance("Part");
  circle.Size = new Vector3(pointSize, pointSize, pointSize);
  circle.Position = new Vector3(x, y, z);
  circle.Anchored = true;
  circle.Color = Color3.fromRGB(color[0] * 255, color[1] * 255, color[2] * 255);
  circle.Material = Enum.Material.Neon;
  circle.Shape = Enum.PartType.Ball;
  return circle;
}

function padNumber(num: number, length: number): string {
  const str = tostring(num);
  let result = str;
  while (result.size() < length) {
    result = "0" + result;
  }
  return result;
}

function generateBarName(
  stackIndex: number,
  hexIndex: number,
  barIndex: number
): string {
  const stackStr = padNumber(stackIndex, 3);
  const hexStr = padNumber(hexIndex, 3);
  const barStr = padNumber(barIndex, 3);
  return `bar${barStr}-h${hexStr}-st${stackStr}`;
}

export function makeBar({
  id,
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: -30, z: 0 },
  props = {},
  label = "Bar",
  stackIndex = 1,
  hexIndex = 1,
  barIndex = 1,
}: BarConfig): Part {
  const finalProps = {
    ...defaultProps,
    ...props,
  };

  const barLength = finalProps.Size[2];
  const frontFaceOffset = barLength / 2;
  const backFaceOffset = -barLength / 2;

  const radY = (rotation.y * math.pi) / 180;
  const cosY = math.cos(radY);
  const sinY = math.sin(radY);

  const frontX = position.x + sinY * frontFaceOffset;
  const frontZ = position.z + cosY * frontFaceOffset;
  const backX = position.x + sinY * backFaceOffset;
  const backZ = position.z + cosY * backFaceOffset;

  const blockColor = finalProps.Color;

  const barName = generateBarName(stackIndex, hexIndex, barIndex);
  const bar = new Instance("Part");
  bar.Name = barName;
  bar.Size = new Vector3(
    finalProps.Size[0],
    finalProps.Size[1],
    finalProps.Size[2]
  );
  bar.Position = new Vector3(position.x, position.y, position.z);
  bar.Orientation = new Vector3(rotation.x, rotation.y, rotation.z);
  bar.Anchored = finalProps.Anchored;
  bar.Color = Color3.fromRGB(
    blockColor[0] * 255,
    blockColor[1] * 255,
    blockColor[2] * 255
  );
  bar.Material = finalProps.Material as unknown as Enum.Material;
  bar.TopSurface = finalProps.TopSurface as unknown as Enum.SurfaceType;
  bar.BottomSurface = finalProps.BottomSurface as unknown as Enum.SurfaceType;
  bar.Transparency = finalProps.Transparency;

  const frontAttachment = makeAttachment(
    "FrontAttachment",
    frontFaceOffset,
    `att${padNumber((barIndex - 1) * 2 + 1, 3)}-h${padNumber(
      hexIndex,
      3
    )}-st${padNumber(stackIndex, 3)}`
  );
  const backAttachment = makeAttachment(
    "BackAttachment",
    backFaceOffset,
    `att${padNumber((barIndex - 1) * 2 + 2, 3)}-h${padNumber(
      hexIndex,
      3
    )}-st${padNumber(stackIndex, 3)}`
  );

  frontAttachment.Parent = bar;
  backAttachment.Parent = bar;

  createTextBox({
    part: bar,
    face: Enum.NormalId.Front,
    text: label,
  });

  createTextBox({
    part: bar,
    face: Enum.NormalId.Back,
    text: label,
  });

  const frontCircle = makeCircle(
    "FrontCircle",
    frontX,
    position.y,
    frontZ,
    [0, 1, 0]
  );
  const backCircle = makeCircle(
    "BackCircle",
    backX,
    position.y,
    backZ,
    [1, 0, 0]
  );

  frontCircle.Parent = bar;
  backCircle.Parent = bar;

  return bar;
}
