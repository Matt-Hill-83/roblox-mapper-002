import { ReplicatedStorage } from "@rbxts/services";
import { ConfigGUIService } from "../services/configGui";
import { EnhancedGeneratorConfig } from "../../shared/interfaces/enhancedGenerator.interface";
import { BaseService } from "../../shared/services/base/BaseService";
import { validateEnhancedGeneratorConfig } from "../../shared/utils/validation";

export class ConfigGUIController extends BaseService {
  private guiService?: ConfigGUIService;
  private remoteEvent?: RemoteEvent;

  /**
   * Initializes the configuration GUI controller
   */
  constructor() {
    super("ConfigGUIController");
  }
  
  public initialize(): void {
    // Wait for remote event
    const remoteEvent = ReplicatedStorage.WaitForChild(
      "ConfigGUIRemote"
    ) as RemoteEvent;
    this.remoteEvent = remoteEvent;

    // Set up event listeners
    this.setupEventListeners();

    // Wait for initial config from server before creating GUI
    // The GUI will be created when we receive the initial config
  }

  /**
   * Sets up remote event listeners
   */
  private setupEventListeners(): void {
    if (!this.remoteEvent) return;

    const eventConnection = this.remoteEvent.OnClientEvent.Connect(
      (eventType: string, data?: unknown) => {
        
        if (eventType === "initialConfig" && typeIs(data, "table")) {
          // Check if it's an enhanced config (has layers property)
          const configData = data as { layers?: unknown };
          if (configData.layers) {
            const enhancedConfig = data as EnhancedGeneratorConfig;
            
            if (!this.guiService) {
              // First time receiving config - create GUI with initial values
              
              this.guiService = new ConfigGUIService({
                onEnhancedConfigChange: (config) =>
                  this.onEnhancedConfigChange(config),
                onClearRequest: () => this.onClearRequest(),
                onUpdateRequest: (config) => this.onUpdateRequest(config),
                initialConfig: enhancedConfig,
              });
              this.guiService.createGUI();
            } else {
              // GUI already exists - just update it
              this.guiService.updateEnhancedConfig(enhancedConfig);
            }
          } else {
            // Simple mode no longer supported
          }
        } else if (eventType === "regenerateSuccess") {
        } else if (eventType === "regenerateError") {
          warn("❌ Regeneration failed:", data);
        } else if (eventType === "updateSuccess") {
        } else if (eventType === "updateError") {
          warn("❌ Update failed:", data);
        } else if (eventType === "triggerGeneration" && typeIs(data, "table")) {
          // Automatic generation triggered by server
          const enhancedConfig = data as EnhancedGeneratorConfig;
          if (this.guiService) {
            // Update the GUI with the config
            this.guiService.updateEnhancedConfig(enhancedConfig);
            // Trigger generation
            this.onEnhancedConfigChange(enhancedConfig);
          }
        }
      }
    );
    
    // Add connection to be managed
    this.addConnection(eventConnection);
  }

  /**
   * Handles enhanced configuration changes from the GUI
   */
  private onEnhancedConfigChange(config: EnhancedGeneratorConfig): void {
    if (this.remoteEvent) {
      // Validate configuration before sending
      const validationResult = validateEnhancedGeneratorConfig(config);
      
      if (validationResult.isValid && validationResult.sanitizedConfig) {
        this.remoteEvent.FireServer("regenerateEnhanced", validationResult.sanitizedConfig);
      } else {
        // Show validation errors in GUI
        const errorMessage = validationResult.errors.join("\n");
        warn(`❌ Configuration validation failed:\n${errorMessage}`);
        
        if (this.guiService) {
          this.guiService.showError(`Validation failed: ${validationResult.errors[0]}`);
        }
      }
    }
  }

  /**
   * Handles clear request from the GUI
   */
  private onClearRequest(): void {
    if (this.remoteEvent) {
      this.remoteEvent.FireServer("clearGraph");
    }
  }

  /**
   * Handles update request from the GUI
   */
  private onUpdateRequest(config: EnhancedGeneratorConfig): void {
    if (this.remoteEvent) {
      // Validate configuration before sending
      const validationResult = validateEnhancedGeneratorConfig(config);
      
      if (validationResult.isValid && validationResult.sanitizedConfig) {
        this.remoteEvent.FireServer("updateEnhanced", validationResult.sanitizedConfig);
      } else {
        // Show validation errors in GUI
        const errorMessage = validationResult.errors.join("\n");
        warn(`❌ Update validation failed:\n${errorMessage}`);
        
        if (this.guiService) {
          this.guiService.showError(`Validation failed: ${validationResult.errors[0]}`);
        }
      }
    }
  }

  /**
   * Custom cleanup logic
   */
  protected onDestroy(): void {
    if (this.guiService) {
      this.guiService.destroy();
      this.guiService = undefined;
    }
    
  }
}
