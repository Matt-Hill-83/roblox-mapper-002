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
        numNodes: 1,
        connectionsPerNode: 1
      },
      {
        layerNumber: 2,
        numNodes: 3,
        connectionsPerNode: 2
      },
      {
        layerNumber: 3,
        numNodes: 9,
        connectionsPerNode: 1
      },
      {
        layerNumber: 4,
        numNodes: 27,
        connectionsPerNode: 1
      },
      {
        layerNumber: 5,
        numNodes: 36,
        connectionsPerNode: 1
      }
    ],
    spacing: {
      nodeHeight: 1,
      nodeRadius: 0.5,
      layerSpacing: 2,
      nodeSpacing: 1,
      swimlaneSpacing: 1,
      linkDiameter: 0.5
    },
    visualization: {
      showLinkLabels: true,
      showConnectors: true,
      allowSameLevelLinks: true
    }
  };
  
  private readonly DEFAULT_POSITION = { x: 0, y: 0, z: 0 };
  
  constructor() {
  }
  
  public setConfigGUIServer(configGUIServer: unknown): void {
    this.configGUIServer = configGUIServer;
  }
  
  public initializeGraph(customConfig?: Partial<GraphInitConfig>): void {
    const config: GraphInitConfig = {
      initialPosition: customConfig?.initialPosition || this.DEFAULT_POSITION,
      defaultConfig: customConfig?.defaultConfig || this.DEFAULT_CONFIG
    };
    
    wait(2);
    this.triggerGraphGeneration(config);
  }
  
  private triggerGraphGeneration(config: GraphInitConfig): void {
    if (!this.configGUIServer) {
      warn("⚠️ ConfigGUIServerService not set, cannot trigger graph generation");
      return;
    }
    
    const players = game.GetService("Players").GetPlayers();
    
    if (players.size() > 0) {
      players.forEach(player => {
        this.sendInitialConfig(player, config);
      });
    }
    
    game.GetService("Players").PlayerAdded.Connect((player) => {
      wait(2);
      this.sendInitialConfig(player, config);
    });
  }
  
  private sendInitialConfig(player: Player, config: GraphInitConfig): void {
    const remoteEvent = game.GetService("ReplicatedStorage").FindFirstChild("ConfigGUIRemote") as RemoteEvent;
    if (!remoteEvent) {
      warn("⚠️ ConfigGUIRemote not found, cannot send initial configuration");
      return;
    }
    
    remoteEvent.FireClient(player, "initialConfig", config.defaultConfig);
    
    wait(1);
    remoteEvent.FireClient(player, "triggerGeneration", config.defaultConfig);
  }
}