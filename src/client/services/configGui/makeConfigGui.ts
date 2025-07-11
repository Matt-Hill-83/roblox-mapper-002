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
import { createCollapsibleFrame } from "./components/collapsibleFrame";
import { createGlobalSettings } from "./components/globalSettings";
import { createLayerGrid } from "./components/layerGrid";
import { createStatusArea } from "./components/status";
import { createVisualizationControls } from "./components/visualizationControls";
import { createAxisMappingControls } from "./components/axisMappingControls/index";
import { refreshAxisDropdownGUI } from "./components/axisMappingControls/utils/screenGuiManager";
import { GUIStateManager } from "./stateManager";
import { GUIEventHandlers } from "./eventHandlers";
import { ComponentFactory } from "./componentFactory";
import { GuiLayoutManager, COMPONENT_HEIGHTS } from "./guiLayout";

export class ConfigGUIService {
  private stateManager: GUIStateManager;
  private eventHandlers: GUIEventHandlers;

  constructor(options: ConfigGUIServiceOptions) {
    // Initialize state manager
    this.stateManager = new GUIStateManager(options.initialConfig, options.defaultAxisOptions);

    // Initialize event handlers
    this.eventHandlers = new GUIEventHandlers({
      stateManager: this.stateManager,
      onEnhancedConfigChange: options.onEnhancedConfigChange,
      onClearRequest: options.onClearRequest,
      onUpdateRequest: options.onUpdateRequest,
    });
  }

  /**
   * Creates and displays the configuration GUI
   */
  public createGUI(): void {
    const player = Players.LocalPlayer;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

    // Check if GUI already exists
    const existingGui = playerGui.FindFirstChild(
      GUI_CONSTANTS.NAMES.SCREEN_GUI
    );
    if (existingGui) {
      existingGui.Destroy();
    }

    // Create ScreenGui
    const gui = new Instance("ScreenGui");
    gui.Name = GUI_CONSTANTS.NAMES.SCREEN_GUI;
    gui.ResetOnSpawn = false;
    gui.Parent = playerGui;
    this.stateManager.setGUI(gui);

    // Create collapsible main frame - full height
    const mainFrameSize = new UDim2(
      0,
      GUI_CONSTANTS.FRAME.ENHANCED_WIDTH,
      0.9,
      0
    );
    const collapsibleFrame = createCollapsibleFrame({
      parent: gui,
      size: mainFrameSize,
      title: "Graph Configuration",
      position: new UDim2(0, 10, 0, 10),
    });

    // Store the main frame
    this.stateManager.setConfigFrame(collapsibleFrame.frame);

    // Create visualization controls on the right side
    const vizFrameSize = new UDim2(0, 300, 0, 200);
    const vizCollapsibleFrame = createCollapsibleFrame({
      parent: gui,
      size: vizFrameSize,
      title: "Visualization Controls",
      position: new UDim2(0, GUI_CONSTANTS.FRAME.ENHANCED_WIDTH + 20, 0, 10), // Position to the right
    });

    // Create unified UI in the content frames
    this.createUnifiedUI(
      collapsibleFrame.contentFrame,
      vizCollapsibleFrame.contentFrame
    );

    this.stateManager.setVisible(true);
  }

