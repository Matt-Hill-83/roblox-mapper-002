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
    print(`[WallManager] createWalls called with yAxis: ${config.axisMapping?.yAxis || "undefined"}`);
    
    if (!config.axisMapping?.yAxis || config.axisMapping.yAxis === "none") {
      print("[WallManager] No Y-axis configured, skipping wall creation");
      return undefined;
    }

    print("[WallManager] Creating vertical walls...");
    print(`[WallManager] Node count: ${cluster.groups[0].nodes.size()}`);
    print(`[WallManager] Shadow dimensions: width=${shadowWidth}, depth=${shadowDepth}`);

    const wallHeight = this.calculateWallHeight(cluster);
    print(`[WallManager] Calculated wall height: ${wallHeight}`);
    
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
    print("[WallManager] Calculating wall height...");
    
    if (!cluster || !cluster.groups || cluster.groups.size() === 0) {
      print("[WallManager] ERROR: Invalid cluster data!");
      return 65; // Return minimum height
    }
    
    const group = cluster.groups[0];
    if (!group || !group.nodes) {
      print("[WallManager] ERROR: Invalid group or nodes!");
      return 65; // Return minimum height
    }
    
    let maxY = 0;
    let minY = math.huge;
    let nodeCount = 0;
    
    group.nodes.forEach((node: Node) => {
      maxY = math.max(maxY, node.position.y);
      minY = math.min(minY, node.position.y);
      nodeCount++;
      
      // Log first few nodes for debugging
      if (nodeCount <= 3) {
        print(`[WallManager] Node ${node.name}: Y=${node.position.y}`);
      }
    });
    
    print(`[WallManager] Y range: min=${minY}, max=${maxY}`);
    
    // Calculate height from Y range
    const yRange = maxY - minY;
    const baseHeight = maxY + 10; // Height from origin + padding
    
    // Ensure minimum wall height of 65 units (typical for 11 layers)
    const MIN_WALL_HEIGHT = 65;
    
    print(`[WallManager] Y range=${yRange}, baseHeight=${baseHeight}`);
    
    // If Y range is very small (all nodes at same Y), use minimum height
    if (yRange < 5) {
      print("[WallManager] Y range too small, using minimum height");
      return MIN_WALL_HEIGHT;
    }
    
    const finalHeight = math.max(baseHeight, MIN_WALL_HEIGHT);
    print(`[WallManager] Final wall height: ${finalHeight}`);
    return finalHeight;
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