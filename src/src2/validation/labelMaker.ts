export function labelMaker(text: string, parent: Instance): TextLabel {
  const label = new Instance("TextLabel");
  label.Text = text;
  label.Parent = parent;
  label.Size = UDim2.fromScale(1, 0.2);
  label.BackgroundTransparency = 1;
  label.TextScaled = true;
  return label;
}