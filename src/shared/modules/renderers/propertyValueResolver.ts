/**
 * Property Value Resolver
 * Centralizes property extraction logic for nodes
 * Part of F002 Phase 2 refactoring - T8
 * Updated for T9: Now supports dynamic property discovery
 */

import { Node } from "../../interfaces/simpleDataGenerator.interface";
import {
  isPersonNode,
  getAgeRange,
  getFullName,
} from "../../utils/nodePropertyHelpers";
import { POSITION_CONSTANTS } from "./constants/positionConstants";
import { getNodePropertyValue } from "../../utils/propertyDiscovery";

export type PropertyExtractor = (node: Node) => string;

export class PropertyValueResolver {
  private propertyExtractors: Map<string, PropertyExtractor>;

  constructor() {
    this.propertyExtractors = new Map([
      ["type", (node) => this.extractType(node)],
      ["age", (node) => this.extractAge(node)],
      ["petType", (node) => this.extractPetType(node)],
      ["petColor", (node) => this.extractPetColor(node)],
      ["firstName", (node) => this.extractFirstName(node)],
      ["lastName", (node) => this.extractLastName(node)],
      ["fullName", (node) => this.extractFullName(node)],
      ["animalType", (node) => this.extractAnimalType(node)],
      ["countryOfBirth", (node) => this.extractCountryOfBirth(node)],
      ["countryOfResidence", (node) => this.extractCountryOfResidence(node)],
      // Harness-specific properties
      ["service", (node) => this.extractService(node)],
      ["component", (node) => this.extractComponent(node)],
      ["language", (node) => this.extractLanguage(node)],
      ["size", (node) => this.extractSize(node)],
      ["resourceDomain", (node) => this.extractResourceDomain(node)],
      ["operationType", (node) => this.extractOperationType(node)],
      ["apiPattern", (node) => this.extractApiPattern(node)],
      ["apiComplexity", (node) => this.extractApiComplexity(node)],
      ["httpMethod", (node) => this.extractHttpMethod(node)],
    ]);
  }

  /**
   * Get property value for a node
   */
  public getPropertyValue(node: Node, propertyName: string): string {
    const extractor = this.propertyExtractors.get(propertyName);

    if (extractor) {
      try {
        return extractor(node);
      } catch (error) {
        warn(
          `[PropertyValueResolver] Error extracting property ${propertyName}: ${error}`
        );
      }
    }

    // Fall back to dynamic property discovery for unknown properties
    const value = getNodePropertyValue(node, propertyName);
    if (value !== undefined) {
      return tostring(value);
    }

    // Final fallback
    return "Unknown";
  }

  /**
   * Register a custom property extractor
   */
  public registerExtractor(
    propertyName: string,
    extractor: PropertyExtractor
  ): void {
    this.propertyExtractors.set(propertyName, extractor);
  }

  /**
   * Get all available property names
   */
  public getAvailableProperties(): string[] {
    const properties: string[] = [];
    this.propertyExtractors.forEach((_, propertyName) => {
      properties.push(propertyName);
    });
    return properties;
  }

  /**
   * Extract type property
   */
  private extractType(node: Node): string {
    // For Harness data, the file type is in properties.type
    if (node.properties?.type) {
      return node.properties.type;
    }
    // For regular nodes, use node.type
    return node.type;
  }

  /**
   * Extract age as range
   */
  private extractAge(node: Node): string {
    return getAgeRange(node);
  }

  /**
   * Extract pet type
   */
  private extractPetType(node: Node): string {
    if (!isPersonNode(node)) {
      return "None";
    }
    return node.properties.petType || "None";
  }

  /**
   * Extract pet color
   */
  private extractPetColor(node: Node): string {
    if (!isPersonNode(node)) {
      return "None";
    }
    return node.properties.petColor || "None";
  }

  /**
   * Extract first name
   */
  private extractFirstName(node: Node): string {
    if (!isPersonNode(node)) {
      return node.name;
    }
    return node.properties.firstName || node.name;
  }

  /**
   * Extract last name
   */
  private extractLastName(node: Node): string {
    if (!isPersonNode(node)) {
      return "";
    }
    return node.properties.lastName || "";
  }

  /**
   * Extract full name
   */
  private extractFullName(node: Node): string {
    return getFullName(node);
  }

  /**
   * Extract animal type
   */
  private extractAnimalType(node: Node): string {
    if (node.type !== "Animals" || !node.properties) {
      return "None";
    }
    // Type-safe property access
    const properties = node.properties as { animalType?: string };
    return properties.animalType || "None";
  }

  /**
   * Extract country of birth
   */
  private extractCountryOfBirth(node: Node): string {
    if (!isPersonNode(node)) {
      return "Unknown";
    }
    return node.properties.countryOfBirth || "Unknown";
  }

  /**
   * Extract country of residence
   */
  private extractCountryOfResidence(node: Node): string {
    if (!isPersonNode(node)) {
      return "Unknown";
    }
    return node.properties.countryOfResidence || "Unknown";
  }

  /**
   * Get age range label from age value
   */
  public getAgeRangeLabel(age: number): string {
    const ranges = POSITION_CONSTANTS.AGE_RANGES;

    if (age < ranges.CHILD.max) return ranges.CHILD.label;
    if (age < ranges.YOUNG_ADULT.max) return ranges.YOUNG_ADULT.label;
    if (age < ranges.MIDDLE_AGED.max) return ranges.MIDDLE_AGED.label;
    if (age < ranges.SENIOR.max) return ranges.SENIOR.label;
    return ranges.ELDERLY.label;
  }

  /**
   * Extract service property (Harness)
   */
  private extractService(node: Node): string {
    return node.properties?.service || "Unknown";
  }

  /**
   * Extract component property (Harness)
   */
  private extractComponent(node: Node): string {
    // For Harness data with component property
    if (node.properties?.component) {
      const component = node.properties.component;
      // print(`[PropertyResolver] Node ${node.name} has component: ${component}`);
      return component;
    }

    // For test data, try to use node name for uniqueness
    // This prevents all nodes from being grouped as "Unknown"
    const match = node.name.match("[0-9]+");
    if (match && match[0]) {
      const result = `${node.type}_${match[0]}`;
      // print(`[PropertyResolver] Node ${node.name} using generated component: ${result}`);
      return result;
    }

    // Fallback to node type
    const fallback = node.type || "Unknown";
    // print(`[PropertyResolver] Node ${node.name} falling back to: ${fallback}`);
    return fallback;
  }

  /**
   * Extract language property (Harness)
   */
  private extractLanguage(node: Node): string {
    return node.properties?.language || "Unknown";
  }

  /**
   * Extract size property (Harness)
   */
  private extractSize(node: Node): string {
    return node.properties?.size || "Unknown";
  }

  /**
   * Extract resourceDomain property (Harness)
   */
  private extractResourceDomain(node: Node): string {
    return node.properties?.resourceDomain || "Unknown";
  }

  /**
   * Extract operationType property (Harness)
   */
  private extractOperationType(node: Node): string {
    return node.properties?.operationType || "Unknown";
  }

  /**
   * Extract apiPattern property (Harness)
   */
  private extractApiPattern(node: Node): string {
    return node.properties?.apiPattern || "Unknown";
  }

  /**
   * Extract apiComplexity property (Harness)
   */
  private extractApiComplexity(node: Node): string {
    return node.properties?.apiComplexity || "Unknown";
  }

  /**
   * Extract httpMethod property (Harness)
   */
  private extractHttpMethod(node: Node): string {
    return node.properties?.httpMethod || "Unknown";
  }
}
