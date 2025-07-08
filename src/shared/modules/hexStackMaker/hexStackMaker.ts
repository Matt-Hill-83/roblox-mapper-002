/**
 * Standardized hex stack maker following IMaker pattern
 */

import { makeHexagon } from "../hexagonMaker";
import { IHexStackMakerConfig } from "./standardizedInterfaces";
import { HEX_STACK_CONSTANTS } from "./constants";
import { generateStackName, calculateLevelPosition } from "./utilities";

/**
 * Default color palette as Color3 array
 */
const DEFAULT_COLOR_PALETTE = HEX_STACK_CONSTANTS.DEFAULT_COLOR_PALETTE.map(
  color => new Color3(color[0], color[1], color[2])
);

/**
 * Creates a hex stack model with standardized configuration
 * @param config - Standardized hex stack configuration
 * @returns The created hex stack model
 */
export function makeHexStack(config: IHexStackMakerConfig): Model {
  // Extract configuration with defaults
  const {
    id = 1,
    position = new Vector3(0, 0, 0),
    width = HEX_STACK_CONSTANTS.DEFAULT_WIDTH,
    height = HEX_STACK_CONSTANTS.DEFAULT_HEIGHT,
    count = HEX_STACK_CONSTANTS.DEFAULT_COUNT,
    colors = DEFAULT_COLOR_PALETTE,
    stackIndex = 1,
    parent,
  } = config;

  print(`⬢ Generating hex stack with ${count} hexagons...`);

  const colorPalette = colors.size() > 0 ? colors : DEFAULT_COLOR_PALETTE;
  const hexagons: Model[] = [];

  // Create the stack model
  const stackModel = new Instance("Model");
  const stackName = generateStackName(stackIndex);
  stackModel.Name = stackName;
  print(`Created stack with name: ${stackName}`);

  // Create stacked hexagons
  for (let level = 0; level < count; level++) {
    const levelPosition = calculateLevelPosition(
      [position.X, position.Y, position.Z], // Convert to array for compatibility
      level,
      height
    );
    const levelColor = colorPalette[level % colorPalette.size()];

    // Create a hexagon for this level using standardized version
    const hexModel = makeHexagon({
      id: `${id}_level${level + 1}`,
      position: new Vector3(levelPosition[0], levelPosition[1], levelPosition[2]),
      width: width,
      height: height,
      barColor: levelColor,
      stackIndex: stackIndex,
      hexIndex: level + 1,
      parent: stackModel,
    });

    hexagons.push(hexModel);
  }

  // Set parent if provided
  if (parent) {
    stackModel.Parent = parent;
  }

  return stackModel;
}