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
import { GUI_CONSTANTS } from "./constants";
import { GUIState } from "./interfaces";
import { validateAndUpdateInput } from "./utilities";
import { createMainFrame } from "./components/frame";
import { createTitle } from "./components/title";
import { createInputFields } from "./components/inputFields";
import { createRegenerateButton } from "./components/regenerateButton";

export class ConfigGUIService {
  private state: GUIState;
  private onConfigChange?: (config: GeneratorConfig) => void;

  constructor(initialConfig: GeneratorConfig) {
    this.state = {
      isVisible: false,
      currentConfig: { ...initialConfig },
      inputs: new Map()
    };
  }

  /**
   * Creates and displays the configuration GUI
   */
  public createGUI(onConfigChange: (config: GeneratorConfig) => void): void {
    this.onConfigChange = onConfigChange;
    const player = Players.LocalPlayer;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

    // Create ScreenGui
    this.state.gui = new Instance("ScreenGui");
    this.state.gui.Name = GUI_CONSTANTS.NAMES.SCREEN_GUI;
    this.state.gui.ResetOnSpawn = false;
    this.state.gui.Parent = playerGui;

    // Create main frame
    this.state.configFrame = createMainFrame(this.state.gui);

    // Add title
    createTitle(this.state.configFrame);

    // Create input fields
    createInputFields({
      configFrame: this.state.configFrame,
      currentConfig: this.state.currentConfig,
      inputs: this.state.inputs,
      validateAndUpdateInput: (input, key, min, max) => 
        validateAndUpdateInput(input, this.state.currentConfig, key, min, max)
    });

    // Create regenerate button
    createRegenerateButton({
      configFrame: this.state.configFrame,
      onRegenerateClick: () => this.onRegenerateClick()
    });

    this.state.isVisible = true;
  }

  /**
   * Handles regenerate button click
   */
  private onRegenerateClick(): void {
    if (this.onConfigChange) {
      // Gather all current values
      const newConfig: GeneratorConfig = { ...this.state.currentConfig };
      
      // Trigger the callback
      this.onConfigChange(newConfig);
    }
  }

  /**
   * Updates the displayed configuration
   */
  public updateConfig(config: GeneratorConfig): void {
    this.state.currentConfig = { ...config };
    
    // Update all input fields
    this.state.inputs.forEach((input, key) => {
      input.Text = tostring(config[key]);
    });
  }

  /**
   * Gets the current visibility state
   */
  public isVisible(): boolean {
    return this.state.isVisible;
  }

  /**
   * Destroys the GUI
   */
  public destroy(): void {
    if (this.state.gui) {
      this.state.gui.Destroy();
      this.state.gui = undefined;
      this.state.configFrame = undefined;
      this.state.inputs.clear();
      this.state.isVisible = false;
    }
  }
}