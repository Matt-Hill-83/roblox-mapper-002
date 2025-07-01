import { makeSmartHexStack } from "./smartHexStackMaker";

interface EntityStackConfig {
  id?: string;
  centerPosition?: [number, number, number];
  width?: number;
  height?: number;
  maxItems?: number;
  data: { name: string; guid?: string }[];
  color?: [number, number, number];
}

interface StackItem {
  name: string;
  labels: string[];
  guid?: string;
}

export function makeEntityStack({
  id = "entityStack1",
  centerPosition = [0, 2, 0],
  width = 8,
  height = 2,
  maxItems = 1,
  data,
  color,
}: EntityStackConfig): Model {
  const stackItems: StackItem[] = [];
  for (let i = 0; i < math.min(maxItems, data.size()); i++) {
    const item = data[i];
    // Create 6 labels all showing the entity name
    const labels = [
      item.name,
      item.name,
      item.name,
      item.name,
      item.name,
      item.name,
    ];
    stackItems.push({
      name: item.name,
      labels,
      guid: item.guid,
    });
  }

  const stackModel = makeSmartHexStack({
    id,
    centerPosition,
    width,
    height,
    stackItems,
    stackIndex: 99, // Use a default or pass as needed
    color: color,
  });

  return stackModel;
} 