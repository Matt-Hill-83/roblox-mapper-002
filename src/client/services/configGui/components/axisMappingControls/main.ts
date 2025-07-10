import { DEFAULTS, getAvailableProperties } from "./constants";
import type { AxisMappingControlsProps, CompactAxisControlsProps } from "./types";
import { getOrCreateScreenGui } from "./utils/screenGuiManager";
import { createMainFrame } from "./utils/layoutManager";
import { createAxisMappingSection } from "./components/axisMappingSection";
import { createVisualCustomizationSection } from "./components/visualCustomizationSection";

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
  
  // Get the 3rd available property for Y axis default
  const availableProps = getAvailableProperties();
  const yAxisDefaultValue = availableProps.size() >= 3 ? availableProps[2] : "none";
  
  // Create a single compact frame for all controls
  createCompactAxisControls({
    gui: gui,
    xAxisValue: mapping.xAxis,
    zAxisValue: mapping.zAxis,
    yAxisValue: yAxisDefaultValue,
    backgroundColorValue: visMapping.backgroundColor || DEFAULTS.BACKGROUND_COLOR,
    borderColorValue: visMapping.borderColor || DEFAULTS.BORDER_COLOR,
    onXAxisChange: (value) => onAxisMappingChange("xAxis", value),
    onZAxisChange: (value) => onAxisMappingChange("zAxis", value),
    onYAxisChange: (value) => print(`Y axis changed to: ${value}`), // Not connected for now
    onBackgroundColorChange: (value) => onVisualMappingChange("backgroundColor", value),
    onBorderColorChange: (value) => onVisualMappingChange("borderColor", value)
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
  yAxisValue,
  backgroundColorValue,
  borderColorValue,
  onXAxisChange,
  onZAxisChange,
  onYAxisChange,
  onBackgroundColorChange,
  onBorderColorChange
}: CompactAxisControlsProps): void {
  // Create main container frame
  const mainFrame = createMainFrame(gui);

  // Create axis mapping section
  createAxisMappingSection({
    parent: mainFrame,
    xAxisValue: xAxisValue,
    zAxisValue: zAxisValue,
    yAxisValue: yAxisValue,
    onXAxisChange: onXAxisChange,
    onZAxisChange: onZAxisChange,
    onYAxisChange: onYAxisChange
  });

  // Create visual customization section
  createVisualCustomizationSection({
    parent: mainFrame,
    backgroundColorValue: backgroundColorValue,
    borderColorValue: borderColorValue,
    onBackgroundColorChange: onBackgroundColorChange,
    onBorderColorChange: onBorderColorChange
  });
}