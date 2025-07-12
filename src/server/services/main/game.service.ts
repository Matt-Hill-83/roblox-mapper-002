import { BaseService } from "../../../shared/services/base/BaseService";
import { ConfigGUIServerService } from "../configGUIServer.service";
import { GraphInitializerService } from "../graphInitializer.service";
import { LinkTypeCounterServerService } from "../linkTypeCounterServer.service";
import { initializeDev2Features } from "./dev2features";
import { makeOriginBlock } from "../../../shared/modules/makeOriginBlock";
import { wireframeBlockMaker } from "../../../src2/validation/wireframeBlockMaker";
import { graphBlasterLayoutMaker } from "../../../src2/graphBlasterLayoutMaker";
import { DataGeneratorService } from "../../../src2/services/dataGeneration/dataGenerator.service";
import { GraphBlasterDataMapperService } from "../../../src2/services/graphBlaster/graphBlasterDataMapper.service";
import { GraphBlasterNodePlacerService } from "../../../src2/services/graphBlaster/graphBlasterNodePlacer.service";

// Origin configuration for 3D positioning
const ORIGIN = {
  x: 0,
  y: 0, // BASE_Y from RENDERER_CONSTANTS
  z: 0,
};

// Maximum number of data items to generate
const MAX_DATA_ITEMS = 10;

// Default GUI axis options
const DEFAULT_AXIS_OPTIONS = {
  xgroup: "component",
  zgroup: "server",
  ygroup: "language",
  nodeColor: "server",
};

export class GameService extends BaseService {
  private configGUIServer?: ConfigGUIServerService;
  private graphInitializer: GraphInitializerService;
  private linkTypeCounterServer: LinkTypeCounterServerService;
  private myStuffFolder!: Folder;
  private gameStarted = false; // Flag to prevent duplicate initialization

  constructor() {
    super("GameService");
    print("=== GameService constructor ===");
    print(`Time: ${os.time()}`);
    this.graphInitializer = new GraphInitializerService();
    this.linkTypeCounterServer = new LinkTypeCounterServerService();
  }

