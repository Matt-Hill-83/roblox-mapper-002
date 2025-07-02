import {
  addConnectionPropertiesToEntities,
  analyzeEntityConnections,
  getEntitiesWithConnections,
  printConnectionSummary,
} from "../../shared/modules/connectionAnalyzer";

import { ComponentStackService } from "./componentStack.service";
import { ConnectorService } from "./connector.service";
import { HierarchicalLayoutService } from "./hierarchicalLayout.service";
import { HierarchyLayoutIntegrator } from "../../shared/modules/hierarchyLayoutIntegrator";
import { ToolStackService } from "./toolStack.service";
import { allEntityData } from "../../shared/data";
import { analyzeEntityHierarchy } from "../../shared/modules/hierarchyAnalyzer";
import { createRingOfStacks } from "../../shared/modules/createRingOfStacks";

// Configuration interfaces
interface ComponentStackConfig {
  guid: string;
  centerPosition: [number, number, number];
  entityType?: string;
}

interface ToolStackConfig {
  centerPosition: [number, number, number];
  width?: number;
}

// Connection types
interface BaseConnection {
  fromGuid: string;
  toGuid: string;
}

interface TreeConnection extends BaseConnection {
  type: "hierarchical" | "related";
}

interface EntityPosition {
  guid: string;
  position: [number, number, number];
  clusterGroup?: string;
  entityType?: string;
}

interface LayoutTree {
  treeId: string;
  totalEntities: number;
  connections: TreeConnection[];
  entityPositions: EntityPosition[];
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
  };
}

interface ValidationMetrics {
  totalTrees: number;
  totalEntities: number;
  totalConnections: number;
  layoutTime: number;
}

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  metrics?: ValidationMetrics;
}

// Validation constants
const MAX_TREE_WIDTH = 100;
const MIN_ENTITY_SPACING = 8;
const MAX_ENTITY_SPACING = 25;

export class GameService {
  private myStuffFolder?: Folder;
  private hierarchicalLayoutService: HierarchicalLayoutService;
  private componentStackService: ComponentStackService;
  private toolStackService: ToolStackService;
  private connectorService: ConnectorService;
  private metrics: ValidationMetrics = {
    layoutTime: 0,
    totalEntities: 0,
    totalConnections: 0,
    totalTrees: 0,
  };

  constructor() {
    this.hierarchicalLayoutService = new HierarchicalLayoutService();
    this.componentStackService = new ComponentStackService();
    this.toolStackService = new ToolStackService();
    this.connectorService = new ConnectorService();
  }

  private gameStarted = false; // Flag to prevent duplicate initialization
  private useHierarchicalLayout = true; // Flag to enable hierarchical layout

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

    // STEP 1b: Analyze hierarchy relationships
    print("🌳 Step 1b: Analyzing entity hierarchies...");
    this.analyzeEntityHierarchies();

    // STEP 2: Create entity layout based on hierarchy
    print("🏗️ Step 2: Creating hierarchical entity layout...");
    if (this.useHierarchicalLayout) {
      this.createHierarchicalEntityLayout();
    } else {
      this.createComponentStack();
      this.createToolStack();
      this.createEntityRing();
    }

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

  /**
   * Create entity instances from layout result
   */
  private createEntityInstances(layoutResult: unknown): Map<string, Instance> {
    const entityMap = new Map<string, Instance>();
    print("📦 Creating entity instances...");

    const result = layoutResult as { trees: LayoutTree[] };
    print(`📊 Processing ${result.trees.size()} trees for entity creation`);

    for (let i = 0; i < result.trees.size(); i++) {
      const treeLayout = result.trees[i];
      const tree = treeLayout.entityPositions;
      print(`🌳 Processing tree ${i} with ${tree.size()} entities`);

      for (let j = 0; j < tree.size(); j++) {
        const entityPosition = tree[j];
        const { guid, position, entityType } = entityPosition;
        print(
          `🔧 Creating entity ${guid} at position [${position[0]}, ${position[1]}, ${position[2]}]`
        );

        try {
          // Create hex stack with proper entity type
          const config: ComponentStackConfig = {
            guid,
            centerPosition: position,
            entityType: entityType || "default",
          };

          const hexStack =
            this.componentStackService.createComponentStack(config);

          if (hexStack) {
            entityMap.set(guid, hexStack);
            print(`✅ Created entity ${guid}`);
          } else {
            print(`❌ Failed to create entity ${guid} - no hex stack returned`);
          }
        } catch (error) {
          print(`❌ Error creating hex stack for ${guid}: ${error}`);
        }
      }
    }

    print(`📦 Created ${entityMap.size()} entity instances total`);
    return entityMap;
  }

