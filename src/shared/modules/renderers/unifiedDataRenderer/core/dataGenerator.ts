/**
 * Data Generator for Unified Data Renderer
 *
 * Handles generation of nodes and links from layer configuration
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
// import { TEMP_TEST_NODES, TEMP_TEST_LINKS } from "../../../../data/tempTestData";
import {
  discoverNodeProperties,
  filterValidAxisProperties,
} from "../../../../utils/propertyDiscovery";

import { IDataGenerator } from "../interfaces";
import { TEMP_HARNESS_LINKS } from "../../../../data/tempHarnessLinks";
import { TEMP_HARNESS_TEST_DATA } from "../../../../data/tempHarnessTestData";

// Default maximum number of items to use from test data
const DEFAULT_MAX_DATA_ITEMS = 100;

export class DataGenerator implements IDataGenerator {
  private linkIdCounter = 0;
  private useTestData = true; // Set to true to use temp test data

  constructor() {
    // Keep references to prevent lint errors for methods we'll use later
    if (false) {
      this.getFileName("");
      this.getServiceColor("");
    }
  }

  /**
   * Generates cluster data from layer configuration
   */
  public generateClusterFromLayers(config: EnhancedGeneratorConfig): Cluster {
    // Use test data if enabled
    if (this.useTestData) {
      return this.generateClusterFromTestData(config);
    }
    const allNodes: Node[] = [];
    const allLinks: Link[] = [];
    const nodesByLayer = new Map<number, Node[]>();

    // Pet types configuration is used in addTypeSpecificProperties method

    // Generate nodes for each layer
    config.layers.forEach((layer) => {
      const layerNodes = this.generateLayerNodes(layer, config);
      layerNodes.forEach((node) => allNodes.push(node));
      nodesByLayer.set(layer.layerNumber, layerNodes);
    });

    // Generate links based on connections per node
    this.linkIdCounter = 0;
    config.layers.forEach((layer) => {
      const currentLayerNodes = nodesByLayer.get(layer.layerNumber)!;
      const nextLayerNodes = nodesByLayer.get(layer.layerNumber + 1);

      this.generateLayerLinks(
        currentLayerNodes,
        nextLayerNodes,
        layer,
        config,
        allLinks
      );

      // Add backward connections for first layer (connecting to second layer)
      if (layer.layerNumber === 1 && nextLayerNodes) {
        nextLayerNodes.forEach((nextNode) => {
          // Ensure each node in layer 2 connects back to at least one node in layer 1
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
    });

    // Ensure all nodes have at least one connection
    this.ensureNodeConnectivity(allNodes, allLinks, config);

    // Create a single group containing all nodes
    const mainGroup: Group = {
      id: "unified-group",
      name: "Unified Data Group",
      nodes: allNodes,
    };

    // Discover properties from all nodes
    const discoveredProps = discoverNodeProperties(allNodes);
    const validProps = filterValidAxisProperties(allNodes, discoveredProps);

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
   * Generate nodes for a single layer
   */
  private generateLayerNodes(
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
  private createNode(
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
      type: nodeTypeName as any, // Now supports "man", "woman", "child"
      color,
      position: { x: 0, y: 0, z: 0 }, // Will be calculated by swim lanes
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
      // Use only the first N pet types based on config
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
    } else if (nodeTypeName === "child") {
      // Use only the first N pet types based on config
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
    } else if (nodeTypeName === "grandparent") {
      // Use only the first N pet types based on config
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
    } else if (nodeTypeName === "Animals") {
      node.properties = {
        animalType: ANIMAL_TYPES[math.random(0, ANIMAL_TYPES.size() - 1)],
      };
    }
  }

  /**
   * Generate links for a layer
   */
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
      } else if (layer.connectionsPerNode > 0 && currentLayerNodes.size() > 1) {
        // For the last layer, ensure at least some connections within the layer
        this.generateIntraLayerLinks(
          sourceNode,
          currentLayerNodes,
          {
            ...layer,
            connectionsPerNode: math.max(1, layer.connectionsPerNode),
          },
          config,
          allLinks
        );
      }
    });
  }

  /**
   * Generate intra-layer connections
   */
  private generateIntraLayerLinks(
    sourceNode: Node,
    currentLayerNodes: Node[],
    layer: LayerConfig,
    config: EnhancedGeneratorConfig,
    allLinks: Link[]
  ): void {
    const allowSameLevelLinks =
      config.visualization?.allowSameLevelLinks ?? true;

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

    // Randomly select target nodes
    const shuffled = this.shuffleArray([...availableTargets]);

    for (let i = 0; i < numConnections; i++) {
      const targetNode = shuffled[i];
      const link = this.createLink(sourceNode, targetNode, config);
      allLinks.push(link);
    }
  }

  /**
   * Generate inter-layer connection
   */
  private generateInterLayerLink(
    sourceNode: Node,
    nextLayerNodes: Node[],
    config: EnhancedGeneratorConfig,
    allLinks: Link[]
  ): void {
    if (nextLayerNodes.size() === 0) return;

    // Prefer connecting to nodes of the same type
    const sameTypeNodes = nextLayerNodes.filter(
      (n) => n.type === sourceNode.type
    );
    const candidateNodes =
      sameTypeNodes.size() > 0 ? sameTypeNodes : nextLayerNodes;

    // Connect to at least one node, potentially more for better connectivity
    const numConnections = math.min(2, candidateNodes.size()); // Connect to up to 2 nodes
    const shuffled = this.shuffleArray([...candidateNodes]);

    for (let i = 0; i < numConnections; i++) {
      const targetNode = shuffled[i];
      // Check if this link already exists
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

  /**
   * Create a link between two nodes
   */
  private createLink(
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

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.size() - 1; i > 0; i--) {
      const j = math.random(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Ensure all nodes have at least one connection
   */
  private ensureNodeConnectivity(
    nodes: Node[],
    links: Link[],
    config: EnhancedGeneratorConfig
  ): void {
    // Create a map to track connections per node
    const nodeConnections = new Map<string, number>();
    nodes.forEach((node) => nodeConnections.set(node.uuid, 0));

    // Count existing connections
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

    // Find isolated nodes
    const isolatedNodes: Node[] = [];
    nodeConnections.forEach((count, uuid) => {
      if (count === 0) {
        const node = nodes.find((n) => n.uuid === uuid);
        if (node) isolatedNodes.push(node);
      }
    });

    if (isolatedNodes.size() > 0) {
      // Create fallback connections
      isolatedNodes.forEach((isolatedNode) => {
        // Find a suitable connection target
        const targetNode = this.findConnectionTarget(isolatedNode, nodes);
        if (targetNode) {
          const fallbackLink: Link = {
            uuid: `link_fallback_${this.linkIdCounter++}`,
            type: "Fallback",
            sourceNodeUuid: isolatedNode.uuid,
            targetNodeUuid: targetNode.uuid,
            color: [0.5, 0.5, 0.5], // Gray color for fallback links
          };
          links.push(fallbackLink);
        }
      });
    }
  }

  /**
   * Find a suitable connection target for an isolated node
   */
  private findConnectionTarget(
    isolatedNode: Node,
    allNodes: Node[]
  ): Node | undefined {
    // Try to connect to a node of the same type first
    const sameTypeNodes = allNodes.filter(
      (n) => n.type === isolatedNode.type && n.uuid !== isolatedNode.uuid
    );
    if (sameTypeNodes.size() > 0) {
      return sameTypeNodes[math.random(0, sameTypeNodes.size() - 1)];
    }

    // Otherwise, connect to any other node
    const otherNodes = allNodes.filter((n) => n.uuid !== isolatedNode.uuid);
    if (otherNodes.size() > 0) {
      return otherNodes[math.random(0, otherNodes.size() - 1)];
    }

    return undefined;
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

  /**
   * Generate cluster from test data
   */
  private generateClusterFromTestData(config?: EnhancedGeneratorConfig): Cluster {
    const maxItems = config?.maxDataItems || DEFAULT_MAX_DATA_ITEMS;
    print(`[DataGenerator] Using maxItems: ${maxItems} (config.maxDataItems: ${config?.maxDataItems || "undefined"})`);
    print(`[DataGenerator] Available test data items: ${TEMP_HARNESS_TEST_DATA.size()}`);
    // Convert Harness data to Node format - using only first maxItems items
    const harnessNodes: Node[] = [];
    let itemCount = 0;
    TEMP_HARNESS_TEST_DATA.forEach((file, index) => {
      if (itemCount >= maxItems) return; // Only process first maxItems items
      itemCount++;
      const node: Node = {
        uuid: `harness_node_${index}`,
        name: this.getFileName(file.path),
        type: file.component as any, // Use component as node type
        color: this.getServiceColor(file.service),
        position: { x: 0, y: 0, z: 0 }, // Will be calculated by swim lanes
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

    // Use real harness links from the link detection analysis
    // Filter to only include links between nodes we actually have
    const nodeUuids = new Set(harnessNodes.map((node) => node.uuid));
    const validHarnessLinks = TEMP_HARNESS_LINKS.filter(
      (link) =>
        nodeUuids.has(link.sourceNodeUuid) && nodeUuids.has(link.targetNodeUuid)
    );

    print(`[DataGenerator] Found ${TEMP_HARNESS_LINKS.size()} total links, ${validHarnessLinks.size()} valid links for ${nodeUuids.size()} nodes`);
    
    // Convert to Link[] format (remove extra properties)
    const harnessLinks: Link[] = validHarnessLinks.map((link) => ({
      uuid: link.uuid,
      type: link.type,
      sourceNodeUuid: link.sourceNodeUuid,
      targetNodeUuid: link.targetNodeUuid,
      color: link.color,
    }));

    // Discover properties from the harness nodes
    const discoveredProps = discoverNodeProperties(harnessNodes);
    const validProps = filterValidAxisProperties(harnessNodes, discoveredProps);

    // Properties are now discovered and available in the cluster

    // Create a single group containing all harness nodes
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

  /**
   * Enable or disable test data mode
   */
  public setUseTestData(useTestData: boolean): void {
    this.useTestData = useTestData;
  }

  /**
   * Extract filename from full path
   * Keep for Harness data switching
   */
  private getFileName(path: string): string {
    if (false) {
      // This prevents lint errors while keeping the code available
      return "";
    }
    const parts = path.split("/");
    return parts[parts.size() - 1] || path;
  }

  /**
   * Get color based on service type
   * Keep for Harness data switching
   */
  private getServiceColor(service: string): [number, number, number] {
    if (false) {
      // This prevents lint errors while keeping the code available
      return [0, 0, 0];
    }
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
