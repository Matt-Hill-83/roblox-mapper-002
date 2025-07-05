import { createRingOfStacks } from "../../shared/modules/createRingOfStacks";
import { ConnectorService } from "./connector.service";
import { allEntityData } from "../../shared/data";
import {
  analyzeEntityConnections,
  addConnectionPropertiesToEntities,
  printConnectionSummary,
} from "../../shared/modules/connectionAnalyzer";
import { analyzeEntityHierarchy } from "../../shared/modules/hierarchyAnalyzer";

export class MakeOldStuffService {
  private connectorService = new ConnectorService();

  public createOldAssets(myStuffFolder: Folder): void {
    print("🏗️ MakeOldStuffService: Creating old assets...");
    
    // STEP 1: Analyze connections FIRST - before creating any stacks
    print("📊 Step 1: Analyzing entity connections...");
    this.analyzeEntityConnections();
    this.addConnectionProperties();

    // STEP 1b: Analyze hierarchy relationships
    print("🌳 Step 1b: Analyzing entity hierarchies...");
    this.analyzeEntityHierarchies();

    // STEP 2: Create entity ring (now that connection data is available)
    print("🏗️ Step 2: Creating entity ring...");
    this.createEntityRing(myStuffFolder);

    // STEP 3: Create connectors after all stacks are created
    print("🔗 Step 3: Creating connectors...");
    this.createConnectors(myStuffFolder);

    print("✅ MakeOldStuffService: Old assets created");
  }


  private createEntityRing(myStuffFolder: Folder): void {
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
      stack.Parent = myStuffFolder;
    }
  }

  private createConnectors(myStuffFolder: Folder): void {
    this.connectorService.createSecurityConnectors(myStuffFolder);
  }

  private analyzeEntityConnections(): void {
    print("🔍 Starting entity connection analysis...");
    analyzeEntityConnections();
    printConnectionSummary();
  }

  private addConnectionProperties(): void {
    print("📎 Adding connection properties to entities...");
    addConnectionPropertiesToEntities();
  }

  private analyzeEntityHierarchies(): void {
    print("🌳 Starting entity hierarchy analysis...");
    const hierarchyResult = analyzeEntityHierarchy();
    print(`  - Found ${hierarchyResult.trees.size()} hierarchy trees`);
    print(`  - Total entities: ${hierarchyResult.totalEntities}`);
    print(`  - Connected entities: ${hierarchyResult.connectedEntities}`);
    
    // Print a summary of each tree
    hierarchyResult.trees.forEach((tree) => {
      print(`  - Tree "${tree.rootName}": ${tree.totalNodes} entities, depth: ${tree.depth}`);
    });
  }
}