// Hexagon Stack Creation Module
import { makeHexagon } from "./makeHexagon.js";
import { colors } from "./colors.js";

export function makeHexStack({
  project,
  id = 1,
  centerPosition = [0, 2, 0],
  width = 10,
  height = 0.5,
  count = 4,
  // colors = null,
}) {
  console.log(`⬢ Generating hex stack with ${count} hexagons...`);

  // Default color palette if none provided
  const defaultColors = [
    colors["Bright red"], // Red
    colors["Brick yellow"], // Golden
    colors["Bright green"], // Green
    colors["Bright blue"], // Blue
    colors["Royal purple"], // Purple
    colors["Bright orange"], // Orange
    colors["Bright bluish green"], // Cyan
    colors["Hot pink"], // Pink
  ];

  const colorPalette = colors.length > 0 ? colors : defaultColors;
  const allBars = [];

  // Create stacked hexagons
  for (let level = 0; level < count; level++) {
    const levelY = centerPosition[1] + level * height;
    const levelPosition = [centerPosition[0], levelY, centerPosition[2]];
    const levelColor = colorPalette[level % colorPalette.length];

    // Create a hexagon for this level
    const hexModel = makeHexagon({
      project,
      id: `${id}_level${level + 1}`,
      centerPosition: levelPosition,
      width: width,
      height: height,
      barProps: {
        Color: levelColor,
      },
    });

    // hexModel is an object with a single key (the Model name)
    allBars.push(hexModel);
  }

  return allBars;
}
