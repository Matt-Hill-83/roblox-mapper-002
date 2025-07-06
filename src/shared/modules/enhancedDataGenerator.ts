/**
 * Enhanced Data Generator Module
 * 
 * Generates node and link data based on layer configuration
 * Supports configurable node types, link types, and connections per layer
 */

import { Node, Link, Group, Cluster } from "../interfaces/simpleDataGenerator.interface";
import { LayerConfig } from "../../client/services/configGui/interfaces";

interface EnhancedGeneratorInput {
  numNodeTypes: number;
  numLinkTypes: number;
  layers: LayerConfig[];
}

// Define available node types
const NODE_TYPES = ["People", "Animals", "Buildings", "Vehicles", "Plants", "Minerals", "Technology", "Food", "Tools", "Weather"];

// Define available link types  
// const LINK_TYPES = ["Parent", "Child", "Sibling", "Friend", "Enemy", "Partner", "Owner", "Creator", "Consumer", "Supplier"];

// Define node colors based on type
const NODE_COLORS: Record<string, [number, number, number]> = {
  "Type A": [0.8, 0.2, 0.2], // Red
  "Type B": [0.2, 0.8, 0.2], // Green
  "Type C": [0.2, 0.2, 0.8], // Blue
  "Type D": [0.8, 0.8, 0.2], // Yellow
  "Type E": [0.8, 0.2, 0.8], // Magenta
  "Type F": [0.2, 0.8, 0.8], // Cyan
  "Type G": [0.8, 0.5, 0.2], // Orange
  "Type H": [0.5, 0.2, 0.8], // Purple
  "Type I": [0.2, 0.5, 0.8], // Sky Blue
  "Type J": [0.8, 0.2, 0.5], // Pink
};

// Define link colors based on type
const LINK_COLORS: Record<string, [number, number, number]> = {
  "Link A": [0.6, 0.1, 0.1], // Dark Red
  "Link B": [0.1, 0.6, 0.1], // Dark Green
  "Link C": [0.1, 0.1, 0.6], // Dark Blue
  "Link D": [0.6, 0.6, 0.1], // Dark Yellow
  "Link E": [0.6, 0.1, 0.6], // Dark Magenta
  "Link F": [0.1, 0.6, 0.6], // Dark Cyan
  "Link G": [0.6, 0.4, 0.1], // Dark Orange
  "Link H": [0.4, 0.1, 0.6], // Dark Purple
  "Link I": [0.1, 0.4, 0.6], // Dark Sky Blue
  "Link J": [0.6, 0.1, 0.4], // Dark Pink
};

let nodeIdCounter = 0;
let linkIdCounter = 0;

/**
 * Generates a unique node ID
 */
function generateNodeId(): string {
  return `node-${++nodeIdCounter}`;
}

/**
 * Generates a unique link ID
 */
function generateLinkId(): string {
  return `link-${++linkIdCounter}`;
}

/**
 * Creates a node with the specified type
 */
function createNode(nodeType: string, layerIndex: number, nodeIndex: number, totalNodesInLayer: number): Node {
  const nodeTypeName = NODE_TYPES[math.min(tonumber(nodeType.match("%d+")[0]) || 1, NODE_TYPES.size()) - 1];
  const color = NODE_COLORS[nodeType] || [0.5, 0.5, 0.5];
  
  // Calculate position based on layer and node index
  const layerSpacing = 10; // Vertical spacing between layers
  const nodeSpacing = 8;  // Horizontal spacing between nodes in same layer
  
  const node: Node = {
    uuid: generateNodeId(),
    name: `${nodeType} ${layerIndex}-${nodeIndex}`,
    type: nodeTypeName as "People" | "Animals",
    color,
    position: { 
      x: (nodeIndex - 1 - (totalNodesInLayer - 1) / 2) * nodeSpacing, // Center nodes horizontally
      y: (layerIndex - 1) * layerSpacing, // Stack layers vertically
      z: 0 
    },
    attachmentNames: ["top", "bottom", "left", "right", "front", "back"],
  };

  // Add type-specific properties
  if (nodeTypeName === "People") {
    node.properties = { age: math.random(18, 80) };
  } else if (nodeTypeName === "Animals") {
    const animalTypes = ["dog", "cat", "bird", "fish", "hamster", "rabbit", "turtle", "snake", "lizard", "horse"];
    node.properties = { animalType: animalTypes[math.random(0, animalTypes.size() - 1)] };
  }

  return node;
}

