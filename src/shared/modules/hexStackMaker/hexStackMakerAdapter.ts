/**
 * Adapter for hex stack maker to maintain backward compatibility
 * while transitioning to standardized interfaces
 */

import { HexStackConfig } from "./interfaces";
import { makeHexStackStandardized } from "./makeHexStackStandardized";
import { convertLegacyHexStackConfig } from "./standardizedInterfaces";

/**
 * Legacy makeHexStack function that adapts to the new standardized version
 * @deprecated Use makeHexStackStandardized directly with IHexStackMakerConfig
 */
export function makeHexStack(config: HexStackConfig): Model {
  // Convert legacy config to standardized config
  const standardizedConfig = convertLegacyHexStackConfig({
    id: config.id,
    centerPosition: config.centerPosition,
    width: config.width,
    height: config.height,
    count: config.count,
    colors: config.colors,
    stackIndex: config.stackIndex,
  });

  // Call the standardized version
  return makeHexStackStandardized(standardizedConfig);
}