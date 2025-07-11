/**
 * State Manager for Configuration GUI
 * 
 * Manages the centralized state for the configuration GUI,
 * providing a clean interface for state updates and subscriptions.
 */

import { GUIState, EnhancedGeneratorConfig } from "./interfaces";
import { GUI_CONSTANTS } from "./constants";
import type { SpacingConfig, VisualizationOptions, AxisMapping, VisualMapping, YAxisConfig } from "../../../shared/interfaces/enhancedGenerator.interface";
import { getDefaultXAxis, getDefaultZAxis, isUsingLegacyDefaults } from "../../../shared/constants/axisDefaults";
import { updateAvailableProperties } from "./components/axisMappingControls/constants";

export class GUIStateManager {
  private state: GUIState;
  private listeners: ((state: GUIState) => void)[] = [];

  constructor(initialConfig?: EnhancedGeneratorConfig, defaultAxisOptions?: { [key: string]: string }) {
    print(`[GUIStateManager] Constructor called with defaultAxisOptions:`, defaultAxisOptions);
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
      showNodes: true,
      showLinkLabels: false,
      showConnectors: true,
      allowSameLevelLinks: false
    };
    
    // Initialize spatial grouping with defaults (using legacy interface for compatibility)
    const defaultAxisMapping: AxisMapping = {
      xAxis: defaultAxisOptions?.xgroup || getDefaultXAxis(),
      zAxis: defaultAxisOptions?.zgroup || getDefaultZAxis(),
      yAxis: defaultAxisOptions?.ygroup || "none", // Default to none, will be updated with discovered properties
      xGroupingProperty: defaultAxisOptions?.xgroup || getDefaultXAxis(),
      zGroupingProperty: defaultAxisOptions?.zgroup || getDefaultZAxis()
    };
    
    // Initialize visual mapping with defaults
    const defaultVisualMapping: VisualMapping = {
      backgroundColor: defaultAxisOptions?.nodeColor || "none",  // Will be updated to first discovered property
      borderColor: "none"
    };
    
    // Initialize Y-axis config with defaults
    const defaultYAxisConfig: YAxisConfig = {
      useLayer: true,
      property: undefined
    };
    
