import { GeneratorConfig } from "../../../shared/interfaces/simpleDataGenerator.interface";

// Layer configuration for enhanced data generator
export interface LayerConfig {
  layerNumber: number;
  numNodes: number;
  connectionsPerNode: number;
  nodeType: string;
  linkType: string;
}

// Enhanced configuration that includes layers
export interface EnhancedGeneratorConfig {
  numNodeTypes: number;
  numLinkTypes: number;
  layers: LayerConfig[];
}

export interface ConfigGUIServiceOptions {
  initialConfig: GeneratorConfig;
  onConfigChange?: (config: GeneratorConfig) => void;
  onEnhancedConfigChange?: (config: EnhancedGeneratorConfig) => void;
  position?: UDim2;
  mode?: "simple" | "enhanced";
}

export interface GUIState {
  isVisible: boolean;
  mode: "simple" | "enhanced";
  currentConfig: GeneratorConfig;
  enhancedConfig: EnhancedGeneratorConfig;
  gui?: ScreenGui;
  configFrame?: Frame;
  inputs: Map<keyof GeneratorConfig, TextBox>;
  layerRows: Frame[];
  statusLabel?: TextLabel;
}

export interface ComponentProps {
  parent: Instance;
  config?: Partial<{
    size?: UDim2;
    position?: UDim2;
    backgroundColor?: Color3;
    textColor?: Color3;
  }>;
}

export interface InputFieldProps {
  configFrame: Frame;
  currentConfig: GeneratorConfig;
  inputs: Map<keyof GeneratorConfig, TextBox>;
  validateAndUpdateInput: (input: TextBox, key: keyof GeneratorConfig, min: number, max: number) => void;
}

export interface RegenerateButtonProps {
  configFrame: Frame;
  onRegenerateClick: () => void;
}