/**
 * Update Manager for Unified Data Renderer
 * 
 * Handles incremental updates of the graph
 */

import { Cluster, Node, Link, Group } from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig, LayerConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { IUpdateManager } from "../interfaces";
import { makeHexagon } from "../../../hexagonMaker";
import { createRopeConnectors } from "../../dataGeneratorRobloxRendererUtils/ropeCreator";
import { RENDERER_CONSTANTS } from "../../dataGeneratorRobloxRendererUtils/constants";
import { COLOR_PALETTES, NODE_TYPE_NAMES, ANIMAL_TYPES, DEFAULT_ATTACHMENTS } from "../constants";

export class UpdateManager implements IUpdateManager {
  private nodeIdCounter = 0;
  private linkIdCounter = 0;

  /**
   * Performs incremental update of the graph
   */
  public performIncrementalUpdate(
    newConfig: EnhancedGeneratorConfig, 
    nodesFolder: Folder, 
    linksFolder: Folder, 
    origin: Vector3
  ): void {
    // Build current state
    const currentNodesByLayer = this.buildCurrentState(nodesFolder);
    
    // Clear all existing connections (we'll rebuild them)
    linksFolder.ClearAllChildren();
    
    // Create update plan
    const { updatedNodeToHexagon, allNodes, nodesByLayer } = this.processLayers(
      newConfig,
      currentNodesByLayer,
      nodesFolder
    );
    
    // Remove layers that no longer exist
    this.removeObsoleteLayers(currentNodesByLayer, newConfig.layers.size());
    
    // Create cluster for positioning
    const cluster = this.createClusterFromNodes(allNodes);
    
    // Recalculate positions (would normally use PositionCalculator)
    // For now, keeping existing logic inline
    this.updateNodePositions(allNodes, updatedNodeToHexagon);
    
    // Recreate connections
    const allLinks = this.recreateConnections(newConfig, nodesByLayer);
    cluster.relations = allLinks;
    
    // Create rope connectors
    createRopeConnectors({
      cluster,
      nodeToHexagon: updatedNodeToHexagon,
      linksFolder,
      visualization: newConfig.visualization,
      linkDiameter: newConfig.spacing?.linkDiameter
    });
    
    print(`📊 Updated ${allNodes.size()} nodes and ${allLinks.size()} connections`);
  }

  /**
   * Build current state map of nodes by layer
   */
  private buildCurrentState(nodesFolder: Folder): Map<number, Model[]> {
    const currentNodesByLayer = new Map<number, Model[]>();
    
    nodesFolder.GetChildren().forEach(node => {
      if (node.IsA("Model")) {
        // Extract layer number from node name (e.g., "Hexagon_L1_N2")
        const match = node.Name.match("Hexagon_L(\\d+)_N(\\d+)");
        if (match) {
          const layerNum = tonumber(match[1]) || 1;
          if (!currentNodesByLayer.has(layerNum)) {
            currentNodesByLayer.set(layerNum, []);
          }
          currentNodesByLayer.get(layerNum)!.push(node);
        }
      }
    });
    
    // Sort nodes within each layer by their index
    currentNodesByLayer.forEach((nodes, layer) => {
      table.sort(nodes, (a, b) => {
        const matchA = a.Name.match("Hexagon_L\\d+_N(\\d+)");
        const matchB = b.Name.match("Hexagon_L\\d+_N(\\d+)");
        const indexA = matchA ? tonumber(matchA[1]) || 0 : 0;
        const indexB = matchB ? tonumber(matchB[1]) || 0 : 0;
        return indexA < indexB;
      });
    });
    
    return currentNodesByLayer;
  }

  /**
   * Process layers and handle node updates
   */
  private processLayers(
    newConfig: EnhancedGeneratorConfig,
    currentNodesByLayer: Map<number, Model[]>,
    nodesFolder: Folder
  ) {
    const updatedNodeToHexagon = new Map<string, Model>();
    const allNodes: Node[] = [];
    const nodesByLayer = new Map<number, Node[]>();
    const newNodesToCreate: Node[] = [];
    
    newConfig.layers.forEach((newLayer, layerIndex) => {
      const layerNum = layerIndex + 1;
      const currentLayerNodes = currentNodesByLayer.get(layerNum) || [];
      const layerNodes: Node[] = [];
      
      // Handle node count changes
      if (newLayer.numNodes > currentLayerNodes.size()) {
        // Add new nodes
        for (let i = 0; i < newLayer.numNodes; i++) {
          if (i < currentLayerNodes.size()) {
            // Keep existing node
            const hexagon = currentLayerNodes[i];
            const node = this.createNodeFromHexagon(hexagon, newConfig, i, layerNum);
            allNodes.push(node);
            layerNodes.push(node);
            updatedNodeToHexagon.set(node.uuid, hexagon);
          } else {
            // Create new node
            const node = this.createNewNode(newConfig, i, layerNum, newLayer);
            allNodes.push(node);
            layerNodes.push(node);
            newNodesToCreate.push(node);
          }
        }
      } else if (newLayer.numNodes < currentLayerNodes.size()) {
        // Remove excess nodes
        for (let i = 0; i < currentLayerNodes.size(); i++) {
          if (i < newLayer.numNodes) {
            // Keep existing node
            const hexagon = currentLayerNodes[i];
            const node = this.createNodeFromHexagon(hexagon, newConfig, i, layerNum);
            allNodes.push(node);
            layerNodes.push(node);
            updatedNodeToHexagon.set(node.uuid, hexagon);
          } else {
            // Remove excess node
            currentLayerNodes[i].Destroy();
          }
        }
      } else {
        // Same number of nodes, just update
        currentLayerNodes.forEach((hexagon, i) => {
          const node = this.createNodeFromHexagon(hexagon, newConfig, i, layerNum);
          allNodes.push(node);
          layerNodes.push(node);
          updatedNodeToHexagon.set(node.uuid, hexagon);
        });
      }
      
      nodesByLayer.set(layerNum, layerNodes);
    });
    
    // Create hexagons for new nodes
    newNodesToCreate.forEach(node => {
      const hexagon = this.createSingleHexagon(node, nodesFolder, newConfig);
      updatedNodeToHexagon.set(node.uuid, hexagon);
    });
    
    return { updatedNodeToHexagon, allNodes, nodesByLayer };
  }

