import { EnhancedGeneratorConfig } from "../../shared/interfaces/enhancedGenerator.interface";

export interface GraphInitConfig {
  initialPosition: { x: number; y: number; z: number };
  defaultConfig: EnhancedGeneratorConfig;
}

export class GraphInitializerService {
  private configGUIServer?: unknown;
  
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