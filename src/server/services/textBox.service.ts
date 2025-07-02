import {
  createTextBox,
  createTextBoxWithCustomStyling,
} from "shared/modules/TextBoxMaker";

interface TextBoxServiceConfig {
  part: Part;
  face: Enum.NormalId;
  text: string;
}

interface StyledTextBoxServiceConfig extends TextBoxServiceConfig {
  backgroundColor?: Color3;
  textColor?: Color3;
  font?: Enum.Font;
  textScaled?: boolean;
}

export class TextBoxService {
  private textBoxes: Map<string, TextBox> = new Map();

  /**
   * Creates a basic TextBox on the specified face of a part
   */
  public createTextBox(config: TextBoxServiceConfig): TextBox {
    const textBox = createTextBox(config);

    // Store reference with a unique key
    const key = `${config.part.Name}_${config.face.Name}_${tick()}`;
    this.textBoxes.set(key, textBox);

    return textBox;
  }

  /**
   * Creates a TextBox with custom styling on the specified face of a part
   */
  public createStyledTextBox(config: StyledTextBoxServiceConfig): TextBox {
    const textBox = createTextBoxWithCustomStyling(config);

    // Store reference with a unique key
    const key = `${config.part.Name}_${config.face.Name}_${tick()}`;
    this.textBoxes.set(key, textBox);

    return textBox;
  }

  /**
   * Updates the text of an existing TextBox
   */
  public updateTextBoxText(textBox: TextBox, newText: string): void {
    textBox.Text = newText;
    print(`✅ Updated TextBox text to: "${newText}"`);
  }

  /**
   * Removes a TextBox and its SurfaceGui from the part
   */
  public removeTextBox(textBox: TextBox): void {
    const surfaceGui = textBox.Parent as SurfaceGui;
    if (surfaceGui && surfaceGui.IsA("SurfaceGui")) {
      surfaceGui.Destroy();
      print(`✅ Removed TextBox and SurfaceGui`);
    }

    // Remove from our tracking map
    this.textBoxes.forEach((storedTextBox, key) => {
      if (storedTextBox === textBox) {
        this.textBoxes.delete(key);
      }
    });
  }

  /**
   * Gets all TextBoxes created by this service
   */
  public getAllTextBoxes(): TextBox[] {
    const textBoxes: TextBox[] = [];
    this.textBoxes.forEach((textBox) => {
      textBoxes.push(textBox);
    });
    return textBoxes;
  }

  /**
   * Clears all TextBoxes created by this service
   */
  public clearAllTextBoxes(): void {
    this.textBoxes.forEach((textBox) => {
      this.removeTextBox(textBox);
    });
    this.textBoxes.clear();
    print(`✅ Cleared all TextBoxes`);
  }

  /**
   * Creates multiple TextBoxes on different faces of the same part
   */
  public createMultipleFaceTextBoxes(
    part: Part,
    faceTextMap: Map<Enum.NormalId, string>
  ): TextBox[] {
    const textBoxes: TextBox[] = [];

    faceTextMap.forEach((text, face) => {
      const textBox = this.createTextBox({ part, face, text });
      textBoxes.push(textBox);
    });

    print(`✅ Created ${textBoxes.size()} TextBoxes on part ${part.Name}`);
    return textBoxes;
  }
}
