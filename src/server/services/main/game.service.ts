import { BaseService } from "../../../shared/services/base/BaseService";
import { ConfigGUIServerService } from "../configGUIServer.service";
import { GraphInitializerService } from "../graphInitializer.service";
import { initializeDev2Features } from "./dev2features";
import { makeOriginBlock } from "../../../shared/modules/makeOriginBlock";

// Origin configuration for 3D positioning
const ORIGIN = {
  x: 0,
  y: 0, // BASE_Y from RENDERER_CONSTANTS
  z: 0,
};

export class GameService extends BaseService {
  private configGUIServer?: ConfigGUIServerService;
  private graphInitializer: GraphInitializerService;
  private myStuffFolder!: Folder;
  private gameStarted = false; // Flag to prevent duplicate initialization

  constructor() {
    super("GameService");
    this.graphInitializer = new GraphInitializerService();
  }

  public startGame(): void {
    if (this.gameStarted) {
      return;
    }

    this.gameStarted = true;

    // Create or find the MyStuff folder at the start
    this.myStuffFolder = game.Workspace.FindFirstChild("MyStuff") as Folder;
    if (!this.myStuffFolder) {
      this.myStuffFolder = new Instance("Folder");
      this.myStuffFolder.Name = "MyStuff";
      this.myStuffFolder.Parent = game.Workspace;
      // Track the folder for cleanup
      this.addInstance(this.myStuffFolder);
    }

    // Skip initial data generation - let user generate via GUI
    // The GUI starts in enhanced mode with its own configuration

    // Create orientation reference block at origin
    if (true) {
      makeOriginBlock({
        origin: { x: ORIGIN.x, y: ORIGIN.y + 20, z: ORIGIN.z }, // Offset cube by 20 in Y
        parent: this.myStuffFolder,
      });
    }

    // Initialize the configuration GUI server with origin
    this.configGUIServer = new ConfigGUIServerService(
      this.myStuffFolder,
      new Vector3(ORIGIN.x, ORIGIN.y, ORIGIN.z)
    );

    // Set up graph initializer with the GUI server
    this.graphInitializer.setConfigGUIServer(this.configGUIServer);

    // Initialize the graph with default configuration
    this.graphInitializer.initializeGraph();

    // Initialize dev2 features
    if (false) {
      initializeDev2Features(this.myStuffFolder);
    }

    // Add debug node inspection after a delay to allow nodes to be created
    task.wait(5);
    this.debugNodeInformation();
    this.debugSwimlaneShadows();
  }

