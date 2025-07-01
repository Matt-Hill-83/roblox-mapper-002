import { allEntityData, allRelationData } from "../data";

export interface EntityWithConnection {
  guid: string;
  name: string;
  hasConnection: boolean;
  connectionCount: number;
  connectionTypes: string[];
  [key: string]: any; // Allow other properties from original entity
}

export interface ConnectionAnalysisResult {
  totalEntities: number;
  entitiesWithConnections: number;
  entitiesWithoutConnections: number;
  connectionRate: number;
  entitiesByType: Record<
    string,
    {
      total: number;
      withConnections: number;
      connectionRate: number;
    }
  >;
}

export function analyzeEntityConnections(): ConnectionAnalysisResult {
  // First, collect all GUIDs that appear in relations
  const connectedGUIDs = new Set<string>();
  const guidConnectionCounts = new Map<string, number>();
  const guidConnectionTypes = new Map<string, Set<string>>();

  // Scan all relation data to find connected GUIDs
  for (const relationInfo of allRelationData) {
    for (const relation of relationInfo.data) {
      // Add source GUID
      connectedGUIDs.add(relation.source_guid);
      guidConnectionCounts.set(
        relation.source_guid,
        (guidConnectionCounts.get(relation.source_guid) || 0) + 1
      );

      if (!guidConnectionTypes.has(relation.source_guid)) {
        guidConnectionTypes.set(relation.source_guid, new Set());
      }
      guidConnectionTypes.get(relation.source_guid)!.add(relationInfo.name);

      // Add target GUID
      connectedGUIDs.add(relation.target_guid);
      guidConnectionCounts.set(
        relation.target_guid,
        (guidConnectionCounts.get(relation.target_guid) || 0) + 1
      );

      if (!guidConnectionTypes.has(relation.target_guid)) {
        guidConnectionTypes.set(relation.target_guid, new Set());
      }
      guidConnectionTypes.get(relation.target_guid)!.add(relationInfo.name);
    }
  }

  print(`📊 Found ${connectedGUIDs.size()} unique GUIDs with connections`);

  // Analyze each entity type
  let totalEntities = 0;
  let entitiesWithConnections = 0;
  const entitiesByType: Record<
    string,
    {
      total: number;
      withConnections: number;
      connectionRate: number;
    }
  > = {};

  for (const entityInfo of allEntityData) {
    const entityTypeName = entityInfo.name;
    let typeTotal = 0;
    let typeWithConnections = 0;

    for (const entity of entityInfo.data) {
      totalEntities++;
      typeTotal++;

      if (connectedGUIDs.has(entity.guid)) {
        entitiesWithConnections++;
        typeWithConnections++;
      }
    }

    entitiesByType[entityTypeName] = {
      total: typeTotal,
      withConnections: typeWithConnections,
      connectionRate:
        typeTotal > 0 ? (typeWithConnections / typeTotal) * 100 : 0,
    };

    print(
      `  ${entityTypeName}: ${typeWithConnections}/${typeTotal} (${
        math.floor(entitiesByType[entityTypeName].connectionRate * 10) / 10
      }%)`
    );
  }

  const connectionRate =
    totalEntities > 0 ? (entitiesWithConnections / totalEntities) * 100 : 0;

  return {
    totalEntities,
    entitiesWithConnections,
    entitiesWithoutConnections: totalEntities - entitiesWithConnections,
    connectionRate,
    entitiesByType,
  };
}

export function addConnectionPropertiesToEntities(): void {
  // Get connection analysis first
  const connectedGUIDs = new Set<string>();
  const guidConnectionCounts = new Map<string, number>();
  const guidConnectionTypes = new Map<string, Set<string>>();

  // Scan all relation data to find connected GUIDs
  for (const relationInfo of allRelationData) {
    for (const relation of relationInfo.data) {
      // Add source GUID
      connectedGUIDs.add(relation.source_guid);
      guidConnectionCounts.set(
        relation.source_guid,
        (guidConnectionCounts.get(relation.source_guid) || 0) + 1
      );
      if (!guidConnectionTypes.has(relation.source_guid)) {
        guidConnectionTypes.set(relation.source_guid, new Set());
      }
      guidConnectionTypes.get(relation.source_guid)!.add(relationInfo.name);

      // Add target GUID
      connectedGUIDs.add(relation.target_guid);
      guidConnectionCounts.set(
        relation.target_guid,
        (guidConnectionCounts.get(relation.target_guid) || 0) + 1
      );
      if (!guidConnectionTypes.has(relation.target_guid)) {
        guidConnectionTypes.set(relation.target_guid, new Set());
      }
      guidConnectionTypes.get(relation.target_guid)!.add(relationInfo.name);
    }
  }

  // Add hasConnection property to all entities
  for (const entityInfo of allEntityData) {
    let connectedCount = 0;
    let isolatedCount = 0;

    for (const entity of entityInfo.data) {
      const hasConnection = connectedGUIDs.has(entity.guid);
      const connectionCount = guidConnectionCounts.get(entity.guid) || 0;
      const connectionTypesSet =
        guidConnectionTypes.get(entity.guid) || new Set();
      const connectionTypes = [...connectionTypesSet];

      // Add the properties
      (entity as any).hasConnection = hasConnection;
      (entity as any).connectionCount = connectionCount;
      (entity as any).connectionTypes = connectionTypes;

      if (hasConnection) {
        connectedCount++;
      } else {
        isolatedCount++;
      }
    }

    // Summary for each entity type
    print(
      `  ✅ ${entityInfo.name}: ${connectedCount} connected, ${isolatedCount} isolated`
    );
  }
}

export function getEntitiesWithConnections(): EntityWithConnection[] {
  const entitiesWithConnections: EntityWithConnection[] = [];

  for (const entityInfo of allEntityData) {
    for (const entity of entityInfo.data) {
      const entityWithConnection = entity as any as EntityWithConnection;
      if (entityWithConnection.hasConnection) {
        entitiesWithConnections.push(entityWithConnection);
      }
    }
  }

  return entitiesWithConnections;
}

export function printConnectionSummary(): void {
  const analysis = analyzeEntityConnections();

  print("📊 CONNECTION ANALYSIS SUMMARY:");
  print(`  Total entities: ${analysis.totalEntities}`);
  print(`  Entities WITH connections: ${analysis.entitiesWithConnections}`);
  print(
    `  Entities WITHOUT connections: ${analysis.entitiesWithoutConnections}`
  );
  print(
    `  Overall connection rate: ${
      math.floor(analysis.connectionRate * 10) / 10
    }%`
  );
  print("");
  print("📈 By entity type:");

  // Create array of type stats for sorting
  const typeArray: Array<[string, (typeof analysis.entitiesByType)[string]]> =
    [];
  for (const [typeName, stats] of pairs(analysis.entitiesByType)) {
    typeArray.push([typeName, stats]);
  }

  // Sort by connection rate descending (Luau sort returns boolean)
  typeArray.sort((a, b) => a[1].connectionRate > b[1].connectionRate);

  for (const [typeName, stats] of typeArray) {
    const displayName = typeName.sub(7); // Remove "entity" prefix (7 characters)
    print(
      `  ${displayName}: ${stats.withConnections}/${stats.total} (${
        math.floor(stats.connectionRate * 10) / 10
      }%)`
    );
  }
}
