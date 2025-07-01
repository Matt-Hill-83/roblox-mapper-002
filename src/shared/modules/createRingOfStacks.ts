import { makeEntityStack } from "./entityStackMaker";
import { allEntityData } from "../data";

interface CreateRingOfStacksConfig {
  maxStacks: number;
  centerPosition?: [number, number, number];
  radius?: number;
  startIndex?: number; // New parameter to specify which entities to use
  color?: [number, number, number]; // Color parameter for the stacks (deprecated - will generate unique colors)
}

// Color palette for different entity stacks
const stackColorPalette: [number, number, number][] = [
  [1, 0.2, 0.2], // Bright red
  [0.2, 0.8, 0.2], // Bright green
  [0.2, 0.2, 1], // Bright blue
  [1, 0.8, 0.2], // Bright yellow/orange
  [0.8, 0.2, 0.8], // Bright magenta
  [0.2, 0.8, 0.8], // Bright cyan
  [1, 0.5, 0], // Orange
  [0.5, 0, 1], // Purple
  [0, 0.7, 0.3], // Forest green
  [0.8, 0.4, 0.2], // Brown
  [1, 0.4, 0.8], // Pink
  [0.6, 0.8, 0.2], // Lime green
  [0.2, 0.4, 0.8], // Royal blue
  [0.8, 0.8, 0.2], // Yellow-green
  [0.7, 0.3, 0.5], // Maroon
  [0.3, 0.7, 0.7], // Teal
  [0.9, 0.6, 0.3], // Light orange
  [0.4, 0.2, 0.7], // Indigo
  [0.6, 0.9, 0.4], // Light green
  [0.9, 0.3, 0.4], // Rose
];

export function createRingOfStacks({
  maxStacks,
  centerPosition = [0, 2, 0],
  radius = 20,
  startIndex = 0,
  color,
}: CreateRingOfStacksConfig): Model[] {
  const stacks: Model[] = [];

  print(`🔵 Ring: Total entities available: ${allEntityData.size()}`);
  print(
    `🔵 Ring: Requested startIndex: ${startIndex}, maxStacks: ${maxStacks}`
  );

  // Take entities starting from startIndex
  const selectedData: typeof allEntityData = [];
  const endIndex = math.min(startIndex + maxStacks, allEntityData.size());
  for (let i = startIndex; i < endIndex; i++) {
    selectedData.push(allEntityData[i]);
  }

  print(
    `🔵 Ring: Using entities ${startIndex} to ${
      endIndex - 1
    } (${selectedData.size()} total)`
  );

  // Debug: Print first few entity names
  for (let i = 0; i < math.min(5, selectedData.size()); i++) {
    print(
      `  Ring entity ${i}: ${selectedData[i].name} (${selectedData[
        i
      ].data.size()} items)`
    );
  }

  for (let i = 0; i < selectedData.size(); i++) {
    const entityInfo = selectedData[i];
    let pos: [number, number, number];

    if (i === 0) {
      // First stack goes in the center
      pos = [centerPosition[0], centerPosition[1], centerPosition[2]];
    } else {
      // Remaining stacks go around the perimeter
      const numPerimeterStacks = selectedData.size() - 1;
      const angleStep = (2 * math.pi) / numPerimeterStacks;
      const angle = (i - 1) * angleStep;

      pos = [
        centerPosition[0] + radius * math.cos(angle),
        centerPosition[1],
        centerPosition[2] + radius * math.sin(angle),
      ];
    }

    // Assign unique color to each stack
    const stackColor = stackColorPalette[i % stackColorPalette.size()];
    print(
      `  ${entityInfo.name}Stack: Color [${stackColor[0]}, ${stackColor[1]}, ${stackColor[2]}]`
    );

    const stack = makeEntityStack({
      id: entityInfo.name + "Stack",
      centerPosition: pos,
      width: 8,
      height: 2,
      maxItems: 16,
      data: entityInfo.data,
      color: stackColor, // Use unique color for each stack
    });
    stacks.push(stack);
  }
  return stacks;
}

// Example usage:
createRingOfStacks({
  maxStacks: 7,
  centerPosition: [0, 1, 0],
  radius: 25,
});
