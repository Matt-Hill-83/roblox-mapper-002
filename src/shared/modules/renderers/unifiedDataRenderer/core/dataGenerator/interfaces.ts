/**
 * Interfaces for DataGenerator refactored modules
 */

import {
  EnhancedGeneratorConfig,
  LayerConfig,
} from "../../../../../interfaces/enhancedGenerator.interface";
import {
  Cluster,
  Link,
  Node,
} from "../../../../../interfaces/simpleDataGenerator.interface";

/**
 * Interface for node generation functionality
 */
export interface INodeGenerator {
  /**
   * Generate all nodes for a specific layer
   */
  generateLayerNodes(layer: LayerConfig, config: EnhancedGeneratorConfig): Node[];
  
  /**
   * Create a single node with proper typing and properties
   */
  createNode(index: number, layerNumber: number, config: EnhancedGeneratorConfig): Node;
}

/**
 * Interface for link generation functionality
 */
export interface ILinkGenerator {
  /**
   * Generate all links between and within layers
   */
  generateAllLinks(
    nodesByLayer: Map<number, Node[]>, 
    config: EnhancedGeneratorConfig
  ): Link[];
  
  /**
   * Ensure all nodes have at least one connection
   */
  ensureConnectivity(nodes: Node[], links: Link[], config: EnhancedGeneratorConfig): void;
  
  /**
   * Create a single link between two nodes
   */
  createLink(sourceNode: Node, targetNode: Node, config: EnhancedGeneratorConfig): Link;
}

/**
 * Interface for test data processing functionality
 */
export interface ITestDataProcessor {
  /**
   * Generate cluster from harness test data
   */
  generateClusterFromTestData(config?: EnhancedGeneratorConfig): Cluster;
  
  /**
   * Set whether to use test data mode
   */
  setUseTestData(enabled: boolean): void;
  
  /**
   * Check if currently using test data
   */
  isUsingTestData(): boolean;
}

/**
 * Interface for property management functionality
 */
export interface IPropertyManager {
  /**
   * Discover and validate properties from generated nodes
   */
  discoverAndValidateProperties(nodes: Node[]): any[];
}

/**
 * Data transfer object for passing nodes between modules
 */
export interface NodesByLayer {
  nodesByLayer: Map<number, Node[]>;
  allNodes: Node[];
}

/**
 * Data transfer object for link generation results
 */
export interface LinkGenerationResult {
  links: Link[];
  isolatedNodeCount: number;
  connectivityEnsured: boolean;
}

/**
 * Configuration for property assignment
 */
export interface PropertyAssignmentConfig {
  numPetTypes: number;
  useFullPropertySet: boolean;
}

/**
 * Metadata about discovered properties
 */
export interface PropertyMetadata {
  name: string;
  type: string;
  values: any[];
  isValidForAxis: boolean;
}