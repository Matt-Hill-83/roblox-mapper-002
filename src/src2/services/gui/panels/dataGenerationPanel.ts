export class DataGenerationPanel {
  private frame: Frame;
  public recordsInput: TextBox;
  public uniqueValuesInput: TextBox;

  constructor(parent: Frame) {
    this.frame = new Instance("Frame");
    this.frame.Parent = parent;
    this.frame.Size = UDim2.fromScale(1, 1);
    this.frame.BackgroundColor3 = new Color3(0.85, 0.91, 0.98);

    this.recordsInput = this.createInput(new UDim2(0, 350, 0, 125), "50");
    this.uniqueValuesInput = this.createInput(new UDim2(0, 350, 0, 165), "10");

    this.createLabels();
    this.createPreviewTable();
    this.createGenerateButton();
  }

  private createInput(position: UDim2, defaultText: string): TextBox {
    const input = new Instance("TextBox");
    input.Parent = this.frame;
    input.Position = position;
    input.Size = new UDim2(0, 80, 0, 25);
    input.Text = defaultText;
    input.BackgroundColor3 = new Color3(1, 1, 1);
    return input;
  }

  private createLabels(): void {
    // Placeholder for label creation
  }

  private createPreviewTable(): void {
    // Placeholder for preview table
  }

  private createGenerateButton(): void {
    const button = new Instance("TextButton");
    button.Parent = this.frame;
    button.Position = new UDim2(0, 380, 0, 350);
    button.Size = new UDim2(0, 280, 0, 40);
    button.Text = "Generate Data";
    button.BackgroundColor3 = new Color3(0.3, 0.69, 0.31);
  }

  getFrame(): Frame {
    return this.frame;
  }
}