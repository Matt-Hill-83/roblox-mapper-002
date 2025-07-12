interface TextLabelConfig {
  part: Part;
  face: Enum.NormalId;
  text: string;
  parent?: Instance;
  backgroundColor?: Color3;
  borderColor?: Color3;
  textColor?: Color3;
}

export function createTextLabel({
  part,
  face,
  text,
  parent,
  backgroundColor,
  borderColor,
  textColor,
}: TextLabelConfig): TextLabel {
  // Create the SurfaceGui
  const surfaceGui = new Instance("SurfaceGui");
  surfaceGui.Name = `SurfaceGui_${face.Name}`;
  surfaceGui.Face = face;
  surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
  surfaceGui.PixelsPerStud = 50;
  surfaceGui.Parent = part;

  // Use provided background color or default to part color
  const bgColor = backgroundColor || part.Color;

  // Create the TextLabel (not TextBox) with barMaker styling
  const textLabel = new Instance("TextLabel");
  textLabel.Name = "TextLabel";
  textLabel.Text = text;
  textLabel.TextScaled = true; // Scale text to fit within bounds
  textLabel.Font = Enum.Font.SourceSans;
  textLabel.Size = new UDim2(1, 0, 1, 0);
  textLabel.BackgroundColor3 = bgColor;
  textLabel.TextColor3 = textColor || new Color3(0, 0, 0);
  textLabel.BorderSizePixel = 10; // No border on hex labels
  textLabel.BorderColor3 = borderColor || new Color3(0, 0, 0);
  textLabel.BorderMode = Enum.BorderMode.Inset; // Keep border inside the TextLabel bounds
  textLabel.TextWrapped = true; // Allow wrapping in addition to scaling
  textLabel.Parent = surfaceGui;

  return textLabel;
}

export function createTextLabelWithCustomStyling({
  part,
  face,
  text,
  textSize = 24,
  backgroundColor,
  textColor = new Color3(0, 0, 0),
  font = Enum.Font.SourceSans,
  borderSizePixel = 2, // Reduced default from 10 to 2
  borderColor,
  textWrapped = true,
}: TextLabelConfig & {
  textSize?: number;
  backgroundColor?: Color3;
  textColor?: Color3;
  font?: Enum.Font;
  borderSizePixel?: number;
  borderColor?: Color3;
  textWrapped?: boolean;
}): TextLabel {
  // Create the SurfaceGui
  const surfaceGui = new Instance("SurfaceGui");
  surfaceGui.Name = `SurfaceGui_${face.Name}`;
  surfaceGui.Face = face;
  surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
  surfaceGui.PixelsPerStud = 50;
  surfaceGui.Parent = part;

  // Use part color as default background if not specified
  const defaultBackgroundColor =
    backgroundColor ||
    Color3.fromRGB(part.Color.R * 255, part.Color.G * 255, part.Color.B * 255);

  // Create the TextLabel with custom styling
  const textLabel = new Instance("TextLabel");
  textLabel.Name = "TextLabel";
  textLabel.Text = text;
  textLabel.TextSize = textSize;
  textLabel.Font = font;
  textLabel.Size = new UDim2(1, 0, 1, 0);
  textLabel.BackgroundColor3 = defaultBackgroundColor;
  textLabel.TextColor3 = textColor;
  textLabel.BorderSizePixel = borderSizePixel;
  if (borderColor) {
    textLabel.BorderColor3 = borderColor;
  }
  textLabel.BorderMode = Enum.BorderMode.Inset; // Keep border inside bounds
  textLabel.TextWrapped = textWrapped;
  textLabel.Parent = surfaceGui;

  return textLabel;
}
