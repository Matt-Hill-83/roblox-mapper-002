import { SimpleDataGeneratorService } from "./dataGenerator/simpleDataGenerator.service";
import { makeHexagon } from "../../shared/modules/hexagonMaker";
import { makeLabelBlock } from "../../shared/modules/labelBlockMaker";
import { Cluster, Node } from "../../shared/interfaces/simpleDataGenerator.interface";
import { RENDERER_CONSTANTS } from "./dataGeneratorRobloxRenderer/constants";
import { calculateSwimLanePositions } from "./dataGeneratorRobloxRenderer/positioning";
import { createRopeConnectors } from "./dataGeneratorRobloxRenderer/ropeCreator";
import { generateDrawIoDiagram } from "./dataGeneratorRobloxRenderer/drawIoGenerator";

export class DataGeneratorRobloxRendererService {
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
    
    // Add orientation reference block
    this.createOrientationReferenceBlock(clusterFolder);
    
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
  
  /**
   * Creates an orientation reference block to help understand the 3D space
   */
  private createOrientationReferenceBlock(parentFolder: Folder): void {
    const referenceFolder = new Instance("Folder");
    referenceFolder.Name = "OrientationReference";
    referenceFolder.Parent = parentFolder;
    
    // Position it above and to the side of the main structure
    const referencePosition = {
      x: -20, // To the left
      y: RENDERER_CONSTANTS.POSITIONING.BASE_Y + 20, // Above the structure
      z: -20  // Forward
    };
    
    makeLabelBlock({
      id: "orientation-ref",
      position: referencePosition,
      props: {
        Size: 10,
        Color: [0.3, 0.3, 0.3], // Dark gray
        Transparency: 0.2
      },
      labels: {
        front: { 
          text: "FRONT",
          textColor: new Color3(0, 0, 1), // Blue
          backgroundColor: new Color3(0.2, 0.2, 0.6), // Dark blue background
          borderColor: new Color3(0.4, 0.4, 0.8) // Light blue border
        },
        back: { 
          text: "BACK",
          textColor: new Color3(0, 0, 1), // Blue
          backgroundColor: new Color3(0.2, 0.2, 0.6), // Dark blue background
          borderColor: new Color3(0.4, 0.4, 0.8) // Light blue border
        },
        left: { 
          text: "LEFT",
          textColor: new Color3(1, 0, 0), // Red
          backgroundColor: new Color3(0.6, 0.2, 0.2), // Dark red background
          borderColor: new Color3(0.8, 0.4, 0.4) // Light red border
        },
        right: { 
          text: "RIGHT",
          textColor: new Color3(1, 0, 0), // Red
          backgroundColor: new Color3(0.6, 0.2, 0.2), // Dark red background
          borderColor: new Color3(0.8, 0.4, 0.4) // Light red border
        },
        top: { 
          text: "TOP",
          textColor: new Color3(0, 1, 0), // Green
          backgroundColor: new Color3(0.2, 0.6, 0.2), // Dark green background
          borderColor: new Color3(0.4, 0.8, 0.4) // Light green border
        },
        bottom: { 
          text: "BOTTOM",
          textColor: new Color3(0, 1, 0), // Green
          backgroundColor: new Color3(0.2, 0.6, 0.2), // Dark green background
          borderColor: new Color3(0.4, 0.8, 0.4) // Light green border
        }
      },
      textBoxOverrides: {
        textSize: 100, // Maximum font size in Roblox
        font: Enum.Font.SourceSansBold,
        borderSizePixel: 5 // Make borders more visible
      },
      parent: referenceFolder
    });
    
    print("🧭 Created orientation reference block");
  }
}