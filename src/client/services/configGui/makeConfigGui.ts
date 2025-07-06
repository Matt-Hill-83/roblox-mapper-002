/**
 * Configuration GUI Service
 * 
 * Implements the Screen GUI specification defined in:
 * 000ProjectSpecification/002ScreenGuiSpec.md
 * 
 * This service provides the user interface for configuring the simple data generator
 * with level-based node counts and other parameters.
 */

import { Players } from "@rbxts/services";
import { GeneratorConfig } from "../../../shared/interfaces/simpleDataGenerator.interface";
import { GUI_CONSTANTS } from "./constants";
import { GUIState, EnhancedGeneratorConfig, ConfigGUIServiceOptions } from "./interfaces";
import { validateAndUpdateInput } from "./utilities";
import { createMainFrame } from "./components/frame";
import { createTitle } from "./components/title";
import { createInputFields } from "./components/inputFields";
import { createRegenerateButton } from "./components/regenerateButton";
import { createGlobalSettings } from "./components/globalSettings";
import { createLayerGrid } from "./components/layerGrid";
import { createStatusArea, updateStatus } from "./components/status";

export class ConfigGUIService {
  private state: GUIState;
  private onConfigChange?: (config: GeneratorConfig) => void;
  private onEnhancedConfigChange?: (config: EnhancedGeneratorConfig) => void;

  constructor(options: ConfigGUIServiceOptions) {
    this.state = {
      isVisible: false,
      mode: options.mode || "simple",
      currentConfig: { ...options.initialConfig },
      enhancedConfig: {
        numNodeTypes: 3,
        numLinkTypes: 3,
        layers: []
      },
      inputs: new Map(),
      layerRows: []
    };
    
    this.onConfigChange = options.onConfigChange;
    this.onEnhancedConfigChange = options.onEnhancedConfigChange;
  }

  /**
   * Creates and displays the configuration GUI
   */
  public createGUI(): void {
    const player = Players.LocalPlayer;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

    // Create ScreenGui
    this.state.gui = new Instance("ScreenGui");
    this.state.gui.Name = GUI_CONSTANTS.NAMES.SCREEN_GUI;
    this.state.gui.ResetOnSpawn = false;
    this.state.gui.Parent = playerGui;

    // Create main frame with appropriate size based on mode
    const frameSize = this.state.mode === "enhanced" 
      ? new UDim2(0, GUI_CONSTANTS.FRAME.ENHANCED_WIDTH, 0, GUI_CONSTANTS.FRAME.ENHANCED_HEIGHT)
      : new UDim2(0, GUI_CONSTANTS.FRAME.WIDTH, 0, GUI_CONSTANTS.FRAME.HEIGHT);
    
    this.state.configFrame = createMainFrame(this.state.gui, frameSize);

    // Add title
    createTitle(this.state.configFrame);

    if (this.state.mode === "simple") {
      // Create simple mode UI
      this.createSimpleUI();
    } else {
      // Create enhanced mode UI
      this.createEnhancedUI();
    }

    this.state.isVisible = true;
  }

  /**
   * Creates the simple mode UI
   */
  private createSimpleUI(): void {
    if (!this.state.configFrame) return;
    
    // Create input fields
    createInputFields({
      configFrame: this.state.configFrame,
      currentConfig: this.state.currentConfig,
      inputs: this.state.inputs,
      validateAndUpdateInput: (input, key, min, max) => 
        validateAndUpdateInput(input, this.state.currentConfig, key, min, max)
    });

    // Create regenerate button
    createRegenerateButton({
      configFrame: this.state.configFrame,
      onRegenerateClick: () => this.onRegenerateClick()
    });
  }

  /**
   * Creates the enhanced mode UI
   */
  private createEnhancedUI(): void {
    if (!this.state.configFrame) return;
    
    // Create global settings
    createGlobalSettings({
      parent: this.state.configFrame,
      numNodeTypes: this.state.enhancedConfig.numNodeTypes,
      numLinkTypes: this.state.enhancedConfig.numLinkTypes,
      onNodeTypesChange: (value) => {
        this.state.enhancedConfig.numNodeTypes = value;
        this.updateStatus("Node types updated");
      },
      onLinkTypesChange: (value) => {
        this.state.enhancedConfig.numLinkTypes = value;
        this.updateStatus("Link types updated");
      }
    });

    // Generate node and link type arrays
    const nodeTypes = this.generateTypeArray("Type", this.state.enhancedConfig.numNodeTypes);
    const linkTypes = this.generateTypeArray("Link", this.state.enhancedConfig.numLinkTypes);

    // Create layer grid
    createLayerGrid({
      parent: this.state.configFrame,
      onLayerUpdate: (layers) => {
        this.state.enhancedConfig.layers = layers;
        this.updateStatus(`${layers.size()} layers configured`);
      },
      nodeTypes,
      linkTypes
    });

    // Create action buttons
    this.createActionButtons();

    // Create status area
    this.state.statusLabel = createStatusArea({
      parent: this.state.configFrame
    });
  }

