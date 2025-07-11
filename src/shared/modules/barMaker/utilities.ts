import { padNumber } from "../../utils/stringUtils";
import { BAR_CONSTANTS } from "./constants";

export function makeAttachment(name: string, offset: number, id: string): Attachment {
  const attachment = new Instance("Attachment");
  attachment.Name = id;
  attachment.Position = new Vector3(0, 0, offset);
  return attachment;
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