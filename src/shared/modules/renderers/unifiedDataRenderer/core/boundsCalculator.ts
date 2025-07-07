/**
 * Bounds Calculator for cluster and node positioning
 * Part of F002 Phase 2 refactoring - T5
 */

import { Cluster, Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { POSITION_CONSTANTS } from "../../constants/positionConstants";

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  minZ: number;
  maxZ: number;
}

export class BoundsCalculator {
  /**
   * Calculate bounds for a cluster of nodes
   */
  public calculateClusterBounds(cluster: Cluster): Bounds {
    if (!this.validateCluster(cluster)) {
      return this.getEmptyBounds();
    }

    let minX = POSITION_CONSTANTS.BOUNDS.INITIAL_MIN;
    let maxX = POSITION_CONSTANTS.BOUNDS.INITIAL_MAX;
    let minY = POSITION_CONSTANTS.BOUNDS.INITIAL_MIN;
    let minZ = POSITION_CONSTANTS.BOUNDS.INITIAL_MIN;
    let maxZ = POSITION_CONSTANTS.BOUNDS.INITIAL_MAX;
    
    cluster.groups[0].nodes.forEach(node => {
      if (!node.position) {
        warn(`[BoundsCalculator] Node ${node.name} has no position`);
        return;
      }
      
      minX = math.min(minX, node.position.x);
      maxX = math.max(maxX, node.position.x);
      minY = math.min(minY, node.position.y);
      minZ = math.min(minZ, node.position.z);
      maxZ = math.max(maxZ, node.position.z);
    });
    
    // Handle case where no valid positions were found
    if (minX === POSITION_CONSTANTS.BOUNDS.INITIAL_MIN) {
      return this.getEmptyBounds();
    }
    
    const bounds = { minX, maxX, minY, minZ, maxZ };
    this.logBounds(bounds, cluster.groups[0].nodes.size());
    
    return bounds;
  }

  /**
   * Calculate bounds for a set of nodes
   */
  public calculateNodeSetBounds(nodes: Node[]): Bounds {
    if (nodes.size() === 0) {
      return this.getEmptyBounds();
    }

    let minX = POSITION_CONSTANTS.BOUNDS.INITIAL_MIN;
    let maxX = POSITION_CONSTANTS.BOUNDS.INITIAL_MAX;
    let minZ = POSITION_CONSTANTS.BOUNDS.INITIAL_MIN;
    let maxZ = POSITION_CONSTANTS.BOUNDS.INITIAL_MAX;
    
    nodes.forEach(node => {
      if (!node.position) return;
      
      minX = math.min(minX, node.position.x);
      maxX = math.max(maxX, node.position.x);
      minZ = math.min(minZ, node.position.z);
      maxZ = math.max(maxZ, node.position.z);
    });
    
    // Handle case where no valid positions were found
    if (minX === POSITION_CONSTANTS.BOUNDS.INITIAL_MIN) {
      return this.getEmptyBounds();
    }
    
    return { 
      minX, 
      maxX, 
      minY: 0, // Node sets don't track Y bounds
      minZ, 
      maxZ 
    };
  }

  /**
   * Calculate center point of bounds
   */
  public calculateCenter(bounds: Bounds): Vector3 {
    return new Vector3(
      (bounds.minX + bounds.maxX) / 2,
      bounds.minY,
      (bounds.minZ + bounds.maxZ) / 2
    );
  }

  /**
   * Calculate dimensions from bounds
   */
  public calculateDimensions(bounds: Bounds): Vector3 {
    return new Vector3(
      bounds.maxX - bounds.minX,
      0, // Height not calculated from bounds
      bounds.maxZ - bounds.minZ
    );
  }

  /**
   * Get empty bounds object
   */
  private getEmptyBounds(): Bounds {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      minZ: 0,
      maxZ: 0
    };
  }

  /**
   * Validate cluster structure
   */
  private validateCluster(cluster: Cluster): boolean {
    if (!cluster) {
      warn("[BoundsCalculator] Invalid cluster: cluster is null or undefined");
      return false;
    }
    
    if (!cluster.groups || cluster.groups.size() === 0) {
      warn("[BoundsCalculator] Invalid cluster: no groups found");
      return false;
    }
    
    if (!cluster.groups[0].nodes) {
      warn("[BoundsCalculator] Invalid cluster: first group has no nodes array");
      return false;
    }
    
    return true;
  }

  /**
   * Log bounds information
   */
  private logBounds(bounds: Bounds, nodeCount: number): void {
    print(`🔍 Bounds calculated:`);
    print(`   - X: [${bounds.minX}, ${bounds.maxX}]`);
    print(`   - Y: [${bounds.minY}]`);
    print(`   - Z: [${bounds.minZ}, ${bounds.maxZ}]`);
    print(`   - Total nodes: ${nodeCount}`);
  }
}