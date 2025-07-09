/**
 * Property Value Resolver
 * Centralizes property extraction logic for nodes
 * Part of F002 Phase 2 refactoring - T8
 */

import { Node } from "../../interfaces/simpleDataGenerator.interface";
import { isPersonNode, getAgeRange, getFullName } from "../../utils/nodePropertyHelpers";
import { POSITION_CONSTANTS } from "./constants/positionConstants";

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
      ["countryOfResidence", (node) => this.extractCountryOfResidence(node)]
    ]);
  }
  
  /**
   * Get property value for a node
   */
  public getPropertyValue(node: Node, propertyName: string): string {
    const extractor = this.propertyExtractors.get(propertyName);
    
    if (!extractor) {
      warn(`[PropertyValueResolver] Unknown property: ${propertyName}`);
      return "Unknown";
    }
    
    try {
      return extractor(node);
    } catch (error) {
      warn(`[PropertyValueResolver] Error extracting property ${propertyName}: ${error}`);
      return "Unknown";
    }
  }
  
  /**
   * Register a custom property extractor
   */
  public registerExtractor(propertyName: string, extractor: PropertyExtractor): void {
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
}