import { SimpleDataGeneratorService } from "../../services/dataGenerator/simpleDataGenerator.service";
import { makeHexagon } from "../hexagonMaker";
import { Cluster, Node } from "../../interfaces/simpleDataGenerator.interface";
import { RENDERER_CONSTANTS } from "./dataGeneratorRobloxRendererUtils/constants";
import { calculateSwimLanePositions } from "./dataGeneratorRobloxRendererUtils/positioning";
import { createRopeConnectors } from "./dataGeneratorRobloxRendererUtils/ropeCreator";
import { generateDrawIoDiagram } from "./dataGeneratorRobloxRendererUtils/drawIoGenerator";

export class DataGeneratorRobloxRenderer {
  private dataGenerator = new SimpleDataGeneratorService();
  
  /**
   * Generates data using the actual data generator service and renders it in Roblox
   * with proper swim lane positioning
   */
  public renderGeneratedData(parentFolder: Folder, config?: {
    numLevel1Nodes?: number;
    numLevel2Nodes?: number;
    numLevel3Nodes?: number;
    childrenPerNode?: number;
    numNodeTypes?: number;
    numLinkTypes?: number;
  }): void {
    print("🎯 Generating data with real data generator service...");
    
    // Generate the data
    const cluster = this.dataGenerator.generateCluster(config);
    
    // Calculate positions for all nodes
    calculateSwimLanePositions(cluster);
    
    // Render the cluster
    this.renderCluster(cluster, parentFolder);
    
    // Print summary
    this.dataGenerator.printClusterSummary(cluster);
  }
  
  /**
   * Renders the cluster with positioned nodes
   */
  private renderCluster(cluster: Cluster, parentFolder: Folder): void {
    // Create folder structure
    const clusterFolder = new Instance("Folder");
    clusterFolder.Name = "GeneratedDataCluster";
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
    
    print("✅ Data generation and rendering complete!");
    print(`📊 Created ${nodeToHexagon.size()} hexagons and ${cluster.relations.size()} connections`);
    
    // Generate draw.io diagram for visualization
    generateDrawIoDiagram(cluster);
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