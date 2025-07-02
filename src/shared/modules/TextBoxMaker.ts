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
  surfaceGui.Parent = part;

  // Create the TextBox
  const textBox = new Instance("TextBox");
  textBox.Name = "TextBox";
  textBox.Text = text;
  textBox.Size = new UDim2(1, 0, 1, 0); // Fill the entire surface
  textBox.Position = new UDim2(0, 0, 0, 0);
  textBox.BackgroundColor3 = new Color3(1, 1, 1); // White background
  textBox.TextColor3 = new Color3(0, 0, 0); // Black text
  textBox.TextScaled = true; // Scale text to fit
  textBox.Font = Enum.Font.SourceSans;
  textBox.BorderSizePixel = 1;
  textBox.BorderColor3 = new Color3(0, 0, 0); // Black border
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
  backgroundColor = new Color3(1, 1, 1),
  textColor = new Color3(0, 0, 0),
  font = Enum.Font.SourceSans,
  textScaled = true,
}: TextBoxConfig & {
  backgroundColor?: Color3;
  textColor?: Color3;
  font?: Enum.Font;
  textScaled?: boolean;
}): TextBox {
  // Create the SurfaceGui
  const surfaceGui = new Instance("SurfaceGui");
  surfaceGui.Name = `SurfaceGui_${face.Name}`;
  surfaceGui.Face = face;
  surfaceGui.Parent = part;

  // Create the TextBox with custom styling
  const textBox = new Instance("TextBox");
  textBox.Name = "TextBox";
  textBox.Text = text;
  textBox.Size = new UDim2(1, 0, 1, 0); // Fill the entire surface
  textBox.Position = new UDim2(0, 0, 0, 0);
  textBox.BackgroundColor3 = backgroundColor;
  textBox.TextColor3 = textColor;
  textBox.TextScaled = textScaled;
  textBox.Font = font;
  textBox.BorderSizePixel = 1;
  textBox.BorderColor3 = new Color3(0, 0, 0); // Black border
  textBox.Parent = surfaceGui;

  print(
    `✅ Created styled TextBox with text "${text}" on ${face.Name} face of ${part.Name}`
  );

  return textBox;
}
