// Hexagon Creation Module
import { makeBar } from "./baseAssets/makeBar.js";

export function makeHexagon({
  project,
  id = 1,
  centerPosition = [0, 2, 0],
  width = 10,
  height = 0.5,
  barProps = {},
  labels = ["Front", "Left", "Right"], // default fallback
}) {
  console.log(`⬡ Generating hexagon with 3 bars...`);

  // Calculate bar dimensions for a hexagon
  // For a regular hexagon with width W:
  // - Each side length = W/2 (radius)
  // - To form a solid hexagon with 3 overlapping bars, bar width = radius * √3
  const radius = width / 2;
  const barLength = radius;
  const barWidth = radius * Math.sqrt(3); // Proper width for solid hexagon
  const barHeight = height; // Use passed-in height

  // Create 3 bars rotated 60 degrees apart
  const bars = [];
  const barsObj = {};

  for (let i = 0; i < 3; i++) {
    const rotation = i * 60; // 0°, 60°, 120°

    const defaultBarProps = {
      Size: [barLength, barHeight, barWidth], // Swap width and length so Z is the long dimension
      Color: [0.9, 0.7, 0.3], // Golden color
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
    });

    // Instead of assigning to project.tree.Workspace.MyStuff, collect bars as children
    Object.assign(barsObj, bar);
    bars.push(bar);
  }

  // Wrap bars in a Model (Group) instance
  const hexModel = {
    [`${id}_Hexagon`]: {
      $className: "Model",
      // Children are the bars
      ...barsObj,
    },
  };

  return hexModel;
}
