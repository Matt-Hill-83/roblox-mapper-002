import { ReplicatedStorage } from "@rbxts/services";
import { GeneratorConfig } from "../../shared/interfaces/simpleDataGenerator.interface";
import { TestSimpleDataGeneratorService } from "./testSimpleDataGenerator.service";

export class ConfigGUIServerService {
  private remoteEvent: RemoteEvent;
  private testGenerator: TestSimpleDataGeneratorService;
  private myStuffFolder: Folder;

  constructor(testGenerator: TestSimpleDataGeneratorService, myStuffFolder: Folder) {
    this.testGenerator = testGenerator;
    this.myStuffFolder = myStuffFolder;

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
      if (eventType === "regenerate" && typeIs(data, "table")) {
        const config = data as Partial<GeneratorConfig>;
        print(`📡 Received regenerate request from ${player.Name}`);
        
        // Validate the config
        if (this.validateConfig(config)) {
          // Regenerate with new config
          this.testGenerator.regenerateWithConfig(this.myStuffFolder, config);
          
          // Send success response
          this.remoteEvent.FireClient(player, "regenerateSuccess", config);
        } else {
          // Send error response
          this.remoteEvent.FireClient(player, "regenerateError", "Invalid configuration");
        }
      }
    });
  }

  /**
   * Validates the configuration from client
   */
  private validateConfig(config: Partial<GeneratorConfig>): boolean {
    // Check if all required fields are present and valid
    const requiredFields: Array<keyof GeneratorConfig> = [
      "numLevel1Nodes", "numLevel2Nodes", "numLevel3Nodes", 
      "childrenPerNode", "numNodeTypes", "numLinkTypes"
    ];

    for (const field of requiredFields) {
      const value = config[field];
      if (value === undefined || !typeIs(value, "number") || value < 1) {
        return false;
      }
    }

    // Additional validation for specific fields
    if (config.numLevel1Nodes && config.numLevel1Nodes > 10) return false;
    if (config.numLevel2Nodes && config.numLevel2Nodes > 50) return false;
    if (config.numLevel3Nodes && config.numLevel3Nodes > 100) return false;
    if (config.childrenPerNode && config.childrenPerNode > 10) return false;
    if (config.numNodeTypes && config.numNodeTypes > 10) return false;
    if (config.numLinkTypes && config.numLinkTypes > 10) return false;

    return true;
  }

  /**
   * Sends initial config to a player
   */
  public sendInitialConfig(player: Player, config: GeneratorConfig): void {
    this.remoteEvent.FireClient(player, "initialConfig", config);
  }
}