/**
 * Unified Data Renderer
 * 
 * Combines layer-based configuration with swim lane positioning and rich colors
 * Accepts enhanced configuration directly without conversion
 */

import { makeHexagon } from "../hexagonMaker";
import { Cluster, Node, Link, Group } from "../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig, LayerConfig } from "../../interfaces/enhancedGenerator.interface";
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
  private currentConfig?: EnhancedGeneratorConfig;

  /**
   * Main entry point - renders data based on enhanced configuration
   */
  public renderEnhancedData(parentFolder: Folder, config: EnhancedGeneratorConfig, origin?: Vector3): void {
    print("🎯 Unified renderer: Starting enhanced data generation...");
    
    // Generate the cluster data
    const cluster = this.generateClusterFromLayers(config);
    
    // Calculate swim lane positions
    this.calculateLayerSwimLanePositions(cluster, config);
    
    // Adjust positions to center bottom at origin
    const targetOrigin = origin || new Vector3(0, 0, 0);
    this.centerBottomAtOrigin(cluster, targetOrigin);
    
    // Render the cluster
    this.renderCluster(cluster, parentFolder, config);
    
    print(`✅ Unified renderer: Complete! Created ${cluster.groups[0].nodes.size()} nodes with swim lanes`);
    
    // Store current configuration for update comparison
    this.currentConfig = config;
  }

  /**
   * Updates existing data incrementally based on configuration changes
   */
  public updateEnhancedData(parentFolder: Folder, config: EnhancedGeneratorConfig, origin?: Vector3): void {
    print("🔄 Unified renderer: Starting incremental update...");
    
    // Find GraphMaker folder
    const graphMakerFolder = parentFolder.FindFirstChild("GraphMaker");
    if (!graphMakerFolder || !this.currentConfig) {
      print("⚠️ No existing graph found, performing full render");
      this.renderEnhancedData(parentFolder, config, origin);
      return;
    }
    
    // Find nodes and links folders
    const clusterFolder = graphMakerFolder.FindFirstChild("UnifiedDataCluster");
    if (!clusterFolder) {
      print("⚠️ No cluster folder found, performing full render");
      this.renderEnhancedData(parentFolder, config, origin);
      return;
    }
    
    const nodesFolder = clusterFolder.FindFirstChild("Nodes") as Folder;
    const linksFolder = clusterFolder.FindFirstChild("Links") as Folder;
    
    if (!nodesFolder || !linksFolder) {
      print("⚠️ Missing folders, performing full render");
      this.renderEnhancedData(parentFolder, config, origin);
      return;
    }
    
    // Compare configurations and update incrementally
    this.performIncrementalUpdate(config, nodesFolder, linksFolder, origin || new Vector3(0, 0, 0));
    
    // Update stored configuration
    this.currentConfig = config;
    
    print("✅ Incremental update complete!");
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
          uuid: `node_${layer.layerNumber}_${i}`,
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
        // Create intra-layer connections (only if allowed by visualization settings)
        const allowSameLevelLinks = config.visualization?.allowSameLevelLinks ?? true;
        if (allowSameLevelLinks && layer.connectionsPerNode > 0 && currentLayerNodes.size() > 1) {
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
    
    // Ensure nodes stay above ground level (minimum Y = 5)
    const minFinalY = minY + offsetY;
    const groundClearanceAdjustment = minFinalY < 5 ? 5 - minFinalY : 0;
    const finalOffsetY = offsetY + groundClearanceAdjustment;
    
    // Debug ground clearance only if adjustment needed
    if (groundClearanceAdjustment > 0) {
      print(`🎯 Ground clearance applied: +${groundClearanceAdjustment} (final Y will be ${minFinalY + groundClearanceAdjustment})`);
    }
    
    // Apply offsets to all nodes
    cluster.groups[0].nodes.forEach(node => {
      node.position.x += offsetX;
      node.position.y += finalOffsetY;
      node.position.z += offsetZ;
    });
    
    print(`✅ Positioned ${cluster.groups[0].nodes.size()} nodes with swim lanes`);
  }
  
  /**
   * Calculates swim lane positions for layer-based data
   */
  private calculateLayerSwimLanePositions(cluster: Cluster, config: EnhancedGeneratorConfig): void {
    // Use spacing from config if provided, otherwise use defaults
    const spacing = config.spacing || {
      nodeHeight: RENDERER_CONSTANTS.HEXAGON.HEIGHT,
      nodeRadius: RENDERER_CONSTANTS.HEXAGON.WIDTH / 2,
      layerSpacing: RENDERER_CONSTANTS.POSITIONING.LEVEL_SPACING,
      nodeSpacing: RENDERER_CONSTANTS.POSITIONING.COLUMN_SPACING,
      swimlaneSpacing: RENDERER_CONSTANTS.POSITIONING.COLUMN_SPACING
    };
    
    const COLUMN_SPACING = spacing.nodeSpacing;
    const LEVEL_SPACING = spacing.layerSpacing;
    const SWIMLANE_SPACING = spacing.swimlaneSpacing;
    const BASE_Y = RENDERER_CONSTANTS.POSITIONING.BASE_Y;
    const numLayers = config.layers.size();
    
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
        typeXOffset += SWIMLANE_SPACING; // Gap between swim lanes
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
          let z = 0;
          
          // Apply random Z offset if enabled
          if (config.visualization?.randomZOffset) {
            // Use node UUID as seed for deterministic randomness
            let seed = 0;
            for (let i = 0; i < node.uuid.size(); i++) {
              seed += string.byte(node.uuid, i + 1)[0];
            }
            math.randomseed(seed);
            
            // 50% chance to offset
            if (math.random() < 0.5) {
              // 50% chance for +20 or -20
              const offsetDirection = math.random() < 0.5 ? -1 : 1;
              z += offsetDirection * 20;
            }
          }
          
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
  private renderCluster(cluster: Cluster, parentFolder: Folder, config?: EnhancedGeneratorConfig): void {
    // Look for existing GraphMaker folder and delete it
    const existingGraphMaker = parentFolder.FindFirstChild("GraphMaker");
    if (existingGraphMaker) {
      existingGraphMaker.Destroy();
    }

    // Create GraphMaker folder
    const graphMakerFolder = new Instance("Folder");
    graphMakerFolder.Name = "GraphMaker";
    graphMakerFolder.Parent = parentFolder;

    // Create folder structure inside GraphMaker
    const clusterFolder = new Instance("Folder");
    clusterFolder.Name = "UnifiedDataCluster";
    clusterFolder.Parent = graphMakerFolder;
    
    const nodesFolder = new Instance("Folder");
    nodesFolder.Name = "Nodes";
    nodesFolder.Parent = clusterFolder;
    
    const linksFolder = new Instance("Folder");
    linksFolder.Name = "Links";
    linksFolder.Parent = clusterFolder;
    
    // Create hexagons for all nodes
    const nodeToHexagon = this.createHexagons(cluster, nodesFolder, config);
    
    // Create links/ropes for relationships
    createRopeConnectors({
      cluster,
      nodeToHexagon,
      linksFolder,
      visualization: config?.visualization,
      linkDiameter: config?.spacing?.linkDiameter
    });
    
    print(`📊 Created ${nodeToHexagon.size()} hexagons and ${cluster.relations.size()} connections`);
  }

  /**
   * Creates hexagons for all nodes in the cluster
   */
  private createHexagons(cluster: Cluster, nodesFolder: Folder, config?: EnhancedGeneratorConfig): Map<string, Model> {
    const nodeToHexagon = new Map<string, Model>();
    let hexIndex = 1;
    
    // Use spacing from config if provided, otherwise use defaults
    const spacing = config?.spacing || {
      nodeHeight: RENDERER_CONSTANTS.HEXAGON.HEIGHT,
      nodeRadius: RENDERER_CONSTANTS.HEXAGON.WIDTH / 2,
      layerSpacing: RENDERER_CONSTANTS.POSITIONING.LEVEL_SPACING,
      nodeSpacing: RENDERER_CONSTANTS.POSITIONING.COLUMN_SPACING,
      swimlaneSpacing: RENDERER_CONSTANTS.POSITIONING.COLUMN_SPACING
    };
    
    cluster.groups.forEach(group => {
      group.nodes.forEach(node => {
        const WIDTH = spacing.nodeRadius * 2; // Diameter from radius
        const HEIGHT = spacing.nodeHeight;
        
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
        
        // Extract layer and node index from uuid if available
        const layerMatch = node.uuid.match("node_(\d+)_(\d+)");
        if (layerMatch) {
          const layerNum = layerMatch[1];
          const nodeIdx = layerMatch[2];
          hexagon.Name = `Hexagon_L${layerNum}_N${nodeIdx}`;
        }
        
        hexagon.Parent = nodesFolder;
        nodeToHexagon.set(node.uuid, hexagon);
        hexIndex++;
      });
    });
    
    return nodeToHexagon;
  }

  /**
   * Performs incremental update of the graph
   */
  private performIncrementalUpdate(newConfig: EnhancedGeneratorConfig, nodesFolder: Folder, linksFolder: Folder, origin: Vector3): void {
    if (!this.currentConfig) return;
    
    // Build current state map of nodes by layer
    const currentNodesByLayer = new Map<number, Model[]>();
    nodesFolder.GetChildren().forEach(node => {
      if (node.IsA("Model")) {
        // Extract layer number from node name (e.g., "Hexagon_L1_N2")
        const match = node.Name.match("Hexagon_L(\d+)_N(\d+)");
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
      nodes.sort((a, b) => {
        const matchA = a.Name.match("Hexagon_L\d+_N(\d+)");
        const matchB = b.Name.match("Hexagon_L\d+_N(\d+)");
        const indexA = matchA ? tonumber(matchA[1]) || 0 : 0;
        const indexB = matchB ? tonumber(matchB[1]) || 0 : 0;
        return indexA < indexB;
      });
    });
    
    // Clear all existing connections (we'll rebuild them)
    linksFolder.ClearAllChildren();
    
    // Update layers
    const updatedNodeToHexagon = new Map<string, Model>();
    const allNodes: Node[] = [];
    const nodesByLayer = new Map<number, Node[]>();
    const newNodesToCreate: Node[] = []; // Track new nodes that need hexagons
    
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
            newNodesToCreate.push(node); // Mark for hexagon creation after positioning
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
    
    // Remove layers that no longer exist
    currentNodesByLayer.forEach((nodes, layerNum) => {
      if (layerNum > newConfig.layers.size()) {
        nodes.forEach(node => node.Destroy());
      }
    });
    
    // Create cluster for positioning
    const cluster: Cluster = {
      groups: [{
        id: "group_1",
        name: "Group1",
        nodes: allNodes
      }],
      relations: []
    };
    
    // Recalculate positions for all layers
    this.calculateLayerSwimLanePositions(cluster, newConfig);
    this.centerBottomAtOrigin(cluster, origin);
    
    // Create hexagons for new nodes now that they have positions
    newNodesToCreate.forEach(node => {
      const hexagon = this.createSingleHexagon(node, nodesFolder, newConfig);
      updatedNodeToHexagon.set(node.uuid, hexagon);
    });
    
    // Update hexagon positions by moving all parts manually to preserve anchoring
    allNodes.forEach(node => {
      const hexagon = updatedNodeToHexagon.get(node.uuid);
      if (hexagon && node.position) {
        const currentPos = hexagon.PrimaryPart?.Position || new Vector3(0, 0, 0);
        const targetPos = new Vector3(node.position.x, node.position.y, node.position.z);
        const offset = targetPos.sub(currentPos);
        
        print(`🔧 Updating hexagon ${hexagon.Name} position from (${currentPos.X}, ${currentPos.Y}, ${currentPos.Z}) to (${targetPos.X}, ${targetPos.Y}, ${targetPos.Z})`);
        
        // Move all parts manually to preserve anchoring
        hexagon.GetChildren().forEach(part => {
          if (part.IsA("BasePart")) {
            const oldPos = part.Position;
            part.Position = part.Position.add(offset);
            print(`  📍 Part ${part.Name}: Anchored=${part.Anchored}, Position (${oldPos.X}, ${oldPos.Y}, ${oldPos.Z}) -> (${part.Position.X}, ${part.Position.Y}, ${part.Position.Z})`);
          }
        });
      }
    });
    
    // Recreate connections based on new configuration
    const allLinks: Link[] = [];
    newConfig.layers.forEach((layer, layerIndex) => {
      const layerNum = layerIndex + 1;
      const currentLayerNodes = nodesByLayer.get(layerNum) || [];
      const nextLayerNodes = nodesByLayer.get(layerNum + 1);
      
      // Create intra-layer connections (only if allowed by visualization settings)
      const allowSameLevelLinks = newConfig.visualization?.allowSameLevelLinks ?? true;
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
            const linkTypeIndex = i % newConfig.numLinkTypes;
            const linkColor = COLOR_PALETTES.LINK_COLORS[linkTypeIndex % COLOR_PALETTES.LINK_COLORS.size()];
            
            allLinks.push({
              uuid: `link_${this.linkIdCounter++}`,
              type: `LinkType${linkTypeIndex}`,
              sourceNodeUuid: sourceNode.uuid,
              targetNodeUuid: targetNode.uuid,
              color: linkColor
            });
          }
        });
      }
      
      // Create inter-layer connections to next layer
      if (nextLayerNodes && nextLayerNodes.size() > 0) {
        currentLayerNodes.forEach(sourceNode => {
          const targetNode = nextLayerNodes[math.random(0, nextLayerNodes.size() - 1)];
          const linkTypeIndex = 0;
          const linkColor = COLOR_PALETTES.LINK_COLORS[linkTypeIndex % COLOR_PALETTES.LINK_COLORS.size()];
          
          allLinks.push({
            uuid: `link_${this.linkIdCounter++}`,
            type: `LinkType${linkTypeIndex}`,
            sourceNodeUuid: sourceNode.uuid,
            targetNodeUuid: targetNode.uuid,
            color: linkColor
          });
        });
      }
    });
    
    // Update cluster relations
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
      attachmentNames: ["top", "bottom", "left", "right", "front", "back"]
    };
    
    // Add level property for swim lane algorithm
    const nodeWithLevel = node as Node & { level: number };
    nodeWithLevel.level = layerNum;
    
    // Add nodeType property for compatibility
    const nodeWithType = node as Node & { nodeType: string };
    nodeWithType.nodeType = nodeTypeName;
    
    // Add animal type property if it's an Animals node
    if (nodeTypeName === "Animals") {
      const animalTypes = ["Dog", "Cat", "Bird", "Fish", "Horse", "Rabbit", "Snake", "Bear"];
      node.properties = { animalType: animalTypes[math.random(0, animalTypes.size() - 1)] };
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
      attachmentNames: ["top", "bottom", "left", "right", "front", "back"]
    };
    
    // Add level property for swim lane algorithm
    const nodeWithLevel = node as Node & { level: number };
    nodeWithLevel.level = layerNum;
    
    // Add nodeType property for compatibility
    const nodeWithType = node as Node & { nodeType: string };
    nodeWithType.nodeType = nodeTypeName;
    
    // Add animal type property if it's an Animals node
    if (nodeTypeName === "Animals") {
      const animalTypes = ["Dog", "Cat", "Bird", "Fish", "Horse", "Rabbit", "Snake", "Bear"];
      node.properties = { animalType: animalTypes[math.random(0, animalTypes.size() - 1)] };
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
    
    const WIDTH = spacing.nodeRadius * 2; // Diameter from radius
    const HEIGHT = spacing.nodeHeight;
    const layerNum = tonumber(node.uuid.match("node_(\d+)_")?.[1]) || 1;
    const nodeIndex = tonumber(node.uuid.match("node_\d+_(\d+)")?.[1]) || 1;
    
    const nodeWithType = node as Node & { nodeType?: string };
    const nodeType = nodeWithType.nodeType || node.type || "Unknown";
    
    const labels: string[] = [
      node.name,
      nodeType,
      ""  // typeNumber would go here if needed
    ];
    
    if (nodeType === "People" && node.properties?.age) {
      labels.push(`Age: ${node.properties.age}`);
    } else if (nodeType === "Animals" && node.properties?.animalType) {
      labels.push(node.properties.animalType);
    }
    
    const hexagon = makeHexagon({
      id: this.nodeIdCounter,
      centerPosition: [node.position.x, node.position.y, node.position.z],
      width: WIDTH,
      height: HEIGHT,
      barProps: {
        Color: node.color
      },
      labels: labels,
      stackIndex: 1,
      hexIndex: this.nodeIdCounter,
      guid: node.uuid
    });
    
    // Set name to match pattern for layer tracking
    hexagon.Name = `Hexagon_L${layerNum}_N${nodeIndex}`;
    hexagon.Parent = nodesFolder;
    return hexagon;
  }
}