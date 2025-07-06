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
import { GUI_CONSTANTS } from "./constants";
import { GUIState, EnhancedGeneratorConfig, ConfigGUIServiceOptions } from "./interfaces";
import type { SpacingConfig } from "../../../shared/interfaces/enhancedGenerator.interface";
import { createMainFrame } from "./components/frame";
import { createTitle } from "./components/title";
import { createGlobalSettings } from "./components/globalSettings";
import { createNodeTypesSection } from "./components/nodeTypesSection";
import { createLayerGrid } from "./components/layerGrid";
import { createStatusArea, updateStatus } from "./components/status";

export class ConfigGUIService {
  private state: GUIState;
  private onEnhancedConfigChange?: (config: EnhancedGeneratorConfig) => void;
  private onClearRequest?: () => void;
  private onUpdateRequest?: (config: EnhancedGeneratorConfig) => void;

  constructor(options: ConfigGUIServiceOptions) {
    print("🏗️ ConfigGUIService constructor called");
    print(`   - Initial config provided: ${options.initialConfig ? "Yes" : "No"}`);
    if (options.initialConfig) {
      print(`   - Node types: ${options.initialConfig.numNodeTypes}`);
      print(`   - Link types: ${options.initialConfig.numLinkTypes}`);
      print(`   - Layers: ${options.initialConfig.layers.size()}`);
      options.initialConfig.layers.forEach((layer, idx) => {
        print(`     Layer ${idx + 1}: ${layer.numNodes} nodes, ${layer.connectionsPerNode} connections`);
      });
    }
    
    // Initialize spacing with defaults if not provided
    const defaultSpacing: SpacingConfig = {
      nodeHeight: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_HEIGHT,
      nodeRadius: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_RADIUS,
      layerSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.LAYER_SPACING,
      nodeSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_SPACING,
      swimlaneSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.SWIMLANE_SPACING
    };
    
    this.state = {
      isVisible: false,
      enhancedConfig: options.initialConfig || {
        numNodeTypes: 3,
        numLinkTypes: 3,
        layers: [],
        spacing: defaultSpacing
      },
      layerRows: []
    };
    
    // Ensure spacing is always defined
    if (!this.state.enhancedConfig.spacing) {
      this.state.enhancedConfig.spacing = defaultSpacing;
    }
    
    this.onEnhancedConfigChange = options.onEnhancedConfigChange;
    this.onClearRequest = options.onClearRequest;
    this.onUpdateRequest = options.onUpdateRequest;
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

    // Create main frame - use 90% of screen height
    const frameSize = new UDim2(0, GUI_CONSTANTS.FRAME.ENHANCED_WIDTH, GUI_CONSTANTS.FRAME.ENHANCED_HEIGHT_SCALE, 0);
    this.state.configFrame = createMainFrame(this.state.gui, frameSize);

    // Add title
    createTitle(this.state.configFrame);

    // Create unified UI
    this.createUnifiedUI();

    this.state.isVisible = true;
  }

