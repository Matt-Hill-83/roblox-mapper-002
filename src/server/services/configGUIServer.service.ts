import { ReplicatedStorage } from "@rbxts/services";
import { UnifiedDataRenderer } from "../../shared/modules/renderers/unifiedDataRenderer";
import { BaseService } from "../../shared/services/base/BaseService";
import { validateEnhancedGeneratorConfig, validateRemoteData } from "../../shared/utils/validation";

export class ConfigGUIServerService extends BaseService {
  private remoteEvent: RemoteEvent;
  private unifiedRenderer: UnifiedDataRenderer;
  private projectRootFolder: Folder;
  private origin: Vector3;

  constructor(projectRootFolder: Folder, origin?: Vector3) {
    super("ConfigGUIServerService");
    this.unifiedRenderer = new UnifiedDataRenderer();
    this.projectRootFolder = projectRootFolder;
    this.origin = origin || new Vector3(0, 0, 0);

    // Create or get RemoteEvent
    let remoteEvent = ReplicatedStorage.FindFirstChild("ConfigGUIRemote") as RemoteEvent;
    if (!remoteEvent) {
      remoteEvent = new Instance("RemoteEvent");
      remoteEvent.Name = "ConfigGUIRemote";
      remoteEvent.Parent = ReplicatedStorage;
      // Track the instance for cleanup
      this.addInstance(remoteEvent);
    }
    this.remoteEvent = remoteEvent;

    // Set up event listener
    this.setupEventListener();
  }

  /**
   * Sets up the remote event listener for config changes
   */
  private setupEventListener(): void {
    const eventConnection = this.remoteEvent.OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
      const [eventType, data] = args;
      
      // First validate remote data size and structure
      const remoteValidation = validateRemoteData(data);
      if (!remoteValidation.isValid) {
        warn(`[ConfigGUIServerService] Invalid remote data from ${player.Name}: ${remoteValidation.error}`);
        this.remoteEvent.FireClient(player, "error", remoteValidation.error);
        return;
      }
      
      // We only handle enhanced mode now with the unified renderer
      if (eventType === "regenerateEnhanced" && typeIs(data, "table")) {
        print(`📡 Received enhanced regenerate request from ${player.Name}`);
        
        // Use comprehensive validation
        const validationResult = validateEnhancedGeneratorConfig(data);
        
        if (validationResult.isValid && validationResult.sanitizedConfig) {
          // Use unified renderer with sanitized config
          this.unifiedRenderer.renderEnhancedData(
            this.projectRootFolder, 
            validationResult.sanitizedConfig, 
            this.origin
          );
          
          // Send success response
          this.remoteEvent.FireClient(player, "regenerateSuccess", validationResult.sanitizedConfig);
        } else {
          // Send detailed error response
          const errorMessage = validationResult.errors.join("; ");
          warn(`[ConfigGUIServerService] Validation errors: ${errorMessage}`);
          this.remoteEvent.FireClient(player, "regenerateError", errorMessage);
        }
      } else if (eventType === "clearGraph") {
        print(`🗑️ Received clear graph request from ${player.Name}`);
        
        // Delete the GraphMaker folder
        const graphMakerFolder = this.projectRootFolder.FindFirstChild("GraphMaker");
        if (graphMakerFolder) {
          graphMakerFolder.Destroy();
          print("✅ GraphMaker folder deleted");
        }
        
        // Delete the flat block foundation
        const flatBlock = this.projectRootFolder.FindFirstChild("FlatBlockFoundation");
        if (flatBlock) {
          flatBlock.Destroy();
          print("✅ Flat block foundation deleted");
        }
        
        // Send success response
        this.remoteEvent.FireClient(player, "clearSuccess");
      } else if (eventType === "updateEnhanced" && typeIs(data, "table")) {
        print(`🔄 Received update request from ${player.Name}`);
        
        // Use comprehensive validation
        const validationResult = validateEnhancedGeneratorConfig(data);
        
        if (validationResult.isValid && validationResult.sanitizedConfig) {
          // Use unified renderer's update method with sanitized config
          this.unifiedRenderer.updateEnhancedData(
            this.projectRootFolder, 
            validationResult.sanitizedConfig, 
            this.origin
          );
          
          // Send success response
          this.remoteEvent.FireClient(player, "updateSuccess", validationResult.sanitizedConfig);
        } else {
          // Send detailed error response
          const errorMessage = validationResult.errors.join("; ");
          warn(`[ConfigGUIServerService] Update validation errors: ${errorMessage}`);
          this.remoteEvent.FireClient(player, "updateError", errorMessage);
        }
      }
    });
    
    // Add connection to be managed
    this.addConnection(eventConnection);
  }

  
  /**
   * Custom cleanup logic
   */
  protected onDestroy(): void {
    // Clean up the unified renderer if it has a destroy method
    if (this.unifiedRenderer && "destroy" in this.unifiedRenderer) {
      const renderer = this.unifiedRenderer as unknown as { destroy?: () => void };
      if (renderer.destroy) {
        renderer.destroy();
      }
    }
    
    print("[ConfigGUIServerService] Cleaned up");
  }
}