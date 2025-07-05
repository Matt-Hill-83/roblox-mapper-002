import { Cluster, Node, Link } from "../../shared/interfaces/simpleDataGenerator.interface";
import { makeHexagon } from "../../shared/modules/hexagonMaker";

export class SimpleDataRendererService {
  
  private nodeModels = new Map<string, Model>();  // UUID to Model mapping
  
  /**
   * Renders a complete cluster in 3D space
   */
  public renderCluster(cluster: Cluster, parentFolder: Folder): void {
    print(`🎨 Rendering cluster with ${cluster.groups.size()} groups...`);
    
    // Create folder structure
    const clusterFolder = new Instance("Folder");
    clusterFolder.Name = "GeneratedCluster";
    clusterFolder.Parent = parentFolder;
    
    const nodesFolder = new Instance("Folder");
    nodesFolder.Name = "Nodes";
    nodesFolder.Parent = clusterFolder;
    
    const linksFolder = new Instance("Folder");
    linksFolder.Name = "Links";
    linksFolder.Parent = clusterFolder;
    
    // Render all nodes
    let hexIndex = 1;
    cluster.groups.forEach(group => {
      group.nodes.forEach(node => {
        const hexagon = this.renderNode(node, hexIndex++);
        hexagon.Parent = nodesFolder;
        this.nodeModels.set(node.uuid, hexagon);
      });
    });
    
    // Wait for all nodes to be created
    wait(0.1);
    
    // Render all links
    cluster.relations.forEach(link => {
      this.renderLink(link, linksFolder);
    });
    
    print(`✅ Cluster rendering complete!`);
  }
  
  /**
   * Renders a single node as a hexagon
   */
  private renderNode(node: Node, hexIndex: number): Model {
    // Determine size based on node type
    const width = node.type === "People" ? 10 : 8;
    const height = node.type === "People" ? 2 : 1.5;
    
    // Create labels
    const labels: string[] = [
      node.name,
      node.type
    ];
    
    // Add type-specific info
    if (node.type === "People" && node.properties?.age) {
      labels.push(`Age: ${node.properties.age}`);
    } else if (node.type === "Animals" && node.properties?.animalType) {
      labels.push(node.properties.animalType);
    }
    
    // Create hexagon
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
    
    // Add node type indicator
    const typeIndicator = new Instance("StringValue");
    typeIndicator.Name = "NodeType";
    typeIndicator.Value = node.type;
    typeIndicator.Parent = hexagon;
    
    // Add UUID for easy lookup
    const uuidValue = new Instance("StringValue");
    uuidValue.Name = "UUID";
    uuidValue.Value = node.uuid;
    uuidValue.Parent = hexagon;
    
    return hexagon;
  }
  
  /**
   * Renders a link between two nodes
   */
  private renderLink(link: Link, parentFolder: Folder): void {
    const sourceModel = this.nodeModels.get(link.sourceNodeUuid);
    const targetModel = this.nodeModels.get(link.targetNodeUuid);
    
    if (!sourceModel || !targetModel) {
      warn(`Could not find models for link ${link.uuid}: ${link.sourceNodeUuid} -> ${link.targetNodeUuid}`);
      return;
    }
    
    // Find center attachments on both models
    const sourceAttachment = this.findCenterAttachment(sourceModel);
    const targetAttachment = this.findCenterAttachment(targetModel);
    
    if (!sourceAttachment || !targetAttachment) {
      warn(`Could not find attachments for link ${link.uuid}`);
      return;
    }
    
    // Create rope constraint for the link
    const rope = new Instance("RopeConstraint");
    rope.Name = `${link.type}_${link.uuid}`;
    rope.Attachment0 = sourceAttachment;
    rope.Attachment1 = targetAttachment;
    rope.Visible = true;
    rope.Thickness = 0.5;
    
    // Set color based on link type
    const colorValue = Color3.fromRGB(
      link.color[0] * 255,
      link.color[1] * 255,
      link.color[2] * 255
    );
    rope.Color = new BrickColor(colorValue);
    
    rope.Parent = parentFolder;
    
    // Add link type indicator
    const linkType = new Instance("StringValue");
    linkType.Name = "LinkType";
    linkType.Value = link.type;
    linkType.Parent = rope;
  }
  
  /**
   * Finds the center attachment on a hexagon model
   */
  private findCenterAttachment(model: Model): Attachment | undefined {
    // Look for attachment with specific pattern from hexagonMaker
    let centerAttachment: Attachment | undefined;
    
    model.GetDescendants().forEach(descendant => {
      if (descendant.IsA("Attachment")) {
        // The center attachment in a hexagon is typically att000
        if (descendant.Name.match("att000") || descendant.Name.match("att007")) {
          centerAttachment = descendant;
        }
      }
    });
    
    // If no center attachment found, use first available
    if (!centerAttachment) {
      model.GetDescendants().forEach(descendant => {
        if (descendant.IsA("Attachment") && !centerAttachment) {
          centerAttachment = descendant;
        }
      });
    }
    
    return centerAttachment;
  }
  
}