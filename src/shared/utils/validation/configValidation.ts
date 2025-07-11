/**
 * Configuration validation utilities for deep object validation
 */

import { validateArray, ARRAY_LIMITS, hasCircularReference } from "./arrayValidation";
import { EnhancedGeneratorConfig, LayerConfig } from "../../interfaces/enhancedGenerator.interface";

interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedConfig?: EnhancedGeneratorConfig;
}

/**
 * Deep validation for EnhancedGeneratorConfig
 */
export function validateEnhancedGeneratorConfig(
  config: unknown
): ConfigValidationResult {
  const errors: string[] = [];

  // Check if config is an object
  if (!typeIs(config, "table") || config === undefined) {
    return {
      isValid: false,
      errors: ["Configuration must be an object"],
    };
  }

  // Check for circular references
  if (hasCircularReference([config])) {
    return {
      isValid: false,
      errors: ["Configuration contains circular references"],
    };
  }

  const cfg = config as EnhancedGeneratorConfig;
  const sanitized: EnhancedGeneratorConfig = {} as EnhancedGeneratorConfig;

  // Validate numeric fields
  if (!typeIs(cfg.numNodeTypes, "number") || cfg.numNodeTypes < 1 || cfg.numNodeTypes > 50) {
    errors.push("numNodeTypes must be a number between 1 and 50");
  } else {
    sanitized.numNodeTypes = cfg.numNodeTypes;
  }

  if (!typeIs(cfg.numLinkTypes, "number") || cfg.numLinkTypes < 1 || cfg.numLinkTypes > 50) {
    errors.push("numLinkTypes must be a number between 1 and 50");
  } else {
    sanitized.numLinkTypes = cfg.numLinkTypes;
  }

  // Validate layers array
  const layersResult = validateArray<LayerConfig>(cfg.layers, {
    maxSize: ARRAY_LIMITS.MAX_LAYERS,
    minSize: 1,
    allowEmpty: false,
  });

  if (!layersResult.isValid) {
    errors.push(`Layers: ${layersResult.error}`);
  } else {
    // Validate each layer
    const validatedLayers: LayerConfig[] = [];
    
    for (let i = 0; i < cfg.layers.size(); i++) {
      const layerErrors = validateLayerConfig(cfg.layers[i], i + 1);
      if (layerErrors.size() > 0) {
        for (const err of layerErrors) {
          errors.push(err);
        }
      } else {
        validatedLayers.push(cfg.layers[i]);
      }
    }
    
    sanitized.layers = validatedLayers;
  }

  // Validate optional spacing config
  if (cfg.spacing) {
    const spacingErrors = validateSpacingConfig(cfg.spacing);
    if (spacingErrors.size() > 0) {
      for (const err of spacingErrors) {
        errors.push(err);
      }
    } else {
      sanitized.spacing = cfg.spacing;
    }
  }

  // Validate optional visualization config
  if (cfg.visualization) {
    const vizErrors = validateVisualizationConfig(cfg.visualization);
    if (vizErrors.size() > 0) {
      for (const err of vizErrors) {
        errors.push(err);
      }
    } else {
      sanitized.visualization = cfg.visualization;
    }
  }

  // Validate optional axis mapping / spatial grouping config
  if (cfg.axisMapping || cfg.spatialGrouping) {
    const mappingConfig = cfg.spatialGrouping || cfg.axisMapping;
    const mappingErrors = validateAxisMappingConfig(mappingConfig);
    if (mappingErrors.size() > 0) {
      for (const err of mappingErrors) {
        errors.push(err);
      }
    } else {
      // Support both old and new property names
      if (cfg.spatialGrouping) {
        sanitized.spatialGrouping = cfg.spatialGrouping;
      }
      if (cfg.axisMapping) {
        sanitized.axisMapping = cfg.axisMapping;
      }
    }
  }

  // Validate optional visual mapping config
  if (cfg.visualMapping) {
    const visualMappingErrors = validateVisualMappingConfig(cfg.visualMapping);
    if (visualMappingErrors.size() > 0) {
      for (const err of visualMappingErrors) {
        errors.push(err);
      }
    } else {
      sanitized.visualMapping = cfg.visualMapping;
    }
  }

  // Validate optional Y-axis config
  if (cfg.yAxisConfig) {
    const yAxisErrors = validateYAxisConfig(cfg.yAxisConfig);
    if (yAxisErrors.size() > 0) {
      for (const err of yAxisErrors) {
        errors.push(err);
      }
    } else {
      sanitized.yAxisConfig = cfg.yAxisConfig;
    }
  }

  // Validate optional numPetTypes
  if (cfg.numPetTypes !== undefined) {
    if (!typeIs(cfg.numPetTypes, "number") || cfg.numPetTypes < 1 || cfg.numPetTypes > 50) {
      errors.push("numPetTypes must be a number between 1 and 50");
    } else {
      sanitized.numPetTypes = cfg.numPetTypes;
    }
  }

  // Validate optional maxDataItems
  if (cfg.maxDataItems !== undefined) {
    if (!typeIs(cfg.maxDataItems, "number") || cfg.maxDataItems < 1 || cfg.maxDataItems > 10000) {
      errors.push("maxDataItems must be a number between 1 and 10000");
    } else {
      sanitized.maxDataItems = cfg.maxDataItems;
    }
  }

  return {
    isValid: errors.size() === 0,
    errors,
    sanitizedConfig: errors.size() === 0 ? sanitized : undefined,
  };
}

/**
 * Validates a single layer configuration
 */
