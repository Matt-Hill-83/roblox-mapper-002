/**
 * Modular Data Generator for Unified Data Renderer
 * 
 * Refactored into internal classes for better organization while maintaining single-file compatibility
 */

import {
  ANIMAL_TYPES,
  COLOR_PALETTES,
  COUNTRIES_OF_BIRTH,
  COUNTRIES_OF_RESIDENCE,
  DEFAULT_ATTACHMENTS,
  FIRST_NAMES,
  LAST_NAMES,
  NODE_TYPE_NAMES,
  PET_COLORS,
  PET_TYPES,
} from "../constants";
import {
  Cluster,
  Group,
  Link,
  Node,
} from "../../../../interfaces/simpleDataGenerator.interface";
import {
  EnhancedGeneratorConfig,
  LayerConfig,
} from "../../../../interfaces/enhancedGenerator.interface";
import {
  discoverNodeProperties,
  filterValidAxisProperties,
} from "../../../../utils/propertyDiscovery";
import { IDataGenerator } from "../interfaces";
import { TEMP_HARNESS_LINKS } from "../../../../data/tempHarnessLinks";
import { TEMP_HARNESS_TEST_DATA } from "../../../../data/tempHarnessTestData";

// Default maximum number of items to use from test data
const DEFAULT_MAX_DATA_ITEMS = 100;

/**
 * Node Generator - Handles node creation and property assignment
 */
class NodeGenerator {
  /**
   * Generate nodes for a single layer
   */
  public generateLayerNodes(
    layer: LayerConfig,
    config: EnhancedGeneratorConfig
  ): Node[] {
    const layerNodes: Node[] = [];

    for (let i = 0; i < layer.numNodes; i++) {
      const node = this.createNode(i, layer.layerNumber, config);
      layerNodes.push(node);
    }

    return layerNodes;
  }

  /**
   * Create a single node
   */
  public createNode(
    index: number,
    layerNumber: number,
    config: EnhancedGeneratorConfig
  ): Node {
    // Cycle through node types based on config
    const nodeTypeIndex = index % config.numNodeTypes;
    const nodeTypeName =
      NODE_TYPE_NAMES[math.min(nodeTypeIndex, NODE_TYPE_NAMES.size() - 1)];
    const color =
      COLOR_PALETTES.NODE_COLORS[
        nodeTypeIndex % COLOR_PALETTES.NODE_COLORS.size()
      ];

    const node: Node = {
      uuid: `node_${layerNumber}_${index}`,
      name: `${nodeTypeName} ${layerNumber}-${index + 1}`,
      type: nodeTypeName as any,
      color,
      position: { x: 0, y: 0, z: 0 },
      attachmentNames: DEFAULT_ATTACHMENTS,
    };

    // Add level property for swim lane algorithm
    const nodeWithLevel = node as Node & { level: number };
    nodeWithLevel.level = layerNumber;

    // Add type-specific properties
    this.addTypeSpecificProperties(node, nodeTypeName, config);

    return node;
  }

  /**
   * Add type-specific properties to node
   */
  private addTypeSpecificProperties(
    node: Node,
    nodeTypeName: string,
    config: EnhancedGeneratorConfig
  ): void {
    if (nodeTypeName === "man" || nodeTypeName === "woman") {
      this.addPersonProperties(node, config);
    } else if (nodeTypeName === "child") {
      this.addChildProperties(node, config);
    } else if (nodeTypeName === "grandparent") {
      this.addGrandparentProperties(node, config);
    } else if (nodeTypeName === "Animals") {
      this.addAnimalProperties(node);
    }
  }

  private addPersonProperties(node: Node, config: EnhancedGeneratorConfig): void {
    const numPetTypes = config.numPetTypes || 5;
    const maxPetTypeIndex = math.min(numPetTypes - 1, PET_TYPES.size() - 1);

    node.properties = {
      age: math.random(18, 80),
      petType: PET_TYPES[math.random(0, maxPetTypeIndex)],
      petColor: PET_COLORS[math.random(0, PET_COLORS.size() - 1)],
      firstName: FIRST_NAMES[math.random(0, FIRST_NAMES.size() - 1)],
      lastName: LAST_NAMES[math.random(0, LAST_NAMES.size() - 1)],
      countryOfBirth:
        COUNTRIES_OF_BIRTH[math.random(0, COUNTRIES_OF_BIRTH.size() - 1)],
      countryOfResidence:
        COUNTRIES_OF_RESIDENCE[
          math.random(0, COUNTRIES_OF_RESIDENCE.size() - 1)
        ],
    };
  }

