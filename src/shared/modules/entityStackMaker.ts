import { makeSmartHexStack } from "./smartHexStackMaker";

interface EntityWithConnection {
  name: string;
  guid?: string;
  hasConnection?: boolean;
  connectionCount?: number;
}

interface EntityStackConfig {
  id?: string;
  centerPosition?: [number, number, number];
  width?: number;
  height?: number;
  maxItems?: number;
  data: EntityWithConnection[];
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
  // Filter entities into two groups and concatenate them
  // Connected entities go at the top of the stack (first in array)
  // Isolated entities (no connections) go at the bottom of the stack (last in array)
  const connectedEntities = data.filter(
    (entity) => entity.hasConnection || false
  );
  const isolatedEntities = data.filter(
    (entity) => !(entity.hasConnection || false)
  );

  // Concatenate: connected first (top), then isolated (bottom)
  const sortedData = [...connectedEntities, ...isolatedEntities];

  // Console log the sorted array for debugging
  print(`\n[DEBUG] Sorted array for stack '${id}':`);
  for (let i = 0; i < sortedData.size(); i++) {
    const e = sortedData[i];
    print(
      `  ${i}: ${e.name} - hasConnection: ${
        e.hasConnection ? "true" : "false"
      }`
    );
  }

  print(
    `� ${id}: Sorted ${data.size()} entities: ${connectedEntities.size()} connected (top), ${isolatedEntities.size()} isolated (bottom)`
  );

  // Special debugging for entityDomain stack only (since it's the focus)
  const isEntityDomain = id === "entityDomainStack";
  if (isEntityDomain) {
    print(
      `� EntityDomain stack verification - Total: ${sortedData.size()} entities`
    );
    if (isolatedEntities.size() > 0) {
      print(
        `  🔴 Isolated (bottom): ${isolatedEntities[0].name}${
          isolatedEntities.size() > 1
            ? ` ... and ${isolatedEntities.size() - 1} more`
            : ""
        }`
      );
    }
    if (connectedEntities.size() > 0) {
      print(
        `  🟢 Connected (top): ${connectedEntities[0].name}${
          connectedEntities.size() > 1
            ? ` ... and ${connectedEntities.size() - 1} more`
            : ""
        }`
      );
    }
  }

  const stackItems: StackItem[] = [];
  for (let i = 0; i < math.min(maxItems, sortedData.size()); i++) {
    const item = sortedData[i];
    const hasConnection = item.hasConnection || false;

    // Create 6 labels showing entity info
    const labels = [
      item.name,
      hasConnection ? "🔗 Connected" : "❌ Isolated",
      item.name,
      hasConnection ? "Has Relations" : "No Relations",
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