  /**
   * Creates the unified UI
   */
  private createUnifiedUI(): void {
    if (!this.state.configFrame) return;
    
    // Create global settings with spacing controls
    createGlobalSettings({
      parent: this.state.configFrame,
      spacing: this.state.enhancedConfig.spacing!,
      onSpacingChange: (field, value) => {
        if (this.state.enhancedConfig.spacing) {
          this.state.enhancedConfig.spacing[field] = value;
          this.updateStatus(`${field} updated to ${value}`);
        }
      }
    });

    // Create node/link types section
    createNodeTypesSection({
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

    // Create layer grid with initial layers
    print(`🎯 Creating layer grid with ${this.state.enhancedConfig.layers.size()} initial layers`);
    createLayerGrid({
      parent: this.state.configFrame,
      onLayerUpdate: (layers) => {
        this.state.enhancedConfig.layers = layers;
        this.updateStatus(`${layers.size()} layers configured`);
      },
      nodeTypes,
      linkTypes,
      initialLayers: this.state.enhancedConfig.layers
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
    
    // Position buttons 70 pixels from bottom using scale
    const buttonYScale = 1;
    const buttonYOffset = -70;
    
    // Regenerate button
    const regenerateButton = new Instance("TextButton");
    regenerateButton.Name = "RegenerateButton";
    regenerateButton.Size = new UDim2(0, GUI_CONSTANTS.BUTTON.WIDTH, 0, GUI_CONSTANTS.BUTTON.HEIGHT);
    regenerateButton.Position = new UDim2(0, 10, buttonYScale, buttonYOffset);
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

    regenerateButton.MouseButton1Click.Connect(() => this.onRegenerateClick());

    // Update button
    const updateButton = new Instance("TextButton");
    updateButton.Name = "UpdateButton";
    updateButton.Size = new UDim2(0, GUI_CONSTANTS.BUTTON.WIDTH, 0, GUI_CONSTANTS.BUTTON.HEIGHT);
    updateButton.Position = new UDim2(0, 10 + GUI_CONSTANTS.BUTTON.WIDTH + GUI_CONSTANTS.BUTTON.SPACING, buttonYScale, buttonYOffset);
    updateButton.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.DEFAULT;
    updateButton.BorderSizePixel = 0;
    updateButton.Font = GUI_CONSTANTS.TYPOGRAPHY.BUTTON_FONT;
    updateButton.Text = "Update";
    updateButton.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    updateButton.TextScaled = true;
    updateButton.Parent = this.state.configFrame;

    const updateCorner = new Instance("UICorner");
    updateCorner.CornerRadius = new UDim(0, 4);
    updateCorner.Parent = updateButton;

    updateButton.MouseButton1Click.Connect(() => this.onUpdateClick());

    // Clear button
    const clearButton = new Instance("TextButton");
    clearButton.Name = "ClearButton";
    clearButton.Size = new UDim2(0, GUI_CONSTANTS.BUTTON.WIDTH, 0, GUI_CONSTANTS.BUTTON.HEIGHT);
    clearButton.Position = new UDim2(0, 10 + (GUI_CONSTANTS.BUTTON.WIDTH + GUI_CONSTANTS.BUTTON.SPACING) * 2, buttonYScale, buttonYOffset);
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
   * Handles regenerate button click
   */
  private onRegenerateClick(): void {
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
   * Handles update button click
   */
  private onUpdateClick(): void {
    if (this.state.enhancedConfig.layers.size() === 0) {
      this.updateStatus("No layers configured!", true);
      return;
    }

    if (this.onUpdateRequest) {
      this.updateStatus("Updating existing graph...");
      this.onUpdateRequest(this.state.enhancedConfig);
      this.updateStatus("Update complete");
    }
  }

  /**
   * Handles clear button click
   */
  private onClearClick(): void {
    // Send clear request to server to delete GraphMaker folder
    if (this.onClearRequest) {
      this.onClearRequest();
    }
    
    // Clear all layers
    this.state.enhancedConfig.layers = [];
    
    // Reset global settings
    this.state.enhancedConfig.numNodeTypes = 3;
    this.state.enhancedConfig.numLinkTypes = 3;
    
    // Reset spacing to defaults
    this.state.enhancedConfig.spacing = {
      nodeHeight: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_HEIGHT,
      nodeRadius: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_RADIUS,
      layerSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.LAYER_SPACING,
      nodeSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_SPACING,
      swimlaneSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.SWIMLANE_SPACING
    };
    
    // Recreate the UI
    if (this.state.configFrame) {
      this.state.configFrame.Destroy();
    }
    
    this.createGUI();
    this.updateStatus("Configuration and graph cleared");
  }

  /**
   * Updates the enhanced configuration
   */
  public updateEnhancedConfig(config: EnhancedGeneratorConfig): void {
    this.state.enhancedConfig = { ...config };
    
    // If GUI is visible, update the display
    if (this.state.configFrame) {
      // Recreate the GUI to reflect new configuration
      this.state.configFrame.Destroy();
      this.createGUI();
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
      this.state.isVisible = false;
    }
  }
}