  /**
   
   */
  private debugNodeInformation(): void {
    
    
    // Find all hexagon models (they start with "Hexagon_")
    const nodes: Model[] = [];
    const searchFolder = (folder: Instance) => {
      folder.GetDescendants().forEach((desc) => {
        if (desc.IsA("Model") && desc.Name.match("^Hexagon_")) {
          nodes.push(desc as Model);
        }
      });
    };
    
    searchFolder(this.myStuffFolder);
    
    
    
    // Sort nodes by their GUID attribute for consistent output
    nodes.sort((a, b) => {
      const guidA = a.GetAttribute("guid") as string || "";
      const guidB = b.GetAttribute("guid") as string || "";
      // Extract number from harness_file_X pattern
      const numA = tonumber(guidA.match("%d+")[0]) || 0;
      const numB = tonumber(guidB.match("%d+")[0]) || 0;
      return numA < numB;
    });
    
    nodes.forEach((node) => {
      const guid = node.GetAttribute("guid") as string || "unknown";
      const nodeName = node.GetAttribute("nodeName") as string || "unknown";
      const nodeType = node.GetAttribute("nodeType") as string || "unknown";
      
      const primaryPart = node.PrimaryPart;
      if (!primaryPart) return;
      
      const position = primaryPart.Position;
      
      let nodeInfo = `Node ${guid} (${nodeName}):`;
      nodeInfo += ` Position=(${math.floor(position.X * 10) / 10}, ${math.floor(position.Y * 10) / 10}, ${math.floor(position.Z * 10) / 10})`;
      nodeInfo += `, Type=${nodeType}`;
      
      // Find the bars (which have the actual color)
      const allChildren = node.GetChildren();
      const bars = allChildren.filter((child): child is Part => 
        child.IsA("Part") && child.Name.match("^Bar_")[0] !== undefined
      );
      
      // Find bar color
      if (bars.size() === 0) {
        // Try finding parts with different naming patterns
        const parts = allChildren.filter((child): child is Part => child.IsA("Part"));
        // Find the first non-center cube part
        const barPart = parts.filter(p => !p.Name.match("centerCube"))[0];
        if (barPart) {
          const barColor = barPart.Color;
          nodeInfo += `, BarColor=(${math.floor(barColor.R * 255)}, ${math.floor(barColor.G * 255)}, ${math.floor(barColor.B * 255)})`;
        }
      } else {
        const barColor = bars[0].Color;
        nodeInfo += `, BarColor=(${math.floor(barColor.R * 255)}, ${math.floor(barColor.G * 255)}, ${math.floor(barColor.B * 255)})`;
      }
      
      // Find text labels on the bars
      for (let i = 0; i < bars.size(); i++) {
        const bar = bars[i];
        const surfaceGui = bar.FindFirstChildOfClass("SurfaceGui");
        if (surfaceGui) {
          const textLabel = surfaceGui.FindFirstChildOfClass("TextLabel");
          if (textLabel) {
            const textColor = textLabel.TextColor3;
            nodeInfo += `, LabelText="${textLabel.Text}"`;
            nodeInfo += `, LabelColor=(${math.floor(textColor.R * 255)}, ${math.floor(textColor.G * 255)}, ${math.floor(textColor.B * 255)})`;
            break; // Only report the first label found
          }
        }
      }
      
      // Check for httpMethod property
      const httpMethod = this.getNodeProperty(node, "httpMethod");
      if (httpMethod) {
        nodeInfo += `, httpMethod=${httpMethod}`;
      }
      
      
    });
    
    
  }
  
  /**
   * Helper to get node property from attributes or by searching the data
   */
  private getNodeProperty(node: Model, propertyName: string): string | undefined {
    // First check if it's stored as an attribute
    const attrValue = node.GetAttribute(propertyName);
    if (attrValue !== undefined) {
      return tostring(attrValue);
    }
    
    // If not found, could search through the actual node data
    // For now, return undefined
    return undefined;
  }

