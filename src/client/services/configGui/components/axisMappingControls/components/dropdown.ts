import { UserInputService } from "@rbxts/services";
import { UI_CONSTANTS } from "../constants";
import type { DropdownProps } from "../types";

/**
 * Creates a dropdown functionality for a button
 */
export function createDropdown({
  button,
  currentValue,
  onChange,
  parent,
  properties
}: DropdownProps): void {
  let isOpen = false;
  let optionsFrame: Frame | undefined;

  button.MouseButton1Click.Connect(() => {
    if (!isOpen) {
      optionsFrame = createOptionsFrame(button, parent, properties, (value) => {
        button.Text = value;
        onChange(value);
        closeDropdown();
      });
      isOpen = true;
    } else {
      closeDropdown();
    }
  });

  // Close when clicking elsewhere
  UserInputService.InputBegan.Connect((input) => {
    if (input.UserInputType === Enum.UserInputType.MouseButton1 && isOpen && optionsFrame) {
      wait(0.1);
      closeDropdown();
    }
  });

  function closeDropdown() {
    if (optionsFrame) {
      optionsFrame.Destroy();
      optionsFrame = undefined;
    }
    isOpen = false;
  }
}

/**
 * Creates the options frame for the dropdown
 */
function createOptionsFrame(
  button: TextButton,
  parent: Frame,
  properties: string[],
  onSelect: (value: string) => void
): Frame {
  const optionsFrame = new Instance("Frame");
  optionsFrame.Name = button.Name + "Options";
  
  // Position dropdown below the button
  const buttonPosition = button.Position;
  const buttonSize = button.Size;
  optionsFrame.Position = new UDim2(
    buttonPosition.X.Scale,
    buttonPosition.X.Offset,
    buttonPosition.Y.Scale,
    buttonPosition.Y.Offset + buttonSize.Y.Offset + UI_CONSTANTS.SPACING.DROPDOWN_OFFSET
  );
  
  const maxVisibleItems = UI_CONSTANTS.DROPDOWN.MAX_VISIBLE_ITEMS;
  const visibleHeight = math.min(properties.size() * UI_CONSTANTS.DROPDOWN.ITEM_HEIGHT, 
    maxVisibleItems * UI_CONSTANTS.DROPDOWN.ITEM_HEIGHT);
  
  optionsFrame.Size = new UDim2(0, button.Size.X.Offset, 0, visibleHeight);
  optionsFrame.BackgroundColor3 = UI_CONSTANTS.DROPDOWN.BACKGROUND_COLOR;
  optionsFrame.BorderSizePixel = 0;
  optionsFrame.ZIndex = 10;
  optionsFrame.Parent = parent;

  const optionsCorner = new Instance("UICorner");
  optionsCorner.CornerRadius = new UDim(0, UI_CONSTANTS.BUTTON.CORNER_RADIUS);
  optionsCorner.Parent = optionsFrame;

  // Create scrolling frame if needed
  const scrollFrame = createScrollFrame(optionsFrame, properties.size());

  // Create option buttons
  properties.forEach((property, index) => {
    createOptionButton(scrollFrame, property, index, onSelect);
  });

  return optionsFrame;
}

/**
 * Creates the scrolling frame for dropdown options
 */
function createScrollFrame(parent: Frame, itemCount: number): ScrollingFrame {
  const scrollFrame = new Instance("ScrollingFrame");
  scrollFrame.Size = new UDim2(1, 0, 1, 0);
  scrollFrame.Position = new UDim2(0, 0, 0, 0);
  scrollFrame.BackgroundTransparency = 1;
  scrollFrame.BorderSizePixel = 0;
  scrollFrame.ScrollBarThickness = UI_CONSTANTS.DROPDOWN.SCROLL_BAR_THICKNESS;
  scrollFrame.CanvasSize = new UDim2(0, 0, 0, itemCount * UI_CONSTANTS.DROPDOWN.ITEM_HEIGHT);
  scrollFrame.Parent = parent;
  
  return scrollFrame;
}

/**
 * Creates an option button in the dropdown
 */
function createOptionButton(
  parent: ScrollingFrame,
  property: string,
  index: number,
  onSelect: (value: string) => void
): TextButton {
  const optionButton = new Instance("TextButton");
  optionButton.Name = `Option_${property}`;
  optionButton.Text = property;
  optionButton.Position = new UDim2(0, 0, 0, index * UI_CONSTANTS.DROPDOWN.ITEM_HEIGHT);
  optionButton.Size = new UDim2(1, -4, 0, UI_CONSTANTS.DROPDOWN.ITEM_HEIGHT);
  optionButton.BackgroundTransparency = 1;
  optionButton.TextColor3 = UI_CONSTANTS.TEXT.BUTTON_COLOR;
  optionButton.Font = Enum.Font.SourceSans;
  optionButton.TextSize = UI_CONSTANTS.TEXT.LABEL_SIZE;
  optionButton.BorderSizePixel = 0;
  optionButton.ZIndex = 100;
  optionButton.Parent = parent;

  // Hover effect
  optionButton.MouseEnter.Connect(() => {
    optionButton.BackgroundTransparency = 0;
    optionButton.BackgroundColor3 = UI_CONSTANTS.BUTTON.HOVER_COLOR;
  });

  optionButton.MouseLeave.Connect(() => {
    optionButton.BackgroundTransparency = 1;
  });

  // Selection
  optionButton.MouseButton1Click.Connect(() => {
    onSelect(property);
  });

  return optionButton;
}