  /**
   * Create ring layout as fallback
   */
  public createEntityRing(): void {
    print("⭕ Creating entity ring layout...");

    try {
      // Create ring of entity stacks
      const ringConfig = {
        maxStacks: math.min(15, allEntityData.size()),
        centerPosition: [0, 0, 0] as [number, number, number],
        radius: 50,
        startIndex: 0,
      };
      createRingOfStacks(ringConfig);

      // Create tool stacks
      const toolConfig: ToolStackConfig = {
        centerPosition: [0, 20, 0],
        width: 30,
      };
      this.toolStackService.createToolStack(toolConfig);

      // Create security connectors
      this.connectorService.createSecurityConnectors(this.myStuffFolder);
    } catch (error) {
      print(`❌ Error creating ring layout: ${error}`);
    }
  }

  /**
   * Initialize entity data and analyze connections
   */
  private initializeEntityData(): void {
    // Analyze entity connections
    analyzeEntityConnections();
    printConnectionSummary();

    // Add connection properties to entities
    addConnectionPropertiesToEntities();

    // Get filtered list of connected entities
    const connectedEntities = getEntitiesWithConnections();
    print(`📊 Found ${connectedEntities.size()} connected entities`);
  }

  /**
   * Create hierarchical entity layout
   */
  private createHierarchicalEntityLayout(): void {
    print("🌳 Creating hierarchical entity layout...");
    print("🔍 DEBUG: useHierarchicalLayout =", this.useHierarchicalLayout);

    try {
      this.initializeEntityData();

      // Get hierarchy data optimized for layout
      const integrator = new HierarchyLayoutIntegrator();
      const hierarchyData = integrator.getFilteredHierarchyForLayout();
      print(
        `📊 Hierarchy data retrieved - Trees: ${hierarchyData.trees.size()}`
      );

      // Create hierarchical layout
      const layoutResult =
        this.hierarchicalLayoutService.createHierarchicalLayout(hierarchyData);
      print(`🏗️ Layout result created - Trees: ${layoutResult.trees.size()}`);

      // Create entity instances for positioning
      const entityMap = this.createEntityInstances(layoutResult);
      print(`📦 Entity instances created: ${entityMap.size()}`);

      // Position entities in 3D space
      const positionedEntities =
        this.hierarchicalLayoutService.positionEntitiesInSpace(
          layoutResult,
          entityMap
        );
      print(`📍 Entities positioned: ${positionedEntities.size()}`);

      // Create hierarchical connectors
      const connectors =
        this.hierarchicalLayoutService.createHierarchicalConnectors(
          layoutResult,
          positionedEntities
        );

      print(
        `✅ Hierarchical layout created: ${positionedEntities.size()} entities positioned, ${connectors.size()} connectors created`
      );
    } catch (error) {
      print(`❌ Error creating hierarchical layout: ${error}`);
      print("🔄 Falling back to ring layout...");
      this.createEntityRing();
    }
  }

  /**
   * Validate the hierarchical layout with real entity data
   */
  public validateHierarchicalLayout(): ValidationResult {
    print("🧪 Validating hierarchical layout...");

    const result: ValidationResult = {
      isValid: true,
      warnings: [],
      errors: [],
      metrics: this.metrics,
    };

    try {
      const startTime = os.clock();

      // Step 1: Get hierarchy analysis results and convert to layout format
      const integrator = new HierarchyLayoutIntegrator();
      const hierarchyResult = integrator.convertToLayoutFormat();

      this.metrics.totalTrees = hierarchyResult.trees.size();
      print(
        `✓ Hierarchy analysis complete - ${this.metrics.totalTrees} trees found`
      );

      // Step 2: Create layout with real data
      const filteredResult = integrator.getFilteredHierarchyForLayout();
      const layoutResult =
        this.hierarchicalLayoutService.createHierarchicalLayout(filteredResult);

      // Update metrics
      this.metrics.totalEntities = layoutResult.trees.reduce(
        (sum, tree) => sum + tree.totalEntities,
        0
      );
      this.metrics.totalConnections = layoutResult.trees.reduce(
        (sum, tree) => sum + tree.connections.size(),
        0
      );

      print(
        `✓ Layout calculation complete - ${this.metrics.totalEntities} entities positioned`
      );

      // Step 3: Validate tree positioning
      const resultData = layoutResult as { trees: unknown[] };
      for (const treeData of resultData.trees) {
        const tree = treeData as {
          treeId?: string;
          rootEntity?: string;
          totalEntities?: number;
          entityPositions?: unknown[];
          connections?: unknown[];
          boundingBox?: {
            min: [number, number, number];
            max: [number, number, number];
          };
        };

        // Convert TreeLayout to LayoutTree format for validation
        const layoutTree: LayoutTree = {
          treeId: tree.treeId || tree.rootEntity || "unknown",
          totalEntities:
            tree.totalEntities ||
            (tree.entityPositions
              ? (tree.entityPositions as EntityPosition[]).size()
              : 0),
          connections: [],
          entityPositions: tree.entityPositions
            ? (tree.entityPositions as EntityPosition[])
            : [],
          boundingBox: tree.boundingBox || {
            min: [0, 0, 0],
            max: [0, 0, 0],
          },
        };
        const treeWarnings = this.validateTreeLayout(layoutTree);
        if (treeWarnings > 0) {
          result.warnings.push(
            `Tree ${layoutTree.treeId}: ${treeWarnings} positioning warnings`
          );
        }
      }

      // Step 4: Create and validate visual representation
      const entityMap = this.createEntityInstances(layoutResult);
      if (entityMap.size() === 0) {
        result.errors.push("No entity instances were created");
        result.isValid = false;
      }

      const visualResult = this.validateVisualRepresentation();
      for (const warning of visualResult.warnings) {
        result.warnings.push(warning);
      }
      for (const errorMsg of visualResult.errors) {
        result.errors.push(errorMsg);
      }

      // Calculate total time
      this.metrics.layoutTime = os.clock() - startTime;
      print(
        `✓ Performance test complete - Layout created in ${this.metrics.layoutTime} seconds`
      );

      if (result.errors.size() > 0) {
        result.isValid = false;
      }

      return result;
    } catch (error) {
      result.isValid = false;
      result.errors.push(`Validation failed: ${error}`);
      return result;
    }
  }

