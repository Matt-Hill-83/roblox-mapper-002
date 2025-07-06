import { ReplicatedStorage } from "@rbxts/services";
import { GeneratorConfig } from "../../shared/interfaces/simpleDataGenerator.interface";
import { TestSimpleDataGeneratorService } from "./testSimpleDataGenerator.service";
import { EnhancedGeneratorConfig } from "../../client/services/configGui/interfaces";
import { generateEnhancedData, convertEnhancedConfig } from "../../shared/modules/enhancedDataGenerator";

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
      } else if (eventType === "regenerateEnhanced" && typeIs(data, "table")) {
        const enhancedConfig = data as EnhancedGeneratorConfig;
        print(`📡 Received enhanced regenerate request from ${player.Name}`);
        
        // Validate the enhanced config
        if (this.validateEnhancedConfig(enhancedConfig)) {
          // Clear existing visualization
          this.clearVisualization();
          
          // Generate data using enhanced generator
          const generatorInput = convertEnhancedConfig(enhancedConfig);
          const cluster = generateEnhancedData(generatorInput);
          
          // Use the test generator to render the cluster
          this.testGenerator.renderCluster(this.myStuffFolder, cluster);
          
          // Send success response
          this.remoteEvent.FireClient(player, "regenerateSuccess", enhancedConfig);
        } else {
          // Send error response
          this.remoteEvent.FireClient(player, "regenerateError", "Invalid enhanced configuration");
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
      if (!layer.nodeType || !layer.linkType) return false;
    }
    
    return true;
  }
  
  /**
   * Clears the existing visualization
   */
  private clearVisualization(): void {
    // Clear all children in myStuffFolder
    const children = this.myStuffFolder.GetChildren();
    children.forEach(child => {
      if (child.Name !== "KeepMe") { // Don't delete any placeholder objects
        child.Destroy();
      }
    });
  }

  /**
   * Sends initial config to a player
   */
  public sendInitialConfig(player: Player, config: GeneratorConfig): void {
    this.remoteEvent.FireClient(player, "initialConfig", config);
  }
}