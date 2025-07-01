import { entityComponentData } from "./componentData";
import { makeSmartHexStack } from "./smartHexStackMaker";

interface ComponentStackConfig {
  id?: string;
  centerPosition?: [number, number, number];
  width?: number;
  height?: number;
  maxItems?: number;
}

interface StackItem {
  name: string;
  labels: string[];
  guid?: string;
}

export function makeComponentStack({
  id = "componentStack1",
  centerPosition = [0, 2, 0],
  width = 8,
  height = 2,
  maxItems = 1,
}: ComponentStackConfig): Model {
  const stackItemsComponents: StackItem[] = [];
  for (let i = 0; i < math.min(maxItems, entityComponentData.size()); i++) {
    const item = entityComponentData[i];
    // Create 6 labels all showing the component name
    const labels = [
      item.name,
      item.name,
      item.name,
      item.name,
      item.name,
      item.name,
    ];
    stackItemsComponents.push({
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
    stackItems: stackItemsComponents,
    stackIndex: 4, // Component stack gets index 4
    color: [0.4, 0.8, 0.4], // Light green color
  });

  return stackModel;
} 