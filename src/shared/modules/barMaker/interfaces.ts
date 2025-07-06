import { BAR_CONSTANTS } from "./constants";

export interface BarProps {
  Size: [number, number, number];
  Anchored: boolean;
  Color: [number, number, number];
  Material: string;
  Shape: string;
  TopSurface: string;
  BottomSurface: string;
  Transparency: number;
}

export interface BarConfig {
  id: string;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  props?: Partial<BarProps>;
  label?: string;
  stackIndex?: number;
  hexIndex?: number;
  barIndex?: number;
}

export const defaultProps: BarProps = {
  Size: BAR_CONSTANTS.DEFAULT_SIZE,
  Anchored: true,
  Color: BAR_CONSTANTS.DEFAULT_COLOR,
  Material: "SmoothPlastic",
  Shape: "Block",
  TopSurface: "Smooth",
  BottomSurface: "Smooth",
  Transparency: 0,
};