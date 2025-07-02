import { CLUSTER_RADIUS } from "./layoutConstants";
import { EntityPosition } from "./hierarchicalLayoutCalculator";

// Spatial clustering system for entity types
export class SpatialClustering {
  /**
   * Apply spatial clustering to entity positions based on their types
   */
  public applyClustering(entityPositions: EntityPosition[]): EntityPosition[] {
    // Group entities by type
    const entityGroups = this.groupEntitiesByType(entityPositions);

    // Apply clustering to each group
    const clusteredPositions: EntityPosition[] = [];

    entityGroups.forEach((entities, entityType) => {
      const clusteredGroup = this.applyTypeBasedClustering(
        entities,
        entityType
      );
      for (const entity of clusteredGroup) {
        clusteredPositions.push(entity);
      }
    });

    return clusteredPositions;
  }

  /**
   * Calculate cluster centroid for a group of entities
   */
  public calculateClusterCentroid(
    entities: EntityPosition[]
  ): [number, number, number] {
    if (entities.size() === 0) {
      return [0, 0, 0];
    }

    let totalX = 0;
    let totalY = 0;
    let totalZ = 0;

    for (const entity of entities) {
      totalX += entity.position[0];
      totalY += entity.position[1];
      totalZ += entity.position[2];
    }

    return [
      totalX / entities.size(),
      totalY / entities.size(),
      totalZ / entities.size(),
    ];
  }

  /**
   * Adjust cluster spacing to maintain hierarchy while grouping by type
   */
  public adjustClusterSpacing(
    clusteredPositions: EntityPosition[],
    hierarchicalPositions: EntityPosition[]
  ): EntityPosition[] {
    const adjustedPositions = [...clusteredPositions];

    // Maintain hierarchy constraints while allowing type clustering
    for (let i = 0; i < adjustedPositions.size(); i++) {
      const clusteredEntity = adjustedPositions[i];
      const originalEntity = hierarchicalPositions.find(
        (e) => e.guid === clusteredEntity.guid
      );

      if (originalEntity) {
        // Blend hierarchical and clustered positions
        const blendFactor = 0.3; // 30% clustering, 70% hierarchy

        adjustedPositions[i] = {
          ...clusteredEntity,
          position: [
            originalEntity.position[0] * (1 - blendFactor) +
              clusteredEntity.position[0] * blendFactor,
            originalEntity.position[1], // Keep hierarchical Y position
            originalEntity.position[2] * (1 - blendFactor) +
              clusteredEntity.position[2] * blendFactor,
          ],
        };
      }
    }

    return adjustedPositions;
  }

  /**
   * Create clusters for different entity types with specific arrangements
   */
  public createTypeSpecificClusters(
    entities: EntityPosition[]
  ): Map<string, EntityPosition[]> {
    const clusters = new Map<string, EntityPosition[]>();

    // Define clustering strategies for different entity types
    const clusteringStrategies = new Map<string, string>([
      ["component", "circular"],
      ["service", "linear"],
      ["module", "grid"],
      ["domain", "scattered"],
      ["environment", "grouped"],
      ["flag", "compact"],
      ["group", "radial"],
    ]);

    // Apply type-specific clustering
    for (const entity of entities) {
      const strategy =
        clusteringStrategies.get(entity.clusterGroup) || "circular";
      const clusterKey = `${entity.clusterGroup}_${strategy}`;

      const cluster = clusters.get(clusterKey) || [];
      cluster.push(entity);
      clusters.set(clusterKey, cluster);
    }

    return clusters;
  }

  // Private helper methods

  private groupEntitiesByType(
    entityPositions: EntityPosition[]
  ): Map<string, EntityPosition[]> {
    const groups = new Map<string, EntityPosition[]>();

    for (const entity of entityPositions) {
      const group = groups.get(entity.clusterGroup) || [];
      group.push(entity);
      groups.set(entity.clusterGroup, group);
    }

    return groups;
  }

