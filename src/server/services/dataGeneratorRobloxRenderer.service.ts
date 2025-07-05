import { SimpleDataGeneratorService } from "./dataGenerator/simpleDataGenerator.service";
import { makeHexagon } from "../../shared/modules/hexagonMaker";
import { Cluster, Node } from "../../shared/interfaces/simpleDataGenerator.interface";
import { RopeLabelService } from "../../shared/modules/ropeLabelService";

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
    const LEVEL_SPACING = 5;    // 5 studs between levels vertically
    const BASE_Y = 20;          // Start 20 studs above ground in the up/down axis
    
    // Organize nodes by level
    const nodesByLevel = new Map<number, Node[]>();
    nodesByLevel.set(1, []);
    nodesByLevel.set(2, []);
    nodesByLevel.set(3, []);
    
    // Use the actual level information from each node
    cluster.groups.forEach(group => {
      group.nodes.forEach((node) => {
        const nodeWithLevel = node as Node & { level?: number };
        const level = nodeWithLevel.level || 1; // Default to level 1 if not set
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
          
          // Find max nodes of this type across all levels for centering
          let maxNodesForType = 0;
          for (let checkLevel = 1; checkLevel <= 3; checkLevel++) {
            const checkKey = `${nodeType}-${checkLevel}`;
            const checkNodes = nodesByTypeAndLevel.get(checkKey) || [];
            maxNodesForType = math.max(maxNodesForType, checkNodes.size());
          }
          
          // Calculate centering offset
          const laneWidth = maxNodesForType * COLUMN_SPACING;
          const nodesWidth = nodes.size() * COLUMN_SPACING;
          const centeringOffset = (laneWidth - nodesWidth) / 2;
          
          const x = baseX + centeringOffset + index * COLUMN_SPACING;
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
    let ropeIndex = 1;
    cluster.relations.forEach(link => {
      const sourceHex = nodeToHexagon.get(link.sourceNodeUuid);
      const targetHex = nodeToHexagon.get(link.targetNodeUuid);
      
      if (sourceHex && targetHex) {
        // Find center attachments - first try the expected pattern, then any att000 attachment
        let sourceAttachment = this.findAttachmentRecursive(sourceHex, `att000-${sourceHex.Name}`);
        if (!sourceAttachment) {
          // Find any attachment starting with att000
          for (const desc of sourceHex.GetDescendants()) {
            if (desc.IsA("Attachment") && desc.Name.sub(1, 6) === "att000") {
              sourceAttachment = desc as Attachment;
              break;
            }
          }
        }
        
        let targetAttachment = this.findAttachmentRecursive(targetHex, `att000-${targetHex.Name}`);
        if (!targetAttachment) {
          // Find any attachment starting with att000
          for (const desc of targetHex.GetDescendants()) {
            if (desc.IsA("Attachment") && desc.Name.sub(1, 6) === "att000") {
              targetAttachment = desc as Attachment;
              break;
            }
          }
        }
        
        if (sourceAttachment && targetAttachment) {
          // Create a rope constraint
          const rope = new Instance("RopeConstraint");
          rope.Name = `rope${this.padNumber(ropeIndex, 3)}-${link.type.lower()}-${sourceHex.Name}-to-${targetHex.Name}`;
          rope.Attachment0 = sourceAttachment;
          rope.Attachment1 = targetAttachment;
          // Set rope length to exact distance (no sag)
          rope.Length = sourceAttachment.WorldPosition.sub(targetAttachment.WorldPosition).Magnitude;
          rope.Visible = true;
          rope.Color = this.getLinkBrickColor(link.type);
          rope.Thickness = 0.4;
          
          // Parent the rope to the target's center cube
          let targetCenterCube = targetHex.FindFirstChild("center");
          if (!targetCenterCube) {
            const children = targetHex.GetChildren();
            for (const child of children) {
              if (child.IsA("Part") && child.Name.find("centerCube-") !== undefined) {
                targetCenterCube = child;
                break;
              }
            }
          }
          rope.Parent = targetCenterCube || linksFolder;
          
          // Create rope label
          const ropeLabelService = RopeLabelService.getInstance();
          const relationName = `${this.getNodeName(sourceHex)}_${link.type}_${this.getNodeName(targetHex)}`;
          
          // Find the center cube of the target hexagon to parent the label to
          let labelParent: Instance = linksFolder; // fallback
          if (targetCenterCube) {
            labelParent = targetCenterCube;
          } else {
            // Try to find center cube in source hexagon as fallback
            let sourceCenterCube = sourceHex.FindFirstChild("center");
            if (!sourceCenterCube) {
              const sourceChildren = sourceHex.GetChildren();
              for (const child of sourceChildren) {
                if (child.IsA("Part") && child.Name.find("centerCube-") !== undefined) {
                  sourceCenterCube = child;
                  break;
                }
              }
            }
            if (sourceCenterCube) {
              labelParent = sourceCenterCube;
            }
          }
          
          ropeLabelService.createLabel(
            ropeIndex,
            link.type,
            sourceAttachment,
            targetAttachment,
            labelParent,  // Parent to center cube of one of the hexagons
            relationName
          );
          
          ropeIndex++;
        }
      }
    });
    
    print("✅ Data generation and rendering complete!");
    print(`📊 Created ${nodeToHexagon.size()} hexagons and ${cluster.relations.size()} connections`);
    
    // Generate draw.io diagram for visualization
    this.generateDrawIoDiagram(cluster);
  }
  
  /**
   * Find attachment recursively in a model
   */
  private findAttachmentRecursive(model: Instance, attachmentName: string): Attachment | undefined {
    for (const desc of model.GetDescendants()) {
      if (desc.IsA("Attachment") && desc.Name === attachmentName) {
        return desc as Attachment;
      }
    }
    return undefined;
  }
  
  /**
   * Pad number with leading zeros
   */
  private padNumber(num: number, length: number): string {
    const str = tostring(num);
    let result = str;
    while (result.size() < length) {
      result = "0" + result;
    }
    return result;
  }
  
  /**
   * Get BrickColor for link type
   */
  private getLinkBrickColor(linkType: string): BrickColor {
    const linkColors: Record<string, BrickColor> = {
      "Parent-Child": new BrickColor("Black"),
      "Owns": new BrickColor("Brown"),
      "Wants": new BrickColor("Bright violet"),
      "Eats": new BrickColor("Bright yellow"),
      "Link4": new BrickColor("Cyan"),
      "Link5": new BrickColor("Bright red"),
      "Link6": new BrickColor("Bright violet"),
      "Link7": new BrickColor("Brown"),
      "Link8": new BrickColor("Medium stone grey"),
      "Link9": new BrickColor("Bright orange"),
      "Link10": new BrickColor("Light blue")
    };
    return linkColors[linkType] || new BrickColor("Bright red");
  }
  
  /**
   * Get node name from hexagon model for label creation
   */
  private getNodeName(hexagon: Model): string {
    // Try to find a text label inside the hexagon that contains the node name
    const textLabels = hexagon.GetDescendants().filter(desc => 
      desc.IsA("TextLabel") || desc.IsA("BillboardGui")
    );
    
    if (textLabels.size() > 0) {
      const firstLabel = textLabels[0];
      if (firstLabel.IsA("TextLabel")) {
        return firstLabel.Text;
      } else if (firstLabel.IsA("BillboardGui")) {
        const textLabel = firstLabel.FindFirstChildOfClass("TextLabel");
        if (textLabel) {
          return textLabel.Text;
        }
      }
    }
    
    // Fallback to hexagon name
    return hexagon.Name;
  }
  
  /**
   * Generate draw.io diagram XML for visualization
   */
  private generateDrawIoDiagram(cluster: Cluster): void {
    print("📊 Generating draw.io diagram...");
    
    // Create timestamp for filename
    const dateTable = os.date("*t");
    const timestamp = string.format("%04d-%02d-%02d_%02d-%02d-%02d", 
      dateTable.year, dateTable.month, dateTable.day, 
      dateTable.hour, dateTable.min, dateTable.sec);
    const filename = `data-generator-diagram-${timestamp}.drawio`;
    
    // Build XML content
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${os.date("%Y-%m-%d")}" agent="DataGeneratorRobloxRenderer" version="21.1.2">
  <diagram name="Generated Data" id="generated-data">
    <mxGraphModel dx="1434" dy="823" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2400" pageHeight="1600" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
`;
    
    // Track node IDs for connections
    const nodeIdMap = new Map<string, number>();
    let cellId = 2;
    
    // Draw nodes
    cluster.groups.forEach(group => {
      group.nodes.forEach(node => {
        const nodeWithLevel = node as Node & { level?: number; typeNumber?: string };
        
        // Scale positions for draw.io (multiply by 10 for better visibility)
        const x = node.position.x * 10;
        const y = 400 - (node.position.y * 10); // Invert Y and double the scale factor from 5 to 10
        
        // Node color
        const fillColor = node.type === "People" ? "#4A90E2" : "#F5A623";
        
        // Create node cell
        xml += `        <mxCell id="${cellId}" value="${node.name}\\n${node.type}\\n${nodeWithLevel.typeNumber || ""}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${fillColor};strokeColor=#000000;fontColor=#FFFFFF;" vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}" width="120" height="60" as="geometry" />
        </mxCell>\n`;
        
        nodeIdMap.set(node.uuid, cellId);
        cellId++;
      });
    });
    
    // Draw connections
    cluster.relations.forEach(relation => {
      const sourceId = nodeIdMap.get(relation.sourceNodeUuid);
      const targetId = nodeIdMap.get(relation.targetNodeUuid);
      
      if (sourceId && targetId) {
        const edgeColor = this.getDrawIoEdgeColor(relation.type);
        
        xml += `        <mxCell id="${cellId}" value="${relation.type}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${edgeColor};strokeWidth=2;" edge="1" parent="1" source="${sourceId}" target="${targetId}">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>\n`;
        
        cellId++;
      }
    });
    
    xml += `      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
    
    // Write to file
    const outputPath = `output/${filename}`;
    print(`💾 Writing draw.io diagram to: ${outputPath}`);
    print(`📝 Diagram contains ${cluster.groups[0].nodes.size()} nodes and ${cluster.relations.size()} connections`);
    
    // Note: In Roblox, we can't directly write files. 
    // You would need to either:
    // 1. Use HttpService to POST this to a server
    // 2. Print it to console for manual copying
    // 3. Store it in a StringValue for retrieval
    
    // For now, let's store it in a StringValue in workspace
    let drawIoStorage = game.Workspace.FindFirstChild("DrawIoDiagrams") as Folder;
    if (!drawIoStorage) {
      drawIoStorage = new Instance("Folder");
      drawIoStorage.Name = "DrawIoDiagrams";
      drawIoStorage.Parent = game.Workspace;
    }
    
    const xmlValue = new Instance("StringValue");
    xmlValue.Name = filename;
    xmlValue.Value = xml;
    xmlValue.Parent = drawIoStorage;
    
    print(`✅ Draw.io diagram stored in Workspace.DrawIoDiagrams.${filename}`);
  }
  
  /**
   * Get edge color for draw.io based on link type
   */
  private getDrawIoEdgeColor(linkType: string): string {
    const edgeColors: Record<string, string> = {
      "Parent-Child": "#000000",
      "Owns": "#8B4513",
      "Wants": "#9370DB",
      "Eats": "#FFD700",
      "Link4": "#00FFFF",
      "Link5": "#FF0000",
      "Link6": "#9370DB",
      "Link7": "#8B4513",
      "Link8": "#808080",
      "Link9": "#FFA500",
      "Link10": "#ADD8E6"
    };
    return edgeColors[linkType] || "#FF0000";
  }
}