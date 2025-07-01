import { ComponentStackService } from "./componentStack.service";
// import { HexStackService } from "./hexStack.service";
// import { NationsStackService } from "./nationsStack.service";
import { ToolStackService } from "./toolStack.service";
import { createRingOfStacks } from "../../shared/modules/createRingOfStacks";
import { ConnectorService } from "./connector.service";
import { allEntityData } from "../../shared/data";
import {
  analyzeEntityConnections,
  addConnectionPropertiesToEntities,
  printConnectionSummary,
  getEntitiesWithConnections,
} from "../../shared/modules/connectionAnalyzer";

export class GameService {
  // private hexStackService = new HexStackService();
  // private nationsStackService = new NationsStackService();
  private componentStackService = new ComponentStackService();
  private toolStackService = new ToolStackService();
  private connectorService = new ConnectorService();
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

    // Create or find the myStuff folder at the start
    this.myStuffFolder = game.Workspace.FindFirstChild("myStuff") as Folder;
    if (!this.myStuffFolder) {
      this.myStuffFolder = new Instance("Folder");
      this.myStuffFolder.Name = "myStuff";
      this.myStuffFolder.Parent = game.Workspace;
    }

    // STEP 1: Analyze connections FIRST - before creating any stacks
    print("📊 Step 1: Analyzing entity connections...");
    this.analyzeEntityConnections();
    this.addConnectionProperties();

    // STEP 2: Create all stacks (now that connection data is available)
    print("🏗️ Step 2: Creating stacks...");
    this.createComponentStack();
    this.createToolStack();
    this.createEntityRing();

    // STEP 3: Create connectors after all stacks are created
    print("🔗 Step 3: Creating connectors...");
    this.createConnectors();

    print("✅ GameService.startGame() completed");
  }

  // private createHexagon(): void {
  //     this.hexagonService.createHexagon({
  //         id: 1,
  //         centerPosition: [5, 5, 5],
  //         width: 10,
  //         height: 0.5,
  //         barProps: {
  //             Color: [0.9, 0.7, 0.3], // Golden color
  //         },
  //         labels: ["North", "East", "West"]
  //     });
  //     print("Hexagon created at (5, 5, 5)!");
  // }

  // private createHexStack(): void {
  //     this.hexStackService.createHexStack({
  //         id: 2,
  //         centerPosition: [20, 5, 5], // Positioned next to the hexagon
  //         width: 8,
  //         height: 0.5,
  //         count: 6,
  //         colors: [
  //             [1, 0, 0], // Red
  //             [0, 1, 0], // Green
  //             [0, 0, 1], // Blue
  //             [1, 1, 0], // Yellow
  //             [1, 0, 1], // Magenta
  //             [0, 1, 1], // Cyan
  //         ]
  //     });
  //     print("Hex stack created at (20, 5, 5)!");
  // }

  // private createNationsStack(): void {
  //     this.nationsStackService.createNationsStack({
  //         id: "nationsStack1",
  //         centerPosition: [35, 5, 5], // Positioned next to the hex stack
  //         width: 8,
  //         height: 2,
  //         maxItems: 3, // Create 3 nations
  //     });
  //     print("Nations stack created at (35, 5, 5)!");
  // }

  private createComponentStack(): void {
    if (false) {
      this.componentStackService.createComponentStack({
        id: "componentStack1",
        centerPosition: [50, 1, 1], // Positioned next to the nations stack
        width: 8,
        height: 1, // Limited to height 1
        maxItems: 100, // Create 16 components (can be increased up to 64)
      });
    }
  }

  private createToolStack(): void {
    if (false) {
      this.toolStackService.createToolStack({
        id: "toolStack1",
        centerPosition: [65, 1, 9], // Positioned next to the component stack
        width: 8,
        height: 1, // Limited to height 1
        maxItems: 100, // Create all 8 tools
      });
    }
  }

  private createEntityRing(): void {
    const centerPosition: [number, number, number] = [0, 20, -50]; // Position in front of the row, more visible

    const stacks = createRingOfStacks({
      maxStacks: math.min(15, allEntityData.size()), // Use actual number of entity types, max 15
      centerPosition: centerPosition,
      radius: 40, // Smaller radius
      startIndex: 0, // Start from entity 0
      // Removed color parameter - each stack will get a unique color automatically
    });

    if (stacks.size() === 0) {
      print("ERROR: No stacks were created for the ring!");
      return;
    }

    // Place each stack in the myStuff folder
    for (let i = 0; i < stacks.size(); i++) {
      const stack = stacks[i];
      stack.Parent = this.myStuffFolder;
    }
  }

  private createConnectors(): void {
    this.connectorService.createSecurityConnectors();
  }

  private analyzeEntityConnections(): void {
    print("🔍 Starting entity connection analysis...");
    analyzeEntityConnections();
    printConnectionSummary();
  }

  private addConnectionProperties(): void {
    addConnectionPropertiesToEntities();

    // Print summary of entities with connections
    const connectedEntities = getEntitiesWithConnections();
    print(
      `🔗 Applied connection properties to ${connectedEntities.size()} entities with connections`
    );
  }
}