  private addChildProperties(node: Node, config: EnhancedGeneratorConfig): void {
    const numPetTypes = config.numPetTypes || 5;
    const maxPetTypeIndex = math.min(numPetTypes - 1, PET_TYPES.size() - 1);

    node.properties = {
      age: math.random(5, 17),
      petType: PET_TYPES[math.random(0, maxPetTypeIndex)],
      petColor: PET_COLORS[math.random(0, PET_COLORS.size() - 1)],
      firstName: FIRST_NAMES[math.random(0, FIRST_NAMES.size() - 1)],
      lastName: LAST_NAMES[math.random(0, LAST_NAMES.size() - 1)],
      countryOfBirth:
        COUNTRIES_OF_BIRTH[math.random(0, COUNTRIES_OF_BIRTH.size() - 1)],
      countryOfResidence:
        COUNTRIES_OF_RESIDENCE[
          math.random(0, COUNTRIES_OF_RESIDENCE.size() - 1)
        ],
    };
  }

  private addGrandparentProperties(node: Node, config: EnhancedGeneratorConfig): void {
    const numPetTypes = config.numPetTypes || 5;
    const maxPetTypeIndex = math.min(numPetTypes - 1, PET_TYPES.size() - 1);

    node.properties = {
      age: math.random(65, 95),
      petType: PET_TYPES[math.random(0, maxPetTypeIndex)],
      petColor: PET_COLORS[math.random(0, PET_COLORS.size() - 1)],
      firstName: FIRST_NAMES[math.random(0, FIRST_NAMES.size() - 1)],
      lastName: LAST_NAMES[math.random(0, LAST_NAMES.size() - 1)],
      countryOfBirth:
        COUNTRIES_OF_BIRTH[math.random(0, COUNTRIES_OF_BIRTH.size() - 1)],
      countryOfResidence:
        COUNTRIES_OF_RESIDENCE[
          math.random(0, COUNTRIES_OF_RESIDENCE.size() - 1)
        ],
    };
  }

  private addAnimalProperties(node: Node): void {
    node.properties = {
      animalType: ANIMAL_TYPES[math.random(0, ANIMAL_TYPES.size() - 1)],
    };
  }
}

/**
 * Link Generator - Handles link creation and connectivity logic
 */
class LinkGenerator {
  private linkIdCounter = 0;

  /**
   * Generate all links between and within layers
   */
  public generateAllLinks(
    nodesByLayer: Map<number, Node[]>,
    config: EnhancedGeneratorConfig
  ): Link[] {
    const allLinks: Link[] = [];
    this.linkIdCounter = 0;

    // Generate links for each layer
    const layerNumbers: number[] = [];
    nodesByLayer.forEach((_, layerNumber) => {
      layerNumbers.push(layerNumber);
    });
    table.sort(layerNumbers, (a, b) => a < b);
    
    layerNumbers.forEach((layerNumber) => {
      const currentLayerNodes = nodesByLayer.get(layerNumber)!;
      const nextLayerNodes = nodesByLayer.get(layerNumber + 1);
      
      const layer: LayerConfig = {
        layerNumber,
        numNodes: currentLayerNodes.size(),
        connectionsPerNode: 2, // Default connections per node
      };

      this.generateLayerLinks(
        currentLayerNodes,
        nextLayerNodes,
        layer,
        config,
        allLinks
      );

      // Add backward connections for first layer
      if (layerNumber === 1 && nextLayerNodes) {
        this.ensureBackwardConnections(currentLayerNodes, nextLayerNodes, config, allLinks);
      }
    });

    return allLinks;
  }

  private generateLayerLinks(
    currentLayerNodes: Node[],
    nextLayerNodes: Node[] | undefined,
    layer: LayerConfig,
    config: EnhancedGeneratorConfig,
    allLinks: Link[]
  ): void {
    currentLayerNodes.forEach((sourceNode) => {
      // Create intra-layer connections
      this.generateIntraLayerLinks(
        sourceNode,
        currentLayerNodes,
        layer,
        config,
        allLinks
      );

      // Create inter-layer connections
      if (nextLayerNodes && nextLayerNodes.size() > 0) {
        this.generateInterLayerLink(
          sourceNode,
          nextLayerNodes,
          config,
          allLinks
        );
      }
    });
  }

