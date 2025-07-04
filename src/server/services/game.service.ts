import { ComponentStackService } from "./componentStack.service";
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
import { analyzeEntityHierarchy } from "../../shared/modules/hierarchyAnalyzer";

export class GameService {
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

    // Create or find the MyStuff folder at the start
    this.myStuffFolder = game.Workspace.FindFirstChild("MyStuff") as Folder;
    if (!this.myStuffFolder) {
      this.myStuffFolder = new Instance("Folder");
      this.myStuffFolder.Name = "MyStuff";
      this.myStuffFolder.Parent = game.Workspace;
    }

    // STEP 1: Analyze connections FIRST - before creating any stacks
    print("📊 Step 1: Analyzing entity connections...");
    this.analyzeEntityConnections();
    this.addConnectionProperties();

    // STEP 1b: Analyze hierarchy relationships
    print("🌳 Step 1b: Analyzing entity hierarchies...");
    this.analyzeEntityHierarchies();

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


  private createComponentStack(): void {
    // Disabled for now
  }

  private createToolStack(): void {
    // Disabled for now
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
    this.connectorService.createSecurityConnectors(this.myStuffFolder);
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

  private analyzeEntityHierarchies(): void {
    print("🌳 Starting entity hierarchy analysis...");
    const hierarchyResult = analyzeEntityHierarchy();

    // Store or process hierarchy results as needed
    // For now, the analysis results are just printed to console
    print(
      `🌳 Hierarchy analysis completed: ${hierarchyResult.trees.size()} trees found`
    );
  }
}
