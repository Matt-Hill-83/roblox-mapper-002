/**
 * Y-Parallel Shadow Manager
 * Handles creation of Y-axis parallel shadow planes
 */

import { Cluster } from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { YParallelShadowCreator } from "../../blocks/yParallelShadowCreator";
import { LAYOUT_CONSTANTS } from "../../constants/layoutConstants";
import { LaneBounds } from "../types";

export class YParallelShadowManager {
  private yParallelShadowCreator: YParallelShadowCreator;

  constructor() {
    this.yParallelShadowCreator = new YParallelShadowCreator();
  }

  /**
   * Creates Y-parallel shadow blocks based on Y-axis property
   */
  public createYParallelShadows(
    cluster: Cluster,
    parentFolder: Folder,
    config: EnhancedGeneratorConfig,
    allLaneBounds: LaneBounds
  ): Map<string, Part> | undefined {
    if (!config.axisMapping?.yAxis || config.axisMapping.yAxis === "none") {
      return undefined;
    }

    // Get the cluster folder
    const graphMakerFolder = parentFolder.FindFirstChild("GraphMaker") as Folder;
    if (!graphMakerFolder) {
      warn("[YParallelShadowManager] GraphMaker folder not found for Y-parallel shadows");
      return undefined;
    }

    const clusterFolder = graphMakerFolder.FindFirstChild("UnifiedDataCluster") as Folder;
    if (!clusterFolder) {
      warn("[YParallelShadowManager] UnifiedDataCluster folder not found for Y-parallel shadows");
      return undefined;
    }

    // Create models to wrap Y shadows
    const yShadowsModelRight = new Instance("Model");
    yShadowsModelRight.Name = "YParallelShadowsRight";
    yShadowsModelRight.Parent = clusterFolder;
    
    const yShadowsModelBack = new Instance("Model");
    yShadowsModelBack.Name = "YParallelShadowsBack";
    yShadowsModelBack.Parent = clusterFolder;

    // Calculate shadow dimensions (same as group shadow)
    const shadowWidth = allLaneBounds.width + LAYOUT_CONSTANTS.SHADOW_PADDING.X_PADDING * 2;
    const shadowDepth = allLaneBounds.depth + LAYOUT_CONSTANTS.SHADOW_PADDING.Z_PADDING * 2;

    // Create Y-parallel shadows for right side (original)
    const yParallelShadowsRight = this.yParallelShadowCreator.createYParallelShadows({
      nodes: cluster.groups[0].nodes,
      yAxisProperty: config.axisMapping.yAxis,
      parent: yShadowsModelRight,
      shadowWidth: shadowWidth,
      shadowDepth: shadowDepth,
      side: "right"
    });

    // Create Y-parallel shadows for back side (duplicate)
    const yParallelShadowsBack = this.yParallelShadowCreator.createYParallelShadows({
      nodes: cluster.groups[0].nodes,
      yAxisProperty: config.axisMapping.yAxis,
      parent: yShadowsModelBack,
      shadowWidth: shadowWidth,
      shadowDepth: shadowDepth,
      side: "back"
    });

    print(`[YParallelShadowManager] Created ${yParallelShadowsRight.size()} right and ${yParallelShadowsBack.size()} back Y-parallel shadow blocks`);
    
    // Return the right shadows for compatibility
    return yParallelShadowsRight;
  }
}