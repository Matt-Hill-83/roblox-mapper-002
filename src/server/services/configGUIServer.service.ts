import { ReplicatedStorage } from "@rbxts/services";
import { UnifiedDataRenderer } from "../../shared/modules/renderers/unifiedDataRenderer";
import { BaseService } from "../../shared/services/base/BaseService";
import { validateEnhancedGeneratorConfig, validateRemoteData } from "../../shared/utils/validation";
import { LinkTypeCounterServerService } from "./linkTypeCounterServer.service";

export class ConfigGUIServerService extends BaseService {
  private remoteEvent: RemoteEvent;
  private unifiedRenderer: UnifiedDataRenderer;
  private linkTypeCounterService?: LinkTypeCounterServerService;
  private projectRootFolder: Folder;
  private origin: Vector3;
  private defaultAxisOptions?: { [key: string]: string };

  constructor(projectRootFolder: Folder, origin?: Vector3, linkTypeCounterService?: LinkTypeCounterServerService, defaultAxisOptions?: { [key: string]: string }) {
    super("ConfigGUIServerService");
    this.unifiedRenderer = new UnifiedDataRenderer();
    this.projectRootFolder = projectRootFolder;
    this.origin = origin || new Vector3(0, 0, 0);
    this.linkTypeCounterService = linkTypeCounterService;
    this.defaultAxisOptions = defaultAxisOptions;

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
        
        // Use comprehensive validation
        const validationResult = validateEnhancedGeneratorConfig(data);
        
        if (validationResult.isValid && validationResult.sanitizedConfig) {
          // Use unified renderer with sanitized config
          const cluster = this.unifiedRenderer.renderEnhancedData(
            this.projectRootFolder, 
            validationResult.sanitizedConfig, 
            this.origin
          );
          
          // Update link type counter with the new links
          if (this.linkTypeCounterService && cluster && cluster.relations) {
            this.linkTypeCounterService.updateLinks(cluster.relations);
          }
          
          // Send success response with discovered properties
          this.remoteEvent.FireClient(player, "regenerateSuccess", validationResult.sanitizedConfig);
          
          // Send discovered properties if available
          if (cluster && cluster.discoveredProperties) {
            this.remoteEvent.FireClient(player, "discoveredProperties", cluster.discoveredProperties);
          }
        } else {
          // Send detailed error response
          const errorMessage = validationResult.errors.join("; ");
          warn(`[ConfigGUIServerService] Validation errors: ${errorMessage}`);
          this.remoteEvent.FireClient(player, "regenerateError", errorMessage);
        }
      } else if (eventType === "clearGraph") {
        
        // Delete the GraphMaker folder
        const graphMakerFolder = this.projectRootFolder.FindFirstChild("GraphMaker");
        if (graphMakerFolder) {
          graphMakerFolder.Destroy();
        }
        
        // Delete the flat block foundation
        const flatBlock = this.projectRootFolder.FindFirstChild("FlatBlockFoundation");
        if (flatBlock) {
          flatBlock.Destroy();
        }
        
        // Send success response
        this.remoteEvent.FireClient(player, "clearSuccess");
      } else if (eventType === "debugLinkTypesGUI") {
        // Debug function to search for LinkTypesDisplay GUI
        print("[ConfigGUIServerService] Debug LinkTypes GUI request received");
        
        // We need to call this on the client side, so we'll fire back to the client
        // to run the debug function there
        this.remoteEvent.FireClient(player, "runDebugLinkTypesGUI");
        
      } else if (eventType === "updateEnhanced" && typeIs(data, "table")) {
        
        // Use comprehensive validation
        const validationResult = validateEnhancedGeneratorConfig(data);
        
        if (validationResult.isValid && validationResult.sanitizedConfig) {
          // Use unified renderer's update method with sanitized config
          const clusterOrVoid = this.unifiedRenderer.updateEnhancedData(
            this.projectRootFolder, 
            validationResult.sanitizedConfig, 
            this.origin
          );
          
          // Update link type counter if we got a new cluster
          if (this.linkTypeCounterService && clusterOrVoid && typeIs(clusterOrVoid, "table") && clusterOrVoid.relations) {
            this.linkTypeCounterService.updateLinks(clusterOrVoid.relations);
          }
          
          // Send success response
          this.remoteEvent.FireClient(player, "updateSuccess", validationResult.sanitizedConfig);
          
          // Send discovered properties if a new cluster was created
          if (clusterOrVoid && typeIs(clusterOrVoid, "table") && clusterOrVoid.discoveredProperties) {
            this.remoteEvent.FireClient(player, "discoveredProperties", clusterOrVoid.discoveredProperties);
          }
        } else {
          // Send detailed error response
          const errorMessage = validationResult.errors.join("; ");
          warn(`[ConfigGUIServerService] Update validation errors: ${errorMessage}`);
          this.remoteEvent.FireClient(player, "updateError", errorMessage);
        }
      } else if (eventType === "getDefaultAxisOptions") {
        // Send default axis options to client
        this.remoteEvent.FireClient(player, "defaultAxisOptions", this.defaultAxisOptions || {});
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
    
  }
}