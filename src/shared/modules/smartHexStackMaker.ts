import { makeHexagon } from "./hexagonMaker";

interface StackItem {
  name: string;
  labels: string[];
}

interface SmartHexStackConfig {
  id: string;
  centerPosition: [number, number, number];
  width: number;
  height: number;
  stackItems: StackItem[];
  stackIndex?: number;
}

export function makeSmartHexStack({
  id,
  centerPosition,
  width,
  height,
  stackItems,
  stackIndex = 1,
}: SmartHexStackConfig): Model[] {
  print(`⬢ Generating smart hex stack with ${stackItems.size()} items...`);

  const hexagons: Model[] = [];

  // Create stacked hexagons for each item
  for (let level = 0; level < stackItems.size(); level++) {
    const item = stackItems[level];
    const levelY = centerPosition[1] + level * height;
    const levelPosition: [number, number, number] = [centerPosition[0], levelY, centerPosition[2]];

    // Create a hexagon for this level with custom labels
    const hexModel = makeHexagon({
      id: `${id}_level${level + 1}` as unknown as number,
      centerPosition: levelPosition,
      width: width,
      height: height,
      barProps: {
        Color: [0.2, 0.6, 0.8], // Blue color for nations
      },
      labels: item.labels,
      stackIndex: stackIndex,
      hexIndex: level + 1,
    });

    hexagons.push(hexModel);
  }

  return hexagons;
} 