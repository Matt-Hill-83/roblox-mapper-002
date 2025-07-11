/**
 * Event Handlers for Configuration GUI
 * 
 * Centralizes all event handling logic for the configuration GUI,
 * providing clean separation of concerns and easier testing.
 */

import { EnhancedGeneratorConfig } from "./interfaces";
import { GUIStateManager } from "./stateManager";
import { updateStatus } from "./components/status";
import { validateEnhancedConfig } from "./validationHandlers";

export interface EventHandlerOptions {
  stateManager: GUIStateManager;
  onEnhancedConfigChange?: (config: EnhancedGeneratorConfig) => void;
  onClearRequest?: () => void;
  onUpdateRequest?: (config: EnhancedGeneratorConfig) => void;
}

export class GUIEventHandlers {
  private stateManager: GUIStateManager;
  private onEnhancedConfigChange?: (config: EnhancedGeneratorConfig) => void;
  private onClearRequest?: () => void;
  private onUpdateRequest?: (config: EnhancedGeneratorConfig) => void;

  constructor(options: EventHandlerOptions) {
    this.stateManager = options.stateManager;
    this.onEnhancedConfigChange = options.onEnhancedConfigChange;
    this.onClearRequest = options.onClearRequest;
    this.onUpdateRequest = options.onUpdateRequest;
  }

  /**
   * Handles spacing field changes
   */
  public handleSpacingChange<K extends keyof import("../../../shared/interfaces/enhancedGenerator.interface").SpacingConfig>(
    field: K,
    value: import("../../../shared/interfaces/enhancedGenerator.interface").SpacingConfig[K]
  ): void {
    this.stateManager.updateSpacing(field, value);
    this.updateStatusMessage(`${field} updated to ${value}`);
  }


  /**
   * Handles layer updates
   */
  public handleLayerUpdate(layers: EnhancedGeneratorConfig["layers"]): void {
    this.stateManager.setLayers(layers);
    this.updateStatusMessage(`${layers.size()} layers configured`);
  }

  /**
   * Handles visualization option changes
   */
  public handleVisualizationChange<K extends keyof import("../../../shared/interfaces/enhancedGenerator.interface").VisualizationOptions>(
    field: K,
    value: import("../../../shared/interfaces/enhancedGenerator.interface").VisualizationOptions[K]
  ): void {
    this.stateManager.updateVisualization(field, value);
    this.updateStatusMessage(`Visualization option "${field}" changed`);
    
    // Trigger immediate update without regeneration
    if (this.onEnhancedConfigChange) {
      const config = this.stateManager.getEnhancedConfig();
      this.onEnhancedConfigChange(config);
    }
  }

  /**
   * Handles regenerate button click
   */
  public handleRegenerateClick(): void {
    const config = this.stateManager.getEnhancedConfig();
    
    // Validate configuration
    const validationResult = validateEnhancedConfig(config);
    if (!validationResult.isValid) {
      this.updateStatusMessage(validationResult.error || "Invalid configuration", true);
      return;
    }

    if (config.layers.size() === 0) {
      this.updateStatusMessage("No layers configured!", true);
      return;
    }

    if (this.onEnhancedConfigChange) {
      this.updateStatusMessage("Regenerating with new configuration...");
      this.onEnhancedConfigChange(config);
      this.updateStatusMessage("Regeneration complete");
    }
  }

  /**
   * Handles update button click
   */
  public handleUpdateClick(): void {
    const config = this.stateManager.getEnhancedConfig();
    
    // Validate configuration
    const validationResult = validateEnhancedConfig(config);
    if (!validationResult.isValid) {
      this.updateStatusMessage(validationResult.error || "Invalid configuration", true);
      return;
    }

    if (config.layers.size() === 0) {
      this.updateStatusMessage("No layers configured!", true);
      return;
    }

    if (this.onUpdateRequest) {
      this.updateStatusMessage("Updating existing graph...");
      this.onUpdateRequest(config);
      this.updateStatusMessage("Update complete");
    }
  }

  /**
   * Handles clear button click
   */
  public handleClearClick(recreateGUI: () => void): void {
    // Send clear request to server to delete GraphMaker folder
    if (this.onClearRequest) {
      this.onClearRequest();
    }
    
    // Reset configuration
    this.stateManager.resetConfig();
    
    // Destroy current GUI elements
    const state = this.stateManager.getState();
    if (state.configFrame) {
      state.configFrame.Destroy();
    }
    
    // Recreate the GUI with reset state
    recreateGUI();
    this.updateStatusMessage("Configuration and graph cleared");
  }

  /**
   * Updates the status message
   */
  private updateStatusMessage(message: string, isError = false): void {
    const state = this.stateManager.getState();
    if (state.statusLabel) {
      updateStatus(state.statusLabel, message, isError);
    }
  }

  /**
   * Handles export config button click
   */
  public handleExportConfigClick(): void {
    // Export configuration data
    this.stateManager.getEnhancedConfig();
    
    this.updateStatusMessage("Configuration exported to console");
  }

  /**
   * Generates an array of type names
   */
  public generateTypeArray(prefix: string, count: number): string[] {
    const types: string[] = [];
    for (let i = 0; i < count; i++) {
      types.push(`${prefix} ${string.char(65 + i)}`); // A, B, C, etc.
    }
    return types;
  }
}