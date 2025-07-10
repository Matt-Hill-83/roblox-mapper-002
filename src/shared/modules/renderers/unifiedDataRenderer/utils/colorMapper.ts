/**
 * Color Mapper Utilities
 * Maps node properties to colors for visual customization
 */

import { Node } from "../../../../interfaces/simpleDataGenerator.interface";
import { VisualMapping } from "../../../../interfaces/enhancedGenerator.interface";
import { personColors } from "../../constants/robloxColors";
import { NODE_TYPE_NAMES } from "../constants";

// Create type color mapping from personColors array
const typeColorMapping: { [key: string]: Color3 } = {};
NODE_TYPE_NAMES.forEach((typeName, index) => {
  if (index < personColors.size()) {
    typeColorMapping[typeName] = personColors[index];
  }
});
// Add Animals if not in NODE_TYPE_NAMES
if (!typeColorMapping["Animals"] && personColors.size() > NODE_TYPE_NAMES.size()) {
  typeColorMapping["Animals"] = personColors[NODE_TYPE_NAMES.size()];
}

// Define color palettes for different properties
const COLOR_SCHEMES = {
  type: typeColorMapping,
  // Harness properties
  component: {
    cd: new Color3(0.2, 0.8, 0.2),          // Green
    ci: new Color3(0.2, 0.6, 0.8),          // Blue
    repository: new Color3(0.8, 0.6, 0.2),  // Orange
    api: new Color3(0.8, 0.2, 0.8),         // Purple
    platform: new Color3(0.2, 0.4, 0.8),    // Dark Blue
    ce: new Color3(0.8, 0.2, 0.4),          // Red
    core: new Color3(0.8, 0.8, 0.2),        // Yellow
    default: new Color3(0.5, 0.5, 0.5)
  },
  service: {
    platform: new Color3(0.2, 0.4, 0.8),    // Dark Blue
    ci: new Color3(0.8, 0.4, 0.2),          // Orange
    cd: new Color3(0.2, 0.8, 0.2),          // Green
    ce: new Color3(0.8, 0.2, 0.8),          // Purple
    core: new Color3(0.8, 0.8, 0.2),        // Yellow
    default: new Color3(0.5, 0.5, 0.5)
  },
  language: {
    java: new Color3(0.8, 0.4, 0.2),        // Orange (Java)
    javascript: new Color3(0.9, 0.8, 0.2),  // Yellow (JS)
    python: new Color3(0.2, 0.4, 0.8),      // Blue (Python)
    go: new Color3(0.2, 0.8, 0.8),          // Cyan (Go)
    typescript: new Color3(0.2, 0.6, 0.8),  // Light Blue (TS)
    kotlin: new Color3(0.8, 0.2, 0.8),      // Purple (Kotlin)
    scala: new Color3(0.8, 0.2, 0.2),       // Red (Scala)
    default: new Color3(0.5, 0.5, 0.5)
  },
  resourceDomain: {
    harness: new Color3(0.2, 0.6, 0.8),
    io: new Color3(0.8, 0.2, 0.4),
    wings: new Color3(0.2, 0.8, 0.4),
    software: new Color3(0.8, 0.6, 0.2),
    default: new Color3(0.5, 0.5, 0.5)
  },
  httpMethod: {
    GET: new Color3(0.2, 0.8, 0.2),       // Green (safe, read-only)
    POST: new Color3(0.2, 0.6, 0.8),      // Blue (create)
    PUT: new Color3(0.8, 0.6, 0.2),       // Orange (update)
    PATCH: new Color3(0.8, 0.8, 0.2),     // Yellow (partial update)
    DELETE: new Color3(0.8, 0.2, 0.2),    // Red (delete)
    HEAD: new Color3(0.6, 0.6, 0.6),      // Gray (metadata)
    OPTIONS: new Color3(0.8, 0.2, 0.8),   // Purple (discovery)
    MULTIPLE: new Color3(0.4, 0.2, 0.6),  // Dark Purple (multiple methods)
    INTERNAL: new Color3(0.2, 0.8, 0.8),  // Cyan (internal calls)
    UNKNOWN: new Color3(0.5, 0.5, 0.5),   // Gray (unknown method)
    default: new Color3(0.5, 0.5, 0.5)
  },
  petType: {
    Dog: new Color3(0.6, 0.4, 0.2),      // Brown
    Cat: new Color3(0.5, 0.5, 0.5),      // Gray
    Bird: new Color3(0.2, 0.8, 0.8),     // Cyan
    Fish: new Color3(0.2, 0.4, 0.8),     // Blue
    None: new Color3(0.7, 0.7, 0.7),     // Light gray
    Hamster: new Color3(0.8, 0.6, 0.2),  // Orange
    Rabbit: new Color3(0.9, 0.9, 0.9)    // White
  },
  petColor: {
    Brown: new Color3(0.6, 0.4, 0.2),
    Black: new Color3(0.1, 0.1, 0.1),
    White: new Color3(0.9, 0.9, 0.9),
    Gray: new Color3(0.5, 0.5, 0.5),
    Orange: new Color3(0.9, 0.6, 0.2),
    Golden: new Color3(0.9, 0.8, 0.4),
    Spotted: new Color3(0.8, 0.8, 0.8)
  },
  age: {
    "0-19": new Color3(0.2, 0.8, 0.2),   // Green (youth)
    "20-39": new Color3(0.2, 0.6, 0.8),  // Blue (young adult)
    "40-59": new Color3(0.8, 0.6, 0.2),  // Orange (middle age)
    "60-79": new Color3(0.8, 0.4, 0.4),  // Red (senior)
    "80+": new Color3(0.6, 0.2, 0.6)     // Purple (elder)
  },
  firstName: {
    // First 5 names get distinct colors
    James: new Color3(0.8, 0.2, 0.2),
    Mary: new Color3(0.2, 0.8, 0.2),
    John: new Color3(0.2, 0.2, 0.8),
    Patricia: new Color3(0.8, 0.8, 0.2),
    Robert: new Color3(0.8, 0.2, 0.8),
    // Rest get a default
    default: new Color3(0.5, 0.5, 0.5)
  },
  lastName: {
    // First 5 names get distinct colors
    Smith: new Color3(0.4, 0.2, 0.1),
    Johnson: new Color3(0.1, 0.4, 0.2),
    Williams: new Color3(0.2, 0.1, 0.4),
    Brown: new Color3(0.6, 0.4, 0.2),
    Jones: new Color3(0.4, 0.1, 0.4),
    // Rest get a default
    default: new Color3(0.6, 0.6, 0.6)
  },
  countryOfBirth: {
    "United States": new Color3(0.2, 0.3, 0.7),  // Blue
    "Canada": new Color3(0.8, 0.2, 0.2),         // Red
    "United Kingdom": new Color3(0.2, 0.4, 0.6),  // Navy
    "Germany": new Color3(0.1, 0.1, 0.1),        // Black
    "France": new Color3(0.2, 0.3, 0.8),         // Blue
    "Japan": new Color3(0.9, 0.9, 0.9),          // White
    "China": new Color3(0.8, 0.2, 0.2),          // Red
    "India": new Color3(1, 0.6, 0.2),            // Orange
    "Brazil": new Color3(0.2, 0.6, 0.2),         // Green
    "Australia": new Color3(0.2, 0.4, 0.2),      // Dark Green
    default: new Color3(0.5, 0.5, 0.5)
  },
  countryOfResidence: {
    "United States": new Color3(0.2, 0.3, 0.7),
    "Canada": new Color3(0.8, 0.2, 0.2),
    "United Kingdom": new Color3(0.2, 0.4, 0.6),
    "Germany": new Color3(0.1, 0.1, 0.1),
    "France": new Color3(0.2, 0.3, 0.8),
    "Japan": new Color3(0.9, 0.9, 0.9),
    "China": new Color3(0.8, 0.2, 0.2),
    "India": new Color3(1, 0.6, 0.2),
    "Brazil": new Color3(0.2, 0.6, 0.2),
    "Australia": new Color3(0.2, 0.4, 0.2),
    "Mexico": new Color3(0.2, 0.5, 0.2),
    "Spain": new Color3(0.8, 0.8, 0.2),
    "Italy": new Color3(0.2, 0.6, 0.2),
    "Netherlands": new Color3(1, 0.6, 0),
    "Sweden": new Color3(0.2, 0.4, 0.8),
    default: new Color3(0.5, 0.5, 0.5)
  }
};

