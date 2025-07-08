/**
 * Adapter for label block maker to maintain backward compatibility
 * while transitioning to standardized interfaces
 */

import { LabelBlockConfig } from "./interfaces";
import { makeLabelBlockStandardized } from "./makeLabelBlockStandardized";
import { convertLegacyLabelBlockConfig } from "./standardizedInterfaces";

/**
 * Legacy makeLabelBlock function that adapts to the new standardized version
 * @deprecated Use makeLabelBlockStandardized directly with ILabelBlockMakerConfig
 */
export function makeLabelBlock(config: LabelBlockConfig): Part {
  // Convert legacy config to standardized config
  const standardizedConfig = convertLegacyLabelBlockConfig({
    id: config.id,
    position: config.position,
    rotation: config.rotation,
    props: config.props,
    labels: config.labels as any,
    textBoxOverrides: config.textBoxOverrides,
    parent: config.parent,
  });

  // Call the standardized version
  return makeLabelBlockStandardized(standardizedConfig);
}