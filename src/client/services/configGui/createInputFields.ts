/**
 * Creates input fields for the configuration GUI
 * 
 * Part of the Screen GUI specification defined in:
 * 000ProjectSpecification/002ScreenGuiSpec.md
 */

import { GeneratorConfig } from "../../../shared/interfaces/simpleDataGenerator.interface";

interface InputFieldParams {
  configFrame: Frame;
  currentConfig: GeneratorConfig;
  inputs: Map<keyof GeneratorConfig, TextBox>;
  validateAndUpdateInput: (input: TextBox, key: keyof GeneratorConfig, min: number, max: number) => void;
}

/**
 * Creates input fields for each configuration parameter
 */
export function createInputFields(params: InputFieldParams): void {
  const { configFrame, currentConfig, inputs, validateAndUpdateInput } = params;
  
  const parameters: Array<{ key: keyof GeneratorConfig; label: string; min: number; max: number }> = [
    { key: "numLevel1Nodes", label: "Number of Level 1 Nodes", min: 1, max: 10 },
    { key: "numLevel2Nodes", label: "Number of Level 2 Nodes", min: 1, max: 50 },
    { key: "numLevel3Nodes", label: "Number of Level 3 Nodes", min: 1, max: 100 },
    { key: "childrenPerNode", label: "Children per Node", min: 1, max: 5 },
    { key: "numNodeTypes", label: "Node Types", min: 1, max: 10 },
    { key: "numLinkTypes", label: "Link Types", min: 1, max: 10 }
  ];

  let yOffset = 40;
  const rowHeight = 35;

  parameters.forEach((param) => {
    // Create label
    const label = new Instance("TextLabel");
    label.Size = new UDim2(0.5, -10, 0, 25);
    label.Position = new UDim2(0, 10, 0, yOffset);
    label.BackgroundTransparency = 1;
    label.Text = param.label + ":";
    label.TextColor3 = new Color3(0.9, 0.9, 0.9);
    label.TextXAlignment = Enum.TextXAlignment.Left;
    label.TextScaled = true;
    label.Font = Enum.Font.SourceSans;
    label.Parent = configFrame;

    // Create input box
    const input = new Instance("TextBox");
    input.Name = param.key;
    input.Size = new UDim2(0.3, 0, 0, 25);
    input.Position = new UDim2(0.7, -10, 0, yOffset);
    input.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
    input.BorderSizePixel = 0;
    input.Text = tostring(currentConfig[param.key]);
    input.TextColor3 = new Color3(1, 1, 1);
    input.TextScaled = true;
    input.Font = Enum.Font.SourceSans;
    input.Parent = configFrame;

    // Add corner rounding to input
    const inputCorner = new Instance("UICorner");
    inputCorner.CornerRadius = new UDim(0, 4);
    inputCorner.Parent = input;

    // Add validation
    input.FocusLost.Connect(() => {
      validateAndUpdateInput(input, param.key, param.min, param.max);
    });

    inputs.set(param.key, input);
    yOffset += rowHeight;
  });
}