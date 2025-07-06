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
import { EnhancedGeneratorConfig, ConfigGUIServiceOptions } from "./interfaces";
import { createMainFrame } from "./components/frame";
import { createTitle } from "./components/title";
import { createGlobalSettings } from "./components/globalSettings";
import { createNodeTypesSection } from "./components/nodeTypesSection";
import { createLayerGrid } from "./components/layerGrid";
import { createStatusArea } from "./components/status";
import { createVisualizationControls } from "./components/visualizationControls";
import { GUIStateManager } from "./stateManager";
import { GUIEventHandlers } from "./eventHandlers";
import { ComponentFactory } from "./componentFactory";

export class ConfigGUIService {
  private stateManager: GUIStateManager;
  private eventHandlers: GUIEventHandlers;

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
    
    // Initialize state manager
    this.stateManager = new GUIStateManager(options.initialConfig);
    
    // Initialize event handlers
    this.eventHandlers = new GUIEventHandlers({
      stateManager: this.stateManager,
      onEnhancedConfigChange: options.onEnhancedConfigChange,
      onClearRequest: options.onClearRequest,
      onUpdateRequest: options.onUpdateRequest
    });
  }

  /**
   * Creates and displays the configuration GUI
   */
  public createGUI(): void {
    const player = Players.LocalPlayer;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

    // Create ScreenGui
    const gui = new Instance("ScreenGui");
    gui.Name = GUI_CONSTANTS.NAMES.SCREEN_GUI;
    gui.ResetOnSpawn = false;
    gui.Parent = playerGui;
    this.stateManager.setGUI(gui);

    // Create main frame - use 90% of screen height
    const frameSize = new UDim2(0, GUI_CONSTANTS.FRAME.ENHANCED_WIDTH, GUI_CONSTANTS.FRAME.ENHANCED_HEIGHT_SCALE, 0);
    const configFrame = createMainFrame(gui, frameSize);
    this.stateManager.setConfigFrame(configFrame);

    // Add title
    createTitle(configFrame);

    // Create unified UI
    this.createUnifiedUI();

    this.stateManager.setVisible(true);
  }

  /**
   * Creates the unified UI
   */
  private createUnifiedUI(): void {
    const state = this.stateManager.getState();
    if (!state.configFrame) return;
    
    const config = this.stateManager.getEnhancedConfig();
    
    // Create global settings with spacing controls
    createGlobalSettings({
      parent: state.configFrame,
      spacing: config.spacing!,
      onSpacingChange: (field, value) => {
        this.eventHandlers.handleSpacingChange(field, value);
      }
    });

    // Create node/link types section
    createNodeTypesSection({
      parent: state.configFrame,
      numNodeTypes: config.numNodeTypes,
      numLinkTypes: config.numLinkTypes,
      onNodeTypesChange: (value) => {
        this.eventHandlers.handleNodeTypesChange(value);
      },
      onLinkTypesChange: (value) => {
        this.eventHandlers.handleLinkTypesChange(value);
      }
    });

    // Generate node and link type arrays
    const nodeTypes = this.eventHandlers.generateTypeArray("Type", config.numNodeTypes);
    const linkTypes = this.eventHandlers.generateTypeArray("Link", config.numLinkTypes);

    // Create layer grid with initial layers
    print(`🎯 Creating layer grid with ${config.layers.size()} initial layers`);
    createLayerGrid({
      parent: state.configFrame,
      onLayerUpdate: (layers) => {
        this.eventHandlers.handleLayerUpdate(layers);
      },
      nodeTypes,
      linkTypes,
      initialLayers: config.layers
    });

    // Create action buttons
    this.createActionButtons();

    // Create visualization controls (positioned to the right of buttons)
    createVisualizationControls({
      parent: state.configFrame,
      visualization: config.visualization!,
      onVisualizationChange: (field, value) => {
        this.eventHandlers.handleVisualizationChange(field, value);
      }
    });

    // Create status area
    const statusLabel = createStatusArea({
      parent: state.configFrame
    });
    this.stateManager.setStatusLabel(statusLabel);
  }

  /**
   * Creates action buttons for enhanced mode
   */
  private createActionButtons(parentFrame?: Frame): void {
    const state = this.stateManager.getState();
    const parent = parentFrame || state.configFrame;
    if (!parent) return;
    
    // Position buttons 70 pixels from bottom using scale
    const buttonYScale = 1;
    const buttonYOffset = -70;
    
    // Regenerate button
    ComponentFactory.createButton({
      name: "RegenerateButton",
      text: "Regenerate",
      position: new UDim2(0, 10, buttonYScale, buttonYOffset),
      parent: parent,
      onClick: () => this.eventHandlers.handleRegenerateClick()
    });

    // Update button
    ComponentFactory.createButton({
      name: "UpdateButton",
      text: "Update",
      position: new UDim2(0, 10 + GUI_CONSTANTS.BUTTON.WIDTH + GUI_CONSTANTS.BUTTON.SPACING, buttonYScale, buttonYOffset),
      parent: parent,
      onClick: () => this.eventHandlers.handleUpdateClick()
    });

    // Clear button
    ComponentFactory.createButton({
      name: "ClearButton",
      text: "Clear",
      position: new UDim2(0, 10 + (GUI_CONSTANTS.BUTTON.WIDTH + GUI_CONSTANTS.BUTTON.SPACING) * 2, buttonYScale, buttonYOffset),
      parent: parent,
      onClick: () => this.eventHandlers.handleClearClick(() => this.createGUI())
    });
  }


  /**
   * Updates the enhanced configuration
   */
  public updateEnhancedConfig(config: EnhancedGeneratorConfig): void {
    this.stateManager.updateEnhancedConfig(config);
    
    // If GUI is visible, update the display
    const state = this.stateManager.getState();
    if (state.configFrame) {
      // Recreate the GUI to reflect new configuration
      state.configFrame.Destroy();
      this.createGUI();
    }
  }

  /**
   * Gets the current visibility state
   */
  public isVisible(): boolean {
    return this.stateManager.getState().isVisible;
  }

  /**
   * Destroys the GUI
   */
  public destroy(): void {
    this.stateManager.destroy();
  }
}