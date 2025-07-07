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
  showLinkLabels: boolean;
  showConnectors: boolean;
  allowSameLevelLinks: boolean;
  randomZOffset: boolean;
  zOffsetAmount?: number;
}

// Axis mapping configuration
export interface AxisMapping {
  xAxis: string; // Property name for X-axis grouping
  zAxis: string; // Property name for Z-axis grouping
}

// Enhanced configuration that includes layers
export interface EnhancedGeneratorConfig {
  numNodeTypes: number;
  numLinkTypes: number;
  layers: LayerConfig[];
  spacing?: SpacingConfig; // Optional for backward compatibility
  visualization?: VisualizationOptions; // Optional for backward compatibility
  axisMapping?: AxisMapping; // Optional for backward compatibility
}