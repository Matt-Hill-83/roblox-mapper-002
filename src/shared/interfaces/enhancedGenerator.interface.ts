/**
 * Interfaces for Enhanced Data Generator
 * Used by both client (GUI) and server (data generation)
 */

// Layer configuration for enhanced data generator
export interface LayerConfig {
  layerNumber: number;
  numNodes: number;
  connectionsPerNode: number;
  nodeType: string;
  linkType: string;
}

// Enhanced configuration that includes layers
export interface EnhancedGeneratorConfig {
  numNodeTypes: number;
  numLinkTypes: number;
  layers: LayerConfig[];
}