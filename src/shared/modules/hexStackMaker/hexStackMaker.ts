import { makeHexagon } from "../hexagonMaker";
import { HexStackConfig } from "./interfaces";
import { HEX_STACK_CONSTANTS } from "./constants";
import { generateStackName, calculateLevelPosition } from "./utilities";

export function makeHexStack({
  id = 1,
  centerPosition = HEX_STACK_CONSTANTS.DEFAULT_CENTER_POSITION,
  width = HEX_STACK_CONSTANTS.DEFAULT_WIDTH,
  height = HEX_STACK_CONSTANTS.DEFAULT_HEIGHT,
  count = HEX_STACK_CONSTANTS.DEFAULT_COUNT,
  colors = [],
  stackIndex = 1,
}: HexStackConfig): Model {
  print(`⬢ Generating hex stack with ${count} hexagons...`);

  const colorPalette = colors.size() > 0 ? colors : HEX_STACK_CONSTANTS.DEFAULT_COLOR_PALETTE;
  const hexagons: Model[] = [];

  // Create the stack model
  const stackModel = new Instance("Model");
  const stackName = generateStackName(stackIndex);
  stackModel.Name = stackName;
  print(`Created stack with name: ${stackName}`);

  // Create stacked hexagons
  for (let level = 0; level < count; level++) {
    const levelPosition = calculateLevelPosition(centerPosition, level, height);
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