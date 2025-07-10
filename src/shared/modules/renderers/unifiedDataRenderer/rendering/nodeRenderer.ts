/**
 * Node Renderer for Unified Data Renderer
 * 
 * Handles creation and rendering of hexagon nodes
 */

import { Cluster, Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { INodeRenderer, SpacingConfig } from "../interfaces";

import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { RENDERER_CONSTANTS } from "../../dataGeneratorRobloxRendererUtils/constants";
import { createRopeConnectors } from "../../dataGeneratorRobloxRendererUtils/ropeCreator";
import { getNodeBackgroundColor } from "../utils/colorMapper";
import { makeHexagon } from "../../../hexagonMaker";

export class NodeRenderer implements INodeRenderer {
  /**
   * Renders the cluster with positioned nodes
   */
  public renderCluster(cluster: Cluster, parentFolder: Folder, config?: EnhancedGeneratorConfig): void {
    
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
    
    // Create hexagons for all nodes if showNodes is true
    const showNodes = config?.visualization?.showNodes !== false; // Default to true
    const nodeToHexagon = showNodes 
      ? this.createHexagons(cluster, nodesFolder, config)
      : new Map<string, Model>();
    
    // Create links/ropes for relationships only if nodes are shown and connectors are enabled
    if (showNodes && config?.visualization?.showConnectors !== false) {
      createRopeConnectors({
        cluster,
        nodeToHexagon,
        linksFolder,
        visualization: config?.visualization,
        linkDiameter: config?.spacing?.linkDiameter
      });
    }
    
  }

  /**
   * Creates hexagons for all nodes in the cluster
   */
  public createHexagons(cluster: Cluster, nodesFolder: Folder, config?: EnhancedGeneratorConfig): Map<string, Model> {
    const nodeToHexagon = new Map<string, Model>();
    let hexIndex = 1;
    
    // Use spacing from config if provided, otherwise use defaults
    const spacing = this.getSpacingConfig(config);
    
    cluster.groups.forEach(group => {
      group.nodes.forEach(node => {
        const hexagon = this.createSingleHexagon(node, hexIndex, spacing, config);
        hexagon.Parent = nodesFolder;
        nodeToHexagon.set(node.uuid, hexagon);
        hexIndex++;
      });
    });
    
    return nodeToHexagon;
  }

  /**
   * Create a single hexagon for a node
   */
  private createSingleHexagon(node: Node, hexIndex: number, spacing: SpacingConfig, config?: EnhancedGeneratorConfig): Model {
    const WIDTH = spacing.nodeRadius * 2; // Diameter from radius
    const HEIGHT = spacing.nodeHeight;
    
    const labels = this.createNodeLabels(node);
    
    // Get colors based on visual mapping
    const backgroundColor = getNodeBackgroundColor(node, config?.visualMapping);
    // const borderColor = getNodeBorderColor(node, config?.visualMapping); // Not used in standardized version
    
    const hexagon = makeHexagon({
      id: hexIndex,
      position: new Vector3(node.position.x, node.position.y, node.position.z),
      width: WIDTH,
      height: HEIGHT,
      barColor: backgroundColor,
      barMaterial: Enum.Material.SmoothPlastic, // Performance optimization
      castShadow: false, // Performance optimization
      labels: labels,
      stackIndex: 1,
      hexIndex: hexIndex,
      guid: node.uuid
    });
    
    // Set hexagon name based on UUID pattern
    this.setHexagonName(hexagon, node.uuid);
    
    // Store node properties as attributes for the inspector
    hexagon.SetAttribute("nodeName", node.name);
    hexagon.SetAttribute("nodeType", node.type);
    
    // Dynamically store all properties as attributes
    if (node.properties) {
      for (const [key, value] of pairs(node.properties)) {
        if (value !== undefined) {
          // Convert value to appropriate type for SetAttribute
          if (typeIs(value, "string") || typeIs(value, "number") || typeIs(value, "boolean")) {
            hexagon.SetAttribute(key as string, value);
          } else {
            // For complex types, convert to string
            hexagon.SetAttribute(key as string, tostring(value));
          }
        }
      }
    }
    
    return hexagon;
  }

  /**
   * Create labels for a node
   */
  private createNodeLabels(node: Node): string[] {
    // For person nodes, use full name if available
    const isPersonNode = ["man", "woman", "child", "grandparent"].includes(node.type);
    const fullName = isPersonNode && node.properties?.firstName && node.properties?.lastName
      ? `${node.properties.firstName} ${node.properties.lastName}`
      : node.name;
    
    const labels: string[] = [
      fullName,
      node.type,
      (node as Node & { typeNumber?: string }).typeNumber || ""
    ];
    
    // Add type-specific properties
    if (isPersonNode && node.properties?.age) {
      labels.push(`Age: ${node.properties.age}`);
    } else if (node.type === "Animals" && node.properties?.animalType) {
      labels.push(node.properties.animalType);
    }
    
    return labels;
  }

  /**
   * Set hexagon name based on UUID pattern
   */
  private setHexagonName(hexagon: Model, uuid: string): void {
    // Extract layer and node index from uuid if available
    const layerMatch = uuid.match("node_(\\d+)_(\\d+)");
    if (layerMatch) {
      const layerNum = layerMatch[1];
      const nodeIdx = layerMatch[2];
      hexagon.Name = `Hexagon_L${layerNum}_N${nodeIdx}`;
    } else {
      hexagon.Name = `Hexagon_${uuid}`;
    }
  }

  /**
   * Get spacing configuration
   */
  private getSpacingConfig(config?: EnhancedGeneratorConfig): SpacingConfig {
    return config?.spacing || {
      nodeHeight: RENDERER_CONSTANTS.HEXAGON.HEIGHT,
      nodeRadius: RENDERER_CONSTANTS.HEXAGON.WIDTH / 2,
      layerSpacing: RENDERER_CONSTANTS.POSITIONING.LEVEL_SPACING,
      nodeSpacing: RENDERER_CONSTANTS.POSITIONING.COLUMN_SPACING,
      swimlaneSpacing: RENDERER_CONSTANTS.POSITIONING.COLUMN_SPACING
    };
  }
}