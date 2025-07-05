/**
 * Interfaces for label block creation
 */

export interface TextBoxProps {
  text?: string;
  textSize?: number;
  backgroundColor?: Color3;
  textColor?: Color3;
  font?: Enum.Font;
  borderSizePixel?: number;
  borderColor?: Color3;
  textWrapped?: boolean;
}

export interface LabelConfig {
  top?: TextBoxProps;
  bottom?: TextBoxProps;
  front?: TextBoxProps;
  back?: TextBoxProps;
  left?: TextBoxProps;
  right?: TextBoxProps;
}

export interface LabelBlockProps {
  Size?: number; // Cube dimension (n x n x n)
  Anchored?: boolean;
  Color?: [number, number, number];
  Material?: string;
  Transparency?: number;
  [key: string]: any; // Allow any additional Part properties
}

export interface LabelBlockConfig {
  id: string;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  props?: LabelBlockProps;
  labels?: LabelConfig;
  textBoxOverrides?: Partial<TextBoxProps>;
  parent?: Instance;
}

import { LABEL_BLOCK_CONSTANTS } from "./constants";

export const defaultProps: LabelBlockProps = {
  Size: LABEL_BLOCK_CONSTANTS.DEFAULT_SIZE,
  Anchored: LABEL_BLOCK_CONSTANTS.DEFAULT_ANCHORED,
  Color: LABEL_BLOCK_CONSTANTS.DEFAULT_COLOR,
  Material: LABEL_BLOCK_CONSTANTS.DEFAULT_MATERIAL,
  Transparency: LABEL_BLOCK_CONSTANTS.DEFAULT_TRANSPARENCY,
};