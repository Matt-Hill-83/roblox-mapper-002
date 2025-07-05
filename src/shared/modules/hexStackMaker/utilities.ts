import { padNumber } from "../../utils/stringUtils";
import { HEX_STACK_CONSTANTS } from "./constants";

export function generateStackName(stackIndex: number): string {
  const stackStr = padNumber(stackIndex, HEX_STACK_CONSTANTS.PAD_LENGTH);
  return `${HEX_STACK_CONSTANTS.NAME_PREFIX}${stackStr}`;
}

export function calculateLevelPosition(
  centerPosition: [number, number, number],
  level: number,
  height: number
): [number, number, number] {
  const levelY = centerPosition[1] + level * height;
  return [centerPosition[0], levelY, centerPosition[2]];
}