  /**
   * Remove layers that no longer exist
   */
  private removeObsoleteLayers(currentNodesByLayer: Map<number, Model[]>, newLayerCount: number): void {
    currentNodesByLayer.forEach((nodes, layerNum) => {
      if (layerNum > newLayerCount) {
        nodes.forEach(node => node.Destroy());
      }
    });
  }

  /**
   * Create cluster from nodes
   */
  private createClusterFromNodes(allNodes: Node[]): Cluster {
    const mainGroup: Group = {
      id: "group_1",
      name: "Group1",
      nodes: allNodes
    };
    
    return {
      groups: [mainGroup],
      relations: []
    };
  }

  /**
   * Update node positions by moving hexagons
   */
  private updateNodePositions(allNodes: Node[], nodeToHexagon: Map<string, Model>): void {
    allNodes.forEach(node => {
      const hexagon = nodeToHexagon.get(node.uuid);
      if (hexagon && node.position) {
        const currentPos = hexagon.PrimaryPart?.Position || new Vector3(0, 0, 0);
        const targetPos = new Vector3(node.position.x, node.position.y, node.position.z);
        const offset = targetPos.sub(currentPos);
        
        // Move all parts manually to preserve anchoring
        hexagon.GetChildren().forEach(part => {
          if (part.IsA("BasePart")) {
            part.Position = part.Position.add(offset);
          }
        });
      }
    });
  }

