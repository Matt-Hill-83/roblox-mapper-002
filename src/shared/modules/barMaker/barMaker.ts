import { BarConfig, defaultProps } from "./interfaces";
import { generateAttachmentName, generateBarName, makeAttachment, } from "./utilities";

// import { BAR_CONSTANTS } from "./constants";
import { createTextBox } from "../TextBoxMaker";

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

  // const radY = (rotation.y * math.pi) / 180;
  // const cosY = math.cos(radY);
  // const sinY = math.sin(radY);

  // const frontX = position.x + sinY * frontFaceOffset;
  // const frontZ = position.z + cosY * frontFaceOffset;
  // const backX = position.x + sinY * backFaceOffset;
  // const backZ = position.z + cosY * backFaceOffset;

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
  bar.CastShadow = false;

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

  // const frontCircle = makeCircle(
  //   "FrontCircle",
  //   frontX,
  //   position.y,
  //   frontZ,
  //   BAR_CONSTANTS.FRONT_CIRCLE_COLOR
  // );
  // const backCircle = makeCircle(
  //   "BackCircle",
  //   backX,
  //   position.y,
  //   backZ,
  //   BAR_CONSTANTS.BACK_CIRCLE_COLOR
  // );

  // frontCircle.Parent = bar;
  // backCircle.Parent = bar;

  return bar;
}
