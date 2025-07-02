import {
  TREE_SPACING,
  LEVEL_HEIGHT,
  ENTITY_SPACING,
  BASE_HEIGHT,
} from "./layoutConstants";
import { EntityPosition, TreeLayout } from "./hierarchicalLayoutCalculator";

// Dynamic spacing calculator for hierarchical layouts
export class DynamicSpacingCalculator {
  /**
   * Calculate dynamic spacing based on tree characteristics
   */
  public calculateDynamicSpacing(trees: TreeLayout[]): DynamicSpacingConfig {
    print(
      "[DynamicSpacingCalculator] Calculating dynamic spacing for",
      trees.size(),
      "trees"
    );

    // Analyze tree characteristics
    const treeAnalysis = this.analyzeTreeCharacteristics(trees);

    // Calculate optimal spacing
    const spacingConfig = this.calculateOptimalSpacing(treeAnalysis);

    print(
      "[DynamicSpacingCalculator] Dynamic spacing calculated:",
      spacingConfig
    );
    return spacingConfig;
  }

  /**
   * Apply dynamic spacing to tree layouts
   */
  public applyDynamicSpacing(
    trees: TreeLayout[],
    spacingConfig: DynamicSpacingConfig
  ): TreeLayout[] {
    const adjustedTrees: TreeLayout[] = [];

    for (let i = 0; i < trees.size(); i++) {
      const tree = trees[i];
      const adjustedTree = this.applySpacingToTree(tree, spacingConfig, i);
      adjustedTrees.push(adjustedTree);
    }

    return adjustedTrees;
  }

  /**
   * Calculate spacing between trees based on their size and complexity
   */
  public calculateTreeSpacing(
    tree1: TreeLayout,
    tree2: TreeLayout,
    baseSpacing: number = TREE_SPACING
  ): number {
    // Factor in tree widths
    const tree1Width = tree1.boundingBox.max[0] - tree1.boundingBox.min[0];
    const tree2Width = tree2.boundingBox.max[0] - tree2.boundingBox.min[0];

    // Factor in tree complexity (entity count)
    const complexityFactor =
      math.sqrt(tree1.totalEntities + tree2.totalEntities) / 10;

    // Calculate dynamic spacing
    const dynamicSpacing =
      baseSpacing + (tree1Width + tree2Width) / 2 + complexityFactor;

    return math.max(baseSpacing, dynamicSpacing);
  }

  /**
   * Calculate level heights based on tree depth and density
   */
  public calculateDynamicLevelHeights(tree: TreeLayout): number[] {
    const levelHeights: number[] = [];
    const entitiesByLevel = this.groupEntitiesByLevel(tree.entityPositions);

    entitiesByLevel.forEach((entities, level) => {
      // Base height
      let levelHeight = LEVEL_HEIGHT;

      // Adjust based on entity count at this level
      const entityDensity = entities.size();
      if (entityDensity > 5) {
        levelHeight *= 1.2; // Increase spacing for crowded levels
      } else if (entityDensity > 10) {
        levelHeight *= 1.5;
      }

      // Adjust based on tree depth (deeper trees need more space)
      const depthFactor = 1 + level * 0.1;
      levelHeight *= depthFactor;

      levelHeights.push(levelHeight);
    });

    return levelHeights;
  }

  /**
   * Calculate entity spacing within levels based on local density
   */
  public calculateDynamicEntitySpacing(
    entities: EntityPosition[],
    baseSpacing: number = ENTITY_SPACING
  ): number {
    const entityCount = entities.size();

    // Increase spacing for crowded areas
    if (entityCount > 8) {
      return baseSpacing * 1.3;
    } else if (entityCount > 4) {
      return baseSpacing * 1.1;
    }

    return baseSpacing;
  }

  // Private helper methods

  private analyzeTreeCharacteristics(
    trees: TreeLayout[]
  ): TreeCharacteristics[] {
    const characteristics: TreeCharacteristics[] = [];

    for (const tree of trees) {
      const char: TreeCharacteristics = {
        treeId: tree.treeId,
        depth: this.calculateTreeDepth(tree.entityPositions),
        width: tree.boundingBox.max[0] - tree.boundingBox.min[0],
        height: tree.boundingBox.max[1] - tree.boundingBox.min[1],
        entityCount: tree.totalEntities,
        density: this.calculateTreeDensity(tree),
        complexity: this.calculateTreeComplexity(tree),
      };

      characteristics.push(char);
    }

    return characteristics;
  }

