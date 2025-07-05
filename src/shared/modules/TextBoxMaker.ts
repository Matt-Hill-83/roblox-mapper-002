interface TextBoxConfig {
  part: Part;
  face: Enum.NormalId;
  text: string;
  parent?: Instance;
}

export function createTextBox({
  part,
  face,
  text,
  parent,
}: TextBoxConfig): TextBox {
  // Create the SurfaceGui
  const surfaceGui = new Instance("SurfaceGui");
  surfaceGui.Name = `SurfaceGui_${face.Name}`;
  surfaceGui.Face = face;
  surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
  surfaceGui.PixelsPerStud = 50;
  surfaceGui.Parent = part;

  // Get block color from part for background matching
  const blockColor = [part.Color.R, part.Color.G, part.Color.B];

  // Create the TextBox with barMaker styling
  const textBox = new Instance("TextBox");
  textBox.Name = "TextBox";
  textBox.Text = text;
  textBox.TextScaled = true; // Scale text to fit within bounds
  textBox.Font = Enum.Font.SourceSans;
  textBox.Size = new UDim2(1, 0, 1, 0);
  textBox.BackgroundColor3 = Color3.fromRGB(
    blockColor[0] * 255,
    blockColor[1] * 255,
    blockColor[2] * 255
  );
  textBox.TextColor3 = Color3.fromRGB(0, 0, 0);
  textBox.BorderSizePixel = 2; // Reduced from 10 to prevent overflow
  textBox.BorderMode = Enum.BorderMode.Inset; // Keep border inside the TextBox bounds
  textBox.TextWrapped = true; // Allow wrapping in addition to scaling
  textBox.Parent = surfaceGui;

  print(
    `✅ Created TextBox with text "${text}" on ${face.Name} face of ${part.Name}`
  );

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

  print(
    `✅ Created styled TextBox with text "${text}" on ${face.Name} face of ${part.Name}`
  );

  return textBox;
}
