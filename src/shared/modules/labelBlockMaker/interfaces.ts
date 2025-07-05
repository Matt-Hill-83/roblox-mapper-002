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

export const defaultProps: LabelBlockProps = {
  Size: 8, // Default cube size
  Anchored: true,
  Color: [0.5, 0.5, 0.5], // Gray default
  Material: "Concrete",
  Transparency: 0,
};