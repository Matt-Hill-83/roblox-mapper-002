/**
 * Unified Data Renderer
 * 
 * Combines layer-based configuration with swim lane positioning and rich colors
 * Accepts enhanced configuration directly without conversion
 */

import { makeHexagon } from "../hexagonMaker";
import { Cluster, Node, Link, Group } from "../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../interfaces/enhancedGenerator.interface";
import { RENDERER_CONSTANTS } from "./dataGeneratorRobloxRendererUtils/constants";
import { createRopeConnectors } from "./dataGeneratorRobloxRendererUtils/ropeCreator";

// Color palettes from SimpleDataGeneratorService
const COLOR_PALETTES = {
  NODE_COLORS: [
    [0.2, 0.4, 0.8],  // Blue
    [0.8, 0.4, 0.2],  // Orange
    [0.2, 0.8, 0.2],  // Green
    [0.8, 0.2, 0.8],  // Magenta
    [0.8, 0.8, 0.2],  // Yellow
    [0.2, 0.8, 0.8],  // Cyan
    [0.8, 0.2, 0.2],  // Red
    [0.4, 0.2, 0.6],  // Purple
    [0.6, 0.4, 0.2],  // Brown
    [0.5, 0.5, 0.5],  // Gray
  ] as [number, number, number][],

  LINK_COLORS: [
    [0.2, 0.8, 0.2],  // Green
    [0.8, 0.2, 0.8],  // Magenta
    [0.8, 0.8, 0.2],  // Yellow
    [0.2, 0.8, 0.8],  // Cyan
    [0.8, 0.2, 0.2],  // Red
    [0.4, 0.2, 0.6],  // Purple
    [0.6, 0.4, 0.2],  // Brown
    [0.5, 0.5, 0.5],  // Gray
    [0.9, 0.5, 0.1],  // Orange-Red
    [0.1, 0.5, 0.9],  // Sky Blue
  ] as [number, number, number][],
};

// Node type names
const NODE_TYPE_NAMES = ["People", "Animals", "Buildings", "Vehicles", "Plants", "Minerals", "Technology", "Food", "Tools", "Weather"];

export class UnifiedDataRenderer {
  private nodeIdCounter = 0;
  private linkIdCounter = 0;

  /**
   * Main entry point - renders data based on enhanced configuration
   */
  public renderEnhancedData(parentFolder: Folder, config: EnhancedGeneratorConfig, origin?: Vector3): void {
    print("🎯 Unified renderer: Starting enhanced data generation...");
    
    // Generate the cluster data
    const cluster = this.generateClusterFromLayers(config);
    
    // Calculate swim lane positions
    this.calculateLayerSwimLanePositions(cluster, config.layers.size());
    
    // Adjust positions to center bottom at origin
    this.centerBottomAtOrigin(cluster, origin || new Vector3(0, 0, 0));
    
    // Render the cluster
    this.renderCluster(cluster, parentFolder);
    
    print(`✅ Unified renderer: Complete! Created ${cluster.groups[0].nodes.size()} nodes with swim lanes`);
  }

