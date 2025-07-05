import { padNumber } from "../../utils/stringUtils";
import { HEXAGON_CONSTANTS } from "./constants";

export function generateHexagonName(stackIndex: number, hexIndex: number): string {
  const hexStr = padNumber(hexIndex, 3);
  const stackStr = padNumber(stackIndex, 3);
  return `${HEXAGON_CONSTANTS.NAME_PREFIXES.HEXAGON}${hexStr}-${HEXAGON_CONSTANTS.NAME_PREFIXES.STACK}${stackStr}`;
}

export function createCenterCube(
  centerPosition: [number, number, number],
  hexIndex: number,
  stackIndex: number
): Part {
  const centerCube = new Instance("Part");
  centerCube.Name = `${HEXAGON_CONSTANTS.NAME_PREFIXES.CENTER_CUBE}-${HEXAGON_CONSTANTS.NAME_PREFIXES.HEXAGON}${padNumber(
    hexIndex,
    3
  )}-${HEXAGON_CONSTANTS.NAME_PREFIXES.STACK}${padNumber(stackIndex, 3)}`;
  centerCube.Size = new Vector3(
    HEXAGON_CONSTANTS.CENTER_CUBE.SIZE,
    HEXAGON_CONSTANTS.CENTER_CUBE.SIZE,
    HEXAGON_CONSTANTS.CENTER_CUBE.SIZE
  );
  centerCube.Position = new Vector3(
    centerPosition[0],
    centerPosition[1],
    centerPosition[2]
  );
  centerCube.Anchored = true;
  centerCube.Transparency = HEXAGON_CONSTANTS.CENTER_CUBE.TRANSPARENCY;
  centerCube.Color = Color3.fromRGB(
    HEXAGON_CONSTANTS.CENTER_CUBE.COLOR_RGB[0],
    HEXAGON_CONSTANTS.CENTER_CUBE.COLOR_RGB[1],
    HEXAGON_CONSTANTS.CENTER_CUBE.COLOR_RGB[2]
  );
  
  return centerCube;
}

export function createCenterAttachment(
  centerCube: Part,
  hexIndex: number,
  stackIndex: number
): Attachment {
  const centerAttachment = new Instance("Attachment");
  centerAttachment.Name = `${HEXAGON_CONSTANTS.NAME_PREFIXES.CENTER_ATTACHMENT}-${HEXAGON_CONSTANTS.NAME_PREFIXES.HEXAGON}${padNumber(
    hexIndex,
    3
  )}-${HEXAGON_CONSTANTS.NAME_PREFIXES.STACK}${padNumber(stackIndex, 3)}`;
  centerAttachment.Position = new Vector3(0, 0, 0);
  centerAttachment.Parent = centerCube;
  
  return centerAttachment;
}

export function calculateBarDimensions(width: number, height: number) {
  // Calculate bar dimensions for a hexagon
  // For a regular hexagon with width W:
  // - Each side length = W/2 (radius)
  // - To form a solid hexagon with 3 overlapping bars, bar width = radius * √3
  const radius = width / 2;
  const barLength = radius;
  const barWidth = radius * math.sqrt(3); // Proper width for solid hexagon
  const barHeight = height;
  
  return {
    barLength,
    barWidth,
    barHeight,
    radius
  };
}