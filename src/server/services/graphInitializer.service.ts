import { EnhancedGeneratorConfig } from "../../shared/interfaces/enhancedGenerator.interface";

/**
 * Configuration for graph initialization
 */
export interface GraphInitConfig {
  // Position for the bottom center of the graph
  initialPosition: {
    x: number;
    y: number;
    z: number;
  };
  
  // Default graph configuration
  defaultConfig: EnhancedGeneratorConfig;
}

/**
 * Service responsible for initializing the graph with default configuration on game startup
 */
export class GraphInitializerService {
  private configGUIServer?: unknown; // Will be set after ConfigGUIServerService is created
  
  // Default configuration for initial graph
  private readonly DEFAULT_CONFIG: EnhancedGeneratorConfig = {
    numNodeTypes: 3,
    numLinkTypes: 2,
    layers: [
      {
        layerNumber: 1,
        numNodes: 3,
        connectionsPerNode: 2,
        nodeType: "Type A",
        linkType: "Link A"
      },
      {
        layerNumber: 2,
        numNodes: 6,
        connectionsPerNode: 3,
        nodeType: "Type B",
        linkType: "Link B"
      },
      {
        layerNumber: 3,
        numNodes: 9,
        connectionsPerNode: 1,
        nodeType: "Type C",
        linkType: "Link A"
      }
    ]
  };
  
  // Default position for graph origin
  private readonly DEFAULT_POSITION = {
    x: 0,
    y: 0,
    z: 0
  };
  
  constructor() {
    print("📊 GraphInitializerService created");
  }
  
  /**
   * Set the ConfigGUIServerService instance
   */
  public setConfigGUIServer(configGUIServer: unknown): void {
    this.configGUIServer = configGUIServer;
  }
  
  /**
   * Initialize the graph with default configuration
   */
  public initializeGraph(customConfig?: Partial<GraphInitConfig>): void {
    print("🚀 Initializing graph with default configuration...");
    
    // Merge custom config with defaults
    const config: GraphInitConfig = {
      initialPosition: customConfig?.initialPosition || this.DEFAULT_POSITION,
      defaultConfig: customConfig?.defaultConfig || this.DEFAULT_CONFIG
    };
    
    // Wait for players and GUI to be ready
    wait(2);
    
    // Trigger graph generation through remote event
    this.triggerGraphGeneration(config);
  }
  
  /**
   * Trigger graph generation with the specified configuration
   */
  private triggerGraphGeneration(config: GraphInitConfig): void {
    if (!this.configGUIServer) {
      warn("⚠️ ConfigGUIServerService not set, cannot trigger graph generation");
      return;
    }
    
    print(`📍 Graph will be positioned at: (${config.initialPosition.x}, ${config.initialPosition.y}, ${config.initialPosition.z})`);
    print(`📊 Generating graph with ${config.defaultConfig.layers.size()} layers`);
    
    // Get all players and send them the initial configuration
    const players = game.GetService("Players").GetPlayers();
    print(`👥 Found ${players.size()} players to send config to`);
    
    if (players.size() === 0) {
      // No players yet, wait for first player
      print("⏳ No players found, waiting for first player to join...");
    } else {
      players.forEach(player => {
        // Send initial configuration to trigger generation
        this.sendInitialConfig(player, config);
      });
    }
    
    // Also listen for new players joining
    game.GetService("Players").PlayerAdded.Connect((player) => {
      wait(2); // Wait for player to load
      this.sendInitialConfig(player, config);
    });
  }
  
  /**
   * Send initial configuration to a player
   */
  private sendInitialConfig(player: Player, config: GraphInitConfig): void {
    const remoteEvent = game.GetService("ReplicatedStorage").FindFirstChild("ConfigGUIRemote") as RemoteEvent;
    if (!remoteEvent) {
      warn("⚠️ ConfigGUIRemote not found, cannot send initial configuration");
      return;
    }
    
    // Send the configuration to trigger automatic generation
    remoteEvent.FireClient(player, "initialConfig", config.defaultConfig);
    
    // After a short delay, trigger regeneration
    wait(0.5);
    remoteEvent.FireClient(player, "triggerGeneration", config.defaultConfig);
    
    print(`✅ Sent initial configuration to ${player.Name}`);
  }
}