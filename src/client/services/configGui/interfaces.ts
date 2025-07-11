import { LayerConfig, EnhancedGeneratorConfig } from "../../../shared/interfaces/enhancedGenerator.interface";

// Re-export the shared interfaces for local use
export { LayerConfig, EnhancedGeneratorConfig };

export interface ConfigGUIServiceOptions {
  onEnhancedConfigChange?: (config: EnhancedGeneratorConfig) => void;
  onClearRequest?: () => void;
  onUpdateRequest?: (config: EnhancedGeneratorConfig) => void;
  position?: UDim2;
  initialConfig?: EnhancedGeneratorConfig;
  defaultAxisOptions?: { [key: string]: string };
}

export interface GUIState {
  isVisible: boolean;
  enhancedConfig: EnhancedGeneratorConfig;
  gui?: ScreenGui;
  configFrame?: Frame;
  layerRows: Frame[];
  statusLabel?: TextLabel;
  discoveredProperties?: string[];
  axisMappingConfig?: any; // Store axis mapping config for delayed creation
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