  /**
   * Generates cluster data from layer configuration
   */
  private generateClusterFromLayers(config: EnhancedGeneratorConfig): Cluster {
    const allNodes: Node[] = [];
    const allLinks: Link[] = [];
    const nodesByLayer = new Map<number, Node[]>();

    // Generate nodes for each layer
    config.layers.forEach((layer) => {
      const layerNodes: Node[] = [];
      
      for (let i = 0; i < layer.numNodes; i++) {
        // Cycle through node types based on config
        const nodeTypeIndex = i % config.numNodeTypes;
        const nodeTypeName = NODE_TYPE_NAMES[math.min(nodeTypeIndex, NODE_TYPE_NAMES.size() - 1)];
        const color = COLOR_PALETTES.NODE_COLORS[nodeTypeIndex % COLOR_PALETTES.NODE_COLORS.size()];
        
        const node: Node = {
          uuid: `node-${++this.nodeIdCounter}`,
          name: `${nodeTypeName} ${layer.layerNumber}-${i + 1}`,
          type: nodeTypeName as "People" | "Animals",
          color,
          position: { x: 0, y: 0, z: 0 }, // Will be calculated by swim lanes
          attachmentNames: ["top", "bottom", "left", "right", "front", "back"],
        };

        // Add level property for swim lane algorithm
        const nodeWithLevel = node as Node & { level: number };
        nodeWithLevel.level = layer.layerNumber;

        // Add type-specific properties
        if (nodeTypeName === "People") {
          node.properties = { age: math.random(18, 80) };
        } else if (nodeTypeName === "Animals") {
          const animalTypes = ["dog", "cat", "bird", "fish", "hamster", "rabbit", "turtle", "snake", "lizard", "horse"];
          node.properties = { animalType: animalTypes[math.random(0, animalTypes.size() - 1)] };
        }

        layerNodes.push(node);
        allNodes.push(node);
      }
      
      nodesByLayer.set(layer.layerNumber, layerNodes);
    });

    // Generate links based on connections per node
    let linkCounter = 0;
    config.layers.forEach((layer) => {
      const currentLayerNodes = nodesByLayer.get(layer.layerNumber)!;
      
      currentLayerNodes.forEach((sourceNode) => {
        // Create intra-layer connections
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
            const linkTypeIndex = linkCounter % config.numLinkTypes;
            const linkColor = COLOR_PALETTES.LINK_COLORS[linkTypeIndex % COLOR_PALETTES.LINK_COLORS.size()];
            linkCounter++;
            
            const link: Link = {
              uuid: `link-${++this.linkIdCounter}`,
              type: `Link${linkTypeIndex + 1}`,
              sourceNodeUuid: sourceNode.uuid,
              targetNodeUuid: targetNode.uuid,
              color: linkColor,
            };
            
            allLinks.push(link);
          }
        }
        
        // Create inter-layer connections (to next layer)
        const nextLayer = layer.layerNumber + 1;
        const nextLayerNodes = nodesByLayer.get(nextLayer);
        if (nextLayerNodes && nextLayerNodes.size() > 0) {
          // Connect to one random node in the next layer
          const targetNode = nextLayerNodes[math.random(0, nextLayerNodes.size() - 1)];
          const linkTypeIndex = linkCounter % config.numLinkTypes;
          const linkColor = COLOR_PALETTES.LINK_COLORS[linkTypeIndex % COLOR_PALETTES.LINK_COLORS.size()];
          linkCounter++;
          
          const link: Link = {
            uuid: `link-${++this.linkIdCounter}`,
            type: `Link${linkTypeIndex + 1}`,
            sourceNodeUuid: sourceNode.uuid,
            targetNodeUuid: targetNode.uuid,
            color: linkColor,
          };
          
          allLinks.push(link);
        }
      });
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
   * Centers the bottom of the group at the specified origin
   */
  private centerBottomAtOrigin(cluster: Cluster, origin: Vector3): void {
    if (cluster.groups[0].nodes.size() === 0) return;
    
    // Find bounding box
    let minX = math.huge;
    let maxX = -math.huge;
    let minY = math.huge;
    
    cluster.groups[0].nodes.forEach(node => {
      minX = math.min(minX, node.position.x);
      maxX = math.max(maxX, node.position.x);
      minY = math.min(minY, node.position.y);
    });
    
    // Calculate offsets to center bottom at origin
    const centerX = (minX + maxX) / 2;
    const offsetX = origin.X - centerX;
    const offsetY = origin.Y - minY; // Bottom of group at origin Y
    const offsetZ = origin.Z;
    
    // Apply offsets to all nodes
    cluster.groups[0].nodes.forEach(node => {
      node.position.x += offsetX;
      node.position.y += offsetY;
      node.position.z += offsetZ;
    });
    
    print(`🎯 Group centered at origin: offset (${offsetX}, ${offsetY}, ${offsetZ})`);
  }
  
  /**
   * Calculates swim lane positions for layer-based data
   */
  private calculateLayerSwimLanePositions(cluster: Cluster, numLayers: number): void {
    const { COLUMN_SPACING, LEVEL_SPACING, BASE_Y } = RENDERER_CONSTANTS.POSITIONING;
    
    // Organize nodes by layer (using level property)
    const nodesByLayer = new Map<number, Node[]>();
    
    cluster.groups.forEach(group => {
      group.nodes.forEach((node) => {
        const nodeWithLevel = node as Node & { level?: number };
        const layer = nodeWithLevel.level || 1;
        if (!nodesByLayer.has(layer)) {
          nodesByLayer.set(layer, []);
        }
        nodesByLayer.get(layer)!.push(node);
      });
    });
    
    // Group nodes by type across all layers
    const typeCounters = new Map<string, number>();
    const nodesByTypeAndLayer = new Map<string, Node[]>();
    
    // First pass: organize nodes by type and layer
    nodesByLayer.forEach((nodes, layer) => {
      nodes.forEach(node => {
        const key = `${node.type}-${layer}`;
        if (!nodesByTypeAndLayer.has(key)) {
          nodesByTypeAndLayer.set(key, []);
        }
        nodesByTypeAndLayer.get(key)!.push(node);
        
        // Track total count per type
        typeCounters.set(node.type, (typeCounters.get(node.type) || 0) + 1);
      });
    });
    
    // Sort types by count (descending) - manual sort for Lua compatibility
    const sortedTypes: string[] = [];
    typeCounters.forEach((_, nodeType) => {
      sortedTypes.push(nodeType);
    });
    
    // Manual bubble sort for Lua compatibility
    for (let i = 0; i < sortedTypes.size() - 1; i++) {
      for (let j = i + 1; j < sortedTypes.size(); j++) {
        const countA = typeCounters.get(sortedTypes[i])!;
        const countB = typeCounters.get(sortedTypes[j])!;
        if (countB > countA) {
          const temp = sortedTypes[i];
          sortedTypes[i] = sortedTypes[j];
          sortedTypes[j] = temp;
        }
      }
    }
    
    // Calculate type column positions
    let typeXOffset = 0;
    const typeXPositions = new Map<string, number>();
    
    sortedTypes.forEach((nodeType, typeIndex) => {
      typeXPositions.set(nodeType, typeXOffset);
      
      // Find max nodes of this type in any layer
      let maxNodesInLayer = 0;
      for (let layer = 1; layer <= numLayers; layer++) {
        const key = `${nodeType}-${layer}`;
        const nodes = nodesByTypeAndLayer.get(key) || [];
        maxNodesInLayer = math.max(maxNodesInLayer, nodes.size());
      }
      
      // Move to next type column
      typeXOffset += maxNodesInLayer * COLUMN_SPACING;
      if (typeIndex < sortedTypes.size() - 1) {
        typeXOffset += COLUMN_SPACING; // Extra gap between types
      }
    });
    
    // Assign positions to each node
    const typeNodeCounters = new Map<string, number>();
    sortedTypes.forEach(nodeType => typeNodeCounters.set(nodeType, 0));
    
    for (let layer = 1; layer <= numLayers; layer++) {
      // Invert Y so layer 1 is at top
      const layerY = BASE_Y + (numLayers - layer) * LEVEL_SPACING;
      
      sortedTypes.forEach(nodeType => {
        const key = `${nodeType}-${layer}`;
        const nodes = nodesByTypeAndLayer.get(key) || [];
        
        // Sort nodes alphabetically within type-layer group - manual sort for Lua
        for (let i = 0; i < nodes.size() - 1; i++) {
          for (let j = i + 1; j < nodes.size(); j++) {
            if (nodes[i].name > nodes[j].name) {
              const temp = nodes[i];
              nodes[i] = nodes[j];
              nodes[j] = temp;
            }
          }
        }
        
        nodes.forEach((node, index) => {
          const baseX = typeXPositions.get(nodeType)!;
          
          // Find max nodes of this type for centering
          let maxNodesForType = 0;
          for (let checkLayer = 1; checkLayer <= numLayers; checkLayer++) {
            const checkKey = `${nodeType}-${checkLayer}`;
            const checkNodes = nodesByTypeAndLayer.get(checkKey) || [];
            maxNodesForType = math.max(maxNodesForType, checkNodes.size());
          }
          
          // Calculate centering offset
          const laneWidth = maxNodesForType * COLUMN_SPACING;
          const nodesWidth = nodes.size() * COLUMN_SPACING;
          const centeringOffset = (laneWidth - nodesWidth) / 2;
          
          const x = baseX + centeringOffset + index * COLUMN_SPACING;
          const z = 0;
          
          // Update node position
          node.position = { x, y: layerY, z };
          
          // Add type number for labeling
          const typeCounter = typeNodeCounters.get(nodeType)! + 1;
          typeNodeCounters.set(nodeType, typeCounter);
          const paddedNumber = typeCounter < 10 ? `0${typeCounter}` : `${typeCounter}`;
          const nodeWithType = node as Node & { typeNumber?: string };
          nodeWithType.typeNumber = `${nodeType.lower()}${paddedNumber}`;
        });
      });
    }
  }

  /**
   * Renders the cluster with positioned nodes
   */
  private renderCluster(cluster: Cluster, parentFolder: Folder): void {
    // Clear existing visualization
    parentFolder.GetChildren().forEach(child => {
      if (child.Name !== "OriginBlock") {
        child.Destroy();
      }
    });

    // Create folder structure
    const clusterFolder = new Instance("Folder");
    clusterFolder.Name = "UnifiedDataCluster";
    clusterFolder.Parent = parentFolder;
    
    const nodesFolder = new Instance("Folder");
    nodesFolder.Name = "Nodes";
    nodesFolder.Parent = clusterFolder;
    
    const linksFolder = new Instance("Folder");
    linksFolder.Name = "Links";
    linksFolder.Parent = clusterFolder;
    
    // Create hexagons for all nodes
    const nodeToHexagon = this.createHexagons(cluster, nodesFolder);
    
    // Create links/ropes for relationships
    createRopeConnectors({
      cluster,
      nodeToHexagon,
      linksFolder
    });
    
    print(`📊 Created ${nodeToHexagon.size()} hexagons and ${cluster.relations.size()} connections`);
  }

  /**
   * Creates hexagons for all nodes in the cluster
   */
  private createHexagons(cluster: Cluster, nodesFolder: Folder): Map<string, Model> {
    const nodeToHexagon = new Map<string, Model>();
    let hexIndex = 1;
    
    cluster.groups.forEach(group => {
      group.nodes.forEach(node => {
        const { WIDTH, HEIGHT } = RENDERER_CONSTANTS.HEXAGON;
        
        const labels: string[] = [
          node.name,
          node.type,
          (node as Node & { typeNumber?: string }).typeNumber || ""
        ];
        
        if (node.type === "People" && node.properties?.age) {
          labels.push(`Age: ${node.properties.age}`);
        } else if (node.type === "Animals" && node.properties?.animalType) {
          labels.push(node.properties.animalType);
        }
        
        const hexagon = makeHexagon({
          id: hexIndex,
          centerPosition: [node.position.x, node.position.y, node.position.z],
          width: WIDTH,
          height: HEIGHT,
          barProps: {
            Color: node.color
          },
          labels: labels,
          stackIndex: 1,
          hexIndex: hexIndex,
          guid: node.uuid
        });
        
        hexagon.Parent = nodesFolder;
        nodeToHexagon.set(node.uuid, hexagon);
        hexIndex++;
      });
    });
    
    return nodeToHexagon;
  }
}