  /**
   * Debug function to find and print swimlane shadow widths
   */
  private debugSwimlaneShadows(): void {
    print("========== DEBUG SWIMLANE SHADOWS ==========");
    
    // Find all Z-parallel lane blocks (swimlane shadows)
    const zParallelLanes: Part[] = [];
    const xParallelLanes: Part[] = [];
    
    const searchForLanes = (parent: Instance) => {
      parent.GetDescendants().forEach((desc) => {
        if (desc.IsA("Part")) {
          const name = desc.Name;
          // Debug Z-parallel lanes
          if (name === "ZParallel_Lane_httpMethod_GET" || 
              name === "ZParallel_Lane_httpMethod_POST" || 
              name === "ZParallel_Lane_httpMethod_PUT" ||
              name === "ZParallel_Lane_httpMethod_MULTIPLE" ||
              name === "ZParallel_Lane_httpMethod_UNKNOWN") {
            print(`[DEBUG] Found ${name}: Size=(${desc.Size.X}, ${desc.Size.Y}, ${desc.Size.Z})`);
            zParallelLanes.push(desc as Part);
          } else if (name.match("^XParallel_Lane_")) {
            // Debug X-parallel lanes
            if (name === "XParallel_Lane_apiPattern_controller" ||
                name === "XParallel_Lane_apiPattern_crud-operation" ||
                name === "XParallel_Lane_apiPattern_data-model" ||
                name === "XParallel_Lane_apiPattern_dependency-injection" ||
                name === "XParallel_Lane_apiPattern_general-api") {
              print(`[DEBUG] Found ${name}: Size=(${desc.Size.X}, ${desc.Size.Y}, ${desc.Size.Z})`);
              xParallelLanes.push(desc as Part);
            }
          }
        }
      });
    };
    
    searchForLanes(this.myStuffFolder);
    
    print(`Found ${zParallelLanes.size()} Z-parallel lanes (vertical swimlane shadows)`);
    print(`Found ${xParallelLanes.size()} X-parallel lanes (horizontal shadows)`);
    
    // Sort and print Z-parallel lanes
    zParallelLanes.sort((a, b) => a.Position.X < b.Position.X);
    print("\nZ-PARALLEL LANES (Vertical Swimlane Shadows):");
    zParallelLanes.forEach((lane) => {
      const name = lane.Name;
      const width = lane.Size.X;
      const position = lane.Position;
      
      // Extract the property value from the lane name (e.g., "ZParallel_Lane_httpMethod_GET" -> "GET")
      const match = name.match("ZParallel_Lane_[^_]+_(.+)");
      const propertyValue = match ? match[1] : undefined;
      
      // Count nodes in the corresponding swimlane
      let nodeCount = 0;
      const nodesFolder = this.myStuffFolder.FindFirstChild("GraphMaker")
        ?.FindFirstChild("UnifiedDataCluster")
        ?.FindFirstChild("Nodes") as Folder;
      
      if (nodesFolder && propertyValue) {
        // Debug: print what swimlanes we find
        if (lane === zParallelLanes[0]) {
          print(`[DEBUG] Looking for Swimlane_${propertyValue} in Nodes folder`);
          nodesFolder.GetChildren().forEach((child) => {
            if (child.IsA("Model") && child.Name.match("^Swimlane_")) {
              print(`[DEBUG] Found swimlane: ${child.Name}`);
            }
          });
        }
        
        // Look for all swimlane models and check their names
        nodesFolder.GetChildren().forEach((swimlane) => {
          if (swimlane.IsA("Model") && swimlane.Name === `Swimlane_${propertyValue}`) {
            // Count hexagons in this swimlane
            swimlane.GetChildren().forEach((child) => {
              if (child.IsA("Model") && child.Name.match("^Hexagon_")) {
                nodeCount++;
              }
            });
          }
        });
      }
      
      print(`  ${name}: width=${width}, nodes=${nodeCount}, position=(${math.floor(position.X * 10) / 10}, ${math.floor(position.Y * 10) / 10}, ${math.floor(position.Z * 10) / 10})`);
    });
    
    // Sort and print X-parallel lanes
    xParallelLanes.sort((a, b) => a.Position.Z < b.Position.Z);
    print("\nX-PARALLEL LANES (Horizontal Shadows):");
    xParallelLanes.forEach((lane) => {
      const name = lane.Name;
      const width = lane.Size.X;
      const depth = lane.Size.Z;
      const position = lane.Position;
      print(`  ${name}: width=${width}, depth=${depth}, position=(${math.floor(position.X * 10) / 10}, ${math.floor(position.Y * 10) / 10}, ${math.floor(position.Z * 10) / 10})`);
    });
    
    print("========== END DEBUG SWIMLANE SHADOWS ==========");
  }

  /**
   * Custom cleanup logic
   */
  protected onDestroy(): void {
    // Destroy services in reverse order of creation
    if (this.configGUIServer) {
      this.configGUIServer.destroy();
      this.configGUIServer = undefined;
    }

    const initializer = this.graphInitializer as unknown as {
      destroy?: () => void;
    };
    if (initializer.destroy) {
      initializer.destroy();
    }
  }
}
