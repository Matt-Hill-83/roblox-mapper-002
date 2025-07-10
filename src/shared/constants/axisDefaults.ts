/**
 * Axis Default Constants
 * Part of T9: Make Axis Filters Dynamic
 * 
 * Centralizes axis property defaults to facilitate migration from hardcoded values
 */

export const AXIS_DEFAULTS = {
  // Legacy hardcoded defaults (to be phased out)
  LEGACY_X_AXIS: "type",
  LEGACY_Z_AXIS: "petType",
  
  // Dynamic defaults - will be set at runtime based on discovered properties
  DYNAMIC_X_AXIS: undefined as string | undefined,
  DYNAMIC_Z_AXIS: undefined as string | undefined,
  
  // Fallback values if no properties are discovered
  FALLBACK_X_AXIS: "property1",
  FALLBACK_Z_AXIS: "property2",
  
  // Minimum number of unique values required for a property to be valid for axis mapping
  MIN_UNIQUE_VALUES_FOR_AXIS: 2
};

/**
 * Helper function to get X-axis default
 * @param discoveredProperties - Array of discovered properties from data
 * @returns The default X-axis property
 */
export function getDefaultXAxis(discoveredProperties?: string[]): string {
  if (discoveredProperties && discoveredProperties.size() > 0) {
    return discoveredProperties[0];
  }
  return AXIS_DEFAULTS.LEGACY_X_AXIS;
}

/**
 * Helper function to get Z-axis default
 * @param discoveredProperties - Array of discovered properties from data
 * @returns The default Z-axis property
 */
export function getDefaultZAxis(discoveredProperties?: string[]): string {
  if (discoveredProperties && discoveredProperties.size() > 1) {
    return discoveredProperties[1];
  }
  return AXIS_DEFAULTS.LEGACY_Z_AXIS;
}

/**
 * Checks if the given axis values are the legacy hardcoded defaults
 * @param xAxis - Current X-axis property
 * @param zAxis - Current Z-axis property
 * @returns True if both are legacy defaults
 */
export function isUsingLegacyDefaults(xAxis: string, zAxis: string): boolean {
  return xAxis === AXIS_DEFAULTS.LEGACY_X_AXIS && zAxis === AXIS_DEFAULTS.LEGACY_Z_AXIS;
}