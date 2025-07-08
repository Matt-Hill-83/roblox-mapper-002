/**
 * Adapter for bar maker to maintain backward compatibility
 * while transitioning to standardized interfaces
 */

import { BarConfig } from "./interfaces";
import { makeBarStandardized } from "./makeBarStandardized";
import { convertLegacyBarConfig } from "./standardizedInterfaces";

/**
 * Legacy makeBar function that adapts to the new standardized version
 * @deprecated Use makeBarStandardized directly with IBarMakerConfig
 */
export function makeBar(config: BarConfig): Part {
  // Convert legacy config to standardized config
  const standardizedConfig = convertLegacyBarConfig({
    id: config.id,
    position: config.position,
    rotation: config.rotation,
    props: config.props,
    label: config.label,
    stackIndex: config.stackIndex,
    hexIndex: config.hexIndex,
    barIndex: config.barIndex,
  });

  // Call the standardized version
  return makeBarStandardized(standardizedConfig);
}