  private generateIntraLayerLinks(
    sourceNode: Node,
    currentLayerNodes: Node[],
    layer: LayerConfig,
    config: EnhancedGeneratorConfig,
    allLinks: Link[]
  ): void {
    const allowSameLevelLinks = config.visualization?.allowSameLevelLinks ?? true;

    if (
      !allowSameLevelLinks ||
      layer.connectionsPerNode <= 0 ||
      currentLayerNodes.size() <= 1
    ) {
      return;
    }

    const availableTargets = currentLayerNodes.filter(
      (n) => n.uuid !== sourceNode.uuid
    );
    const numConnections = math.min(
      layer.connectionsPerNode,
      availableTargets.size()
    );

    const shuffled = this.shuffleArray([...availableTargets]);

    for (let i = 0; i < numConnections; i++) {
      const targetNode = shuffled[i];
      const link = this.createLink(sourceNode, targetNode, config);
      allLinks.push(link);
    }
  }

  private generateInterLayerLink(
    sourceNode: Node,
    nextLayerNodes: Node[],
    config: EnhancedGeneratorConfig,
    allLinks: Link[]
  ): void {
    if (nextLayerNodes.size() === 0) return;

    const sameTypeNodes = nextLayerNodes.filter(
      (n) => n.type === sourceNode.type
    );
    const candidateNodes =
      sameTypeNodes.size() > 0 ? sameTypeNodes : nextLayerNodes;

    const numConnections = math.min(2, candidateNodes.size());
    const shuffled = this.shuffleArray([...candidateNodes]);

    for (let i = 0; i < numConnections; i++) {
      const targetNode = shuffled[i];
      const linkExists = allLinks.some(
        (link) =>
          (link.sourceNodeUuid === sourceNode.uuid &&
            link.targetNodeUuid === targetNode.uuid) ||
          (link.sourceNodeUuid === targetNode.uuid &&
            link.targetNodeUuid === sourceNode.uuid)
      );

      if (!linkExists) {
        const link = this.createLink(sourceNode, targetNode, config);
        allLinks.push(link);
      }
    }
  }

  public createLink(
    sourceNode: Node,
    targetNode: Node,
    config: EnhancedGeneratorConfig
  ): Link {
    const linkTypeIndex = this.linkIdCounter % config.numLinkTypes;
    const linkColor =
      COLOR_PALETTES.LINK_COLORS[
        linkTypeIndex % COLOR_PALETTES.LINK_COLORS.size()
      ];

    const link: Link = {
      uuid: `link-${++this.linkIdCounter}`,
      type: `Link${linkTypeIndex + 1}`,
      sourceNodeUuid: sourceNode.uuid,
      targetNodeUuid: targetNode.uuid,
      color: linkColor,
    };

    return link;
  }