  /**
   * Recreate connections based on new configuration
   */
  private recreateConnections(
    config: EnhancedGeneratorConfig,
    nodesByLayer: Map<number, Node[]>
  ): Link[] {
    const allLinks: Link[] = [];
    this.linkIdCounter = 0;
    
    config.layers.forEach((layer, layerIndex) => {
      const layerNum = layerIndex + 1;
      const currentLayerNodes = nodesByLayer.get(layerNum) || [];
      const nextLayerNodes = nodesByLayer.get(layerNum + 1);
      
      // Create intra-layer connections
      const allowSameLevelLinks = config.visualization?.allowSameLevelLinks ?? true;
      if (allowSameLevelLinks && layer.connectionsPerNode > 0 && currentLayerNodes.size() > 1) {
        currentLayerNodes.forEach((sourceNode, nodeIndex) => {
          const availableTargets = currentLayerNodes.filter((_, idx) => idx !== nodeIndex);
          const numConnections = math.min(layer.connectionsPerNode, availableTargets.size());
          
          // Shuffle and select targets
          const shuffled = [...availableTargets];
          for (let i = shuffled.size() - 1; i > 0; i--) {
            const j = math.random(0, i);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          
          for (let i = 0; i < numConnections; i++) {
            const targetNode = shuffled[i];
            const link = this.createLink(sourceNode, targetNode, config);
            allLinks.push(link);
          }
        });
      }
      
      // Create inter-layer connections
      if (nextLayerNodes && nextLayerNodes.size() > 0) {
        currentLayerNodes.forEach(sourceNode => {
          const targetNode = nextLayerNodes[math.random(0, nextLayerNodes.size() - 1)];
          const link = this.createLink(sourceNode, targetNode, config);
          allLinks.push(link);
        });
      }
    });
    
    return allLinks;
  }

  /**
   * Create a link between two nodes
   */
  private createLink(sourceNode: Node, targetNode: Node, config: EnhancedGeneratorConfig): Link {
    const linkTypeIndex = this.linkIdCounter % config.numLinkTypes;
    const linkColor = COLOR_PALETTES.LINK_COLORS[linkTypeIndex % COLOR_PALETTES.LINK_COLORS.size()];
    
    return {
      uuid: `link_${this.linkIdCounter++}`,
      type: `Link${linkTypeIndex + 1}`,
      sourceNodeUuid: sourceNode.uuid,
      targetNodeUuid: targetNode.uuid,
      color: linkColor
    };
  }

  /**
   * Creates a node from an existing hexagon model
   */
  private createNodeFromHexagon(hexagon: Model, config: EnhancedGeneratorConfig, nodeIndex: number, layerNum: number): Node {
    const nodeTypeIndex = nodeIndex % config.numNodeTypes;
    const nodeTypeName = NODE_TYPE_NAMES[math.min(nodeTypeIndex, NODE_TYPE_NAMES.size() - 1)];
    const color = COLOR_PALETTES.NODE_COLORS[nodeTypeIndex % COLOR_PALETTES.NODE_COLORS.size()];
    
    const primaryPart = hexagon.PrimaryPart;
    const position = primaryPart ? primaryPart.Position : new Vector3(0, 0, 0);
    
    const node: Node = {
      uuid: `node_${layerNum}_${nodeIndex}`,
      name: `${nodeTypeName} ${nodeIndex + 1}`,
      type: nodeTypeName as "People" | "Animals",
      position: { x: position.X, y: position.Y, z: position.Z },
      color: color,
      attachmentNames: DEFAULT_ATTACHMENTS
    };
    
    // Add level property for swim lane algorithm
    const nodeWithLevel = node as Node & { level: number };
    nodeWithLevel.level = layerNum;
    
    // Add type-specific properties
    if (nodeTypeName === "Animals") {
      node.properties = { animalType: ANIMAL_TYPES[math.random(0, ANIMAL_TYPES.size() - 1)] };
    }
    
    return node;
  }

  /**
   * Creates a new node
   */
  private createNewNode(config: EnhancedGeneratorConfig, nodeIndex: number, layerNum: number, layer: LayerConfig): Node {
    const nodeTypeIndex = nodeIndex % config.numNodeTypes;
    const nodeTypeName = NODE_TYPE_NAMES[math.min(nodeTypeIndex, NODE_TYPE_NAMES.size() - 1)];
    const color = COLOR_PALETTES.NODE_COLORS[nodeTypeIndex % COLOR_PALETTES.NODE_COLORS.size()];
    
    const node: Node = {
      uuid: `node_${layerNum}_${nodeIndex}`,
      name: `${nodeTypeName} ${nodeIndex + 1}`,
      type: nodeTypeName as "People" | "Animals",
      position: { x: 0, y: 0, z: 0 }, // Will be set by swim lane positioning
      color: color,
      attachmentNames: DEFAULT_ATTACHMENTS
    };
    
    // Add level property for swim lane algorithm
    const nodeWithLevel = node as Node & { level: number };
    nodeWithLevel.level = layerNum;
    
    // Add type-specific properties
    if (nodeTypeName === "Animals") {
      node.properties = { animalType: ANIMAL_TYPES[math.random(0, ANIMAL_TYPES.size() - 1)] };
    }
    
    return node;
  }

  /**
   * Creates a single hexagon for a node
   */
  private createSingleHexagon(node: Node, nodesFolder: Folder, config?: EnhancedGeneratorConfig): Model {
    // Use spacing from config if provided, otherwise use defaults
    const spacing = config?.spacing || {
      nodeHeight: RENDERER_CONSTANTS.HEXAGON.HEIGHT,
      nodeRadius: RENDERER_CONSTANTS.HEXAGON.WIDTH / 2,
      layerSpacing: RENDERER_CONSTANTS.POSITIONING.LEVEL_SPACING,
      nodeSpacing: RENDERER_CONSTANTS.POSITIONING.COLUMN_SPACING,
      swimlaneSpacing: RENDERER_CONSTANTS.POSITIONING.COLUMN_SPACING
    };
    
    const WIDTH = spacing.nodeRadius * 2;
    const HEIGHT = spacing.nodeHeight;
    
    const labels: string[] = [
      node.name,
      node.type,
      ""  // typeNumber would be added later
    ];
    
    if (node.properties?.animalType) {
      labels.push(node.properties.animalType);
    }
    
    const hexagon = makeHexagon({
      id: this.nodeIdCounter++,
      position: new Vector3(node.position.x, node.position.y, node.position.z),
      width: WIDTH,
      height: HEIGHT,
      barColor: new Color3(node.color[0], node.color[1], node.color[2]),
      barMaterial: Enum.Material.SmoothPlastic,
      castShadow: false,
      labels: labels,
      stackIndex: 1,
      hexIndex: this.nodeIdCounter,
      guid: node.uuid
    });
    
    // Set name to match pattern for layer tracking
    const layerNum = tonumber(node.uuid.match("node_(\\d+)_")?.[1]) || 1;
    const nodeIndex = tonumber(node.uuid.match("node_\\d+_(\\d+)")?.[1]) || 1;
    hexagon.Name = `Hexagon_L${layerNum}_N${nodeIndex}`;
    hexagon.Parent = nodesFolder;
    
    return hexagon;
  }
}