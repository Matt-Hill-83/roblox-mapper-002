/**
 * Component Factory for Configuration GUI
 * 
 * Provides a centralized factory for creating GUI components
 * with consistent styling and behavior.
 */

import { GUI_CONSTANTS } from "./constants";
import { createDropdown } from "./components/dropdown";
import { createFrame } from "./components/frame";
import { createTitle } from "./components/title";

export interface ButtonOptions {
  name: string;
  text: string;
  position: UDim2;
  size?: UDim2;
  parent: GuiObject;
  onClick?: () => void;
  backgroundColor?: Color3;
}

export interface TextInputOptions {
  name: string;
  placeholderText?: string;
  text?: string;
  position: UDim2;
  size?: UDim2;
  parent: GuiObject;
  onFocusLost?: (enterPressed: boolean, inputObject: InputObject) => void;
}

export interface LabelOptions {
  name: string;
  text: string;
  position: UDim2;
  size?: UDim2;
  parent: GuiObject;
  textColor?: Color3;
  font?: Enum.Font;
  textScaled?: boolean;
}

export interface FrameOptions {
  name: string;
  position?: UDim2;
  size?: UDim2;
  parent: GuiObject;
  backgroundColor?: Color3;
  borderSizePixel?: number;
}

export interface DropdownOptions {
  name: string;
  items: string[];
  defaultValue: string;
  position: UDim2;
  size?: UDim2;
  parent: Frame;
  onChange: (value: string) => void;
}

export interface TitleOptions {
  text: string;
  parent: Frame;
  position?: UDim2;
  size?: UDim2;
}

export class ComponentFactory {
  /**
   * Creates a styled button
   */
  public static createButton(options: ButtonOptions): TextButton {
    const button = new Instance("TextButton");
    button.Name = options.name;
    button.Size = options.size || new UDim2(0, GUI_CONSTANTS.BUTTON.WIDTH, 0, GUI_CONSTANTS.BUTTON.HEIGHT);
    button.Position = options.position;
    button.BackgroundColor3 = options.backgroundColor || GUI_CONSTANTS.COLORS.BUTTON.DEFAULT;
    button.BorderSizePixel = 0;
    button.Font = GUI_CONSTANTS.TYPOGRAPHY.BUTTON_FONT;
    button.Text = options.text;
    button.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    button.TextScaled = true;
    button.Parent = options.parent;

    // Add corner radius
    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 4);
    corner.Parent = button;

    // Add hover effect
    button.MouseEnter.Connect(() => {
      button.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.HOVER;
    });

    button.MouseLeave.Connect(() => {
      button.BackgroundColor3 = options.backgroundColor || GUI_CONSTANTS.COLORS.BUTTON.DEFAULT;
    });

    // Add click feedback
    button.MouseButton1Down.Connect(() => {
      button.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.ACTIVE;
    });

    button.MouseButton1Up.Connect(() => {
      button.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.HOVER;
    });

    // Connect click handler
    if (options.onClick) {
      button.MouseButton1Click.Connect(options.onClick);
    }