  private calculateOptimalSpacing(
    characteristics: TreeCharacteristics[]
  ): DynamicSpacingConfig {
    if (characteristics.size() === 0) {
      return this.getDefaultSpacingConfig();
    }

    // Calculate average characteristics
    const avgDepth =
      characteristics.reduce((sum, char) => sum + char.depth, 0) /
      characteristics.size();
    const avgEntityCount =
      characteristics.reduce((sum, char) => sum + char.entityCount, 0) /
      characteristics.size();
    const maxWidth = math.max(...characteristics.map((char) => char.width));

    // Calculate dynamic spacing values
    const dynamicTreeSpacing = TREE_SPACING + maxWidth * 0.5;
    const dynamicLevelHeight = LEVEL_HEIGHT * (1 + avgDepth * 0.1);
    const dynamicEntitySpacing = ENTITY_SPACING * (1 + avgEntityCount / 50);

    return {
      treeSpacing: math.min(dynamicTreeSpacing, TREE_SPACING * 2),
      levelHeight: math.min(dynamicLevelHeight, LEVEL_HEIGHT * 2),
      entitySpacing: math.min(dynamicEntitySpacing, ENTITY_SPACING * 2),
      baseHeight: BASE_HEIGHT,
      adaptiveScaling: true,
    };
  }

  private applySpacingToTree(
    tree: TreeLayout,
    spacingConfig: DynamicSpacingConfig,
    treeIndex: number
  ): TreeLayout {
    const adjustedPositions: EntityPosition[] = [];

    // Group entities by level for level-specific adjustments
    const entitiesByLevel = this.groupEntitiesByLevel(tree.entityPositions);

    entitiesByLevel.forEach((entities, level) => {
      const levelHeight = spacingConfig.levelHeight * (1 + level * 0.05);

      for (let i = 0; i < entities.size(); i++) {
        const entity = entities[i];

        // Apply dynamic spacing adjustments
        const adjustedPosition: [number, number, number] = [
          entity.position[0] + treeIndex * spacingConfig.treeSpacing,
          spacingConfig.baseHeight - level * levelHeight,
          entity.position[2],
        ];

        adjustedPositions.push({
          ...entity,
          position: adjustedPosition,
        });
      }
    });

    // Recalculate bounding box
    const newBoundingBox = this.calculateBoundingBox(adjustedPositions);

    return {
      ...tree,
      entityPositions: adjustedPositions,
      boundingBox: newBoundingBox,
    };
  }

  private calculateTreeDepth(entityPositions: EntityPosition[]): number {
    if (entityPositions.size() === 0) return 0;

    return math.max(...entityPositions.map((entity) => entity.level)) + 1;
  }

  private calculateTreeDensity(tree: TreeLayout): number {
    const volume = this.calculateBoundingBoxVolume(tree.boundingBox);
    return volume > 0 ? tree.totalEntities / volume : 0;
  }

  private calculateTreeComplexity(tree: TreeLayout): number {
    // Complexity based on connections and depth
    const connectionCount = tree.connections.size();
    const depth = this.calculateTreeDepth(tree.entityPositions);

    return connectionCount * depth;
  }

  private calculateBoundingBoxVolume(boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
  }): number {
    const width = boundingBox.max[0] - boundingBox.min[0];
    const height = boundingBox.max[1] - boundingBox.min[1];
    const depth = boundingBox.max[2] - boundingBox.min[2];

    return width * height * depth;
  }

  private groupEntitiesByLevel(
    entityPositions: EntityPosition[]
  ): Map<number, EntityPosition[]> {
    const levelMap = new Map<number, EntityPosition[]>();

    for (const entity of entityPositions) {
      const levelEntities = levelMap.get(entity.level) || [];
      levelEntities.push(entity);
      levelMap.set(entity.level, levelEntities);
    }

    return levelMap;
  }

  private calculateBoundingBox(entityPositions: EntityPosition[]): {
    min: [number, number, number];
    max: [number, number, number];
  } {
    if (entityPositions.size() === 0) {
      return { min: [0, 0, 0], max: [0, 0, 0] };
    }

    const positions = entityPositions.map((e) => e.position);
    const minX = math.min(...positions.map((p) => p[0]));
    const minY = math.min(...positions.map((p) => p[1]));
    const minZ = math.min(...positions.map((p) => p[2]));
    const maxX = math.max(...positions.map((p) => p[0]));
    const maxY = math.max(...positions.map((p) => p[1]));
    const maxZ = math.max(...positions.map((p) => p[2]));

    return {
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ],
    };
  }

  private getDefaultSpacingConfig(): DynamicSpacingConfig {
    return {
      treeSpacing: TREE_SPACING,
      levelHeight: LEVEL_HEIGHT,
      entitySpacing: ENTITY_SPACING,
      baseHeight: BASE_HEIGHT,
      adaptiveScaling: false,
    };
  }
}

// Type definitions
export interface DynamicSpacingConfig {
  treeSpacing: number;
  levelHeight: number;
  entitySpacing: number;
  baseHeight: number;
  adaptiveScaling: boolean;
}

export interface TreeCharacteristics {
  treeId: string;
  depth: number;
  width: number;
  height: number;
  entityCount: number;
  density: number;
  complexity: number;
}
