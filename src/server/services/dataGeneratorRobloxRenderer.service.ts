import { SimpleDataGeneratorService } from "./dataGenerator/simpleDataGenerator.service";
import { makeHexagon } from "../../shared/modules/hexagonMaker";
import { Cluster, Node } from "../../shared/interfaces/simpleDataGenerator.interface";

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
    this.calculateSwimLanePositions(cluster);
    
    // Render the cluster
    this.renderCluster(cluster, parentFolder);
    
    // Print summary
    this.dataGenerator.printClusterSummary(cluster);
  }
  
  /**
   * Calculates swim lane positions for all nodes in the cluster
   * Based on the JavaScript test data generator positioning logic
   */
  private calculateSwimLanePositions(cluster: Cluster): void {
    // Constants for positioning - reasonable for Roblox viewing
    const COLUMN_SPACING = 10;  // 10 studs between columns (hexagons are 8 wide)
    const LEVEL_SPACING = 15;   // 15 studs between levels vertically
    const BASE_Y = 10;          // Start 10 studs above ground
    
    // Organize nodes by level
    const nodesByLevel = new Map<number, Node[]>();
    nodesByLevel.set(1, []);
    nodesByLevel.set(2, []);
    nodesByLevel.set(3, []);
    
    // Determine level for each node based on its position in the array
    // This is temporary - in production we'd track level properly
    cluster.groups.forEach(group => {
      group.nodes.forEach((node, index) => {
        let level: number;
        if (index < 10) {
          level = 1;  // First 10 nodes are level 1
        } else if (index < 60) {
          level = 2;  // Next 50 nodes are level 2
        } else {
          level = 3;  // Rest are level 3
        }
        nodesByLevel.get(level)!.push(node);
      });
    });
    
    // Group nodes by type across all levels
    const typeCounters = new Map<string, number>();
    const nodesByTypeAndLevel = new Map<string, Node[]>();
    
    // First pass: organize nodes by type and level, count totals
    for (const [level, nodes] of nodesByLevel) {
      for (const node of nodes) {
        const key = `${node.type}-${level}`;
        if (!nodesByTypeAndLevel.has(key)) {
          nodesByTypeAndLevel.set(key, []);
        }
        nodesByTypeAndLevel.get(key)!.push(node);
        
        // Track total count per type
        typeCounters.set(node.type, (typeCounters.get(node.type) || 0) + 1);
      }
    }
    
    // Sort nodes within each type-level group alphabetically
    for (const [_, nodes] of nodesByTypeAndLevel) {
      // Manual sort implementation for Lua compatibility
      for (let i = 0; i < nodes.size() - 1; i++) {
        for (let j = i + 1; j < nodes.size(); j++) {
          if (nodes[i].name > nodes[j].name) {
            const temp = nodes[i];
            nodes[i] = nodes[j];
            nodes[j] = temp;
          }
        }
      }
    }
    
    // Calculate type columns (sorted by count, descending)
    const sortedTypes: string[] = [];
    typeCounters.forEach((_, nodeType) => {
      sortedTypes.push(nodeType);
    });
    // Manual sort for Lua compatibility
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
    
    // Assign positions
    let typeXOffset = 0;
    const typeXPositions = new Map<string, number>();
    
    for (const nodeType of sortedTypes) {
      typeXPositions.set(nodeType, typeXOffset);
      
      // Find max nodes of this type in any level
      let maxNodesInLevel = 0;
      for (let level = 1; level <= 3; level++) {
        const key = `${nodeType}-${level}`;
        const nodes = nodesByTypeAndLevel.get(key) || [];
        maxNodesInLevel = math.max(maxNodesInLevel, nodes.size());
      }
      
      // Move to next type column
      typeXOffset += maxNodesInLevel * COLUMN_SPACING;
      const typeIndex = sortedTypes.indexOf(nodeType);
      if (typeIndex !== -1 && typeIndex < sortedTypes.size() - 1) {
        typeXOffset += COLUMN_SPACING; // Extra gap between types
      }
    }
    
    // Assign positions to each node
    const typeNodeCounters = new Map<string, number>();
    for (const nodeType of sortedTypes) {
      typeNodeCounters.set(nodeType, 0);
    }
    
    for (let level = 1; level <= 3; level++) {
      const levelY = BASE_Y + (3 - level) * LEVEL_SPACING;  // Level 1 at top, level 3 at bottom
      
      for (const nodeType of sortedTypes) {
        const key = `${nodeType}-${level}`;
        const nodes = nodesByTypeAndLevel.get(key) || [];
        
        nodes.forEach((node, index) => {
          const baseX = typeXPositions.get(nodeType)!;
          const x = baseX + index * COLUMN_SPACING;
          const z = 0;  // Depth, can be adjusted later
          
          // Update node position
          node.position = { x, y: levelY, z };
          
          // Add type number for labeling
          const typeCounter = typeNodeCounters.get(nodeType)! + 1;
          typeNodeCounters.set(nodeType, typeCounter);
          // Add typeNumber property to node for display
          const paddedNumber = typeCounter < 10 ? `0${typeCounter}` : `${typeCounter}`;
          const nodeWithType = node as Node & { typeNumber?: string };
          nodeWithType.typeNumber = `${nodeType.lower()}${paddedNumber}`;
        });
      }
    }
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
    let hexIndex = 1;
    const nodeToHexagon = new Map<string, Model>();
    
    cluster.groups.forEach(group => {
      group.nodes.forEach(node => {
        const width = 8;
        const height = 1.5;
        
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
          width: width,
          height: height,
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
    
    // Create links/ropes for relationships
    cluster.relations.forEach(link => {
      const sourceHex = nodeToHexagon.get(link.sourceNodeUuid);
      const targetHex = nodeToHexagon.get(link.targetNodeUuid);
      
      if (sourceHex && targetHex) {
        // Find attachment points on hexagons
        const sourceAttachment = sourceHex.FindFirstChild("Attachment", true) as Attachment;
        const targetAttachment = targetHex.FindFirstChild("Attachment", true) as Attachment;
        
        if (sourceAttachment && targetAttachment) {
          // Create a rope constraint
          const rope = new Instance("RopeConstraint");
          rope.Name = `${link.type}_${link.uuid}`;
          rope.Attachment0 = sourceAttachment;
          rope.Attachment1 = targetAttachment;
          rope.Visible = true;
          rope.Color = new BrickColor(new Color3(link.color[0], link.color[1], link.color[2]));
          rope.Thickness = 0.2;
          rope.Parent = linksFolder;
        }
      }
    });
    
    print("✅ Data generation and rendering complete!");
  }
}