import { EnhancedGeneratorConfig } from "../../shared/interfaces/enhancedGenerator.interface";

export interface GraphInitConfig {
  initialPosition: { x: number; y: number; z: number };
  defaultConfig: EnhancedGeneratorConfig;
}

export class GraphInitializerService {
  private configGUIServer?: unknown;

  private readonly DEFAULT_CONFIG: EnhancedGeneratorConfig = {
    numNodeTypes: 4,
    numLinkTypes: 3,
    layers: [
      {
        layerNumber: 1,
        numNodes: 4, // Test with more nodes in first layer
        connectionsPerNode: 0, // Test with no intra-layer connections
      },
      {
        layerNumber: 2,
        numNodes: 8,
        connectionsPerNode: 1,
      },
      {
        layerNumber: 3,
        numNodes: 12,
        connectionsPerNode: 0, // Test sparse connectivity
      },
      {
        layerNumber: 4,
        numNodes: 16,
        connectionsPerNode: 2,
      },
      {
        layerNumber: 5,
        numNodes: 20,
        connectionsPerNode: 0, // Test last layer with no connections
      },
    ],
    spacing: {
      nodeHeight: 0.5,
      nodeRadius: 0.5,
      layerSpacing: 5,
      // layerSpacing: 0.5,
      nodeSpacing: 1,
      swimlaneSpacing: 1,
      linkDiameter: 0.1,
    },
    visualization: {
      showNodes: true,
      showLinkLabels: false,
      showConnectors: true,
      allowSameLevelLinks: true, // Enable same-level links for testing
    },
    // Default axis mapping for Harness data - will be updated when properties are discovered
    axisMapping: {
      xAxis: "httpMethod",
      zAxis: "apiPattern",
      yAxis: "component",
    },
    visualMapping: {
      backgroundColor: "httpMethod", // Default to httpMethod for Harness data
      borderColor: "none",
    },
    yAxisConfig: {
      useLayer: true,
      property: undefined,
    },
    numPetTypes: 5,
    maxDataItems: 1000, // Maximum number of items to use from test data
  };

  private readonly DEFAULT_POSITION = { x: 0, y: 0, z: 0 };

  constructor() {}

  public setConfigGUIServer(configGUIServer: unknown): void {
    this.configGUIServer = configGUIServer;
  }

  public initializeGraph(customConfig?: Partial<GraphInitConfig>): void {
    // Merge custom config with defaults
    const mergedDefaultConfig = {
      ...this.DEFAULT_CONFIG,
      ...customConfig?.defaultConfig,
    };

    const config: GraphInitConfig = {
      initialPosition: customConfig?.initialPosition || this.DEFAULT_POSITION,
      defaultConfig: mergedDefaultConfig,
    };

    wait(2);
    this.triggerGraphGeneration(config);
  }

  public initializeGraphWithMaxItems(maxDataItems: number): void {
    print(
      `[GraphInitializer] Initializing graph with max ${maxDataItems} items`
    );

    const configWithMaxItems = {
      ...this.DEFAULT_CONFIG,
      maxDataItems,
    };

    const config: GraphInitConfig = {
      initialPosition: this.DEFAULT_POSITION,
      defaultConfig: configWithMaxItems,
    };

    wait(2);
    this.triggerGraphGeneration(config);
  }

  private triggerGraphGeneration(config: GraphInitConfig): void {
    if (!this.configGUIServer) {
      warn(
        "⚠️ ConfigGUIServerService not set, cannot trigger graph generation"
      );
      return;
    }

    const players = game.GetService("Players").GetPlayers();

    if (players.size() > 0) {
      players.forEach((player) => {
        this.sendInitialConfig(player, config);
      });
    }

    game.GetService("Players").PlayerAdded.Connect((player) => {
      wait(2);
      this.sendInitialConfig(player, config);
    });
  }

  private sendInitialConfig(player: Player, config: GraphInitConfig): void {
    const remoteEvent = game
      .GetService("ReplicatedStorage")
      .FindFirstChild("ConfigGUIRemote") as RemoteEvent;
    if (!remoteEvent) {
      warn("⚠️ ConfigGUIRemote not found, cannot send initial configuration");
      return;
    }

    remoteEvent.FireClient(player, "initialConfig", config.defaultConfig);

    wait(1);
    remoteEvent.FireClient(player, "triggerGeneration", config.defaultConfig);
  }
}