  /**
   * Creates the unified UI
   */
  private createUnifiedUI(contentFrame?: Frame, vizContentFrame?: Frame): void {
    const state = this.stateManager.getState();
    const parentFrame = contentFrame || state.configFrame;
    if (!parentFrame) return;

    const config = this.stateManager.getEnhancedConfig();

    // Create layout manager
    const layoutManager = new GuiLayoutManager(parentFrame);

    // Create scrolling frame for content
    const scrollFrame = layoutManager.createScrollingFrame();

    // Create global settings with spacing controls
    const globalSettings = createGlobalSettings({
      parent: scrollFrame,
      spacing: config.spacing!,
      onSpacingChange: (field, value) => {
        this.eventHandlers.handleSpacingChange(field, value);
      },
    });
    globalSettings.Position = layoutManager.getNextPosition(
      COMPONENT_HEIGHTS.GLOBAL_SETTINGS
    );


    // Generate default type arrays (legacy layer grid support)
    const nodeTypes = this.eventHandlers.generateTypeArray("Type", 5);
    const linkTypes = this.eventHandlers.generateTypeArray("Link", 3);

    // Create layer grid with initial layers
    const layerGrid = createLayerGrid({
      parent: scrollFrame,
      onLayerUpdate: (layers) => {
        this.eventHandlers.handleLayerUpdate(layers);
      },
      nodeTypes,
      linkTypes,
      initialLayers: config.layers,
    });
    layerGrid.Position = layoutManager.getNextPosition(
      COMPONENT_HEIGHTS.LAYER_GRID_HEADER +
        config.layers.size() * COMPONENT_HEIGHTS.LAYER_ROW +
        50
    );

    // Move visualization controls to separate frame
    if (vizContentFrame) {
      const visualizationControls = createVisualizationControls({
        parent: vizContentFrame,
        visualization: config.visualization!,
        onVisualizationChange: (field, value) => {
          this.eventHandlers.handleVisualizationChange(field, value);
        },
      });
      visualizationControls.Position = new UDim2(0, 10, 0, 10);
      visualizationControls.Size = new UDim2(1, -20, 1, -20);
    }

    // Store axis mapping config for later creation
    this.stateManager.setAxisMappingConfig({
      parent: parentFrame, // Not actually used since dropdowns are separate GUIs
      axisMapping: config.axisMapping,
      visualMapping: config.visualMapping,
      useLayerForYAxis: config.yAxisConfig?.useLayer !== false, // Default to true
      yAxisProperty: config.yAxisConfig?.property,
      onAxisMappingChange: (axis: "xAxis" | "zAxis" | "yAxis", value: string) => {
        this.stateManager.updateAxisMapping(axis, value);
        // Trigger re-render with new axis mapping
        this.eventHandlers.handleRegenerateClick();
      },
      onVisualMappingChange: (
        mapping: "backgroundColor" | "borderColor",
        value: string
      ) => {
        this.stateManager.updateVisualMapping(mapping, value);
        // Trigger re-render with new visual mapping
        this.eventHandlers.handleRegenerateClick();
      },
      onYAxisModeChange: (useLayer: boolean) => {
        this.stateManager.updateYAxisConfig({ useLayer });
        // Trigger re-render with new Y-axis mode
        this.eventHandlers.handleRegenerateClick();
      },
      onYAxisPropertyChange: (property: string) => {
        this.stateManager.updateYAxisConfig({ useLayer: false, property });
        // Trigger re-render with new Y-axis property
        this.eventHandlers.handleRegenerateClick();
      },
    });

    // Update scrolling frame canvas size
    layoutManager.updateCanvasSize(scrollFrame);

    // Create action buttons (outside scrolling frame)
    this.createActionButtons(parentFrame);

    // Create status area (outside scrolling frame)
    const statusLabel = createStatusArea({
      parent: parentFrame,
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
      onClick: () => this.eventHandlers.handleRegenerateClick(),
    });

    // Update button
    ComponentFactory.createButton({
      name: "UpdateButton",
      text: "Update",
      position: new UDim2(
        0,
        10 + GUI_CONSTANTS.BUTTON.WIDTH + GUI_CONSTANTS.BUTTON.SPACING,
        buttonYScale,
        buttonYOffset
      ),
      parent: parent,
      onClick: () => this.eventHandlers.handleUpdateClick(),
    });

    // Clear button
    ComponentFactory.createButton({
      name: "ClearButton",
      text: "Clear",
      position: new UDim2(
        0,
        10 + (GUI_CONSTANTS.BUTTON.WIDTH + GUI_CONSTANTS.BUTTON.SPACING) * 2,
        buttonYScale,
        buttonYOffset
      ),
      parent: parent,
      onClick: () =>
        this.eventHandlers.handleClearClick(() => this.createGUI()),
    });

    // Export Config button
    ComponentFactory.createButton({
      name: "ExportConfigButton",
      text: "Export",
      position: new UDim2(
        0,
        10 + (GUI_CONSTANTS.BUTTON.WIDTH + GUI_CONSTANTS.BUTTON.SPACING) * 3,
        buttonYScale,
        buttonYOffset
      ),
      parent: parent,
      onClick: () => this.eventHandlers.handleExportConfigClick(),
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
   * Updates the discovered properties from the data
   */
  public updateDiscoveredProperties(properties: string[]): void {
    properties.forEach((prop, index) => {});

    // Update the state manager with discovered properties
    this.stateManager.updateDiscoveredProperties(properties);

    // First refresh the axis dropdown GUI to clear old dropdowns
    refreshAxisDropdownGUI();

    // Create axis mapping controls now that we have properties
    const axisMappingConfig = this.stateManager.getAxisMappingConfig();
    if (axisMappingConfig) {
      // Update the config with the new axis mapping values from state
      const currentState = this.stateManager.getState();
      if (currentState.enhancedConfig.axisMapping) {
        axisMappingConfig.axisMapping = currentState.enhancedConfig.axisMapping;
      }
      createAxisMappingControls(axisMappingConfig);
    }

  }

  /**
   * Gets the current visibility state
   */
  public isVisible(): boolean {
    return this.stateManager.getState().isVisible;
  }

  /**
   * Shows an error message to the user
   */
  public showError(message: string): void {
    const state = this.stateManager.getState();
    const screenGui = state.configFrame?.Parent?.Parent as ScreenGui;
    if (!screenGui) return;

    // Create error notification
    const errorFrame = new Instance("Frame");
    errorFrame.Name = "ErrorNotification";
    errorFrame.Size = new UDim2(0, 400, 0, 100);
    errorFrame.Position = new UDim2(0.5, -200, 0, 50);
    errorFrame.BackgroundColor3 = new Color3(0.8, 0.2, 0.2);
    errorFrame.BorderSizePixel = 2;
    errorFrame.BorderColor3 = new Color3(0.6, 0, 0);
    errorFrame.Parent = screenGui;

    const errorText = new Instance("TextLabel");
    errorText.Text = "⚠️ " + message;
    errorText.Size = new UDim2(1, -20, 1, -20);
    errorText.Position = new UDim2(0, 10, 0, 10);
    errorText.BackgroundTransparency = 1;
    errorText.TextColor3 = new Color3(1, 1, 1);
    errorText.TextScaled = true;
    errorText.TextWrapped = true;
    errorText.Font = Enum.Font.SourceSansBold;
    errorText.Parent = errorFrame;

    // Auto-dismiss after 5 seconds
    wait(5);
    errorFrame.Destroy();
  }

  /**
   * Destroys the GUI
   */
  public destroy(): void {
    this.stateManager.destroy();
  }
}
