/**
 * Utility functions for label block creation
 */

import { createTextBox, createTextBoxWithCustomStyling } from "../TextBoxMaker";
import { LabelConfig, TextBoxProps } from "./interfaces";

export function createLabelsForBlock(
  block: Part,
  labels: LabelConfig,
  textBoxOverrides: Partial<TextBoxProps>,
  faceMap: [keyof LabelConfig, Enum.NormalId][]
): void {
  // Create labels for each specified face
  faceMap.forEach(([faceKey, normalId]) => {
    const labelConfig = labels[faceKey];
    if (labelConfig) {
      if (labelConfig.text) {
        // Merge textBoxOverrides with individual label config
        const mergedConfig = {
          ...textBoxOverrides,
          ...labelConfig,
          text: labelConfig.text, // Ensure text is not overridden
        };
        
        // Use custom styling if any styling properties are provided
        if (
          mergedConfig.textSize !== undefined ||
          mergedConfig.backgroundColor !== undefined ||
          mergedConfig.textColor !== undefined ||
          mergedConfig.font !== undefined ||
          mergedConfig.borderSizePixel !== undefined ||
          mergedConfig.borderColor !== undefined ||
          mergedConfig.textWrapped !== undefined
        ) {
          createTextBoxWithCustomStyling({
            part: block,
            face: normalId,
            text: mergedConfig.text,
            textSize: mergedConfig.textSize,
            backgroundColor: mergedConfig.backgroundColor,
            textColor: mergedConfig.textColor,
            font: mergedConfig.font,
            borderSizePixel: mergedConfig.borderSizePixel,
            borderColor: mergedConfig.borderColor,
            textWrapped: mergedConfig.textWrapped,
          });
        } else {
          // Use simple text box for basic text
          createTextBox({
            part: block,
            face: normalId,
            text: mergedConfig.text,
          });
        }
      }
    }
  });
}