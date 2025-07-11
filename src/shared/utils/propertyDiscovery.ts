/**
 * Property Discovery Utility
 * Dynamically discovers properties from data objects for axis mapping
 * Part of T9: Make Axis Filters Dynamic
 */

import { Node } from "../interfaces/simpleDataGenerator.interface";

/**
 * System properties that should be excluded from axis mapping
 */
const SYSTEM_PROPERTIES = new Set([
  "uuid",
  "name", 
  "type",
  "color",
  "position",
  "attachmentNames",
  "properties", // This is the container, we want what's inside
  "level" // Internal property used by layout algorithm
]);

/**
 * Discovers all unique properties from an array of nodes
 * @param nodes - Array of nodes to analyze
 * @returns Array of discovered property names suitable for axis mapping
 */
export function discoverNodeProperties(nodes: Node[]): string[] {
  const propertySet = new Set<string>();
  
  nodes.forEach(node => {
    // Check if node has properties object
    if (node.properties && typeIs(node.properties, "table")) {
      // Extract all property keys
      for (const [key, _] of pairs(node.properties)) {
        if (typeIs(key, "string") && !SYSTEM_PROPERTIES.has(key)) {
          propertySet.add(key);
        }
      }
    }
  });
  
  // Convert set to sorted array for consistent ordering
  const properties: string[] = [];
  propertySet.forEach(prop => properties.push(prop));
  properties.sort();
  
  return properties;
}


/**
 * Gets property value from a node, handling nested properties
 * @param node - Node to get property from
 * @param propertyName - Name of property to retrieve
 * @returns Property value or undefined
 */
export function getNodePropertyValue(node: Node, propertyName: string): unknown {
  // Check nested properties first
  if (node.properties) {
    const props = node.properties as Record<string, unknown>;
    const value = props[propertyName];
    if (value !== undefined) {
      return value;
    }
  }
  
  // Check top-level properties (but skip system properties)
  if (!SYSTEM_PROPERTIES.has(propertyName)) {
    const topLevel = node as unknown as Record<string, unknown>;
    const value = topLevel[propertyName];
    if (value !== undefined) {
      return value;
    }
  }
  
  return undefined;
}

/**
 * Validates that discovered properties have enough variety for axis mapping
 * @param nodes - Array of nodes
 * @param propertyName - Property to validate
 * @returns True if property has at least 2 different values
 */
function isValidAxisProperty(nodes: Node[], propertyName: string): boolean {
  const uniqueValues = new Set<string>();
  
  nodes.forEach(node => {
    const value = getNodePropertyValue(node, propertyName);
    if (value !== undefined) {
      uniqueValues.add(tostring(value));
    }
  });
  
  return uniqueValues.size() >= 2;
}

/**
 * Filters discovered properties to only include those suitable for axis mapping
 * @param nodes - Array of nodes
 * @param properties - Array of property names to filter
 * @returns Filtered array of properties with enough variety
 */
export function filterValidAxisProperties(nodes: Node[], properties: string[]): string[] {
  return properties.filter(prop => isValidAxisProperty(nodes, prop));
}