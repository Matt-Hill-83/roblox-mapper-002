import { makeSmartHexStack } from "./smartHexStackMaker";
import { toolData } from "./toolData";

interface ToolStackConfig {
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

export function makeToolStack({
  id = "toolStack1",
  centerPosition = [0, 2, 0],
  width = 8,
  height = 2,
  maxItems = 1,
}: ToolStackConfig): Model {
  const stackItemsTools: StackItem[] = [];
  for (let i = 0; i < math.min(maxItems, toolData.size()); i++) {
    const item = toolData[i];
    const labels = [
      item.name,
      item.type,
      item.language,
      item.purpose,
      item.platform,
      item.category,
    ];
    stackItemsTools.push({
      name: item.name,
      labels,
    });
  }

  const stackModel = makeSmartHexStack({
    id,
    centerPosition,
    width,
    height,
    stackItems: stackItemsTools,
    stackIndex: 5, // Tool stack gets index 5
  });

  return stackModel;
} 