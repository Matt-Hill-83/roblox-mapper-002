import type { AxisMapping, VisualMapping } from "../../../../../shared/interfaces/enhancedGenerator.interface";

export interface AxisMappingControlsProps {
  parent: Frame;
  axisMapping?: AxisMapping;
  visualMapping?: VisualMapping;
  useLayerForYAxis?: boolean;
  yAxisProperty?: string;
  onAxisMappingChange: (axis: "xAxis" | "zAxis", value: string) => void;
  onVisualMappingChange: (mapping: keyof VisualMapping, value: string) => void;
  onYAxisModeChange?: (useLayer: boolean) => void;
  onYAxisPropertyChange?: (property: string) => void;
}

export interface CompactAxisControlsProps {
  gui: ScreenGui;
  xAxisValue: string;
  zAxisValue: string;
  yAxisValue: string;
  backgroundColorValue: string;
  borderColorValue: string;
  onXAxisChange: (value: string) => void;
  onZAxisChange: (value: string) => void;
  onYAxisChange: (value: string) => void;
  onBackgroundColorChange: (value: string) => void;
  onBorderColorChange: (value: string) => void;
}

export interface DropdownProps {
  button: TextButton;
  currentValue: string;
  onChange: (value: string) => void;
  parent: Frame;
  properties: string[];
}

export interface RadioButtonProps {
  parent: Frame;
  position: UDim2;
  text: string;
  selected: boolean;
  onSelect: () => void;
}

export interface SectionProps {
  parent: Frame;
  title: string;
  yPosition: number;
}

export interface LabeledControlProps {
  parent: Frame;
  label: string;
  yPosition: number;
  value: string;
  properties: string[];
  onChange: (value: string) => void;
}