function validateLayerConfig(layer: LayerConfig, layerIndex: number): string[] {
  const errors: string[] = [];
  const prefix = `Layer ${layerIndex}:`;

  // Validate layer number
  if (!typeIs(layer.layerNumber, "number") || layer.layerNumber < 1) {
    errors.push(`${prefix} layerNumber must be a positive number`);
  }

  // Validate numNodes
  if (!typeIs(layer.numNodes, "number") || layer.numNodes < 1 || layer.numNodes > ARRAY_LIMITS.MAX_NODES) {
    errors.push(`${prefix} numNodes must be between 1 and ${ARRAY_LIMITS.MAX_NODES}`);
  }

  // Validate connectionsPerNode
  if (!typeIs(layer.connectionsPerNode, "number") || layer.connectionsPerNode < 0 || layer.connectionsPerNode > 100) {
    errors.push(`${prefix} connectionsPerNode must be between 0 and 100`);
  }

  return errors;
}

/**
 * Validates spacing configuration
 */
function validateSpacingConfig(spacing: unknown): string[] {
  const errors: string[] = [];

  if (!typeIs(spacing, "table")) {
    errors.push("Spacing must be an object");
    return errors;
  }
  
  const spacingObj = spacing as Record<string, unknown>;

  // Validate numeric spacing values
  const numericFields = ["nodeHeight", "nodeRadius", "layerSpacing", "nodeSpacing", "swimlaneSpacing", "linkDiameter"];
  
  for (const field of numericFields) {
    const value = spacingObj[field];
    if (value !== undefined) {
      if (!typeIs(value, "number") || value <= 0 || value > 1000) {
        errors.push(`Spacing.${field} must be a positive number less than 1000`);
      }
    }
  }

  return errors;
}

/**
 * Validates visualization configuration
 */
function validateVisualizationConfig(viz: unknown): string[] {
  const errors: string[] = [];

  if (!typeIs(viz, "table")) {
    errors.push("Visualization must be an object");
    return errors;
  }
  
  const vizObj = viz as Record<string, unknown>;

  // Validate boolean fields
  const booleanFields = ["showNodes", "showLinkLabels", "showConnectors", "allowSameLevelLinks"];
  
  for (const field of booleanFields) {
    const value = vizObj[field];
    if (value !== undefined && !typeIs(value, "boolean")) {
      errors.push(`Visualization.${field} must be a boolean`);
    }
  }

  return errors;
}

/**
 * Validates axis mapping / spatial grouping configuration
 */
function validateAxisMappingConfig(mapping: unknown): string[] {
  const errors: string[] = [];

  if (!typeIs(mapping, "table")) {
    errors.push("Axis mapping / spatial grouping must be an object");
    return errors;
  }
  
  const mappingObj = mapping as Record<string, unknown>;

  // Check for required fields (support both old and new names)
  const hasOldNames = mappingObj["xAxis"] !== undefined && mappingObj["zAxis"] !== undefined;
  const hasNewNames = mappingObj["xGroupingProperty"] !== undefined && mappingObj["zGroupingProperty"] !== undefined;
  
  if (!hasOldNames && !hasNewNames) {
    errors.push("Axis mapping must have either xAxis/zAxis or xGroupingProperty/zGroupingProperty");
  }

  // Validate string fields
  const stringFields = ["xAxis", "zAxis", "xGroupingProperty", "zGroupingProperty"];
  
  for (const field of stringFields) {
    const value = mappingObj[field];
    if (value !== undefined && !typeIs(value, "string")) {
      errors.push(`AxisMapping.${field} must be a string`);
    }
  }

  return errors;
}

/**
 * Validates visual mapping configuration
 */
function validateVisualMappingConfig(visualMapping: unknown): string[] {
  const errors: string[] = [];

  if (!typeIs(visualMapping, "table")) {
    errors.push("Visual mapping must be an object");
    return errors;
  }
  
  const mappingObj = visualMapping as Record<string, unknown>;

  // Validate string fields
  const stringFields = ["backgroundColor", "borderColor"];
  
  for (const field of stringFields) {
    const value = mappingObj[field];
    if (value !== undefined && !typeIs(value, "string")) {
      errors.push(`VisualMapping.${field} must be a string`);
    }
  }

  return errors;
}

/**
 * Validates Y-axis configuration
 */
function validateYAxisConfig(yAxisConfig: unknown): string[] {
  const errors: string[] = [];

  if (!typeIs(yAxisConfig, "table")) {
    errors.push("Y-axis config must be an object");
    return errors;
  }
  
  const configObj = yAxisConfig as Record<string, unknown>;

  // Validate boolean field
  if (configObj["useLayer"] !== undefined && !typeIs(configObj["useLayer"], "boolean")) {
    errors.push("YAxisConfig.useLayer must be a boolean");
  }

  // Validate string field
  if (configObj["property"] !== undefined && !typeIs(configObj["property"], "string")) {
    errors.push("YAxisConfig.property must be a string");
  }

  return errors;
}


/**
 * Sanitizes and validates remote data
 */
export function validateRemoteData(data: unknown): { isValid: boolean; error?: string } {
  // For Roblox, we can't easily check serialized size, so check structure depth
  function checkDepth(obj: unknown, currentDepth: number): boolean {
    if (currentDepth > 20) return false; // Max depth of 20
    if (typeIs(obj, "table")) {
      for (const [_, value] of pairs(obj)) {
        if (!checkDepth(value, currentDepth + 1)) return false;
      }
    }
    return true;
  }
  
  if (!checkDepth(data, 0)) {
    return { isValid: false, error: "Data structure too deep (max 20 levels)" };
  }

  // Check for suspicious patterns
  if (hasCircularReference([data])) {
    return { isValid: false, error: "Data contains circular references" };
  }

  return { isValid: true };
}