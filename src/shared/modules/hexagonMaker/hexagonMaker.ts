import { makeBar } from "../barMaker";
import { HexagonConfig } from "./interfaces";
import { HEXAGON_CONSTANTS } from "./constants";
import {
  generateHexagonName,
  createCenterCube,
  createCenterAttachment,
  calculateBarDimensions
} from "./utilities";

export function makeHexagon({
  id = 1,
  centerPosition = HEXAGON_CONSTANTS.DEFAULT_CENTER_POSITION,
  width = HEXAGON_CONSTANTS.DEFAULT_WIDTH,
  height = HEXAGON_CONSTANTS.DEFAULT_HEIGHT,
  barProps = {},
  labels = HEXAGON_CONSTANTS.DEFAULT_LABELS,
  stackIndex = 1,
  hexIndex = 1,
  guid,
}: HexagonConfig): Model {
  print("⬡ Generating hexagon with 3 bars...");

  // Calculate bar dimensions
  const dimensions = calculateBarDimensions(width, height);

  // Create the hexagon model
  const hexModel = new Instance("Model");
  const hexagonName = generateHexagonName(stackIndex, hexIndex);
  hexModel.Name = hexagonName;

  // Set GUID as attribute if provided
  if (guid) {
    hexModel.SetAttribute("guid", guid);
  }

  // Create center cube and attachment
  const centerCube = createCenterCube(centerPosition, hexIndex, stackIndex);
  centerCube.Parent = hexModel;
  
  createCenterAttachment(centerCube, hexIndex, stackIndex);

  // Create 3 bars rotated 60 degrees apart
  for (let i = 0; i < HEXAGON_CONSTANTS.NUM_BARS; i++) {
    const rotation = i * HEXAGON_CONSTANTS.ROTATION_ANGLE; // 0°, 60°, 120°

    const defaultBarProps = {
      Size: [dimensions.barLength, dimensions.barHeight, dimensions.barWidth], // Swap width and length so Z is the long dimension
      Color: HEXAGON_CONSTANTS.DEFAULT_BAR_COLOR,
      ...barProps, // Spread any custom bar properties
    };

    const bar = makeBar({
      id: `${id}_bar${i + 1}`,
      position: {
        x: centerPosition[0],
        y: centerPosition[1],
        z: centerPosition[2],
      },
      rotation: { x: 0, y: rotation, z: 0 },
      props: defaultBarProps,
      label: labels[i] || `Bar${i + 1}`,
      stackIndex: stackIndex,
      hexIndex: hexIndex,
      barIndex: i + 1,
    });

    bar.Parent = hexModel;
  }

  return hexModel;
}