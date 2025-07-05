import { simpleEntityData } from "./simpleGraphData.service";
import { makeHexagon } from "../../shared/modules/hexagonMaker";

export class SimpleGraphService {

  public createSimpleGraph(myStuffFolder: Folder): void {
    print("📊 Creating simple graph visualization with hexagons...");
    
    // Get the simple data
    const entities = simpleEntityData;
    
    // Position configuration - parent above, children below
    const parentPosition: [number, number, number] = [20, 30, 20];
    const child1Position: [number, number, number] = [10, 20, 20];
    const child2Position: [number, number, number] = [30, 20, 20];
    
    // Create parent hexagon
    const parentHex = makeHexagon({
      id: 1,
      centerPosition: parentPosition,
      width: 12,              // Larger for parent
      height: 2,
      barProps: {
        Color: [0.2, 0.4, 0.8]  // Blue for parent
      },
      labels: ["Parent", "System", entities[0].name],
      stackIndex: 1,
      hexIndex: 1,
      guid: entities[0].guid
    });
    parentHex.Parent = myStuffFolder;
    
    // Create child hexagons
    const child1Hex = makeHexagon({
      id: 2,
      centerPosition: child1Position,
      width: 8,               // Smaller for children
      height: 1.5,
      barProps: {
        Color: [0.4, 0.8, 0.4]  // Green for children
      },
      labels: ["Child1", "Component", entities[1].name],
      stackIndex: 1,
      hexIndex: 2,
      guid: entities[1].guid
    });
    child1Hex.Parent = myStuffFolder;
    
    const child2Hex = makeHexagon({
      id: 3,
      centerPosition: child2Position,
      width: 8,               // Smaller for children
      height: 1.5,
      barProps: {
        Color: [0.4, 0.8, 0.4]  // Green for children
      },
      labels: ["Child2", "Component", entities[2].name],
      stackIndex: 1,
      hexIndex: 3,
      guid: entities[2].guid
    });
    child2Hex.Parent = myStuffFolder;
    
    // Wait a frame to ensure all hexagons are created
    wait(0.1);
    
    // Create simple rope connections manually
    print("🔗 Creating simple rope connections...");
    
    // Find attachments on the hexagons
    const parentAttachments = this.findAttachments(parentHex);
    const child1Attachments = this.findAttachments(child1Hex);
    const child2Attachments = this.findAttachments(child2Hex);
    
    // Create rope from parent to child1
    if (parentAttachments.size() > 0 && child1Attachments.size() > 0) {
      const rope1 = new Instance("RopeConstraint");
      rope1.Attachment0 = parentAttachments[0];
      rope1.Attachment1 = child1Attachments[0];
      rope1.Visible = true;
      rope1.Thickness = 0.3;
      rope1.Color = new BrickColor("White");
      rope1.Parent = myStuffFolder;
      print("  - Connected Parent to Child1");
    }
    
    // Create rope from parent to child2
    if (parentAttachments.size() > 1 && child2Attachments.size() > 0) {
      const rope2 = new Instance("RopeConstraint");
      rope2.Attachment0 = parentAttachments[1];
      rope2.Attachment1 = child2Attachments[0];
      rope2.Visible = true;
      rope2.Thickness = 0.3;
      rope2.Color = new BrickColor("White");
      rope2.Parent = myStuffFolder;
      print("  - Connected Parent to Child2");
    }
    
    print("✅ Simple hexagon graph created successfully!");
  }
  
  private findAttachments(model: Model): Attachment[] {
    const attachments: Attachment[] = [];
    
    model.GetDescendants().forEach((descendant) => {
      if (descendant.IsA("Attachment")) {
        attachments.push(descendant);
      }
    });
    
    return attachments;
  }
}