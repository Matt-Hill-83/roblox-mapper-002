/**
 * Label Block Maker module
 * Exports all public APIs for creating label blocks
 */

// Legacy exports (deprecated)
export { makeLabelBlock } from "./labelBlockMakerAdapter";
export { makeLabelBlockAllFaces } from "./labelBlockMaker";
export type { 
  TextBoxProps, 
  LabelConfig, 
  LabelBlockProps, 
  LabelBlockConfig 
} from "./interfaces";

// Standardized exports
export { makeLabelBlockStandardized } from "./makeLabelBlockStandardized";
export type { ILabelBlockMakerConfig } from "./standardizedInterfaces";