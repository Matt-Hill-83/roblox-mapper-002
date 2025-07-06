/**
 * Validation Handlers for Configuration GUI
 * 
 * Provides comprehensive validation for all configuration inputs
 * to ensure data integrity and prevent invalid states.
 */

import { EnhancedGeneratorConfig, LayerConfig } from "./interfaces";
import { GUI_CONSTANTS } from "./constants";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates the entire enhanced configuration
 */
export function validateEnhancedConfig(config: EnhancedGeneratorConfig): ValidationResult {
  // Validate node types
  if (config.numNodeTypes < 1 || config.numNodeTypes > 10) {
    return {
      isValid: false,
      error: "Node types must be between 1 and 10"
    };
  }

  // Validate link types
  if (config.numLinkTypes < 1 || config.numLinkTypes > 10) {
    return {
      isValid: false,
      error: "Link types must be between 1 and 10"
    };
  }

  // Validate layers
  if (config.layers.size() > GUI_CONSTANTS.VALIDATION.MAX_LAYERS) {
    return {
      isValid: false,
      error: `Cannot exceed ${GUI_CONSTANTS.VALIDATION.MAX_LAYERS} layers`
    };
  }

  // Validate each layer
  for (let i = 0; i < config.layers.size(); i++) {
    const layer = config.layers[i];
    const layerResult = validateLayerConfig(layer, i + 1);
    if (!layerResult.isValid) {
      return layerResult;
    }
  }

  // Validate spacing
  if (config.spacing) {
    const spacingResult = validateSpacingConfig(config.spacing);
    if (!spacingResult.isValid) {
      return spacingResult;
    }
  }

  return { isValid: true };
}

/**
 * Validates a single layer configuration
 */
export function validateLayerConfig(layer: LayerConfig, layerNumber: number): ValidationResult {
  // Validate number of nodes
  if (layer.numNodes < 1 || layer.numNodes > GUI_CONSTANTS.VALIDATION.MAX_NODES_PER_LAYER) {
    return {
      isValid: false,
      error: `Layer ${layerNumber}: Number of nodes must be between 1 and ${GUI_CONSTANTS.VALIDATION.MAX_NODES_PER_LAYER}`
    };
  }

  // Validate connections per node
  if (layer.connectionsPerNode < 0 || layer.connectionsPerNode > GUI_CONSTANTS.VALIDATION.MAX_CONNECTIONS_PER_NODE) {
    return {
      isValid: false,
      error: `Layer ${layerNumber}: Connections per node must be between 0 and ${GUI_CONSTANTS.VALIDATION.MAX_CONNECTIONS_PER_NODE}`
    };
  }

  // Validate node type is selected
  if (!layer.nodeType || layer.nodeType === "") {
    return {
      isValid: false,
      error: `Layer ${layerNumber}: Node type must be selected`
    };
  }

  // Validate link type is selected (if connections > 0)
  if (layer.connectionsPerNode > 0 && (!layer.linkType || layer.linkType === "")) {
    return {
      isValid: false,
      error: `Layer ${layerNumber}: Link type must be selected when connections > 0`
    };
  }

  return { isValid: true };
}

/**
 * Validates spacing configuration
 */
export function validateSpacingConfig(spacing: import("../../../shared/interfaces/enhancedGenerator.interface").SpacingConfig): ValidationResult {
  const fields = [
    { name: "nodeHeight", value: spacing.nodeHeight, min: 1, max: 100 },
    { name: "nodeRadius", value: spacing.nodeRadius, min: 1, max: 50 },
    { name: "layerSpacing", value: spacing.layerSpacing, min: 5, max: 200 },
    { name: "nodeSpacing", value: spacing.nodeSpacing, min: 1, max: 100 },
    { name: "swimlaneSpacing", value: spacing.swimlaneSpacing, min: 5, max: 200 },
    { name: "linkDiameter", value: spacing.linkDiameter, min: 0.1, max: 5 }
  ];

  for (const field of fields) {
    if (field.value < field.min || field.value > field.max) {
      return {
        isValid: false,
        error: `${field.name} must be between ${field.min} and ${field.max}`
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates a numeric input value
 */
export function validateNumericInput(value: string, min: number, max: number, fieldName: string): ValidationResult {
  const numValue = tonumber(value);
  
  if (numValue === undefined) {
    return {
      isValid: false,
      error: `${fieldName} must be a number`
    };
  }

  if (numValue < min || numValue > max) {
    return {
      isValid: false,
      error: `${fieldName} must be between ${min} and ${max}`
    };
  }

  return { isValid: true };
}

/**
 * Validates a string input
 */
export function validateStringInput(value: string, maxLength: number, fieldName: string): ValidationResult {
  if (value.size() === 0) {
    return {
      isValid: false,
      error: `${fieldName} cannot be empty`
    };
  }

  if (value.size() > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${maxLength} characters`
    };
  }

  // Check for potentially malicious patterns
  const dangerousPatterns = ["<", ">", "&", '"', "'", "\\"];
  for (const pattern of dangerousPatterns) {
    if (value.find(pattern)[0] !== undefined) {
      return {
        isValid: false,
        error: `${fieldName} contains invalid characters`
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates the total complexity of the configuration
 */
export function validateComplexity(config: EnhancedGeneratorConfig): ValidationResult {
  let totalNodes = 0;
  let totalConnections = 0;

  for (let i = 0; i < config.layers.size(); i++) {
    const layer = config.layers[i];
    totalNodes += layer.numNodes;
    totalConnections += layer.numNodes * layer.connectionsPerNode;
  }

  if (totalNodes > GUI_CONSTANTS.VALIDATION.MAX_TOTAL_NODES) {
    return {
      isValid: false,
      error: `Total nodes (${totalNodes}) exceeds maximum of ${GUI_CONSTANTS.VALIDATION.MAX_TOTAL_NODES}`
    };
  }

  if (totalConnections > GUI_CONSTANTS.VALIDATION.MAX_TOTAL_CONNECTIONS) {
    return {
      isValid: false,
      error: `Total connections (${totalConnections}) exceeds maximum of ${GUI_CONSTANTS.VALIDATION.MAX_TOTAL_CONNECTIONS}`
    };
  }

  return { isValid: true };
}