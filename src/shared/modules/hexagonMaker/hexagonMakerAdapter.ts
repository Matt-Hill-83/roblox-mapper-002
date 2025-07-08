/**
 * Adapter for hexagon maker to maintain backward compatibility
 * while transitioning to standardized interfaces
 */

import { HexagonConfig } from "./interfaces";
import { makeHexagonStandardized } from "./makeHexagonStandardized";
import { convertLegacyHexagonConfig } from "./standardizedInterfaces";

/**
 * Legacy makeHexagon function that adapts to the new standardized version
 * @deprecated Use makeHexagonStandardized directly with IHexagonMakerConfig
 */
export function makeHexagon(config: HexagonConfig): Model {
  // Convert legacy config to standardized config
  const standardizedConfig = convertLegacyHexagonConfig({
    id: config.id,
    centerPosition: config.centerPosition,
    width: config.width,
    height: config.height,
    barProps: config.barProps,
    labels: config.labels,
    stackIndex: config.stackIndex,
    hexIndex: config.hexIndex,
    guid: config.guid,
  });

  // Call the standardized version
  return makeHexagonStandardized(standardizedConfig);
}