import { Players } from "@rbxts/services";
import { GeneratorConfig } from "../../shared/interfaces/simpleDataGenerator.interface";

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
    this.configFrame.Size = new UDim2(0, 300, 0, 250);
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
    this.createInputFields();

    // Create regenerate button
    this.createRegenerateButton();
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
   * Creates input fields for each configuration parameter
   */
  private createInputFields(): void {
    const parameters: Array<{ key: keyof GeneratorConfig; label: string; min: number; max: number }> = [
      { key: "numGroups", label: "Number of Groups", min: 1, max: 10 },
      { key: "numLevels", label: "Number of Levels", min: 1, max: 5 },
      { key: "numBranches", label: "Branches per Parent", min: 1, max: 5 },
      { key: "numNodeTypes", label: "Node Types", min: 1, max: 2 },
      { key: "numLinkTypes", label: "Link Types", min: 1, max: 3 }
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
      label.Parent = this.configFrame;

      // Create input box
      const input = new Instance("TextBox");
      input.Name = param.key;
      input.Size = new UDim2(0.3, 0, 0, 25);
      input.Position = new UDim2(0.7, -10, 0, yOffset);
      input.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
      input.BorderSizePixel = 0;
      input.Text = tostring(this.currentConfig[param.key]);
      input.TextColor3 = new Color3(1, 1, 1);
      input.TextScaled = true;
      input.Font = Enum.Font.SourceSans;
      input.Parent = this.configFrame;

      // Add corner rounding to input
      const inputCorner = new Instance("UICorner");
      inputCorner.CornerRadius = new UDim(0, 4);
      inputCorner.Parent = input;

      // Add validation
      input.FocusLost.Connect(() => {
        this.validateAndUpdateInput(input, param.key, param.min, param.max);
      });

      this.inputs.set(param.key, input);
      yOffset += rowHeight;
    });
  }

  /**
   * Creates the regenerate button
   */
  private createRegenerateButton(): void {
    const button = new Instance("TextButton");
    button.Name = "RegenerateButton";
    button.Size = new UDim2(0.8, 0, 0, 30);
    button.Position = new UDim2(0.1, 0, 1, -40);
    button.BackgroundColor3 = new Color3(0.2, 0.6, 0.2);
    button.BorderSizePixel = 0;
    button.Text = "Regenerate";
    button.TextColor3 = new Color3(1, 1, 1);
    button.TextScaled = true;
    button.Font = Enum.Font.SourceSansBold;
    button.Parent = this.configFrame;

    // Add corner rounding
    const buttonCorner = new Instance("UICorner");
    buttonCorner.CornerRadius = new UDim(0, 6);
    buttonCorner.Parent = button;

    // Add hover effect
    button.MouseEnter.Connect(() => {
      button.BackgroundColor3 = new Color3(0.3, 0.7, 0.3);
    });

    button.MouseLeave.Connect(() => {
      button.BackgroundColor3 = new Color3(0.2, 0.6, 0.2);
    });

    // Handle click
    button.MouseButton1Click.Connect(() => {
      this.onRegenerateClick();
    });
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