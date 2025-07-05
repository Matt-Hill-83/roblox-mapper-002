/**
 * Creates input fields for the configuration GUI
 * 
 * Part of the Screen GUI specification defined in:
 * 000ProjectSpecification/002ScreenGuiSpec.md
 */

import { GeneratorConfig } from "../../../../shared/interfaces/simpleDataGenerator.interface";
import { InputFieldProps } from "../interfaces";
import { GUI_CONSTANTS } from "../constants";
import { createUICorner } from "../utilities";

/**
 * Creates input fields for each configuration parameter
 */
export function createInputFields(params: InputFieldProps): void {
  const { configFrame, currentConfig, inputs, validateAndUpdateInput } = params;
  
  const parameters: Array<{ key: keyof GeneratorConfig; label: string; min: number; max: number }> = [
    { key: "numLevel1Nodes", label: "Number of Level 1 Nodes", min: 1, max: 10 },
    { key: "numLevel2Nodes", label: "Number of Level 2 Nodes", min: 1, max: 50 },
    { key: "numLevel3Nodes", label: "Number of Level 3 Nodes", min: 1, max: 100 },
    { key: "childrenPerNode", label: "Children per Node", min: 1, max: 5 },
    { key: "numNodeTypes", label: "Node Types", min: 1, max: 10 },
    { key: "numLinkTypes", label: "Link Types", min: 1, max: 10 }
  ];

  let yOffset = GUI_CONSTANTS.INPUT.START_Y;
  const rowHeight = GUI_CONSTANTS.INPUT.HEIGHT + GUI_CONSTANTS.INPUT.SPACING;

  parameters.forEach((param) => {
    // Create label
    const label = new Instance("TextLabel");
    label.Size = new UDim2(GUI_CONSTANTS.INPUT.LABEL_WIDTH, -10, 0, GUI_CONSTANTS.INPUT.HEIGHT);
    label.Position = new UDim2(0, 10, 0, yOffset);
    label.BackgroundTransparency = 1;
    label.Text = param.label + ":";
    label.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    label.TextXAlignment = Enum.TextXAlignment.Left;
    label.TextScaled = true;
    label.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
    label.Parent = configFrame;

    // Create input box
    const input = new Instance("TextBox");
    input.Name = param.key;
    input.Size = new UDim2(GUI_CONSTANTS.INPUT.INPUT_WIDTH, 0, 0, GUI_CONSTANTS.INPUT.HEIGHT);
    input.Position = new UDim2(1 - GUI_CONSTANTS.INPUT.INPUT_WIDTH, -10, 0, yOffset);
    input.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
    input.BorderSizePixel = 0;
    input.Text = tostring(currentConfig[param.key]);
    input.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    input.TextScaled = true;
    input.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
    input.Parent = configFrame;

    // Add corner rounding to input
    createUICorner(input, new UDim(0, 4));

    // Add validation
    input.FocusLost.Connect(() => {
      validateAndUpdateInput(input, param.key, param.min, param.max);
    });

    inputs.set(param.key, input);
    yOffset += rowHeight;
  });
}