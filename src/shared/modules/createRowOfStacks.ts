import { makeEntityStack } from "./entityStackMaker";
import { entityArtifactData } from "../data/entityArtifactData";
import { entityClassData } from "../data/entityClassData";
import { entityComponentData } from "../data/entityComponentData";
import { entityDomainData } from "../data/entityDomainData";

interface CreateRowOfStacksConfig {
  files: string[]; // Array of file base names (without .js)
  dataModules: Record<string, any>; // Map from base name to data array
  maxStacks: number;
  startPosition?: [number, number, number];
  spacing?: number;
}

export function createRowOfStacks({
  files,
  dataModules,
  maxStacks,
  startPosition = [0, 2, 0],
  spacing = 12,
}: CreateRowOfStacksConfig): Model[] {
  const stacks: Model[] = [];
  for (let i = 0; i < math.min(maxStacks, files.size()); i++) {
    const baseName = files[i];
    const data = dataModules[baseName];
    const pos: [number, number, number] = [
      startPosition[0] + i * spacing,
      startPosition[1],
      startPosition[2],
    ];
    const stack = makeEntityStack({
      id: baseName + "Stack",
      centerPosition: pos,
      width: 8,
      height: 2,
      maxItems: 16,
      data,
    });
    stacks.push(stack);
  }
  return stacks;
}

// Example usage:
createRowOfStacks({
  files: ["entityArtifact", "entityClass", "entityComponent", "entityDomain"],
  dataModules: {
    entityArtifact: entityArtifactData,
    entityClass: entityClassData,
    entityComponent: entityComponentData,
    entityDomain: entityDomainData,
  },
  maxStacks: 4,
}); 