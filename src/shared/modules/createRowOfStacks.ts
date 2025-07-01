import { makeEntityStack } from "./entityStackMaker";
import { allEntityData } from "../data";

interface CreateRowOfStacksConfig {
  maxStacks: number;
  startPosition?: [number, number, number];
  spacing?: number;
}

export function createRowOfStacks({
  maxStacks,
  startPosition = [0, 2, 0],
  spacing = 12,
}: CreateRowOfStacksConfig): Model[] {
  const stacks: Model[] = [];
  
  // Take the first maxStacks from available entity data
  const selectedData: typeof allEntityData = [];
  for (let i = 0; i < math.min(maxStacks, allEntityData.size()); i++) {
    selectedData.push(allEntityData[i]);
  }
  
  print(`🟦 Row: Using entities 0 to ${selectedData.size() - 1} (${selectedData.size()} total)`);
  
  // Debug: Print first few entity names
  for (let i = 0; i < math.min(5, selectedData.size()); i++) {
    print(`  Row entity ${i}: ${selectedData[i].name} (${selectedData[i].data.size()} items)`);
  }
  
  for (let i = 0; i < selectedData.size(); i++) {
    const entityInfo = selectedData[i];
    const pos: [number, number, number] = [
      startPosition[0] + i * spacing,
      startPosition[1],
      startPosition[2],
    ];
    const stack = makeEntityStack({
      id: entityInfo.name + "Stack",
      centerPosition: pos,
      width: 8,
      height: 2,
      maxItems: 16,
      data: entityInfo.data,
    });
    stacks.push(stack);
  }
  return stacks;
} 