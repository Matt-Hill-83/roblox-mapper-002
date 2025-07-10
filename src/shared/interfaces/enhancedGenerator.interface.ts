/**
 * Interfaces for Enhanced Data Generator
 * Used by both client (GUI) and server (data generation)
 */

// Layer configuration for enhanced data generator
export interface LayerConfig {
  layerNumber: number;
  numNodes: number;
  connectionsPerNode: number;
  nodeType?: string;
  linkType?: string;
}

// Spacing configuration for visual layout
export interface SpacingConfig {
  nodeHeight: number;
  nodeRadius: number;
  layerSpacing: number;
  nodeSpacing: number;
  swimlaneSpacing: number;
  linkDiameter: number;
  originYOffset?: number;
}

// Visualization control options
export interface VisualizationOptions {
  showNodes: boolean;
  showLinkLabels: boolean;
  showConnectors: boolean;
  allowSameLevelLinks: boolean;
}

// Spatial grouping configuration
export interface SpatialGrouping {
  xGroupingProperty: string; // Property that determines X position grouping
  zGroupingProperty: string; // Property that determines Z position grouping
}

// Legacy interface for backwards compatibility
export interface AxisMapping extends SpatialGrouping {
  xAxis: string; // Deprecated: use xGroupingProperty
  zAxis: string; // Deprecated: use zGroupingProperty
}

// Visual mapping configuration for node colors
export interface VisualMapping {
  backgroundColor: string; // Property name for background color mapping
  borderColor: string; // Property name for border color mapping
}

// Y-axis configuration
export interface YAxisConfig {
  useLayer: boolean; // true = use layer hierarchy, false = use property
  property?: string; // Property name when not using layer
}

// Enhanced configuration that includes layers
export interface EnhancedGeneratorConfig {
  numNodeTypes: number;
  numLinkTypes: number;
  numPetTypes?: number; // Number of pet types for Z position grouping (default: 5)
  layers: LayerConfig[];
  spacing?: SpacingConfig; // Optional for backward compatibility
  visualization?: VisualizationOptions; // Optional for backward compatibility
  spatialGrouping?: SpatialGrouping; // Spatial grouping configuration
  axisMapping?: AxisMapping; // Deprecated: use spatialGrouping
  visualMapping?: VisualMapping; // Optional for visual property mapping
  yAxisConfig?: YAxisConfig; // Optional for Y-axis configuration
}