  /**
   * Validate an individual tree layout
   */
  private validateTreeLayout(tree: LayoutTree): number {
    let warnings = 0;
    print(`Validating tree ${tree.treeId}`);

    // Check entity spacing
    const positions = tree.entityPositions.map((p) => p.position);

    for (let i = 0; i < positions.size(); i++) {
      for (let j = i + 1; j < positions.size(); j++) {
        const dist = [
          positions[i][0] - positions[j][0],
          positions[i][1] - positions[j][1],
          positions[i][2] - positions[j][2],
        ];
        const spacing = math.sqrt(
          dist[0] * dist[0] + dist[1] * dist[1] + dist[2] * dist[2]
        );
        if (spacing < MIN_ENTITY_SPACING) {
          warnings++;
        }
      }
    }

    // Validate bounding box
    const bounds = tree.boundingBox;
    const width = bounds.max[0] - bounds.min[0];
    const height = bounds.max[1] - bounds.min[1];

    if (width > MAX_TREE_WIDTH) {
      warnings++;
    }

    if (height > tree.totalEntities * MAX_ENTITY_SPACING) {
      warnings++;
    }

    return warnings;
  }

  /**
   * Validate the visual representation of entities
   */
  private validateVisualRepresentation(): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      warnings: [],
      errors: [],
    };

    if (!this.myStuffFolder) {
      result.isValid = false;
      result.errors.push("myStuff folder not found");
      return result;
    }

    // Validate entity models
    const entityModels = new Map<string, Model>();
    const positions = new Map<string, Vector3>();

    this.myStuffFolder.GetChildren().forEach((child: Instance) => {
      if (child.IsA("Model") && child.Name.match("HexStack")) {
        entityModels.set(child.Name, child as Model);
      }
    });

    let collisions = 0;

    entityModels.forEach((model: Model, name: string) => {
      const position = model.PrimaryPart?.Position;
      if (position) {
        positions.forEach((otherPos: Vector3) => {
          if (position.sub(otherPos).Magnitude < MIN_ENTITY_SPACING) {
            collisions++;
          }
        });
        positions.set(name, position);
      } else {
        result.errors.push(`Entity ${name} has no PrimaryPart`);
      }
    });

    if (collisions > 0) {
      result.warnings.push(
        `Found ${collisions} potential collisions between entities`
      );
    }

    // Validate hierarchy visualization
    const hierarchyErrors = this.validateHierarchyVisualization(positions);
    if (hierarchyErrors > 0) {
      result.warnings.push(
        `Found ${hierarchyErrors} hierarchy visualization issues`
      );
    }

    return result;
  }

  /**
   * Validate that the visual hierarchy matches the logical hierarchy
   */
  private validateHierarchyVisualization(
    positions: Map<string, Vector3>
  ): number {
    let errors = 0;

    // Get the current hierarchy
    const hierarchyResult = analyzeEntityHierarchy();

    // Check each parent-child relationship
    for (const tree of hierarchyResult.trees) {
      for (const connection of tree.connections) {
        if (connection.type !== "hierarchical") continue;

        const parentPos = positions.get(connection.fromGuid);
        const childPos = positions.get(connection.toGuid);

        if (parentPos && childPos) {
          // Child should be below parent
          if (childPos.Y <= parentPos.Y) {
            errors++;
          }

          // Child should be within reasonable distance of parent
          if (childPos.sub(parentPos).Magnitude > MAX_TREE_WIDTH / 2) {
            errors++;
          }
        }
      }
    }

    return errors;
  }
}