    this.state = {
      isVisible: false,
      enhancedConfig: initialConfig || {
        numNodeTypes: 4,
        numLinkTypes: 3,
        layers: [],
        spacing: defaultSpacing,
        visualization: defaultVisualization,
        axisMapping: defaultAxisMapping,
        visualMapping: defaultVisualMapping,
        yAxisConfig: defaultYAxisConfig,
        numPetTypes: 5
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
    
    // Ensure visual mapping is always defined
    if (!this.state.enhancedConfig.visualMapping) {
      this.state.enhancedConfig.visualMapping = defaultVisualMapping;
    }
    
    // Ensure Y-axis config is always defined
    if (!this.state.enhancedConfig.yAxisConfig) {
      this.state.enhancedConfig.yAxisConfig = defaultYAxisConfig;
    }
    
    // Ensure numPetTypes is always defined
    if (!this.state.enhancedConfig.numPetTypes) {
      this.state.enhancedConfig.numPetTypes = 5;
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
      showNodes: true,
      showLinkLabels: false,
      showConnectors: true,
      allowSameLevelLinks: false
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
    // Preserve important properties if not provided in the new config
    const axisMapping = config.axisMapping || this.state.enhancedConfig.axisMapping;
    const visualMapping = config.visualMapping || this.state.enhancedConfig.visualMapping;
    const yAxisConfig = config.yAxisConfig || this.state.enhancedConfig.yAxisConfig;
    const spacing = config.spacing || this.state.enhancedConfig.spacing;
    const visualization = config.visualization || this.state.enhancedConfig.visualization;
    
    this.state.enhancedConfig = { 
      ...config, 
      axisMapping,
      visualMapping,
      yAxisConfig,
      spacing,
      visualization
    };
    this.notifyListeners();
  }
  
  /**
   * Updates the discovered properties from the cluster data
   */
  public updateDiscoveredProperties(properties: string[]): void {
    this.state.discoveredProperties = properties;
    
    // Update the available properties in the dropdown controls
    updateAvailableProperties(properties);
    
    // If we have at least 2 properties and no axis mapping is set, use the first two
    if (properties.size() >= 2 && this.state.enhancedConfig.axisMapping) {
      const currentMapping = this.state.enhancedConfig.axisMapping;
      
      // Always set Y-axis if we have 3+ properties and it's not already set
      const shouldUpdateYAxis = properties.size() >= 3 && 
                               (!currentMapping.yAxis || currentMapping.yAxis === "none");
      
      // Only update X,Z if current values are the hardcoded defaults
      if (isUsingLegacyDefaults(currentMapping.xAxis, currentMapping.zAxis)) {
        this.state.enhancedConfig.axisMapping = {
          xAxis: getDefaultXAxis(properties),
          zAxis: getDefaultZAxis(properties),
          yAxis: properties.size() >= 3 ? properties[2] : "none", // Set to 3rd property if available
          xGroupingProperty: getDefaultXAxis(properties),
          zGroupingProperty: getDefaultZAxis(properties)
        };
      } else if (shouldUpdateYAxis) {
        // Update only Y-axis if X,Z are already properly set
        this.state.enhancedConfig.axisMapping = {
          ...currentMapping,
          yAxis: properties[2] // Set to 3rd property
        };
        
        print(`[GUIStateManager] Updated Y-axis to discovered property: ${properties[2]}`);
      }
      
      if (isUsingLegacyDefaults(currentMapping.xAxis, currentMapping.zAxis) || shouldUpdateYAxis) {
        print(`[GUIStateManager] Updated axis mapping to discovered properties:`);
        print(`  X-axis: ${this.state.enhancedConfig.axisMapping.xAxis}`);
        print(`  Z-axis: ${this.state.enhancedConfig.axisMapping.zAxis}`);
        print(`  Y-axis: ${this.state.enhancedConfig.axisMapping.yAxis}`);
      }
    }
    
    // Update visual mapping to use httpMethod as default background color if available
    if (properties.size() > 0 && this.state.enhancedConfig.visualMapping) {
      const currentVisualMapping = this.state.enhancedConfig.visualMapping;
      
      // Only update if background is still "None" or "none"
      if (currentVisualMapping.backgroundColor === "None" || currentVisualMapping.backgroundColor === "none") {
        // Prefer "httpMethod" if it exists in discovered properties
        const httpMethodIndex = properties.indexOf("httpMethod");
        if (httpMethodIndex !== -1) {
          this.state.enhancedConfig.visualMapping.backgroundColor = "httpMethod";
          print(`[GUIStateManager] Updated background color to httpMethod`);
        } else {
          this.state.enhancedConfig.visualMapping.backgroundColor = properties[0];
          print(`[GUIStateManager] Updated background color to first property: ${properties[0]}`);
        }
      }
    }
    
    
    // Notify listeners about the changes
    this.notifyListeners();
  }
  
  /**
   * Sets the axis mapping configuration for delayed creation
   */
  public setAxisMappingConfig(config: any): void {
    this.state.axisMappingConfig = config;
  }
  
  /**
   * Gets the stored axis mapping configuration
   */
  public getAxisMappingConfig(): any {
    return this.state.axisMappingConfig;
  }
  
  /**
   * Updates spatial grouping (formerly axis mapping)
   */
  public updateAxisMapping(axis: "xAxis" | "zAxis" | "yAxis", value: string): void {
    if (!this.state.enhancedConfig.axisMapping) {
      this.state.enhancedConfig.axisMapping = {
        xAxis: getDefaultXAxis(this.state.discoveredProperties),
        zAxis: getDefaultZAxis(this.state.discoveredProperties),
        yAxis: this.state.discoveredProperties && this.state.discoveredProperties.size() >= 3 ? this.state.discoveredProperties[2] : "none",
        xGroupingProperty: getDefaultXAxis(this.state.discoveredProperties),
        zGroupingProperty: getDefaultZAxis(this.state.discoveredProperties)
      };
    }
    
    // Update both legacy and new property names for compatibility
    this.state.enhancedConfig.axisMapping[axis] = value;
    if (axis === "xAxis") {
      this.state.enhancedConfig.axisMapping.xGroupingProperty = value;
    } else if (axis === "zAxis") {
      this.state.enhancedConfig.axisMapping.zGroupingProperty = value;
    }
    
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