import { makeSmartHexStack } from "./smartHexStackMaker";
import { newNations } from "./nationsData";

interface NationsStackConfig {
  id?: string;
  centerPosition?: [number, number, number];
  width?: number;
  height?: number;
  maxItems?: number;
}

interface StackItem {
  name: string;
  labels: string[];
}

export function makeNationsStack({
  id = "nationsStack1",
  centerPosition = [0, 2, 0],
  width = 8,
  height = 2,
  maxItems = 1,
}: NationsStackConfig): Model {
  const stackItemsNations: StackItem[] = [];
  for (let i = 0; i < math.min(maxItems, newNations.size()); i++) {
    const item = newNations[i];
    const labels = [
      item.sport,
      item.country,
      item.capitalCity,
      item.animal,
      item.stadium,
      item.food,
    ];
    stackItemsNations.push({
      name: item.team,
      labels,
    });
  }

  const stackModel = makeSmartHexStack({
    id,
    centerPosition,
    width,
    height,
    stackItems: stackItemsNations,
    stackIndex: 3,
  });

  return stackModel;
} 