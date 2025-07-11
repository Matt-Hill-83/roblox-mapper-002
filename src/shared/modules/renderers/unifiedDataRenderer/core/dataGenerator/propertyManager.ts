/**
 * Property Manager for Unified Data Renderer
 * 
 * Handles property discovery and validation for generated nodes
 */

import {
  discoverNodeProperties,
  filterValidAxisProperties,
} from "../../../../../utils/propertyDiscovery";
import { Node } from "../../../../../interfaces/simpleDataGenerator.interface";
import { IPropertyManager } from "./interfaces";

export class PropertyManager implements IPropertyManager {
  
  /**
   * Discover and validate properties from generated nodes
   */
  public discoverAndValidateProperties(nodes: Node[]): any[] {
    // Use the existing property discovery utilities
    const discoveredProps = discoverNodeProperties(nodes);
    const validProps = filterValidAxisProperties(nodes, discoveredProps);
    
    return validProps;
  }

  /**
   * Analyze property distribution across nodes
   */
  public analyzePropertyDistribution(nodes: Node[]): PropertyAnalysis {
    const analysis: PropertyAnalysis = {
      totalNodes: nodes.size(),
      propertyCoverage: new Map(),
      propertyTypes: new Map(),
      uniqueValues: new Map()
    };

    // Analyze each node's properties
    nodes.forEach((node) => {
      if (node.properties) {
        for (const [propName, value] of pairs(node.properties)) {
          // Track coverage
          const currentCount = analysis.propertyCoverage.get(propName) || 0;
          analysis.propertyCoverage.set(propName, currentCount + 1);

          // Track types
          const valueType = typeOf(value);
          analysis.propertyTypes.set(propName, valueType);

          // Track unique values
          if (!analysis.uniqueValues.has(propName)) {
            analysis.uniqueValues.set(propName, new Set());
          }
          analysis.uniqueValues.get(propName)!.add(value);
        }
      }
    });

    return analysis;
  }

  /**
   * Validate that properties are suitable for axis mapping
   */
  public validateAxisProperties(nodes: Node[], propertyName: string): PropertyValidation {
    let foundCount = 0;
    let nullCount = 0;
    let typeSet = new Set<string>();
    const sampleValues: defined[] = [];

    nodes.forEach((node) => {
      const properties = node.properties;
      let found = false;
      if (properties) {
        for (const [propName, propValue] of pairs(properties)) {
          if (propName === propertyName && propValue !== undefined) {
            foundCount++;
            typeSet.add(typeOf(propValue));
            if (sampleValues.size() < 5) {
              sampleValues.push(propValue);
            }
            found = true;
            break;
          }
        }
      }
      if (!found) {
        nullCount++;
      }
    });

    const isValid = foundCount > 1 && typeSet.size() === 1; // Need variety and consistent typing
    const coverage = (foundCount / nodes.size()) * 100;
    
    const typeSetArray: string[] = [];
    typeSet.forEach((typeValue) => typeSetArray.push(typeValue));

    return {
      isValid,
      coverage,
      uniqueValueCount: foundCount, // Simplified for roblox-ts compatibility
      dataType: typeSet.size() === 1 ? typeSetArray[0] : 'mixed',
      nullCount,
      sampleValues
    };
  }

  /**
   * Get summary of all properties across nodes
   */
  public getPropertySummary(nodes: Node[]): PropertySummary {
    const analysis = this.analyzePropertyDistribution(nodes);
    const summary: PropertySummary = {
      totalProperties: analysis.propertyCoverage.size(),
      averageCoverage: 0,
      properties: []
    };

    let totalCoverage = 0;
    analysis.propertyCoverage.forEach((count, propName) => {
      const coverage = (count / analysis.totalNodes) * 100;
      totalCoverage += coverage;

      const validation = this.validateAxisProperties(nodes, propName);
      
      const uniqueValuesSet = analysis.uniqueValues.get(propName);
      const uniqueValuesCount = uniqueValuesSet ? uniqueValuesSet.size() : 0;
      
      summary.properties.push({
        name: propName,
        type: analysis.propertyTypes.get(propName) || 'unknown',
        coverage,
        uniqueValues: uniqueValuesCount,
        isValidForAxis: validation.isValid
      });
    });

    summary.averageCoverage = totalCoverage / analysis.propertyCoverage.size();
    
    // Sort by coverage descending
    table.sort(summary.properties, (a, b) => b.coverage > a.coverage);

    return summary;
  }
}

/**
 * Property analysis result interface
 */
interface PropertyAnalysis {
  totalNodes: number;
  propertyCoverage: Map<string, number>;
  propertyTypes: Map<string, string>;
  uniqueValues: Map<string, Set<defined>>;
}

/**
 * Property validation result interface
 */
interface PropertyValidation {
  isValid: boolean;
  coverage: number;
  uniqueValueCount: number;
  dataType: string;
  nullCount: number;
  sampleValues: defined[];
}

/**
 * Property summary interface
 */
interface PropertySummary {
  totalProperties: number;
  averageCoverage: number;
  properties: PropertyInfo[];
}

/**
 * Individual property information
 */
interface PropertyInfo {
  name: string;
  type: string;
  coverage: number;
  uniqueValues: number;
  isValidForAxis: boolean;
}