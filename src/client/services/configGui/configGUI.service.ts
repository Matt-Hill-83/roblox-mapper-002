/**
 * Configuration GUI Service
 * 
 * Implements the Screen GUI specification defined in:
 * 000ProjectSpecification/002ScreenGuiSpec.md
 * 
 * This service provides the user interface for configuring the simple data generator
 * with level-based node counts and other parameters.
 */

import { Players } from "@rbxts/services";
import { GeneratorConfig } from "../../../shared/interfaces/simpleDataGenerator.interface";
import { createInputFields } from "./createInputFields";
import { createRegenerateButton } from "./createRegenerateButton";

export class ConfigGUIService {
  private gui?: ScreenGui;
  private configFrame?: Frame;
  private inputs: Map<keyof GeneratorConfig, TextBox> = new Map();
  private currentConfig: GeneratorConfig;
  private onConfigChange?: (config: GeneratorConfig) => void;

  constructor(initialConfig: GeneratorConfig) {
    this.currentConfig = { ...initialConfig };
  }

  /**
   * Creates and displays the configuration GUI
   */
  public createGUI(onConfigChange: (config: GeneratorConfig) => void): void {
    this.onConfigChange = onConfigChange;
    const player = Players.LocalPlayer;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

    // Create ScreenGui
    this.gui = new Instance("ScreenGui");
    this.gui.Name = "ConfigurationGUI";
    this.gui.ResetOnSpawn = false;
    this.gui.Parent = playerGui;

    // Create main frame
    this.configFrame = new Instance("Frame");
    this.configFrame.Name = "ConfigFrame";
    this.configFrame.Size = new UDim2(0, 350, 0, 285);
    this.configFrame.Position = new UDim2(0, 10, 0, 10); // Upper left corner
    this.configFrame.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
    this.configFrame.BorderSizePixel = 0;
    this.configFrame.Parent = this.gui;

    // Add corner rounding
    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 8);
    corner.Parent = this.configFrame;

    // Add title
    this.createTitle();

    // Create input fields
    createInputFields({
      configFrame: this.configFrame,
      currentConfig: this.currentConfig,
      inputs: this.inputs as Map<keyof GeneratorConfig, TextBox>,
      validateAndUpdateInput: (input, key, min, max) => this.validateAndUpdateInput(input, key, min, max)
    });

    // Create regenerate button
    createRegenerateButton({
      configFrame: this.configFrame,
      onRegenerateClick: () => this.onRegenerateClick()
    });
  }

  /**
   * Creates the title label
   */
  private createTitle(): void {
    const title = new Instance("TextLabel");
    title.Name = "Title";
    title.Size = new UDim2(1, 0, 0, 30);
    title.Position = new UDim2(0, 0, 0, 0);
    title.BackgroundTransparency = 1;
    title.Text = "Generator Configuration";
    title.TextColor3 = new Color3(1, 1, 1);
    title.TextScaled = true;
    title.Font = Enum.Font.SourceSansBold;
    title.Parent = this.configFrame;
  }



  /**
   * Validates and updates input value
   */
  private validateAndUpdateInput(input: TextBox, key: keyof GeneratorConfig, min: number, max: number): void {
    const value = tonumber(input.Text);
    
    if (value !== undefined && value >= min && value <= max) {
      this.currentConfig[key] = math.floor(value);
      input.Text = tostring(this.currentConfig[key]);
      input.TextColor3 = new Color3(1, 1, 1);
    } else {
      // Reset to current valid value
      input.Text = tostring(this.currentConfig[key]);
      input.TextColor3 = new Color3(1, 0.5, 0.5);
      
      // Flash red briefly
      wait(0.5);
      input.TextColor3 = new Color3(1, 1, 1);
    }
  }

  /**
   * Handles regenerate button click
   */
  private onRegenerateClick(): void {
    if (this.onConfigChange) {
      // Gather all current values
      const newConfig: GeneratorConfig = { ...this.currentConfig };
      
      // Trigger the callback
      this.onConfigChange(newConfig);
      
      // Visual feedback
      const button = this.configFrame!.FindFirstChild("RegenerateButton") as TextButton;
      const originalColor = button.BackgroundColor3;
      button.BackgroundColor3 = new Color3(0.1, 0.4, 0.1);
      wait(0.2);
      button.BackgroundColor3 = originalColor;
    }
  }

  /**
   * Updates the displayed configuration
   */
  public updateConfig(config: GeneratorConfig): void {
    this.currentConfig = { ...config };
    
    // Update all input fields
    this.inputs.forEach((input, key) => {
      input.Text = tostring(config[key]);
    });
  }

  /**
   * Destroys the GUI
   */
  public destroy(): void {
    if (this.gui) {
      this.gui.Destroy();
      this.gui = undefined;
      this.configFrame = undefined;
      this.inputs.clear();
    }
  }
}