import { GUI_CONSTANTS } from "../constants";

interface StatusProps {
  parent: Frame;
  initialMessage?: string;
}

export function createStatusArea({ parent, initialMessage = "Ready" }: StatusProps): TextLabel {
  const statusLabel = new Instance("TextLabel");
  statusLabel.Name = "StatusLabel";
  statusLabel.Size = new UDim2(1, -20, 0, 25);
  statusLabel.Position = new UDim2(0, 10, 1, -35); // Position at bottom
  statusLabel.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
  statusLabel.BorderSizePixel = 0;
  statusLabel.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
  statusLabel.Text = `Status: ${initialMessage}`;
  statusLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  statusLabel.TextScaled = true;
  statusLabel.TextXAlignment = Enum.TextXAlignment.Left;
  statusLabel.Parent = parent;

  const statusCorner = new Instance("UICorner");
  statusCorner.CornerRadius = new UDim(0, 4);
  statusCorner.Parent = statusLabel;

  return statusLabel;
}

export function updateStatus(statusLabel: TextLabel, message: string, isError = false): void {
  statusLabel.Text = `Status: ${message}`;
  statusLabel.TextColor3 = isError ? GUI_CONSTANTS.COLORS.ERROR : GUI_CONSTANTS.COLORS.TEXT;
  
  // Flash effect for important messages
  if (isError) {
    const originalColor = statusLabel.BackgroundColor3;
    statusLabel.BackgroundColor3 = new Color3(0.4, 0.1, 0.1);
    wait(GUI_CONSTANTS.ANIMATION.FLASH_DURATION);
    statusLabel.BackgroundColor3 = originalColor;
  }
}