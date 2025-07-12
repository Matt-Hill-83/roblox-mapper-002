// import { padNumber } from "../../utils/stringUtils";
import { BLOCK_CONSTANTS } from "./constants";

export function makeAttachment(name: string, offset: number, id: string): Attachment {
  const attachment = new Instance("Attachment");
  attachment.Name = id;
  attachment.Position = new Vector3(0, 0, offset);
  return attachment;
}

export function generateBlockName(
  stackIndex: number,
  hexIndex: number,
  blockIndex: number
): string {
  const stackStr = string.format(`%0${BLOCK_CONSTANTS.PAD_LENGTH}d`, stackIndex);
  const hexStr = string.format(`%0${BLOCK_CONSTANTS.PAD_LENGTH}d`, hexIndex);
  const blockStr = string.format(`%0${BLOCK_CONSTANTS.PAD_LENGTH}d`, blockIndex);
  return `${BLOCK_CONSTANTS.NAME_PREFIXES.BLOCK}${blockStr}-${BLOCK_CONSTANTS.NAME_PREFIXES.HEX}${hexStr}-${BLOCK_CONSTANTS.NAME_PREFIXES.STACK}${stackStr}`;
}

export function generateAttachmentName(
  attachmentNumber: number,
  hexIndex: number,
  stackIndex: number
): string {
  const attStr = string.format(`%0${BLOCK_CONSTANTS.PAD_LENGTH}d`, attachmentNumber);
  const hexStr = string.format(`%0${BLOCK_CONSTANTS.PAD_LENGTH}d`, hexIndex);
  const stackStr = string.format(`%0${BLOCK_CONSTANTS.PAD_LENGTH}d`, stackIndex);
  return `${BLOCK_CONSTANTS.NAME_PREFIXES.ATTACHMENT}${attStr}-${BLOCK_CONSTANTS.NAME_PREFIXES.HEX}${hexStr}-${BLOCK_CONSTANTS.NAME_PREFIXES.STACK}${stackStr}`;
}