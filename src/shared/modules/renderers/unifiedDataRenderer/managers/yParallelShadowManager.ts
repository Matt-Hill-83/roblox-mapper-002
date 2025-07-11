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

    // Calculate shadow dimensions (same as group shadow)
    const shadowWidth = allLaneBounds.width + LAYOUT_CONSTANTS.SHADOW_PADDING.X_PADDING * 2;
    const shadowDepth = allLaneBounds.depth + LAYOUT_CONSTANTS.SHADOW_PADDING.Z_PADDING * 2;

    // Create Y-parallel shadows
    const yParallelShadows = this.yParallelShadowCreator.createYParallelShadows({
      nodes: cluster.groups[0].nodes,
      yAxisProperty: config.axisMapping.yAxis,
      parent: clusterFolder,
      shadowWidth: shadowWidth,
      shadowDepth: shadowDepth
    });

    print(`[YParallelShadowManager] Created ${yParallelShadows.size()} Y-parallel shadow blocks`);
    
    return yParallelShadows;
  }
}