import { makeHexagon } from "./hexagonMaker";

interface HexStackConfig {
  id?: number;
  centerPosition?: [number, number, number];
  width?: number;
  height?: number;
  count?: number;
  colors?: [number, number, number][];
  stackIndex?: number;
}

function padNumber(num: number, length: number): string {
  const str = tostring(num);
  let result = str;
  while (result.size() < length) {
    result = "0" + result;
  }
  return result;
}

function generateStackName(stackIndex: number): string {
  const stackStr = padNumber(stackIndex, 3);
  return `st${stackStr}`;
}

export function makeHexStack({
  id = 1,
  centerPosition = [0, 2, 0],
  width = 10,
  height = 0.5,
  count = 4,
  colors = [],
  stackIndex = 1,
}: HexStackConfig): Model {
  print(`⬢ Generating hex stack with ${count} hexagons...`);

  // Default color palette if none provided
  const defaultColors: [number, number, number][] = [
    [1, 0, 0], // Red
    [0.8, 0.6, 0.2], // Golden
    [0, 1, 0], // Green
    [0, 0, 1], // Blue
    [0.5, 0, 0.5], // Purple
    [1, 0.5, 0], // Orange
    [0, 1, 1], // Cyan
    [1, 0, 0.5], // Pink
  ];

  const colorPalette = colors.size() > 0 ? colors : defaultColors;
  const hexagons: Model[] = [];

  // Create the stack model
  const stackModel = new Instance("Model");
  const stackName = generateStackName(stackIndex);
  stackModel.Name = stackName;
  print(`Created stack with name: ${stackName}`);

  // Create stacked hexagons
  for (let level = 0; level < count; level++) {
    const levelY = centerPosition[1] + level * height;
    const levelPosition: [number, number, number] = [centerPosition[0], levelY, centerPosition[2]];
    const levelColor = colorPalette[level % colorPalette.size()];

    // Create a hexagon for this level
    const hexModel = makeHexagon({
      id: `${id}_level${level + 1}` as unknown as number,
      centerPosition: levelPosition,
      width: width,
      height: height,
      barProps: {
        Color: levelColor,
      },
      stackIndex: stackIndex,
      hexIndex: level + 1,
    });

    hexModel.Parent = stackModel;
    hexagons.push(hexModel);
  }

  return stackModel;
} 