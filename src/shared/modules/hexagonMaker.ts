import { makeBar } from "./barMaker";

interface HexagonConfig {
  id?: number;
  centerPosition?: [number, number, number];
  width?: number;
  height?: number;
  barProps?: any;
  labels?: string[];
  stackIndex?: number;
  hexIndex?: number;
  guid?: string;
}

function padNumber(num: number, length: number): string {
  const str = tostring(num);
  let result = str;
  while (result.size() < length) {
    result = "0" + result;
  }
  return result;
}

function generateHexagonName(stackIndex: number, hexIndex: number): string {
  const hexStr = padNumber(hexIndex, 3);
  const stackStr = padNumber(stackIndex, 3);
  return `h${hexStr}-st${stackStr}`;
}

export function makeHexagon({
  id = 1,
  centerPosition = [0, 2, 0],
  width = 10,
  height = 0.5,
  barProps = {},
  labels = ["Front", "Left", "Right"],
  stackIndex = 1,
  hexIndex = 1,
  guid,
}: HexagonConfig): Model {
  print("⬡ Generating hexagon with 3 bars...");

  // Calculate bar dimensions for a hexagon
  // For a regular hexagon with width W:
  // - Each side length = W/2 (radius)
  // - To form a solid hexagon with 3 overlapping bars, bar width = radius * √3
  const radius = width / 2;
  const barLength = radius;
  const barWidth = radius * math.sqrt(3); // Proper width for solid hexagon
  const barHeight = height; // Use passed-in height

  // Create the hexagon model
  const hexModel = new Instance("Model");
  const hexagonName = generateHexagonName(stackIndex, hexIndex);
  hexModel.Name = hexagonName;

  // Set GUID as attribute if provided
  if (guid) {
    hexModel.SetAttribute("guid", guid);
  }

  // Create a cube at the center of the hexagon
  const centerCube = new Instance("Part");
  centerCube.Name = `centerCube-h${padNumber(hexIndex, 3)}-st${padNumber(
    stackIndex,
    3
  )}`;
  centerCube.Size = new Vector3(0.1, 0.1, 0.1);
  centerCube.Position = new Vector3(
    centerPosition[0],
    centerPosition[1],
    centerPosition[2]
  );
  centerCube.Anchored = true;
  centerCube.Transparency = 0.4;
  centerCube.Color = Color3.fromRGB(255, 255, 0); // yellow for visibility
  centerCube.Parent = hexModel;

  // Create center attachment and parent to center cube
  const centerAttachment = new Instance("Attachment");
  centerAttachment.Name = `att000-h${padNumber(hexIndex, 3)}-st${padNumber(
    stackIndex,
    3
  )}`;
  centerAttachment.Position = new Vector3(0, 0, 0);
  centerAttachment.Parent = centerCube;

  // Create 3 bars rotated 60 degrees apart
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
      stackIndex: stackIndex,
      hexIndex: hexIndex,
      barIndex: i + 1,
    });

    bar.Parent = hexModel;
  }

  return hexModel;
}
