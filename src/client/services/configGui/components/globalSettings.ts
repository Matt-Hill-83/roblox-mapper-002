import { GUI_CONSTANTS } from "../constants";
import { createSpacingControls } from "./spacingControls";
import type { SpacingConfig } from "../../../../shared/interfaces/enhancedGenerator.interface";

interface GlobalSettingsProps {
  parent: Frame;
  spacing: SpacingConfig;
  onSpacingChange: (field: keyof SpacingConfig, value: number) => void;
}

export function createGlobalSettings({
  parent,
  spacing,
  onSpacingChange
}: GlobalSettingsProps): Frame {
  // Create container
  const container = new Instance("Frame");
  container.Name = "GlobalSettings";
  container.Size = new UDim2(1, -20, 0, GUI_CONSTANTS.ENHANCED.GLOBAL_SETTINGS_HEIGHT);
  container.Position = new UDim2(0, 10, 0, 40);
  container.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
  container.BorderSizePixel = 0;
  container.Parent = parent;

  const containerCorner = new Instance("UICorner");
  containerCorner.CornerRadius = new UDim(0, 4);
  containerCorner.Parent = container;

  // Title
  const title = new Instance("TextLabel");
  title.Size = new UDim2(1, -10, 0, 25);
  title.Position = new UDim2(0, 5, 0, 5);
  title.BackgroundTransparency = 1;
  title.Font = GUI_CONSTANTS.TYPOGRAPHY.TITLE_FONT;
  title.Text = "Global Settings";
  title.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  title.TextScaled = true;
  title.Parent = container;

  // Add spacing controls
  createSpacingControls({
    parent: container,
    spacing,
    onSpacingChange
  });

  return container;
}