/**
 * Label Block Maker module
 * Exports all public APIs for creating label blocks
 */

// Main exports
export { makeLabelBlock } from "./labelBlockMaker";
export type { ILabelBlockMakerConfig } from "./standardizedInterfaces";

// Legacy types for reference (can be removed in future)
export type { 
  TextBoxProps, 
  LabelConfig, 
  LabelBlockProps, 
  LabelBlockConfig 
} from "./interfaces";