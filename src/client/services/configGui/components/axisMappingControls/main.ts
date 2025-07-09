import { DEFAULTS } from "./constants";
import type { AxisMappingControlsProps, CompactAxisControlsProps } from "./types";
import { getOrCreateScreenGui } from "./utils/screenGuiManager";
import { createMainFrame } from "./utils/layoutManager";
import { createAxisMappingSection } from "./components/axisMappingSection";
import { createVisualCustomizationSection } from "./components/visualCustomizationSection";
import { createYAxisConfigSection } from "./components/yAxisConfigSection";

/**
 * Creates axis mapping controls UI
 * Main entry point that maintains backward compatibility
 */
export function createAxisMappingControls({
  parent,
  axisMapping,
  visualMapping,
  useLayerForYAxis = DEFAULTS.USE_LAYER_FOR_Y_AXIS,
  yAxisProperty,
  onAxisMappingChange,
  onVisualMappingChange,
  onYAxisModeChange,
  onYAxisPropertyChange
}: AxisMappingControlsProps): void {
  // Provide default axis mapping if not provided
  const mapping = axisMapping || {
    xAxis: DEFAULTS.X_AXIS,
    zAxis: DEFAULTS.Z_AXIS
  };
  
  // Provide default visual mapping if not provided
  const visMapping = visualMapping || {
    backgroundColor: DEFAULTS.BACKGROUND_COLOR,
    borderColor: DEFAULTS.BORDER_COLOR
  };
  
  // Get or create the shared ScreenGui
  const gui = getOrCreateScreenGui();
  
  // Create a single compact frame for all controls
  createCompactAxisControls({
    gui: gui,
    xAxisValue: mapping.xAxis,
    zAxisValue: mapping.zAxis,
    backgroundColorValue: visMapping.backgroundColor || DEFAULTS.BACKGROUND_COLOR,
    borderColorValue: visMapping.borderColor || DEFAULTS.BORDER_COLOR,
    useLayerForYAxis: useLayerForYAxis,
    yAxisProperty: yAxisProperty,
    onXAxisChange: (value) => onAxisMappingChange("xAxis", value),
    onZAxisChange: (value) => onAxisMappingChange("zAxis", value),
    onBackgroundColorChange: (value) => onVisualMappingChange("backgroundColor", value),
    onBorderColorChange: (value) => onVisualMappingChange("borderColor", value),
    onYAxisModeChange: onYAxisModeChange,
    onYAxisPropertyChange: onYAxisPropertyChange
  });
}

/**
 * Creates the compact axis controls frame with all sections
 * Internal function that orchestrates the UI creation
 */
function createCompactAxisControls({
  gui,
  xAxisValue,
  zAxisValue,
  backgroundColorValue,
  borderColorValue,
  useLayerForYAxis,
  yAxisProperty,
  onXAxisChange,
  onZAxisChange,
  onBackgroundColorChange,
  onBorderColorChange,
  onYAxisModeChange,
  onYAxisPropertyChange
}: CompactAxisControlsProps): void {
  // Create main container frame
  const mainFrame = createMainFrame(gui);

  // Create axis mapping section
  createAxisMappingSection({
    parent: mainFrame,
    xAxisValue: xAxisValue,
    zAxisValue: zAxisValue,
    onXAxisChange: onXAxisChange,
    onZAxisChange: onZAxisChange
  });

  // Create visual customization section
  createVisualCustomizationSection({
    parent: mainFrame,
    backgroundColorValue: backgroundColorValue,
    borderColorValue: borderColorValue,
    onBackgroundColorChange: onBackgroundColorChange,
    onBorderColorChange: onBorderColorChange
  });

  // Create Y-axis configuration section
  createYAxisConfigSection({
    parent: mainFrame,
    useLayerForYAxis: useLayerForYAxis,
    yAxisProperty: yAxisProperty,
    onYAxisModeChange: onYAxisModeChange,
    onYAxisPropertyChange: onYAxisPropertyChange
  });
}