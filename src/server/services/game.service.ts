import { MakeOldStuffService } from "./makeOldStuff.service";
import { SimpleGraphService } from "./simpleGraph.service";
import { TestSimpleDataGeneratorService } from "./testSimpleDataGenerator.service";
import { ConfigGUIServerService } from "./configGUIServer.service";
import { DataGeneratorRobloxRendererService } from "./dataGeneratorRobloxRenderer.service";
import { TestLabelBlockService } from "./testLabelBlock.service";
import { makeLabelBlock } from "../../shared/modules/labelBlockMaker";

// Origin configuration for 3D positioning
const ORIGIN = {
  x: 0,
  y: 20, // BASE_Y from RENDERER_CONSTANTS
  z: 0
};

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

    // Create orientation reference block at origin
    if (true) {
      const orientationFolder = new Instance("Folder");
      orientationFolder.Name = "OrientationReference";
      orientationFolder.Parent = this.myStuffFolder;

      makeLabelBlock({
        id: "orientation-ref",
        position: {
          x: ORIGIN.x - 20, // Offset to the left
          y: ORIGIN.y + 20, // Above the origin
          z: ORIGIN.z - 20  // Forward
        },
        props: {
          Size: 10,
          Color: [0.3, 0.3, 0.3], // Dark gray
          Transparency: 0.2,
          Material: "Neon",
          CanCollide: false,
          CastShadow: false
        },
        labels: {
          front: { 
            text: "FRONT",
            textColor: new Color3(0, 0, 0.8), // Dark blue text
            backgroundColor: new Color3(0.5, 0.5, 0.8), // Medium blue background
            borderColor: new Color3(0, 0, 0.3) // Very dark blue border
          },
          back: { 
            text: "BACK",
            textColor: new Color3(0, 0, 0.8), // Dark blue text
            backgroundColor: new Color3(0.5, 0.5, 0.8), // Medium blue background
            borderColor: new Color3(0, 0, 0.3) // Very dark blue border
          },
          left: { 
            text: "LEFT",
            textColor: new Color3(0.8, 0, 0), // Dark red text
            backgroundColor: new Color3(0.8, 0.5, 0.5), // Medium red background
            borderColor: new Color3(0.3, 0, 0) // Very dark red border
          },
          right: { 
            text: "RIGHT",
            textColor: new Color3(0.8, 0, 0), // Dark red text
            backgroundColor: new Color3(0.8, 0.5, 0.5), // Medium red background
            borderColor: new Color3(0.3, 0, 0) // Very dark red border
          },
          top: { 
            text: "TOP",
            textColor: new Color3(0, 0.8, 0), // Dark green text
            backgroundColor: new Color3(0.5, 0.8, 0.5), // Medium green background
            borderColor: new Color3(0, 0.3, 0) // Very dark green border
          },
          bottom: { 
            text: "BOTTOM",
            textColor: new Color3(0, 0.8, 0), // Dark green text
            backgroundColor: new Color3(0.5, 0.8, 0.5), // Medium green background
            borderColor: new Color3(0, 0.3, 0) // Very dark green border
          }
        },
        textBoxOverrides: {
          textSize: 100, // Maximum font size in Roblox
          font: Enum.Font.SourceSansBold,
          borderSizePixel: 10 // Wider borders for better visibility
        },
        parent: orientationFolder
      });
      
      print("🧭 Created orientation reference block at origin");
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
