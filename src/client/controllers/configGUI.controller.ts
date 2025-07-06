import { ReplicatedStorage } from "@rbxts/services";
import { ConfigGUIService } from "../services/configGui";
import { EnhancedGeneratorConfig } from "../../shared/interfaces/enhancedGenerator.interface";

export class ConfigGUIController {
  private guiService?: ConfigGUIService;
  private remoteEvent?: RemoteEvent;

  /**
   * Initializes the configuration GUI controller
   */
  public initialize(): void {
    // Wait for remote event
    const remoteEvent = ReplicatedStorage.WaitForChild(
      "ConfigGUIRemote"
    ) as RemoteEvent;
    this.remoteEvent = remoteEvent;

    // Set up event listeners
    this.setupEventListeners();

    // Wait for initial config from server before creating GUI
    print("🕰️ Waiting for initial configuration from server...");
    // The GUI will be created when we receive the initial config
  }

  /**
   * Sets up remote event listeners
   */
  private setupEventListeners(): void {
    if (!this.remoteEvent) return;

    this.remoteEvent.OnClientEvent.Connect(
      (eventType: string, data?: unknown) => {
        print(`🔔 Client received event: ${eventType}`);
        
        if (eventType === "initialConfig" && typeIs(data, "table")) {
          // Check if it's an enhanced config (has layers property)
          const configData = data as { layers?: unknown };
          if (configData.layers) {
            const enhancedConfig = data as EnhancedGeneratorConfig;
            print(`📄 Received enhanced config with ${enhancedConfig.layers.size()} layers`);
            
            if (!this.guiService) {
              // First time receiving config - create GUI with initial values
              print("🎆 Creating GUI with server configuration");
              print(`   - Node types: ${enhancedConfig.numNodeTypes}`);
              print(`   - Link types: ${enhancedConfig.numLinkTypes}`);
              print(`   - Layers: ${enhancedConfig.layers.size()}`);
              
              this.guiService = new ConfigGUIService({
                onEnhancedConfigChange: (config) =>
                  this.onEnhancedConfigChange(config),
                onClearRequest: () => this.onClearRequest(),
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
          print("✅ Regeneration successful!");
        } else if (eventType === "regenerateError") {
          warn("❌ Regeneration failed:", data);
        } else if (eventType === "triggerGeneration" && typeIs(data, "table")) {
          // Automatic generation triggered by server
          print("🚀 Auto-generating graph from server trigger...");
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
  }

  /**
   * Handles enhanced configuration changes from the GUI
   */
  private onEnhancedConfigChange(config: EnhancedGeneratorConfig): void {
    if (this.remoteEvent) {
      print("📤 Sending enhanced regenerate request to server...");
      this.remoteEvent.FireServer("regenerateEnhanced", config);
    }
  }

  /**
   * Handles clear request from the GUI
   */
  private onClearRequest(): void {
    if (this.remoteEvent) {
      print("🗑️ Sending clear request to server...");
      this.remoteEvent.FireServer("clearGraph");
    }
  }

  /**
   * Cleans up the GUI
   */
  public destroy(): void {
    if (this.guiService) {
      this.guiService.destroy();
      this.guiService = undefined;
    }
  }
}