  /**
   * Creates action buttons for enhanced mode
   */
  private createActionButtons(): void {
    if (!this.state.configFrame) return;
    
    const buttonY = this.state.configFrame.Size.Y.Offset - 70;
    
    // Regenerate button
    const regenerateButton = new Instance("TextButton");
    regenerateButton.Name = "RegenerateButton";
    regenerateButton.Size = new UDim2(0, GUI_CONSTANTS.BUTTON.WIDTH, 0, GUI_CONSTANTS.BUTTON.HEIGHT);
    regenerateButton.Position = new UDim2(0, 10, 0, buttonY);
    regenerateButton.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.DEFAULT;
    regenerateButton.BorderSizePixel = 0;
    regenerateButton.Font = GUI_CONSTANTS.TYPOGRAPHY.BUTTON_FONT;
    regenerateButton.Text = "Regenerate";
    regenerateButton.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    regenerateButton.TextScaled = true;
    regenerateButton.Parent = this.state.configFrame;

    const regenerateCorner = new Instance("UICorner");
    regenerateCorner.CornerRadius = new UDim(0, 4);
    regenerateCorner.Parent = regenerateButton;

    regenerateButton.MouseButton1Click.Connect(() => this.onEnhancedRegenerateClick());

    // Clear button
    const clearButton = new Instance("TextButton");
    clearButton.Name = "ClearButton";
    clearButton.Size = new UDim2(0, GUI_CONSTANTS.BUTTON.WIDTH, 0, GUI_CONSTANTS.BUTTON.HEIGHT);
    clearButton.Position = new UDim2(0, 10 + GUI_CONSTANTS.BUTTON.WIDTH + GUI_CONSTANTS.BUTTON.SPACING, 0, buttonY);
    clearButton.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.DEFAULT;
    clearButton.BorderSizePixel = 0;
    clearButton.Font = GUI_CONSTANTS.TYPOGRAPHY.BUTTON_FONT;
    clearButton.Text = "Clear";
    clearButton.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    clearButton.TextScaled = true;
    clearButton.Parent = this.state.configFrame;

    const clearCorner = new Instance("UICorner");
    clearCorner.CornerRadius = new UDim(0, 4);
    clearCorner.Parent = clearButton;

    clearButton.MouseButton1Click.Connect(() => this.onClearClick());
  }

  /**
   * Generates an array of type names
   */
  private generateTypeArray(prefix: string, count: number): string[] {
    const types: string[] = [];
    for (let i = 0; i < count; i++) {
      types.push(`${prefix} ${string.char(65 + i)}`); // A, B, C, etc.
    }
    return types;
  }

  /**
   * Updates the status message
   */
  private updateStatus(message: string, isError = false): void {
    if (this.state.statusLabel) {
      updateStatus(this.state.statusLabel, message, isError);
    }
  }

  /**
   * Handles regenerate button click in simple mode
   */
  private onRegenerateClick(): void {
    if (this.onConfigChange) {
      // Gather all current values
      const newConfig: GeneratorConfig = { ...this.state.currentConfig };
      
      // Trigger the callback
      this.onConfigChange(newConfig);
    }
  }

  /**
   * Handles regenerate button click in enhanced mode
   */
  private onEnhancedRegenerateClick(): void {
    if (this.state.enhancedConfig.layers.size() === 0) {
      this.updateStatus("No layers configured!", true);
      return;
    }

    if (this.onEnhancedConfigChange) {
      this.updateStatus("Regenerating with new configuration...");
      this.onEnhancedConfigChange(this.state.enhancedConfig);
      this.updateStatus("Regeneration complete");
    }
  }

  /**
   * Handles clear button click
   */
  private onClearClick(): void {
    // Clear all layers
    this.state.enhancedConfig.layers = [];
    
    // Reset global settings
    this.state.enhancedConfig.numNodeTypes = 3;
    this.state.enhancedConfig.numLinkTypes = 3;
    
    // Recreate the UI
    if (this.state.configFrame) {
      this.state.configFrame.Destroy();
    }
    
    this.createGUI();
    this.updateStatus("Configuration cleared");
  }

  /**
   * Updates the displayed configuration
   */
  public updateConfig(config: GeneratorConfig): void {
    this.state.currentConfig = { ...config };
    
    // Update all input fields
    this.state.inputs.forEach((input, key) => {
      input.Text = tostring(config[key]);
    });
  }

  /**
   * Sets the GUI mode
   */
  public setMode(mode: "simple" | "enhanced"): void {
    if (this.state.mode !== mode) {
      this.state.mode = mode;
      
      // Recreate the GUI
      if (this.state.gui) {
        this.destroy();
        this.createGUI();
      }
    }
  }

  /**
   * Gets the current visibility state
   */
  public isVisible(): boolean {
    return this.state.isVisible;
  }

  /**
   * Destroys the GUI
   */
  public destroy(): void {
    if (this.state.gui) {
      this.state.gui.Destroy();
      this.state.gui = undefined;
      this.state.configFrame = undefined;
      this.state.inputs.clear();
      this.state.isVisible = false;
    }
  }
}