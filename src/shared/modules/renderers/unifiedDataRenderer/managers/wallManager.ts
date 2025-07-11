/**
 * Wall Manager
 * Handles creation of vertical walls for Y-axis visualization
 */

import { Cluster, Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { createVerticalWalls } from "../../verticalWallCreator";
import { PropertyValueResolver } from "../../propertyValueResolver";
import {
  YPropertyBounds,
  WallManagerResult
} from "../types";

export class WallManager {
  private propertyResolver: PropertyValueResolver;

  constructor() {
    this.propertyResolver = new PropertyValueResolver();
  }

  /**
   * Creates vertical walls if Y-axis property is configured
   */
  public createWalls(
    cluster: Cluster,
    config: EnhancedGeneratorConfig,
    targetOrigin: Vector3,
    shadowWidth: number,
    shadowDepth: number,
    platform: Part
  ): WallManagerResult | undefined {
    if (!config.axisMapping?.yAxis || config.axisMapping.yAxis === "none") {
      return undefined;
    }

    const wallHeight = this.calculateWallHeight(cluster);
    
    const walls = createVerticalWalls({
      platformBounds: {
        minX: targetOrigin.X - shadowWidth / 2,
        maxX: targetOrigin.X + shadowWidth / 2,
        minZ: targetOrigin.Z - shadowDepth / 2,
        maxZ: targetOrigin.Z + shadowDepth / 2,
      },
      height: wallHeight,
      parent: platform
    });

    // Add swimlane shadows on walls
    this.createYAxisWallSwimlanes(cluster, walls, config);

    return { walls, wallHeight };
  }

  /**
   * Calculate wall height based on cluster bounds
   */
  private calculateWallHeight(cluster: Cluster): number {
    let maxY = 0;
    cluster.groups[0].nodes.forEach((node: Node) => {
      maxY = math.max(maxY, node.position.y);
    });
    return maxY + 10; // Add some padding
  }

  /**
   * Create Y-axis swimlane shadows on walls
   */
  private createYAxisWallSwimlanes(
    cluster: Cluster,
    _walls: Part[],
    config: EnhancedGeneratorConfig
  ): void {
    if (!config.axisMapping?.yAxis || config.axisMapping.yAxis === "none") return;

    const yAxisProperty = config.axisMapping.yAxis;
    const propertyGroups = new Map<string, YPropertyBounds>();
    const propertyColors = new Map<string, Color3>();

    // Group nodes by Y-axis property and find bounds
    cluster.groups[0].nodes.forEach((node: Node) => {
      const propertyValue = this.propertyResolver.getPropertyValue(
        node,
        yAxisProperty
      );

      if (!propertyGroups.has(propertyValue)) {
        propertyGroups.set(propertyValue, {
          minY: math.huge,
          maxY: -math.huge,
        });
        // Use node color for the property
        propertyColors.set(
          propertyValue,
          new Color3(node.color[0], node.color[1], node.color[2])
        );
      }

      const bounds = propertyGroups.get(propertyValue)!;
      bounds.minY = math.min(bounds.minY, node.position.y);
      bounds.maxY = math.max(bounds.maxY, node.position.y);
    });

    // Create swimlane shadows on walls - DISABLED: remove child walls inside walls
    // createWallSwimlanes(walls, propertyGroups, propertyColors);
  }
}