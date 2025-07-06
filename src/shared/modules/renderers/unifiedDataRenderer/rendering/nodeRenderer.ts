/**
 * Node Renderer for Unified Data Renderer
 * 
 * Handles creation and rendering of hexagon nodes
 */

import { Cluster, Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import { INodeRenderer, SpacingConfig } from "../interfaces";
import { makeHexagon } from "../../../hexagonMaker";
import { createRopeConnectors } from "../../dataGeneratorRobloxRendererUtils/ropeCreator";
import { RENDERER_CONSTANTS } from "../../dataGeneratorRobloxRendererUtils/constants";

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
  public createHexagons(cluster: Cluster, nodesFolder: Folder, config?: EnhancedGeneratorConfig): Map<string, Model> {
    const nodeToHexagon = new Map<string, Model>();
    let hexIndex = 1;
    
    // Use spacing from config if provided, otherwise use defaults
    const spacing = this.getSpacingConfig(config);
    
    cluster.groups.forEach(group => {
      group.nodes.forEach(node => {
        const hexagon = this.createSingleHexagon(node, hexIndex, spacing);
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
  private createSingleHexagon(node: Node, hexIndex: number, spacing: SpacingConfig): Model {
    const WIDTH = spacing.nodeRadius * 2; // Diameter from radius
    const HEIGHT = spacing.nodeHeight;
    
    const labels = this.createNodeLabels(node);
    
    const hexagon = makeHexagon({
      id: hexIndex,
      centerPosition: [node.position.x, node.position.y, node.position.z],
      width: WIDTH,
      height: HEIGHT,
      barProps: {
        Color: node.color,
        Material: Enum.Material.SmoothPlastic, // Performance optimization
        CastShadow: false // Performance optimization
      },
      labels: labels,
      stackIndex: 1,
      hexIndex: hexIndex,
      guid: node.uuid
    });
    
    // Set hexagon name based on UUID pattern
    this.setHexagonName(hexagon, node.uuid);
    
    return hexagon;
  }

  /**
   * Create labels for a node
   */
  private createNodeLabels(node: Node): string[] {
    const labels: string[] = [
      node.name,
      node.type,
      (node as Node & { typeNumber?: string }).typeNumber || ""
    ];
    
    // Add type-specific properties
    if (node.type === "People" && node.properties?.age) {
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