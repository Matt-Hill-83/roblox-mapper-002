/**
 * Creates the regenerate button for the configuration GUI
 * 
 * Part of the Screen GUI specification defined in:
 * 000ProjectSpecification/002ScreenGuiSpec.md
 */

interface RegenerateButtonParams {
  configFrame: Frame;
  onRegenerateClick: () => void;
}

/**
 * Creates the regenerate button
 */
export function createRegenerateButton(params: RegenerateButtonParams): void {
  const { configFrame, onRegenerateClick } = params;
  
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
  button.Parent = configFrame;

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
    onRegenerateClick();
  });
}