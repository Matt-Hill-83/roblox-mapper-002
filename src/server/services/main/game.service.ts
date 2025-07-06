import { TestSimpleDataGeneratorService } from "../testSimpleDataGenerator.service";
import { ConfigGUIServerService } from "../configGUIServer.service";
import { makeOriginBlock } from "../../../shared/modules/makeOriginBlock";

// Origin configuration for 3D positioning
const ORIGIN = {
  x: 0,
  y: 0, // BASE_Y from RENDERER_CONSTANTS
  z: 0,
};

export class GameService {
  private testSimpleDataGenerator = new TestSimpleDataGeneratorService();
  private configGUIServer?: ConfigGUIServerService;
  private myStuffFolder!: Folder;
  private gameStarted = false; // Flag to prevent duplicate initialization

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

    // Initialize the configuration GUI server
    this.configGUIServer = new ConfigGUIServerService(
      this.testSimpleDataGenerator,
      this.myStuffFolder
    );
    print(`🎮 GUI Server initialized: ${this.configGUIServer !== undefined}`);

    print("✅ GameService.startGame() completed");
  }
}
