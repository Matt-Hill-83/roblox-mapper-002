import { MakeOldStuffService } from "./makeOldStuff.service";
import { SimpleGraphService } from "./simpleGraph.service";
import { TestSimpleDataGeneratorService } from "./testSimpleDataGenerator.service";
import { ConfigGUIServerService } from "./configGUIServer.service";
import { DataGeneratorRobloxRendererService } from "./dataGeneratorRobloxRenderer.service";
import { TestLabelBlockService } from "./testLabelBlock.service";

// Origin configuration for 3D positioning
// TODO: Pass this to data generator renderer when needed
// const ORIGIN = {
//   x: 0,
//   y: 20, // BASE_Y from RENDERER_CONSTANTS
//   z: 0
// };

export class GameService {
  private makeOldStuffService = new MakeOldStuffService();
  private simpleGraphService = new SimpleGraphService();
  private testSimpleDataGenerator = new TestSimpleDataGeneratorService();
  private dataGeneratorRenderer = new DataGeneratorRobloxRendererService();
  private testLabelBlockService = new TestLabelBlockService();
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

    // Disable old assets for now
    if (false) {
      this.makeOldStuffService.createOldAssets(this.myStuffFolder);
    }

    // Create simple graph with 3 hexagons
    if (false) {
      this.simpleGraphService.createSimpleGraph(this.myStuffFolder);
    }

    // Test the new simple data generator
    if (false) {
      this.testSimpleDataGenerator.runPeopleAnimalsDemo(this.myStuffFolder);
    }

    // Test label block primitive
    if (false) {
      this.testLabelBlockService.testLabelBlocks(this.myStuffFolder);
    }

    // Use actual data generator with swim lane positioning
    if (true) {
      this.dataGeneratorRenderer.renderGeneratedData(this.myStuffFolder, {
        numLevel1Nodes: 1,
        numLevel2Nodes: 1,
        numLevel3Nodes: 5,
        childrenPerNode: 1,
        numNodeTypes: 3,
        numLinkTypes: 3,
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
