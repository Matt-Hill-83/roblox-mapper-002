/**
 * Type-safe property access helpers for nodes
 * Part of F002 refactoring for improved type safety
 * Updated for T9: Make Axis Filters Dynamic - now supports any property structure
 */

import { Node } from "../interfaces/simpleDataGenerator.interface";
import { PersonProperties, AnimalProperties, isPersonNodeType, isAnimalNodeType } from "../interfaces/nodeTypes";
import { getNodePropertyValue } from "./propertyDiscovery";

// Type guards for nodes with specific properties
export function isPersonNode(node: Node): node is Node & { 
  properties: PersonProperties 
} {
  return isPersonNodeType(node.type) && node.properties !== undefined;
}

export function isAnimalNode(node: Node): node is Node & {
  properties: AnimalProperties
} {
  return isAnimalNodeType(node.type) && node.properties !== undefined;
}

// Safe property getters
export function getNodeProperty<K extends keyof (PersonProperties & AnimalProperties)>(
  node: Node, 
  property: K
): string | number | undefined {
  if (!node.properties) {
    return undefined;
  }

  // Type-specific property access
  if (property === "age" && isPersonNode(node)) {
    return node.properties.age;
  }
  
  if ((property === "petType" || property === "petColor" || 
       property === "firstName" || property === "lastName") && isPersonNode(node)) {
    return node.properties[property];
  }
  
  if (property === "animalType" && isAnimalNode(node)) {
    return node.properties.animalType;
  }
  
  return undefined;
}

// Get age range for grouping
export function getAgeRange(node: Node): string {
  if (!isPersonNode(node)) {
    return "Unknown";
  }
  
  const age = node.properties.age;
  if (age < 20) return "0-19";
  if (age < 40) return "20-39";
  if (age < 60) return "40-59";
  if (age < 80) return "60-79";
  return "80+";
}

// Get full name for person nodes
export function getFullName(node: Node): string {
  if (!isPersonNode(node)) {
    return node.name;
  }
  
  const { firstName, lastName } = node.properties;
  return `${firstName} ${lastName}`;
}

// Property value resolver for any property - now generic
export function resolvePropertyValue(node: Node, propertyName: string): string {
  // Handle special case for "type"
  if (propertyName === "type") {
    return node.type;
  }
  
  // Handle age with range grouping (legacy support)
  if (propertyName === "age" && isPersonNode(node)) {
    return getAgeRange(node);
  }
  
  // Use generic property discovery for all properties
  const value = getNodePropertyValue(node, propertyName);
  return value !== undefined ? tostring(value) : "Unknown";
}