interface TextBoxConfig {
  part: Part;
  face: Enum.NormalId;
  text: string;
  parent?: Instance;
  backgroundColor?: Color3;
  borderColor?: Color3;
  textColor?: Color3;
}

export function createTextBox({
  part,
  face,
  text,
  parent,
  backgroundColor,
  borderColor,
  textColor
}: TextBoxConfig): TextBox {
  // Create the SurfaceGui
  const surfaceGui = new Instance("SurfaceGui");
  surfaceGui.Name = `SurfaceGui_${face.Name}`;
  surfaceGui.Face = face;
  surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
  surfaceGui.PixelsPerStud = 50;
  surfaceGui.Parent = part;

  // Use provided background color or default to part color
  const bgColor = backgroundColor || part.Color;

  // Create the TextBox with barMaker styling
  const textBox = new Instance("TextBox");
  textBox.Name = "TextBox";
  textBox.Text = text;
  textBox.TextScaled = true; // Scale text to fit within bounds
  textBox.Font = Enum.Font.SourceSans;
  textBox.Size = new UDim2(1, 0, 1, 0);
  textBox.BackgroundColor3 = bgColor;
  textBox.TextColor3 = textColor || new Color3(0, 0, 0);
  textBox.BorderSizePixel = 2; // Reduced from 10 to prevent overflow
  textBox.BorderColor3 = borderColor || new Color3(0, 0, 0);
  textBox.BorderMode = Enum.BorderMode.Inset; // Keep border inside the TextBox bounds
  textBox.TextWrapped = true; // Allow wrapping in addition to scaling
  textBox.Parent = surfaceGui;

  return textBox;
}

export function createTextBoxWithCustomStyling({
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
}: TextBoxConfig & {
  textSize?: number;
  backgroundColor?: Color3;
  textColor?: Color3;
  font?: Enum.Font;
  borderSizePixel?: number;
  borderColor?: Color3;
  textWrapped?: boolean;
}): TextBox {
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

  // Create the TextBox with custom styling
  const textBox = new Instance("TextBox");
  textBox.Name = "TextBox";
  textBox.Text = text;
  textBox.TextSize = textSize;
  textBox.Font = font;
  textBox.Size = new UDim2(1, 0, 1, 0);
  textBox.BackgroundColor3 = defaultBackgroundColor;
  textBox.TextColor3 = textColor;
  textBox.BorderSizePixel = borderSizePixel;
  if (borderColor) {
    textBox.BorderColor3 = borderColor;
  }
  textBox.BorderMode = Enum.BorderMode.Inset; // Keep border inside bounds
  textBox.TextWrapped = textWrapped;
  textBox.Parent = surfaceGui;

  return textBox;
}
