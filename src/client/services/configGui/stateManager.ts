/**
 * State Manager for Configuration GUI
 * 
 * Manages the centralized state for the configuration GUI,
 * providing a clean interface for state updates and subscriptions.
 */

import { GUIState, EnhancedGeneratorConfig } from "./interfaces";
import { GUI_CONSTANTS } from "./constants";
import type { SpacingConfig, VisualizationOptions, AxisMapping } from "../../../shared/interfaces/enhancedGenerator.interface";

export class GUIStateManager {
  private state: GUIState;
  private listeners: ((state: GUIState) => void)[] = [];

  constructor(initialConfig?: EnhancedGeneratorConfig) {
    // Initialize spacing with defaults
    const defaultSpacing: SpacingConfig = {
      nodeHeight: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_HEIGHT,
      nodeRadius: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_RADIUS,
      layerSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.LAYER_SPACING,
      nodeSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_SPACING,
      swimlaneSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.SWIMLANE_SPACING,
      linkDiameter: GUI_CONSTANTS.SPACING_DEFAULTS.LINK_DIAMETER
    };
    
    // Initialize visualization options with defaults
    const defaultVisualization: VisualizationOptions = {
      showLinkLabels: false,
      showConnectors: true,
      allowSameLevelLinks: false,
      randomZOffset: false,
      zOffsetAmount: 5
    };
    
    // Initialize axis mapping with defaults
    const defaultAxisMapping: AxisMapping = {
      xAxis: "type",
      zAxis: "petType"
    };
    
    this.state = {
      isVisible: false,
      enhancedConfig: initialConfig || {
        numNodeTypes: 4,
        numLinkTypes: 3,
        layers: [],
        spacing: defaultSpacing,
        visualization: defaultVisualization,
        axisMapping: defaultAxisMapping
      },
      layerRows: []
    };
    
    // Ensure spacing is always defined
    if (!this.state.enhancedConfig.spacing) {
      this.state.enhancedConfig.spacing = defaultSpacing;
    }
    
    // Ensure visualization is always defined
    if (!this.state.enhancedConfig.visualization) {
      this.state.enhancedConfig.visualization = defaultVisualization;
    }
    
    // Ensure axis mapping is always defined
    if (!this.state.enhancedConfig.axisMapping) {
      this.state.enhancedConfig.axisMapping = defaultAxisMapping;
    }
  }

  /**
   * Gets the current state
   */
  public getState(): GUIState {
    return { ...this.state };
  }

  /**
   * Gets the enhanced configuration
   */
  public getEnhancedConfig(): EnhancedGeneratorConfig {
    return { ...this.state.enhancedConfig };
  }

  /**
   * Updates the GUI visibility
   */
  public setVisible(visible: boolean): void {
    this.state.isVisible = visible;
    this.notifyListeners();
  }

  /**
   * Updates the GUI instance
   */
  public setGUI(gui: ScreenGui | undefined): void {
    this.state.gui = gui;
    this.notifyListeners();
  }

  /**
   * Updates the config frame
   */
  public setConfigFrame(frame: Frame | undefined): void {
    this.state.configFrame = frame;
    this.notifyListeners();
  }

  /**
   * Updates the status label
   */
  public setStatusLabel(label: TextLabel | undefined): void {
    this.state.statusLabel = label;
    this.notifyListeners();
  }

  /**
   * Updates the number of node types
   */
  public setNumNodeTypes(value: number): void {
    this.state.enhancedConfig.numNodeTypes = value;
    this.notifyListeners();
  }

  /**
   * Updates the number of link types
   */
  public setNumLinkTypes(value: number): void {
    this.state.enhancedConfig.numLinkTypes = value;
    this.notifyListeners();
  }

  /**
   * Updates the layers configuration
   */
  public setLayers(layers: EnhancedGeneratorConfig["layers"]): void {
    this.state.enhancedConfig.layers = layers;
    this.notifyListeners();
  }

  /**
   * Updates a spacing field
   */
  public updateSpacing<K extends keyof SpacingConfig>(field: K, value: SpacingConfig[K]): void {
    if (this.state.enhancedConfig.spacing) {
      this.state.enhancedConfig.spacing[field] = value;
      this.notifyListeners();
    }
  }

  /**
   * Updates a visualization field
   */
  public updateVisualization<K extends keyof VisualizationOptions>(field: K, value: VisualizationOptions[K]): void {
    if (this.state.enhancedConfig.visualization) {
      this.state.enhancedConfig.visualization[field] = value;
      this.notifyListeners();
    }
  }

  /**
   * Resets the configuration to defaults
   */
  public resetConfig(): void {
    const defaultSpacing: SpacingConfig = {
      nodeHeight: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_HEIGHT,
      nodeRadius: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_RADIUS,
      layerSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.LAYER_SPACING,
      nodeSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.NODE_SPACING,
      swimlaneSpacing: GUI_CONSTANTS.SPACING_DEFAULTS.SWIMLANE_SPACING,
      linkDiameter: GUI_CONSTANTS.SPACING_DEFAULTS.LINK_DIAMETER
    };
    
    const defaultVisualization: VisualizationOptions = {
      showLinkLabels: false,
      showConnectors: true,
      allowSameLevelLinks: false,
      randomZOffset: false
    };
    
    this.state.enhancedConfig = {
      numNodeTypes: 4,
      numLinkTypes: 3,
      layers: [],
      spacing: defaultSpacing,
      visualization: defaultVisualization
    };
    
    this.notifyListeners();
  }

  /**
   * Updates the entire enhanced configuration
   */
  public updateEnhancedConfig(config: EnhancedGeneratorConfig): void {
    this.state.enhancedConfig = { ...config };
    this.notifyListeners();
  }
  
  /**
   * Updates axis mapping
   */
  public updateAxisMapping(axis: "xAxis" | "zAxis", value: string): void {
    if (!this.state.enhancedConfig.axisMapping) {
      this.state.enhancedConfig.axisMapping = {
        xAxis: "type",
        zAxis: "petType"
      };
    }
    this.state.enhancedConfig.axisMapping[axis] = value;
    this.notifyListeners();
  }
  
  /**
   * Updates visual mapping
   */
  public updateVisualMapping(mapping: "backgroundColor" | "borderColor", value: string): void {
    if (!this.state.enhancedConfig.visualMapping) {
      this.state.enhancedConfig.visualMapping = {
        backgroundColor: "type",
        borderColor: "none"
      };
    }
    this.state.enhancedConfig.visualMapping[mapping] = value;
    this.notifyListeners();
  }
  
  /**
   * Updates Y-axis configuration
   */
  public updateYAxisConfig(config: { useLayer: boolean; property?: string }): void {
    this.state.enhancedConfig.yAxisConfig = config;
    this.notifyListeners();
  }

  /**
   * Subscribes to state changes
   */
  public subscribe(listener: (state: GUIState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index >= 0) {
        const newListeners: ((state: GUIState) => void)[] = [];
        for (let i = 0; i < this.listeners.size(); i++) {
          if (i !== index) {
            newListeners.push(this.listeners[i]);
          }
        }
        this.listeners = newListeners;
      }
    };
  }

  /**
   * Notifies all listeners of state changes
   */
  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach(listener => listener(currentState));
  }

  /**
   * Cleans up the state manager
   */
  public destroy(): void {
    this.listeners = [];
    if (this.state.gui) {
      this.state.gui.Destroy();
    }
    this.state.gui = undefined;
    this.state.configFrame = undefined;
    this.state.statusLabel = undefined;
    this.state.isVisible = false;
  }
}