// Default colors
const DEFAULT_BACKGROUND_COLOR = new Color3(0.5, 0.5, 0.5);
const DEFAULT_BORDER_COLOR = new Color3(0, 0, 0);

/**
 * Get property value from node for color mapping
 */
function getNodePropertyValue(node: Node, propertyName: string): string {
  // Debug httpMethod lookup for first few nodes
  if (propertyName === "httpMethod" && node.uuid.match("harness_file_[0-2]")) {
    print(`[ColorMapper] Looking for httpMethod in node ${node.uuid}, properties=${node.properties !== undefined}`);
    if (node.properties) {
      const keys: string[] = [];
      for (const [key] of pairs(node.properties)) {
        keys.push(key as string);
      }
      print(`[ColorMapper] Node ${node.uuid} properties: ${keys.join(", ")}`);
      const httpMethodValue = propertyName in node.properties ? node.properties[propertyName as keyof typeof node.properties] : undefined;
      print(`[ColorMapper] httpMethod value: ${httpMethodValue || "undefined"}`);
    }
  }
  
  if (propertyName === "type") {
    return node.type;
  } else if (propertyName === "age" && node.properties?.age !== undefined) {
    const age = node.properties.age;
    if (age < 20) return "0-19";
    if (age < 40) return "20-39";
    if (age < 60) return "40-59";
    if (age < 80) return "60-79";
    return "80+";
  } else if (node.properties && propertyName in node.properties) {
    const value = node.properties[propertyName as keyof typeof node.properties];
    return value ? tostring(value) : "None";
  }
  return "Unknown";
}