/**
 * Creates a link between two nodes
 */
function createLink(sourceNodeId: string, targetNodeId: string, linkType: string): Link {
  const color = LINK_COLORS[linkType] || [0.3, 0.3, 0.3];
  
  return {
    uuid: generateLinkId(),
    type: linkType,
    sourceNodeUuid: sourceNodeId,
    targetNodeUuid: targetNodeId,
    color,
  };
}

/**
 * Generates data based on enhanced layer configuration
 */
export function generateEnhancedData(config: EnhancedGeneratorInput): Cluster {
  // Reset counters
  nodeIdCounter = 0;
  linkIdCounter = 0;

  const allNodes: Node[] = [];
  const allLinks: Link[] = [];
  const nodesByLayer: Node[][] = [];

  // Generate nodes for each layer
  config.layers.forEach((layer, layerIndex) => {
    const layerNodes: Node[] = [];
    
    for (let i = 0; i < layer.numNodes; i++) {
      const node = createNode(layer.nodeType, layerIndex + 1, i + 1, layer.numNodes);
      layerNodes.push(node);
      allNodes.push(node);
    }
    
    nodesByLayer.push(layerNodes);
  });

  // Generate links based on layer configuration
  config.layers.forEach((layer, layerIndex) => {
    const currentLayerNodes = nodesByLayer[layerIndex];
    
    currentLayerNodes.forEach((sourceNode) => {
      // Create connections within the same layer
      if (layer.connectionsPerNode > 0 && currentLayerNodes.size() > 1) {
        const availableTargets = currentLayerNodes.filter(n => n.uuid !== sourceNode.uuid);
        const numConnections = math.min(layer.connectionsPerNode, availableTargets.size());
        
        // Randomly select target nodes
        const shuffled = [...availableTargets];
        for (let i = shuffled.size() - 1; i > 0; i--) {
          const j = math.random(0, i);
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        for (let i = 0; i < numConnections; i++) {
          const targetNode = shuffled[i];
          const link = createLink(sourceNode.uuid, targetNode.uuid, layer.linkType);
          allLinks.push(link);
        }
      }
      
      // Create connections to next layer (hierarchical)
      if (layerIndex < nodesByLayer.size() - 1) {
        const nextLayerNodes = nodesByLayer[layerIndex + 1];
        if (nextLayerNodes.size() > 0) {
          // Connect to one random node in the next layer
          const targetNode = nextLayerNodes[math.random(0, nextLayerNodes.size() - 1)];
          const link = createLink(sourceNode.uuid, targetNode.uuid, "Parent");
          allLinks.push(link);
        }
      }
    });
  });

  // Create a single group containing all nodes
  const mainGroup: Group = {
    id: "main-group",
    name: "Enhanced Data Group",
    nodes: allNodes,
  };

  // Return the cluster
  return {
    groups: [mainGroup],
    relations: allLinks,
  };
}

/**
 * Converts enhanced config from GUI to generator input format
 */
export function convertEnhancedConfig(guiConfig: {
  numNodeTypes: number;
  numLinkTypes: number;
  layers: Array<{
    layerNumber: number;
    numNodes: number;
    connectionsPerNode: number;
    nodeType: string;
    linkType: string;
  }>;
}): EnhancedGeneratorInput {
  return {
    numNodeTypes: guiConfig.numNodeTypes,
    numLinkTypes: guiConfig.numLinkTypes,
    layers: guiConfig.layers.map(layer => ({
      layerNumber: layer.layerNumber,
      numNodes: layer.numNodes,
      connectionsPerNode: layer.connectionsPerNode,
      nodeType: layer.nodeType,
      linkType: layer.linkType,
    })),
  };
}