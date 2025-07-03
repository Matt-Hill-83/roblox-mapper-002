// Utility functions for generating entity and connector colors

/**
 * Generates a distinct color palette for entity types
 * Uses HSL color space for better visual separation
 */
export function generateEntityTypeColors(numTypes: number): string[] {
  const colors: string[] = [];
  
  // Predefined colors for common cases (2-6 types)
  const predefinedColors = [
    '#1976d2', // Blue
    '#d32f2f', // Red  
    '#388e3c', // Green
    '#f57c00', // Orange
    '#7b1fa2', // Purple
    '#00796b', // Teal
    '#5d4037', // Brown
    '#455a64', // Blue Grey
  ];

  if (numTypes <= predefinedColors.length) {
    return predefinedColors.slice(0, numTypes);
  }

  // For more than 8 types, generate colors using HSL
  for (let i = 0; i < numTypes; i++) {
    const hue = (i * 360) / numTypes;
    const saturation = 65 + (i % 3) * 10; // Vary saturation slightly
    const lightness = 45 + (i % 2) * 10;  // Vary lightness slightly
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}

/**
 * Generates distinct visual styles for connector types
 */
export interface ConnectorStyle {
  color: string;
  strokeWidth: number;
  strokeDasharray?: string;
  opacity: number;
}

export function generateConnectorTypeStyles(numTypes: number): ConnectorStyle[] {
  const baseColors = [
    '#666666', // Grey
    '#2196f3', // Blue
    '#4caf50', // Green
    '#ff9800', // Orange
    '#9c27b0', // Purple
    '#f44336', // Red
    '#00bcd4', // Cyan
    '#795548', // Brown
  ];

  const styles: ConnectorStyle[] = [];

  for (let i = 0; i < numTypes; i++) {
    const colorIndex = i % baseColors.length;
    const styleIndex = Math.floor(i / baseColors.length);
    
    let strokeDasharray: string | undefined;
    let strokeWidth = 2;
    
    // Vary line styles for different connector types
    switch (styleIndex) {
      case 0: // Solid line
        strokeDasharray = undefined;
        strokeWidth = 2;
        break;
      case 1: // Dashed line
        strokeDasharray = '8,4';
        strokeWidth = 2;
        break;
      case 2: // Dotted line
        strokeDasharray = '2,3';
        strokeWidth = 2;
        break;
      case 3: // Thick solid
        strokeDasharray = undefined;
        strokeWidth = 3;
        break;
      default: // Long dash
        strokeDasharray = '12,6';
        strokeWidth = 2;
        break;
    }

    styles.push({
      color: baseColors[colorIndex],
      strokeWidth,
      strokeDasharray,
      opacity: 0.8
    });
  }

  return styles;
}

/**
 * Maps entity type index to color from the generated palette
 */
export function getEntityTypeColor(typeIndex: number, colors: string[]): string {
  return colors[typeIndex % colors.length];
}

/**
 * Maps connector type index to style from the generated styles
 */
export function getConnectorTypeStyle(typeIndex: number, styles: ConnectorStyle[]): ConnectorStyle {
  return styles[typeIndex % styles.length];
}