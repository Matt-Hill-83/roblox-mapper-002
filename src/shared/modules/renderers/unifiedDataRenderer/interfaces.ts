/**
 * Interfaces for Unified Data Renderer components
 */

import { EnhancedGeneratorConfig } from "../../../interfaces/enhancedGenerator.interface";
import { Cluster, Node } from "../../../interfaces/simpleDataGenerator.interface";

/**
 * Interface for data generation functionality
 */
export interface IDataGenerator {
  generateClusterFromLayers(config: EnhancedGeneratorConfig): Cluster;
}

/**
 * Interface for position calculation functionality
 */
export interface IPositionCalculator {
  calculateLayerSwimLanePositions(cluster: Cluster, config: EnhancedGeneratorConfig): void;
  centerBottomAtOrigin(cluster: Cluster, origin: Vector3): void;
}

/**
 * Interface for node rendering functionality
 */
export interface INodeRenderer {
  createHexagons(cluster: Cluster, nodesFolder: Folder, config?: EnhancedGeneratorConfig): Map<string, Model>;
  renderCluster(cluster: Cluster, parentFolder: Folder, config?: EnhancedGeneratorConfig): void;
}

/**
 * Interface for update management functionality
 */
export interface IUpdateManager {
  performIncrementalUpdate(
    newConfig: EnhancedGeneratorConfig, 
    nodesFolder: Folder, 
    linksFolder: Folder, 
    origin: Vector3
  ): void;
}

/**
 * Configuration for node creation
 */
export interface NodeCreationParams {
  uuid: string;
  name: string;
  type: string;
  colorIndex: number;
  layerNum: number;
  nodeIndex: number;
}

/**
 * Update plan for incremental updates
 */
export interface UpdatePlan {
  nodesToAdd: Node[];
  nodesToRemove: string[];
  nodesToUpdate: Map<string, Node>;
  layersToRemove: number[];
}

/**
 * Spacing configuration for rendering
 */
export interface SpacingConfig {
  nodeHeight: number;
  nodeRadius: number;
  layerSpacing: number;
  nodeSpacing: number;
  swimlaneSpacing: number;
  linkDiameter?: number;
}