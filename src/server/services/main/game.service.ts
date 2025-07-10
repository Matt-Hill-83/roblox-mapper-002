import { ConfigGUIServerService } from "../configGUIServer.service";
import { GraphInitializerService } from "../graphInitializer.service";
import { makeOriginBlock } from "../../../shared/modules/makeOriginBlock";
import { initializeDev2Features } from "./dev2features";
import { BaseService } from "../../../shared/services/base/BaseService";

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
    
    print("========== HELLO WORK - GAME SERVICE STARTED ==========");
    print("TEST");

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

    // Search for vertical walls after a delay to ensure rendering is complete
    task.wait(2);
    this.searchForVerticalWalls();
  }

  /**
   * Searches for all vertical walls (FarZEdgeWall) in the workspace and reports their properties
   */
  private searchForVerticalWalls(): void {
    print("========== SEARCHING FOR VERTICAL WALLS ==========");
    
    const walls: Part[] = [];
    
    // Recursive function to search through all descendants
    const searchInInstance = (instance: Instance) => {
      if (instance.IsA("Part") && (instance.Name === "FarZEdgeWall" || instance.Name === "FarXEdgeWall")) {
        walls.push(instance as Part);
      }
      
      for (const child of instance.GetChildren()) {
        searchInInstance(child);
      }
    };
    
    // Search in MyStuff folder
    if (this.myStuffFolder) {
      searchInInstance(this.myStuffFolder);
    }
    
    // Report findings
    if (walls.size() === 0) {
      print("❌ No vertical walls found!");
    } else {
      print(`✅ Found ${walls.size()} vertical wall(s):`);
      
      walls.forEach((wall, index) => {
        print(`\n  Wall #${index + 1}:`);
        print(`    Name: ${wall.Name}`);
        print(`    Parent: ${wall.Parent ? wall.Parent.GetFullName() : "nil"}`);
        print(`    Position: ${wall.Position}`);
        print(`    Size: ${wall.Size}`);
        print(`    Anchored: ${wall.Anchored}`);
        print(`    Transparency: ${wall.Transparency}`);
        print(`    Material: ${wall.Material.Name}`);
        print(`    CanCollide: ${wall.CanCollide}`);
        
        // Check if it's visible
        const isVisible = wall.Transparency < 1 && wall.Parent !== undefined;
        print(`    Visible: ${isVisible ? "Yes" : "No"}`);
      });
    }
    
    print("========== END VERTICAL WALL SEARCH ==========");
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