  public startGame(): void {
    print("=== startGame() called ===");
    print(`Time: ${os.time()}`);
    print(`gameStarted flag: ${this.gameStarted}`);

    if (this.gameStarted) {
      print("Game already started, returning");
      return;
    }

    this.gameStarted = true;
    print("Setting gameStarted = true");

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
        origin: new Vector3(ORIGIN.x, ORIGIN.y + 20, ORIGIN.z), // Offset cube by 20 in Y
        parent: this.myStuffFolder,
      });
    }

    // Initialize the configuration GUI server with origin, link counter, and default axis options
    this.configGUIServer = new ConfigGUIServerService(
      this.myStuffFolder,
      new Vector3(ORIGIN.x, ORIGIN.y, ORIGIN.z),
      this.linkTypeCounterServer,
      DEFAULT_AXIS_OPTIONS
    );

    // Set server-side prefilters to exclude properties we don't want to visualize
    // Currently no server prefilters are needed, but this can be used to filter out
    // specific property values that should never be shown
    // Example: this.configGUIServer.setServerPrefilters({
    //   component: ["deprecated", "test"],
    //   service: ["internal"]
    // });

    // Set up graph initializer with the GUI server
    this.graphInitializer.setConfigGUIServer(this.configGUIServer);

    // Initialize the graph with configuration including max data items
    this.graphInitializer.initializeGraphWithMaxItems(MAX_DATA_ITEMS);

    // Initialize dev2 features
    if (false) {
      initializeDev2Features(this.myStuffFolder);
    }

    // Clean up any existing RubixCube before creating a new one
    const existingCubes = this.myStuffFolder
      .GetChildren()
      .filter(
        (child) =>
          child.Name === "RubixCube" || child.Name.sub(1, 10) === "RubixCube_"
      );
    if (existingCubes.size() > 0) {
      print(
        `Found ${existingCubes.size()} existing RubixCube(s), removing them`
      );
      existingCubes.forEach((cube) => cube.Destroy());
    }

    // Old rubixCubeMaker call disabled
    if (false) {
      print("=== Old rubixCubeMaker disabled ===");
      // Add a wireframe block next to the rubix cube
      wireframeBlockMaker({
        position: new Vector3(ORIGIN.x + 50, ORIGIN.y + 10, ORIGIN.z - 50),
        size: new Vector3(10, 10, 10),
        parent: this.myStuffFolder,
        nameStub: "demo-wireframe",
        // edgeThicknessRatio: 0.1,
        transparency: 0.7,
        color: new Color3(0.3, 0.5, 0.8),
        edgeBlockColor: new Color3(1, 1, 1),
      });
      print("=== wireframeBlockMaker completed ===");
    }
    //
    //
    //
    //
    //
    //
    //
    //
    // Call graphBlasterLayoutMaker
    print("=== About to call graphBlasterLayoutMaker ===");
    const { rubixCubeService } = graphBlasterLayoutMaker({
      origin: new Vector3(ORIGIN.x - 50, ORIGIN.y - 4, ORIGIN.z - 40),
      rubixCubeProps: {
        blockSize: {
          x: 24,
          y: 5,
          z: 32,
        },
        numBlocks: {
          x: 3,
          y: 2,
          z: 5,
        },
      },
      parent: this.myStuffFolder,
    });
    print("=== graphBlasterLayoutMaker completed ===");

    // Example: Access the cube data from the service
    const cubeData = rubixCubeService.getData();
    if (cubeData) {
      print(`Generated cube data with ${cubeData.size()} layers`);
    }

    // Test data generation (T2.4)
    if (true) {
      print("=== Testing Data Generation ===");
      const dataGenerator = new DataGeneratorService();

      // Create a folder for generated data
      const dataFolder = new Instance("Folder");
      dataFolder.Name = "GeneratedData";
      dataFolder.Parent = this.myStuffFolder;

      // Generate and save sample data
      const exportFolder = dataGenerator.generateAndSaveSampleData(dataFolder);
      print(`Data exported to: ${exportFolder.GetFullName()}`);
    }

    // Test wireframe panels (T17)
    if (true) {
      print("=== Testing Wireframe Panels ===");

      // Create a wireframe block with panels
      wireframeBlockMaker({
        position: new Vector3(ORIGIN.x + 70, ORIGIN.y + 10, ORIGIN.z),
        size: new Vector3(20, 20, 20),
        parent: this.myStuffFolder,
        nameStub: "panel-test",
        edgeWidth: 0.5,
        edgeBlockColor: new Color3(1, 1, 1), // White edges
        transparency: 0.9, // Very transparent main block
        panels: {
          front: true,
          back: true,
          left: true,
          right: false, // Skip right panel for visibility
          top: true,
          bottom: true,
        },
        panelProps: {
          transparency: 0,
          color: new Color3(0.3, 0.6, 0.9), // Light blue panels
          thickness: 0.5,
        },
      });

      print("Created wireframe block with panels");

      // Create another wireframe block with only vertical wall panels
      wireframeBlockMaker({
        position: new Vector3(ORIGIN.x + 100, ORIGIN.y + 10, ORIGIN.z),
        size: new Vector3(20, 20, 20),
        parent: this.myStuffFolder,
        nameStub: "vertical-panels",
        edgeWidth: 0.5,
        edgeBlockColor: new Color3(0.2, 0.2, 0.2), // Dark gray edges
        transparency: 0.9, // Very transparent main block
        panels: {
          front: true, // Vertical wall
          back: true, // Vertical wall
          left: true, // Vertical wall
          right: true, // Vertical wall
          top: false, // Not a vertical wall
          bottom: false, // Not a vertical wall
        },
        panelProps: {
          transparency: 0,
          color: new Color3(0.9, 0.3, 0.3), // Reddish panels
          thickness: 0.3,
        },
      });

      print("Created wireframe block with vertical wall panels only");
    }

    // Test GraphBlaster visualization (T18)
    if (true) {
      print("=== Testing GraphBlaster Visualization ===");
      
      // Create service instances
      const dataMapper = new GraphBlasterDataMapperService();
      const nodePlacer = new GraphBlasterNodePlacerService(dataMapper);
      
      // Use the generated data
      const dataGenerator = new DataGeneratorService();
      const data = dataGenerator.generateSampleData();
      
      // Analyze the data to get unique counts
      const config = dataMapper.analyzeData(data.persons);
      
      // Create GraphBlaster layout with dynamic sizing based on data
      const gbLayout = graphBlasterLayoutMaker({
        origin: new Vector3(ORIGIN.x + 150, ORIGIN.y, ORIGIN.z),
        rubixCubeProps: {
          numBlocks: {
            x: config.uniqueCounts.x,
            y: config.uniqueCounts.y,
            z: config.uniqueCounts.z,
          },
          blockSize: {
            x: 10,
            y: 4,
            z: 10,
          },
        },
        parent: this.myStuffFolder,
      });
      
      print("Created GraphBlaster layout with dimensions: " + 
        config.uniqueCounts.x + "x" + config.uniqueCounts.y + "x" + config.uniqueCounts.z);
        
      // Place person nodes within the rubix cube
      nodePlacer.placeNodes(data.persons, gbLayout.rubixCubeService, gbLayout.layoutModel);
    }
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
