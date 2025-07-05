import { GeneratorConfig } from "../../../shared/interfaces/simpleDataGenerator.interface";

export interface ConfigGUIServiceOptions {
  initialConfig: GeneratorConfig;
  onConfigChange?: (config: GeneratorConfig) => void;
  position?: UDim2;
}

export interface GUIState {
  isVisible: boolean;
  currentConfig: GeneratorConfig;
  gui?: ScreenGui;
  configFrame?: Frame;
  inputs: Map<keyof GeneratorConfig, TextBox>;
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