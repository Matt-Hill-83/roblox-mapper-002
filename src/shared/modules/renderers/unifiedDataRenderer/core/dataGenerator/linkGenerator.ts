/**
 * Link Generator for Unified Data Renderer
 * 
 * Handles creation and management of relationships between nodes
 */

import { COLOR_PALETTES } from "../../constants";
import {
  EnhancedGeneratorConfig,
  LayerConfig,
} from "../../../../../interfaces/enhancedGenerator.interface";
import { 
  Link, 
  Node 
} from "../../../../../interfaces/simpleDataGenerator.interface";
import { ILinkGenerator } from "./interfaces";

export class LinkGenerator implements ILinkGenerator {
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
      
      // Create a mock layer config for the link generation
      const layer: LayerConfig = {
        layerNumber,
        numNodes: currentLayerNodes.size(),
        connectionsPerNode: this.getDefaultConnectionsPerNode(config),
      };

      this.generateLayerLinks(
        currentLayerNodes,
        nextLayerNodes,
        layer,
        config,
        allLinks
      );

      // Add backward connections for first layer (connecting to second layer)
      if (layerNumber === 1 && nextLayerNodes) {
        this.ensureBackwardConnections(currentLayerNodes, nextLayerNodes, config, allLinks);
      }
    });

    return allLinks;
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

  /**
   * Ensure all nodes have at least one connection
   */
  public ensureConnectivity(
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
   * Ensure backward connections for first layer
   */
  private ensureBackwardConnections(
    currentLayerNodes: Node[],
    nextLayerNodes: Node[],
    config: EnhancedGeneratorConfig,
    allLinks: Link[]
  ): void {
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

  /**
   * Get default connections per node from config or use reasonable default
   */
  private getDefaultConnectionsPerNode(config: EnhancedGeneratorConfig): number {
    // Check if the config has a default value, otherwise use 2
    return 2; // Default to 2 connections per node
  }
}