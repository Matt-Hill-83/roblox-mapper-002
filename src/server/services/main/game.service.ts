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
      print(
        "⚠️ GameService.startGame() already called, skipping duplicate call"
      );
      return;
    }

    print("🎮 GameService.startGame() called");
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
        origin: ORIGIN,
        parent: this.myStuffFolder,
      });
    }

    // Initialize the configuration GUI server with origin
    this.configGUIServer = new ConfigGUIServerService(
      this.myStuffFolder, 
      new Vector3(ORIGIN.x, ORIGIN.y, ORIGIN.z)
    );
    print(`🎮 GUI Server initialized: ${this.configGUIServer !== undefined}`);
    
    // Set up graph initializer with the GUI server
    this.graphInitializer.setConfigGUIServer(this.configGUIServer);
    
    // Initialize the graph with default configuration
    this.graphInitializer.initializeGraph();

    // Initialize dev2 features
    initializeDev2Features(this.myStuffFolder);

    print("✅ GameService.startGame() completed");
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
    
    const initializer = this.graphInitializer as unknown as { destroy?: () => void };
    if (initializer.destroy) {
      initializer.destroy();
    }
    
    print("[GameService] Cleaned up");
  }
}