  private applyTypeBasedClustering(
    entities: EntityPosition[],
    entityType: string
  ): EntityPosition[] {
    if (entities.size() <= 1) {
      return entities;
    }

    const centroid = this.calculateClusterCentroid(entities);
    // Apply different clustering patterns based on entity type
    switch (string.lower(entityType)) {
      case "component":
        return this.applyCircularClustering(entities, centroid);
      case "service":
        return this.applyLinearClustering(entities, centroid);
      case "module":
        return this.applyGridClustering(entities, centroid);
      case "domain":
        return this.applyScatteredClustering(entities, centroid);
      default:
        return this.applyCircularClustering(entities, centroid);
    }
  }

  private applyCircularClustering(
    entities: EntityPosition[],
    centroid: [number, number, number]
  ): EntityPosition[] {
    const clustered: EntityPosition[] = [];
    const radius = CLUSTER_RADIUS;

    for (let i = 0; i < entities.size(); i++) {
      const entity = entities[i];
      const angle = (i / entities.size()) * 2 * math.pi;

      const clusteredPosition: [number, number, number] = [
        centroid[0] + math.cos(angle) * radius,
        entity.position[1], // Maintain hierarchical Y position
        centroid[2] + math.sin(angle) * radius,
      ];

      clustered.push({
        ...entity,
        position: clusteredPosition,
      });
    }

    return clustered;
  }

  private applyLinearClustering(
    entities: EntityPosition[],
    centroid: [number, number, number]
  ): EntityPosition[] {
    const clustered: EntityPosition[] = [];
    const spacing = CLUSTER_RADIUS * 0.5;

    for (let i = 0; i < entities.size(); i++) {
      const entity = entities[i];
      const offset = (i - entities.size() / 2) * spacing;

      const clusteredPosition: [number, number, number] = [
        centroid[0] + offset,
        entity.position[1],
        centroid[2],
      ];

      clustered.push({
        ...entity,
        position: clusteredPosition,
      });
    }

    return clustered;
  }

  private applyGridClustering(
    entities: EntityPosition[],
    centroid: [number, number, number]
  ): EntityPosition[] {
    const clustered: EntityPosition[] = [];
    const gridSize = math.ceil(math.sqrt(entities.size()));
    const spacing = CLUSTER_RADIUS * 0.7;

    for (let i = 0; i < entities.size(); i++) {
      const entity = entities[i];
      const row = math.floor(i / gridSize);
      const col = i % gridSize;

      const clusteredPosition: [number, number, number] = [
        centroid[0] + (col - gridSize / 2) * spacing,
        entity.position[1],
        centroid[2] + (row - gridSize / 2) * spacing,
      ];

      clustered.push({
        ...entity,
        position: clusteredPosition,
      });
    }

    return clustered;
  }

  private applyScatteredClustering(
    entities: EntityPosition[],
    centroid: [number, number, number]
  ): EntityPosition[] {
    const clustered: EntityPosition[] = [];
    const scatterRadius = CLUSTER_RADIUS * 1.2;

    for (let i = 0; i < entities.size(); i++) {
      const entity = entities[i];

      // Random but deterministic positioning based on entity guid
      const hash = this.hashGuid(entity.guid);
      const angle = (hash % 360) * (math.pi / 180);
      const distance = ((hash % 100) / 100) * scatterRadius;

      const clusteredPosition: [number, number, number] = [
        centroid[0] + math.cos(angle) * distance,
        entity.position[1],
        centroid[2] + math.sin(angle) * distance,
      ];

      clustered.push({
        ...entity,
        position: clusteredPosition,
      });
    }

    return clustered;
  }

  private hashGuid(guid: string): number {
    let hash = 0;
    for (let i = 0; i < guid.size(); i++) {
      const char = string.byte(guid, i + 1)[0];
      hash = (hash << 5) - hash + char;
      hash = hash % 1000000; // Keep hash reasonable
    }
    return math.abs(hash);
  }
}
