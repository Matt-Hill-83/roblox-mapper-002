import { makeEntityStack } from "./entityStackMaker";
import { allEntityData } from "../data";

interface CreateRingOfStacksConfig {
  maxStacks: number;
  centerPosition?: [number, number, number];
  radius?: number;
  startIndex?: number; // New parameter to specify which entities to use
  color?: [number, number, number]; // Color parameter for the stacks
}

export function createRingOfStacks({
  maxStacks,
  centerPosition = [0, 2, 0],
  radius = 20,
  startIndex = 0,
  color,
}: CreateRingOfStacksConfig): Model[] {
  const stacks: Model[] = [];
  
  print(`🔵 Ring: Total entities available: ${allEntityData.size()}`);
  print(`🔵 Ring: Requested startIndex: ${startIndex}, maxStacks: ${maxStacks}`);
  
  // Take entities starting from startIndex
  const selectedData: typeof allEntityData = [];
  const endIndex = math.min(startIndex + maxStacks, allEntityData.size());
  for (let i = startIndex; i < endIndex; i++) {
    selectedData.push(allEntityData[i]);
  }
  
  print(`🔵 Ring: Using entities ${startIndex} to ${endIndex - 1} (${selectedData.size()} total)`);
  
  // Debug: Print first few entity names
  for (let i = 0; i < math.min(5, selectedData.size()); i++) {
    print(`  Ring entity ${i}: ${selectedData[i].name} (${selectedData[i].data.size()} items)`);
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
    
    const stack = makeEntityStack({
      id: entityInfo.name + "Stack",
      centerPosition: pos,
      width: 8,
      height: 2,
      maxItems: 16,
      data: entityInfo.data,
      color: color,
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
