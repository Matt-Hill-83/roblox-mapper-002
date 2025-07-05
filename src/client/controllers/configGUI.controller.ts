import { ReplicatedStorage } from "@rbxts/services";
import { ConfigGUIService } from "../services/configGui/configGUI.service";
import { GeneratorConfig } from "../../shared/interfaces/simpleDataGenerator.interface";
import { config001 } from "../../shared/configs/simpleDataGeneratorConfigs";

export class ConfigGUIController {
  private guiService?: ConfigGUIService;
  private remoteEvent?: RemoteEvent;

  /**
   * Initializes the configuration GUI controller
   */
  public initialize(): void {
    // Wait for remote event
    const remoteEvent = ReplicatedStorage.WaitForChild("ConfigGUIRemote") as RemoteEvent;
    this.remoteEvent = remoteEvent;

    // Set up event listeners
    this.setupEventListeners();

    // Create GUI with default config
    const defaultConfig: GeneratorConfig = {
      numLevel1Nodes: 1,
      numLevel2Nodes: 6,
      numLevel3Nodes: 12,
      childrenPerNode: 3,
      numNodeTypes: config001.numNodeTypes || 2,
      numLinkTypes: config001.numLinkTypes || 3
    };

    this.guiService = new ConfigGUIService(defaultConfig);
    this.guiService.createGUI((newConfig) => this.onConfigChange(newConfig));
  }

  /**
   * Sets up remote event listeners
   */
  private setupEventListeners(): void {
    if (!this.remoteEvent) return;

    this.remoteEvent.OnClientEvent.Connect((eventType: string, data?: unknown) => {
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
    });
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
   * Cleans up the GUI
   */
  public destroy(): void {
    if (this.guiService) {
      this.guiService.destroy();
      this.guiService = undefined;
    }
  }
}