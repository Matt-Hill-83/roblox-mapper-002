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
  private currentFilters?: { [key: string]: string[] };
  private serverPrefilters?: { [key: string]: string[] };
  private originalPropertyValues?: { [key: string]: string[] };

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
          // Apply combined filters before rendering
          this.applyCombinedFilters();
          
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
          
          // Store original property values if not already stored
          if (!this.originalPropertyValues) {
            this.originalPropertyValues = this.getPropertyValues();
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
      } else if (eventType === "getPropertyValues") {
        // Always send original unfiltered property values
        const propertyValues = this.originalPropertyValues || this.getPropertyValues();
        this.remoteEvent.FireClient(player, "propertyValues", propertyValues);
      } else if (eventType === "updateFilters" && typeIs(data, "table")) {
        // Update filters and regenerate data
        this.currentFilters = this.convertFilterFormat(data);
        print(`[ConfigGUIServerService] Updated filters:`, this.currentFilters);
        
        // Apply combined server and client filters
        this.applyCombinedFilters();
        
        // Get current config and re-render with filters
        const currentConfig = this.unifiedRenderer.getCurrentConfig();
        if (currentConfig) {
          // Re-render the entire graph with filters applied
          const cluster = this.unifiedRenderer.renderEnhancedData(
            this.projectRootFolder, 
            currentConfig, 
            this.origin
          );
          
          // Update link type counter with the new filtered links
          if (this.linkTypeCounterService && cluster && cluster.relations) {
            this.linkTypeCounterService.updateLinks(cluster.relations);
          }
          
          // Send success response
          this.remoteEvent.FireClient(player, "regenerateSuccess", currentConfig);
          
          // Send original property values (not filtered)
          wait(0.5);
          const propertyValues = this.originalPropertyValues || this.getPropertyValues();
          this.remoteEvent.FireClient(player, "propertyValues", propertyValues);
        }
      }
    });
    
    // Add connection to be managed
    this.addConnection(eventConnection);
  }

  
  /**
   * Get unique property values from current rendered data
   */
  private getPropertyValues(): { [key: string]: string[] } {
    const propertyValues: { [key: string]: Set<string> } = {};
    
    // Get the current cluster data from the renderer
    const currentCluster = this.unifiedRenderer.getCurrentCluster();
    if (!currentCluster) {
      return {};
    }
    
    // Iterate through all nodes and collect unique values for each property
    currentCluster.groups.forEach(group => {
      group.nodes.forEach(node => {
        if (node.properties) {
          for (const [propName, propValue] of pairs(node.properties)) {
            if (typeIs(propName, "string") && propValue !== undefined) {
              if (!propertyValues[propName]) {
                propertyValues[propName] = new Set<string>();
              }
              propertyValues[propName].add(tostring(propValue));
            }
          }
        }
      });
    });
    
    // Convert sets to arrays
    const result: { [key: string]: string[] } = {};
    for (const [propName, valueSet] of pairs(propertyValues)) {
      const valuesArray: string[] = [];
      valueSet.forEach(value => valuesArray.push(value));
      valuesArray.sort();
      result[propName] = valuesArray;
    }
    
    return result;
  }

  /**
   * Convert filter format from client (Sets) to server (arrays)
   */
  private convertFilterFormat(clientFilters: any): { [key: string]: string[] } {
    const serverFilters: { [key: string]: string[] } = {};
    
    if (typeIs(clientFilters, "table")) {
      for (const [propName, filterSet] of pairs(clientFilters)) {
        if (typeIs(propName, "string") && typeIs(filterSet, "table")) {
          const values: string[] = [];
          // Convert Lua table (acting as Set) to array
          for (const [value, _] of pairs(filterSet as any)) {
            if (typeIs(value, "string")) {
              values.push(value);
            }
          }
          if (values.size() > 0) {
            serverFilters[propName] = values;
          }
        }
      }
    }
    
    return serverFilters;
  }

  /**
   * Set server-side prefilters that are always applied
   */
  public setServerPrefilters(filters: { [key: string]: string[] }): void {
    this.serverPrefilters = filters;
    // Apply combined filters to the renderer
    this.applyCombinedFilters();
  }

  /**
   * Apply both server prefilters and client filters
   */
  private applyCombinedFilters(): void {
    const combinedFilters: { [key: string]: string[] } = {};
    
    // First add server prefilters
    if (this.serverPrefilters) {
      for (const [prop, values] of pairs(this.serverPrefilters)) {
        if (typeIs(prop, "string")) {
          combinedFilters[prop] = [...values];
        }
      }
    }
    
    // Then add client filters
    if (this.currentFilters) {
      for (const [prop, values] of pairs(this.currentFilters)) {
        if (typeIs(prop, "string")) {
          if (combinedFilters[prop]) {
            // Merge with existing filters, avoiding duplicates
            const existingSet = new Set(combinedFilters[prop]);
            values.forEach(v => existingSet.add(v));
            combinedFilters[prop] = [];
            existingSet.forEach(v => combinedFilters[prop].push(v));
          } else {
            combinedFilters[prop] = [...values];
          }
        }
      }
    }
    
    // Apply combined filters to renderer
    this.unifiedRenderer.setPropertyFilters(combinedFilters);
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