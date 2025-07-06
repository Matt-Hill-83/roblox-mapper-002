import { ReplicatedStorage } from "@rbxts/services";
import { EnhancedGeneratorConfig } from "../../shared/interfaces/enhancedGenerator.interface";
import { UnifiedDataRenderer } from "../../shared/modules/renderers/unifiedDataRenderer";

export class ConfigGUIServerService {
  private remoteEvent: RemoteEvent;
  private unifiedRenderer: UnifiedDataRenderer;
  private projectRootFolder: Folder;
  private origin: Vector3;

  constructor(projectRootFolder: Folder, origin?: Vector3) {
    this.unifiedRenderer = new UnifiedDataRenderer();
    this.projectRootFolder = projectRootFolder;
    this.origin = origin || new Vector3(0, 0, 0);

    // Create or get RemoteEvent
    let remoteEvent = ReplicatedStorage.FindFirstChild("ConfigGUIRemote") as RemoteEvent;
    if (!remoteEvent) {
      remoteEvent = new Instance("RemoteEvent");
      remoteEvent.Name = "ConfigGUIRemote";
      remoteEvent.Parent = ReplicatedStorage;
    }
    this.remoteEvent = remoteEvent;

    // Set up event listener
    this.setupEventListener();
  }

  /**
   * Sets up the remote event listener for config changes
   */
  private setupEventListener(): void {
    this.remoteEvent.OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
      const [eventType, data] = args;
      
      // We only handle enhanced mode now with the unified renderer
      if (eventType === "regenerateEnhanced" && typeIs(data, "table")) {
        const enhancedConfig = data as EnhancedGeneratorConfig;
        print(`📡 Received enhanced regenerate request from ${player.Name}`);
        
        // Validate the enhanced config
        if (this.validateEnhancedConfig(enhancedConfig)) {
          // Use unified renderer which handles everything
          this.unifiedRenderer.renderEnhancedData(this.projectRootFolder, enhancedConfig, this.origin);
          
          // Send success response
          this.remoteEvent.FireClient(player, "regenerateSuccess", enhancedConfig);
        } else {
          // Send error response
          this.remoteEvent.FireClient(player, "regenerateError", "Invalid enhanced configuration");
        }
      } else if (eventType === "clearGraph") {
        print(`🗑️ Received clear graph request from ${player.Name}`);
        
        // Delete the GraphMaker folder
        const graphMakerFolder = this.projectRootFolder.FindFirstChild("GraphMaker");
        if (graphMakerFolder) {
          graphMakerFolder.Destroy();
          print("✅ GraphMaker folder deleted");
        }
        
        // Send success response
        this.remoteEvent.FireClient(player, "clearSuccess");
      } else if (eventType === "updateEnhanced" && typeIs(data, "table")) {
        const enhancedConfig = data as EnhancedGeneratorConfig;
        print(`🔄 Received update request from ${player.Name}`);
        
        // Validate the enhanced config
        if (this.validateEnhancedConfig(enhancedConfig)) {
          // Use unified renderer's update method
          this.unifiedRenderer.updateEnhancedData(this.projectRootFolder, enhancedConfig, this.origin);
          
          // Send success response
          this.remoteEvent.FireClient(player, "updateSuccess", enhancedConfig);
        } else {
          // Send error response
          this.remoteEvent.FireClient(player, "updateError", "Invalid enhanced configuration");
        }
      }
    });
  }

  /**
   * Validates the enhanced configuration from client
   */
  private validateEnhancedConfig(config: EnhancedGeneratorConfig): boolean {
    // Check basic structure
    if (!config.numNodeTypes || !config.numLinkTypes || !config.layers) {
      return false;
    }
    
    // Validate number ranges
    if (config.numNodeTypes < 1 || config.numNodeTypes > 10) return false;
    if (config.numLinkTypes < 1 || config.numLinkTypes > 10) return false;
    
    // Validate layers
    if (!typeIs(config.layers, "table") || config.layers.size() === 0) {
      return false;
    }
    
    // Validate each layer
    for (const layer of config.layers) {
      if (!layer.numNodes || layer.numNodes < 1 || layer.numNodes > 50) return false;
      if (layer.connectionsPerNode === undefined || layer.connectionsPerNode < 0 || layer.connectionsPerNode > 20) return false;
      // nodeType and linkType are now optional
    }
    
    return true;
  }
}