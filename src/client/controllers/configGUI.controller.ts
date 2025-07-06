import { ReplicatedStorage } from "@rbxts/services";
import { ConfigGUIService } from "../services/configGui";
import { GeneratorConfig } from "../../shared/interfaces/simpleDataGenerator.interface";
import { config001 } from "../../shared/configs/simpleDataGeneratorConfigs";
import { EnhancedGeneratorConfig } from "../services/configGui/interfaces";

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

    // Create GUI with default config
    const defaultConfig: GeneratorConfig = {
      numLevel1Nodes: 1,
      numLevel2Nodes: 1,
      numLevel3Nodes: 1,
      childrenPerNode: 3,
      numNodeTypes: config001.numNodeTypes || 2,
      numLinkTypes: config001.numLinkTypes || 3,
    };

    this.guiService = new ConfigGUIService({
      initialConfig: defaultConfig,
      onConfigChange: (newConfig) => this.onConfigChange(newConfig),
      onEnhancedConfigChange: (enhancedConfig) =>
        this.onEnhancedConfigChange(enhancedConfig),
      mode: "enhanced", // Start in enhanced mode
    });
    this.guiService.createGUI();
  }

  /**
   * Sets up remote event listeners
   */
  private setupEventListeners(): void {
    if (!this.remoteEvent) return;

    this.remoteEvent.OnClientEvent.Connect(
      (eventType: string, data?: unknown) => {
        if (eventType === "initialConfig" && typeIs(data, "table")) {
          const config = data as GeneratorConfig;
          if (this.guiService) {
            this.guiService.updateConfig(config);
          }
        } else if (eventType === "regenerateSuccess") {
          print("✅ Regeneration successful!");
        } else if (eventType === "regenerateError") {
          warn("❌ Regeneration failed:", data);
        }
      }
    );
  }

  /**
   * Handles configuration changes from the GUI
   */
  private onConfigChange(config: GeneratorConfig): void {
    if (this.remoteEvent) {
      print("📤 Sending regenerate request to server...");
      this.remoteEvent.FireServer("regenerate", config);
    }
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
   * Cleans up the GUI
   */
  public destroy(): void {
    if (this.guiService) {
      this.guiService.destroy();
      this.guiService = undefined;
    }
  }
}
