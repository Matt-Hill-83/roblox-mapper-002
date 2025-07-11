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
const MAX_DATA_ITEMS = 400;

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