  public ensureConnectivity(
    nodes: Node[],
    links: Link[],
    config: EnhancedGeneratorConfig
  ): void {
    const nodeConnections = new Map<string, number>();
    nodes.forEach((node) => nodeConnections.set(node.uuid, 0));

    links.forEach((link) => {
      nodeConnections.set(
        link.sourceNodeUuid,
        (nodeConnections.get(link.sourceNodeUuid) || 0) + 1
      );
      nodeConnections.set(
        link.targetNodeUuid,
        (nodeConnections.get(link.targetNodeUuid) || 0) + 1
      );
    });

    const isolatedNodes: Node[] = [];
    nodeConnections.forEach((count, uuid) => {
      if (count === 0) {
        const node = nodes.find((n) => n.uuid === uuid);
        if (node) isolatedNodes.push(node);
      }
    });

    if (isolatedNodes.size() > 0) {
      isolatedNodes.forEach((isolatedNode) => {
        const targetNode = this.findConnectionTarget(isolatedNode, nodes);
        if (targetNode) {
          const fallbackLink: Link = {
            uuid: `link_fallback_${this.linkIdCounter++}`,
            type: "Fallback",
            sourceNodeUuid: isolatedNode.uuid,
            targetNodeUuid: targetNode.uuid,
            color: [0.5, 0.5, 0.5],
          };
          links.push(fallbackLink);
        }
      });
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.size() - 1; i > 0; i--) {
      const j = math.random(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private findConnectionTarget(
    isolatedNode: Node,
    allNodes: Node[]
  ): Node | undefined {
    const sameTypeNodes = allNodes.filter(
      (n) => n.type === isolatedNode.type && n.uuid !== isolatedNode.uuid
    );
    if (sameTypeNodes.size() > 0) {
      return sameTypeNodes[math.random(0, sameTypeNodes.size() - 1)];
    }

    const otherNodes = allNodes.filter((n) => n.uuid !== isolatedNode.uuid);
    if (otherNodes.size() > 0) {
      return otherNodes[math.random(0, otherNodes.size() - 1)];
    }

    return undefined;
  }

  private ensureBackwardConnections(
    currentLayerNodes: Node[],
    nextLayerNodes: Node[],
    config: EnhancedGeneratorConfig,
    allLinks: Link[]
  ): void {
    nextLayerNodes.forEach((nextNode) => {
      const hasBackwardConnection = allLinks.some(
        (link) =>
          link.targetNodeUuid === nextNode.uuid &&
          currentLayerNodes.some((n) => n.uuid === link.sourceNodeUuid)
      );

      if (!hasBackwardConnection) {
        const sourceNode =
          currentLayerNodes[math.random(0, currentLayerNodes.size() - 1)];
        const link = this.createLink(sourceNode, nextNode, config);
        allLinks.push(link);
      }
    });
  }
}

/**
 * Test Data Processor - Handles test data conversion
 */
class TestDataProcessor {
  private useTestData = true;

  public generateClusterFromTestData(config?: EnhancedGeneratorConfig): Cluster {
    const maxItems = config?.maxDataItems || DEFAULT_MAX_DATA_ITEMS;
    print(`[TestDataProcessor] Using maxItems: ${maxItems}`);
    
    const harnessNodes: Node[] = [];
    let itemCount = 0;
    
    TEMP_HARNESS_TEST_DATA.forEach((file, index) => {
      if (itemCount >= maxItems) return;
      itemCount++;
      
      const node: Node = {
        uuid: `harness_node_${index}`,
        name: this.getFileName(file.path),
        type: file.component as any,
        color: this.getServiceColor(file.service),
        position: { x: 0, y: 0, z: 0 },
        attachmentNames: [],
        properties: {
          service: file.service,
          component: file.component,
          language: file.language,
          size: file.size,
          type: file.type,
          resourceDomain: file.resourceDomain,
          operationType: file.operationType,
          apiPattern: file.apiPattern,
          apiComplexity: file.apiComplexity,
          httpMethod: file.httpMethod,
          path: file.path,
        },
      };
      harnessNodes.push(node);
    });

    const nodeUuids = new Set(harnessNodes.map((node) => node.uuid));
    const validHarnessLinks = TEMP_HARNESS_LINKS.filter(
      (link) =>
        nodeUuids.has(link.sourceNodeUuid) && nodeUuids.has(link.targetNodeUuid)
    );
    
    const harnessLinks: Link[] = validHarnessLinks.map((link) => ({
      uuid: link.uuid,
      type: link.type,
      sourceNodeUuid: link.sourceNodeUuid,
      targetNodeUuid: link.targetNodeUuid,
      color: link.color,
    }));

    const discoveredProps = discoverNodeProperties(harnessNodes);
    const validProps = filterValidAxisProperties(harnessNodes, discoveredProps);

    const mainGroup: Group = {
      id: "harness-group",
      name: "Harness Data Group",
      nodes: harnessNodes,
    };

    return {
      groups: [mainGroup],
      relations: harnessLinks,
      discoveredProperties: validProps,
    };
  }

  public setUseTestData(enabled: boolean): void {
    this.useTestData = enabled;
  }

  public isUsingTestData(): boolean {
    return this.useTestData;
  }

  private getFileName(path: string): string {
    const parts = path.split("/");
    return parts[parts.size() - 1] || path;
  }

  private getServiceColor(service: string): [number, number, number] {
    const serviceColors: { [key: string]: [number, number, number] } = {
      platform: [0.2, 0.4, 0.8],
      ci: [0.8, 0.4, 0.2],
      cd: [0.2, 0.8, 0.2],
      ce: [0.8, 0.2, 0.8],
      core: [0.8, 0.8, 0.2],
    };
    return serviceColors[service] || [0.5, 0.5, 0.5];
  }
}

/**
 * Property Manager - Handles property discovery and validation
 */
class PropertyManager {
  public discoverAndValidateProperties(nodes: Node[]): any[] {
    const discoveredProps = discoverNodeProperties(nodes);
    const validProps = filterValidAxisProperties(nodes, discoveredProps);
    return validProps;
  }
}

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
    // Initialize all modules internally
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

    const cluster = {
      groups: [mainGroup],
      relations: allLinks,
      discoveredProperties: validProps,
    };

    // Write first maxDataItems objects to tempData.json for debugging
    this.writeTempData(allNodes, allLinks, config.maxDataItems || DEFAULT_MAX_DATA_ITEMS);

    return cluster;
  }

  /**
   * Enable or disable test data mode
   */
  public setUseTestData(useTestData: boolean): void {
    this.useTestData = useTestData;
    this.testDataProcessor.setUseTestData(useTestData);
  }

  /**
   * Write first maxDataItems objects to tempData.json for debugging
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

    first10Nodes.forEach(() => {
      // Node properties are already set
    });

    // Links are already processed
  }
}
