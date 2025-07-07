/**
 * Strongly typed node type definitions
 * Part of F002 refactoring for improved type safety
 */

// Core node type unions
export type PersonNodeType = "man" | "woman" | "child" | "grandparent";
export type AnimalNodeType = "Animals"; // Currently only one animal group type
export type NodeType = PersonNodeType | AnimalNodeType;

// Property type definitions
export interface PersonProperties {
  age: number;
  petType: string;
  petColor: string;
  firstName: string;
  lastName: string;
}

export interface AnimalProperties {
  animalType: string;
}

// Node property union
export type NodeProperties = PersonProperties | AnimalProperties;

// Type guards
export function isPersonNodeType(nodeType: string): nodeType is PersonNodeType {
  return ["man", "woman", "child", "grandparent"].includes(nodeType);
}

export function isAnimalNodeType(nodeType: string): nodeType is AnimalNodeType {
  return nodeType === "Animals";
}

export function isValidNodeType(nodeType: string): nodeType is NodeType {
  return isPersonNodeType(nodeType) || isAnimalNodeType(nodeType);
}

// Axis property names
export type AxisPropertyName = "type" | "age" | "petType" | "petColor" | "firstName" | "lastName";

export const AXIS_PROPERTIES: readonly AxisPropertyName[] = [
  "type",
  "age", 
  "petType",
  "petColor",
  "firstName",
  "lastName"
] as const;