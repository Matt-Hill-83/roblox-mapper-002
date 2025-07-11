import { BaseService } from "../../../shared/services/base/BaseService";
import { ConfigGUIServerService } from "../configGUIServer.service";
import { GraphInitializerService } from "../graphInitializer.service";
import { LinkTypeCounterServerService } from "../linkTypeCounterServer.service";
import { initializeDev2Features } from "./dev2features";
import { makeOriginBlock } from "../../../shared/modules/makeOriginBlock";

// Origin configuration for 3D positioning
const ORIGIN = {
  x: 0,
  y: 0, // BASE_Y from RENDERER_CONSTANTS
  z: 0,
};

// Maximum number of data items to generate
const MAX_DATA_ITEMS = 200;

export class GameService extends BaseService {
  private configGUIServer?: ConfigGUIServerService;
  private graphInitializer: GraphInitializerService;
  private linkTypeCounterServer: LinkTypeCounterServerService;
  private myStuffFolder!: Folder;
  private gameStarted = false; // Flag to prevent duplicate initialization

  constructor() {
    super("GameService");
    this.graphInitializer = new GraphInitializerService();
    this.linkTypeCounterServer = new LinkTypeCounterServerService();
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

    // Initialize the configuration GUI server with origin and link counter
    this.configGUIServer = new ConfigGUIServerService(
      this.myStuffFolder,
      new Vector3(ORIGIN.x, ORIGIN.y, ORIGIN.z),
      this.linkTypeCounterServer
    );

    // Set up graph initializer with the GUI server
    this.graphInitializer.setConfigGUIServer(this.configGUIServer);

    // Initialize the graph with configuration including max data items
    this.graphInitializer.initializeGraphWithMaxItems(MAX_DATA_ITEMS);

    // Initialize dev2 features
    if (false) {
      initializeDev2Features(this.myStuffFolder);
    }
  }

  /**
   * Debug function to search for the LinkTypesDisplay GUI and report its details
   */
  public debugLinkTypesGUI(): void {
    print("[GameService] Searching for LinkTypesDisplay GUI...");
    
    const players = game.GetService("Players");
    const localPlayer = players.LocalPlayer;
    if (!localPlayer) {
      print("[GameService] No LocalPlayer found");
      return;
    }
    
    const playerGui = localPlayer.WaitForChild("PlayerGui", 5) as PlayerGui | undefined;
    if (!playerGui) {
      print("[GameService] PlayerGui not found");
      return;
    }
    
    print("[GameService] Searching in PlayerGui...");
    
    // Search for any GUI containing LinkTypesDisplay
    let foundGUI = false;
    
    playerGui.GetChildren().forEach((child) => {
      if (child.IsA("ScreenGui")) {
        print(`[GameService] Found ScreenGui: ${child.Name}`);
        
        // Search recursively for LinkTypesDisplay
        const searchResult = this.searchForLinkTypesDisplay(child);
        if (searchResult) {
          foundGUI = true;
          print(`[GameService] Found LinkTypesDisplay in ScreenGui: ${child.Name}`);
          print(`  - Position: ${searchResult.Position}`);
          print(`  - Size: ${searchResult.Size}`);
          print(`  - Visible: ${searchResult.Visible}`);
          print(`  - Parent hierarchy: ${this.getParentHierarchy(searchResult)}`);
        }
      }
    });
    
    if (!foundGUI) {
      print("[GameService] LinkTypesDisplay GUI not found in any ScreenGui");
      
      // List all ScreenGuis for debugging
      print("[GameService] Available ScreenGuis:");
      playerGui.GetChildren().forEach((child) => {
        if (child.IsA("ScreenGui")) {
          print(`  - ${child.Name} (Enabled: ${child.Enabled})`);
          
          // List top-level children
          child.GetChildren().forEach((grandchild) => {
            print(`    - ${grandchild.Name} (${grandchild.ClassName})`);
          });
        }
      });
    }
  }
  
  /**
   * Recursively search for LinkTypesDisplay element
   */
  private searchForLinkTypesDisplay(parent: Instance): GuiObject | undefined {
    if (parent.Name === "LinkTypesDisplay" && parent.IsA("GuiObject")) {
      return parent;
    }
    
    for (const child of parent.GetChildren()) {
      const result = this.searchForLinkTypesDisplay(child);
      if (result) {
        return result;
      }
    }
    
    return undefined;
  }
  
  /**
   * Get the parent hierarchy as a string
   */
  private getParentHierarchy(obj: Instance): string {
    const hierarchy: string[] = [];
    let current: Instance | undefined = obj;
    
    while (current && current !== game) {
      hierarchy.unshift(current.Name);
      current = current.Parent;
    }
    
    return hierarchy.join(" -> ");
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