    return button;
  }

  /**
   * Creates a styled text input
   */
  public static createTextInput(options: TextInputOptions): TextBox {
    const input = new Instance("TextBox");
    input.Name = options.name;
    input.Size = options.size || new UDim2(0.4, 0, 0, GUI_CONSTANTS.INPUT.HEIGHT);
    input.Position = options.position;
    input.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
    input.BorderSizePixel = 0;
    input.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
    input.Text = options.text || "";
    input.PlaceholderText = options.placeholderText || "";
    input.PlaceholderColor3 = new Color3(0.7, 0.7, 0.7);
    input.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    input.TextScaled = true;
    input.ClearTextOnFocus = false;
    input.Parent = options.parent;

    // Add corner radius
    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 4);
    corner.Parent = input;

    // Connect focus lost handler
    if (options.onFocusLost) {
      input.FocusLost.Connect(options.onFocusLost);
    }

    return input;
  }

  /**
   * Creates a styled label
   */
  public static createLabel(options: LabelOptions): TextLabel {
    const label = new Instance("TextLabel");
    label.Name = options.name;
    label.Size = options.size || new UDim2(0.5, 0, 0, GUI_CONSTANTS.INPUT.HEIGHT);
    label.Position = options.position;
    label.BackgroundTransparency = 1;
    label.Font = options.font || GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
    label.Text = options.text;
    label.TextColor3 = options.textColor || GUI_CONSTANTS.COLORS.TEXT;
    label.TextScaled = options.textScaled !== false;
    label.TextXAlignment = Enum.TextXAlignment.Left;
    label.Parent = options.parent;

    return label;
  }

  /**
   * Creates a styled frame
   */
  public static createFrame(options: FrameOptions): Frame {
    const frame = new Instance("Frame");
    frame.Name = options.name;
    frame.Size = options.size || new UDim2(1, 0, 1, 0);
    frame.Position = options.position || new UDim2(0, 0, 0, 0);
    frame.BackgroundColor3 = options.backgroundColor || GUI_CONSTANTS.COLORS.BACKGROUND;
    frame.BorderSizePixel = options.borderSizePixel !== undefined ? options.borderSizePixel : 0;
    frame.Parent = options.parent;

    return frame;
  }

  /**
   * Creates a checkbox (using a TextButton)
   */
  public static createCheckbox(options: ButtonOptions & { checked?: boolean }): TextButton {
    const checkbox = this.createButton({
      ...options,
      size: new UDim2(0, 20, 0, 20),
      text: options.checked ? "✓" : "",
      backgroundColor: new Color3(0.3, 0.3, 0.3)
    });

    let checked = options.checked || false;
    
    checkbox.MouseButton1Click.Connect(() => {
      checked = !checked;
      checkbox.Text = checked ? "✓" : "";
      if (options.onClick) {
        options.onClick();
      }
    });

    return checkbox;
  }

  /**
   * Creates a full dropdown with item selection
   */
  public static createDropdown(options: DropdownOptions): TextButton {
    return createDropdown({
      parent: options.parent,
      position: options.position,
      size: options.size || new UDim2(0, 100, 0, GUI_CONSTANTS.INPUT.HEIGHT),
      items: options.items,
      defaultValue: options.defaultValue,
      onChange: options.onChange
    });
  }
  
  /**
   * Creates a styled frame using the modular component
   */
  public static createStyledFrame(options: FrameOptions): Frame {
    return createFrame({
      name: options.name,
      parent: options.parent,
      position: options.position,
      size: options.size,
      backgroundColor: options.backgroundColor,
      borderSizePixel: options.borderSizePixel
    });
  }
  
  /**
   * Creates a title component
   */
  public static createTitle(options: TitleOptions): TextLabel {
    return createTitle(options);
  }

  /**
   * Creates a numeric input with validation
   */
  public static createNumericInput(options: TextInputOptions & { min?: number; max?: number }): TextBox {
    const input = this.createTextInput(options);
    
    input.FocusLost.Connect((enterPressed) => {
      const value = tonumber(input.Text);
      if (value === undefined) {
        input.Text = "0";
      } else if (options.min !== undefined && value < options.min) {
        input.Text = tostring(options.min);
      } else if (options.max !== undefined && value > options.max) {
        input.Text = tostring(options.max);
      }
      
      if (options.onFocusLost) {
        options.onFocusLost(enterPressed, {} as InputObject);
      }
    });

    return input;
  }

  /**
   * Creates a section divider
   */
  public static createDivider(parent: GuiObject, yPosition: number): Frame {
    const divider = new Instance("Frame");
    divider.Name = "Divider";
    divider.Size = new UDim2(0.9, 0, 0, 1);
    divider.Position = new UDim2(0.05, 0, 0, yPosition);
    divider.BackgroundColor3 = new Color3(0.4, 0.4, 0.4);
    divider.BorderSizePixel = 0;
    divider.Parent = parent;

    return divider;
  }

  /**
   * Creates a scrolling frame
   */
  public static createScrollingFrame(options: FrameOptions & { canvasSize?: UDim2 }): ScrollingFrame {
    const scrollFrame = new Instance("ScrollingFrame");
    scrollFrame.Name = options.name;
    scrollFrame.Size = options.size || new UDim2(1, 0, 1, 0);
    scrollFrame.Position = options.position || new UDim2(0, 0, 0, 0);
    scrollFrame.BackgroundColor3 = options.backgroundColor || GUI_CONSTANTS.COLORS.BACKGROUND;
    scrollFrame.BorderSizePixel = options.borderSizePixel !== undefined ? options.borderSizePixel : 0;
    scrollFrame.ScrollBarThickness = 8;
    scrollFrame.ScrollBarImageColor3 = new Color3(0.5, 0.5, 0.5);
    scrollFrame.CanvasSize = options.canvasSize || new UDim2(0, 0, 0, 0);
    scrollFrame.Parent = options.parent;

    return scrollFrame;
  }
}