/**
 * Data Generator for Unified Data Renderer
 * 
 * Handles generation of nodes and links from layer configuration
 */

import { Cluster, Node, Link, Group } from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig, LayerConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { IDataGenerator } from "../interfaces";
import { COLOR_PALETTES, NODE_TYPE_NAMES, ANIMAL_TYPES, DEFAULT_ATTACHMENTS, PET_TYPES, PET_COLORS } from "../constants";

export class DataGenerator implements IDataGenerator {
  private linkIdCounter = 0;

  /**
   * Generates cluster data from layer configuration
   */
  public generateClusterFromLayers(config: EnhancedGeneratorConfig): Cluster {
    const allNodes: Node[] = [];
    const allLinks: Link[] = [];
    const nodesByLayer = new Map<number, Node[]>();

    // Generate nodes for each layer
    config.layers.forEach((layer) => {
      const layerNodes = this.generateLayerNodes(layer, config);
      layerNodes.forEach(node => allNodes.push(node));
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
    });

    // Create a single group containing all nodes
    const mainGroup: Group = {
      id: "unified-group",
      name: "Unified Data Group",
      nodes: allNodes,
    };

    return {
      groups: [mainGroup],
      relations: allLinks,
    };
  }

  /**
   * Generate nodes for a single layer
   */
  private generateLayerNodes(layer: LayerConfig, config: EnhancedGeneratorConfig): Node[] {
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
  private createNode(index: number, layerNumber: number, config: EnhancedGeneratorConfig): Node {
    // Cycle through node types based on config
    const nodeTypeIndex = index % config.numNodeTypes;
    const nodeTypeName = NODE_TYPE_NAMES[math.min(nodeTypeIndex, NODE_TYPE_NAMES.size() - 1)];
    const color = COLOR_PALETTES.NODE_COLORS[nodeTypeIndex % COLOR_PALETTES.NODE_COLORS.size()];
    
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
    this.addTypeSpecificProperties(node, nodeTypeName);

    return node;
  }

  /**
   * Add type-specific properties to node
   */
  private addTypeSpecificProperties(node: Node, nodeTypeName: string): void {
    if (nodeTypeName === "man" || nodeTypeName === "woman") {
      node.properties = { 
        age: math.random(18, 80),
        petType: PET_TYPES[math.random(0, PET_TYPES.size() - 1)],
        petColor: PET_COLORS[math.random(0, PET_COLORS.size() - 1)]
      };
    } else if (nodeTypeName === "child") {
      node.properties = { 
        age: math.random(5, 17),
        petType: PET_TYPES[math.random(0, PET_TYPES.size() - 1)],
        petColor: PET_COLORS[math.random(0, PET_COLORS.size() - 1)]
      };
    } else if (nodeTypeName === "grandparent") {
      node.properties = { 
        age: math.random(65, 95),
        petType: PET_TYPES[math.random(0, PET_TYPES.size() - 1)],
        petColor: PET_COLORS[math.random(0, PET_COLORS.size() - 1)]
      };
    } else if (nodeTypeName === "Animals") {
      node.properties = { 
        animalType: ANIMAL_TYPES[math.random(0, ANIMAL_TYPES.size() - 1)] 
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
    const allowSameLevelLinks = config.visualization?.allowSameLevelLinks ?? true;
    
    if (!allowSameLevelLinks || layer.connectionsPerNode <= 0 || currentLayerNodes.size() <= 1) {
      return;
    }

    const availableTargets = currentLayerNodes.filter(n => n.uuid !== sourceNode.uuid);
    const numConnections = math.min(layer.connectionsPerNode, availableTargets.size());
    
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
    // Connect to one random node in the next layer
    const targetNode = nextLayerNodes[math.random(0, nextLayerNodes.size() - 1)];
    const link = this.createLink(sourceNode, targetNode, config);
    allLinks.push(link);
  }

  /**
   * Create a link between two nodes
   */
  private createLink(sourceNode: Node, targetNode: Node, config: EnhancedGeneratorConfig): Link {
    const linkTypeIndex = this.linkIdCounter % config.numLinkTypes;
    const linkColor = COLOR_PALETTES.LINK_COLORS[linkTypeIndex % COLOR_PALETTES.LINK_COLORS.size()];
    
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
}