/**
 * Get color for a property value
 */
function getColorForPropertyValue(propertyName: string, value: string): Color3 {
  const scheme = COLOR_SCHEMES[propertyName as keyof typeof COLOR_SCHEMES];
  if (!scheme) return DEFAULT_BACKGROUND_COLOR;

  // Check if value exists in scheme
  if (value in scheme) {
    return scheme[value as keyof typeof scheme];
  }

  // Use default color if available
  if ("default" in scheme) {
    return scheme.default;
  }

  return DEFAULT_BACKGROUND_COLOR;
}

/**
 * Get background color for a node based on visual mapping
 */
export function getNodeBackgroundColor(node: Node, visualMapping?: VisualMapping): Color3 {
  // Debug all nodes to see what's happening
  if (node.uuid.match("harness_file_")) {
    print(`[ColorMapper] Node ${node.uuid}: visualMapping=${visualMapping !== undefined}, backgroundColor=${visualMapping?.backgroundColor}`);
  }
  
  if (!visualMapping || visualMapping.backgroundColor === "none") {
    // Use node's default color
    if (node.uuid.match("harness_file_")) {
      print(`[ColorMapper] Using default color for ${node.uuid}: (${node.color[0]}, ${node.color[1]}, ${node.color[2]})`);
    }
    return new Color3(node.color[0], node.color[1], node.color[2]);
  }

  const propertyValue = getNodePropertyValue(node, visualMapping.backgroundColor);
  const mappedColor = getColorForPropertyValue(visualMapping.backgroundColor, propertyValue);
  
  // Debug first few nodes to see what's happening
  if (node.uuid.match("harness_file_[0-2]")) {
    print(`[ColorMapper] Node ${node.uuid}: visualMapping.backgroundColor=${visualMapping.backgroundColor}, propertyValue=${propertyValue}, mappedColor=(${mappedColor.R * 255}, ${mappedColor.G * 255}, ${mappedColor.B * 255})`);
  }
  
  return mappedColor;
}

/**
 * Get border color for a node based on visual mapping
 */
export function getNodeBorderColor(node: Node, visualMapping?: VisualMapping): Color3 {
  if (!visualMapping || visualMapping.borderColor === "none") {
    return DEFAULT_BORDER_COLOR;
  }

  const propertyValue = getNodePropertyValue(node, visualMapping.borderColor);
  return getColorForPropertyValue(visualMapping.borderColor, propertyValue);
}

/**
 * Get text properties for a node (for label visibility)
 */
export function getNodeTextProperties(backgroundColor: Color3): { textColor: Color3; borderColor: Color3 } {
  // Calculate brightness of background
  const brightness = (backgroundColor.R + backgroundColor.G + backgroundColor.B) / 3;
  
  // Use contrasting text color
  const textColor = brightness > 0.5 
    ? new Color3(0, 0, 0)  // Black text on light background
    : new Color3(1, 1, 1); // White text on dark background
    
  return {
    textColor,
    borderColor: textColor // Use same color for text border
  };
}