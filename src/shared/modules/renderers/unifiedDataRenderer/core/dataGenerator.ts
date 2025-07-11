/**
 * Modular Data Generator for Unified Data Renderer
 * 
 * Orchestrates node generation, link creation, and test data processing
 */

import {
  Cluster,
  Group,
  Link,
  Node,
} from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { IDataGenerator } from "../interfaces";

// Import modules
import { NodeGenerator } from "./dataGenerator/nodeGenerator";
import { LinkGenerator } from "./dataGenerator/linkGenerator";
import { PropertyManager } from "./dataGenerator/propertyManager";
import { TestDataProcessor } from "./dataGenerator/testDataProcessor";

// Default maximum number of items to use from test data
const DEFAULT_MAX_DATA_ITEMS = 100;

/**
 * Main DataGenerator - Orchestrates all modules
 */
export class DataGenerator implements IDataGenerator {
  private nodeGenerator: NodeGenerator;
  private linkGenerator: LinkGenerator;
  private propertyManager: PropertyManager;
  private testDataProcessor: TestDataProcessor;
  private useTestData = true;

  constructor() {
    // Initialize all modules
    this.nodeGenerator = new NodeGenerator();
    this.linkGenerator = new LinkGenerator();
    this.propertyManager = new PropertyManager();
    this.testDataProcessor = new TestDataProcessor();
  }

  /**
   * Generates cluster data from layer configuration
   */
  public generateClusterFromLayers(config: EnhancedGeneratorConfig): Cluster {
    // Use test data if enabled
    if (this.useTestData) {
      return this.testDataProcessor.generateClusterFromTestData(config);
    }

    const allNodes: Node[] = [];
    const nodesByLayer = new Map<number, Node[]>();

    // Generate nodes for each layer using NodeGenerator
    config.layers.forEach((layer) => {
      const layerNodes = this.nodeGenerator.generateLayerNodes(layer, config);
      layerNodes.forEach((node) => allNodes.push(node));
      nodesByLayer.set(layer.layerNumber, layerNodes);
    });

    // Generate links using LinkGenerator
    const allLinks = this.linkGenerator.generateAllLinks(nodesByLayer, config);

    // Ensure all nodes have at least one connection
    this.linkGenerator.ensureConnectivity(allNodes, allLinks, config);

    // Create a single group containing all nodes
    const mainGroup: Group = {
      id: "unified-group",
      name: "Unified Data Group",
      nodes: allNodes,
    };

    // Discover properties using PropertyManager
    const validProps = this.propertyManager.discoverAndValidateProperties(allNodes);

    const cluster: Cluster = {
      groups: [mainGroup],
      relations: allLinks,
      discoveredProperties: validProps,
    };

    // Write first maxDataItems objects to tempData.json for debugging
    this.writeTempData(allNodes, allLinks, config.maxDataItems ?? DEFAULT_MAX_DATA_ITEMS);

    return cluster;
  }

  /**
   * Enable or disable test data usage
   */
  public setUseTestData(useTestData: boolean): void {
    this.useTestData = useTestData;
    this.testDataProcessor.setUseTestData(useTestData);
  }

  /**
   * Write temporary debug data
   */
  private writeTempData(allNodes: Node[], allLinks: Link[], maxDataItems: number): void {
    const first10Nodes: Node[] = [];
    const first10Links: Link[] = [];

    // Get first maxDataItems nodes
    for (let i = 0; i < math.min(maxDataItems, allNodes.size()); i++) {
      first10Nodes.push(allNodes[i]);
    }

    // Get first maxDataItems links
    for (let i = 0; i < math.min(maxDataItems, allLinks.size()); i++) {
      first10Links.push(allLinks[i]);
    }

    // Debug output
    first10Nodes.forEach((node) => {
      // Node properties are already set
    });

    // Links are already processed
  }
}