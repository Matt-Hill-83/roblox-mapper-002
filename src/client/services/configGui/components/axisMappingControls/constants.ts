import { AXIS_DEFAULTS } from "../../../../../shared/constants/axisDefaults";

// Store the discovered properties internally
let _availableProperties: string[] = [];
let _visualProperties: string[] = [];
let _propertyValueCounts: Map<string, Map<string, number>> = new Map();

// Export getters to ensure we always get the latest values
export function getAvailableProperties(): string[] {
  return _availableProperties;
}

export function getPropertyValueCount(propertyName: string): number {
  const counts = _propertyValueCounts.get(propertyName);
  return counts ? counts.size() : 0;
}

export function getVisualProperties(): string[] {
  return _visualProperties;
}

/**
 * Updates the available properties from discovered data properties
 * @param discoveredProps - Array of property names discovered from data
 */
export function updateAvailableProperties(discoveredProps: string[]): void {
  if (discoveredProps && discoveredProps.size() > 0) {
    // Update axis mapping properties
    _availableProperties = [...discoveredProps];
    
    // Update visual properties (include "none" option)
    _visualProperties = ["none", ...discoveredProps];
    
    // Update property counts by scanning the workspace
    updatePropertyCounts(discoveredProps);
    
    discoveredProps.forEach((prop, index) => {
      
    });
  } else {
    
    _availableProperties = [];
    _visualProperties = ["none"];
    _propertyValueCounts.clear();
  }
}

/**
 * Scans the workspace for nodes and counts unique property values
 */
function updatePropertyCounts(properties: string[]): void {
  _propertyValueCounts.clear();
  
  // Find all hexagon nodes in the workspace
  const workspace = game.GetService("Workspace");
  const myStuff = workspace.FindFirstChild("MyStuff");
  if (!myStuff) return;
  
  const graphMaker = myStuff.FindFirstChild("GraphMaker");
  if (!graphMaker) return;
  
  const clusterFolder = graphMaker.FindFirstChild("UnifiedDataCluster");
  if (!clusterFolder) return;
  
  const nodesFolder = clusterFolder.FindFirstChild("Nodes");
  if (!nodesFolder) return;
  
  // Initialize counts for each property
  properties.forEach(prop => {
    _propertyValueCounts.set(prop, new Map<string, number>());
  });
  
  // Count property values from nodes
  nodesFolder.GetDescendants().forEach(desc => {
    if (desc.IsA("Model") && desc.Name.match("^Hexagon_")) {
      properties.forEach(prop => {
        const value = desc.GetAttribute(prop) as string;
        if (value !== undefined) {
          const propCounts = _propertyValueCounts.get(prop)!;
          const currentCount = propCounts.get(value) || 0;
          propCounts.set(value, currentCount + 1);
        }
      });
    }
  });
}

// UI Constants
export const UI_CONSTANTS = {
  FRAME: {
    WIDTH: 300,
    HEIGHT: 200,  // Reduced from 250 since Y-axis config section removed
    BACKGROUND_COLOR: new Color3(0.2, 0.2, 0.2),
    CORNER_RADIUS: 8
  },
  BUTTON: {
    HEIGHT: 20,
    BACKGROUND_COLOR: new Color3(0.3, 0.3, 0.3),
    HOVER_COLOR: new Color3(0.35, 0.35, 0.35),
    DISABLED_BACKGROUND_COLOR: new Color3(0.2, 0.2, 0.2),
    CORNER_RADIUS: 4
  },
  TEXT: {
    SECTION_COLOR: new Color3(0.6, 0.6, 0.6),
    LABEL_COLOR: new Color3(0.8, 0.8, 0.8),
    BUTTON_COLOR: new Color3(1, 1, 1),
    DISABLED_COLOR: new Color3(0.5, 0.5, 0.5),
    SECTION_SIZE: 12,
    LABEL_SIZE: 14
  },
  SPACING: {
    SECTION_MARGIN: 10,
    LABEL_WIDTH: 80,
    DROPDOWN_WIDTH: 180,
    DROPDOWN_OFFSET: 5,
    RADIO_SIZE: 16,
    RADIO_INNER_SIZE: 8
  },
  DROPDOWN: {
    MAX_VISIBLE_ITEMS: 8,
    ITEM_HEIGHT: 20,
    BACKGROUND_COLOR: new Color3(0.25, 0.25, 0.25),
    SCROLL_BAR_THICKNESS: 4
  }
};

// Default values
export const DEFAULTS = {
  X_AXIS: AXIS_DEFAULTS.LEGACY_X_AXIS,
  Z_AXIS: AXIS_DEFAULTS.LEGACY_Z_AXIS,
  BACKGROUND_COLOR: "none",
  BORDER_COLOR: "none",
  USE_LAYER_FOR_Y_AXIS: true
};