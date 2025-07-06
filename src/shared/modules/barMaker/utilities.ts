import { padNumber } from "../../utils/stringUtils";
import { BAR_CONSTANTS } from "./constants";

export function makeAttachment(name: string, offset: number, id: string): Attachment {
  const attachment = new Instance("Attachment");
  attachment.Name = id;
  attachment.Position = new Vector3(0, 0, offset);
  return attachment;
}

export function makeCircle(
  name: string,
  x: number,
  y: number,
  z: number,
  color: [number, number, number]
): Part {
  const circle = new Instance("Part");
  circle.Size = new Vector3(BAR_CONSTANTS.POINT_SIZE, BAR_CONSTANTS.POINT_SIZE, BAR_CONSTANTS.POINT_SIZE);
  circle.Position = new Vector3(x, y, z);
  circle.Anchored = true;
  circle.Color = Color3.fromRGB(color[0] * 255, color[1] * 255, color[2] * 255);
  circle.Material = Enum.Material.SmoothPlastic;
  circle.Shape = Enum.PartType.Ball;
  circle.CastShadow = false;
  return circle;
}

export function generateBarName(
  stackIndex: number,
  hexIndex: number,
  barIndex: number
): string {
  const stackStr = padNumber(stackIndex, BAR_CONSTANTS.PAD_LENGTH);
  const hexStr = padNumber(hexIndex, BAR_CONSTANTS.PAD_LENGTH);
  const barStr = padNumber(barIndex, BAR_CONSTANTS.PAD_LENGTH);
  return `${BAR_CONSTANTS.NAME_PREFIXES.BAR}${barStr}-${BAR_CONSTANTS.NAME_PREFIXES.HEX}${hexStr}-${BAR_CONSTANTS.NAME_PREFIXES.STACK}${stackStr}`;
}

export function generateAttachmentName(
  attachmentNumber: number,
  hexIndex: number,
  stackIndex: number
): string {
  const attStr = padNumber(attachmentNumber, BAR_CONSTANTS.PAD_LENGTH);
  const hexStr = padNumber(hexIndex, BAR_CONSTANTS.PAD_LENGTH);
  const stackStr = padNumber(stackIndex, BAR_CONSTANTS.PAD_LENGTH);
  return `${BAR_CONSTANTS.NAME_PREFIXES.ATTACHMENT}${attStr}-${BAR_CONSTANTS.NAME_PREFIXES.HEX}${hexStr}-${BAR_CONSTANTS.NAME_PREFIXES.STACK}${stackStr}`;
}