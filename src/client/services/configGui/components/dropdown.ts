import { GUI_CONSTANTS } from "../constants";

interface DropdownProps {
  parent: Frame;
  position: UDim2;
  size: UDim2;
  items: string[];
  defaultValue: string;
  onChange: (value: string) => void;
}

export function createDropdown({
  parent,
  position,
  size,
  items,
  defaultValue,
  onChange
}: DropdownProps): TextButton {
  // Create dropdown button
  const dropdown = new Instance("TextButton");
  dropdown.Name = "Dropdown";
  dropdown.Size = size;
  dropdown.Position = position;
  dropdown.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.DEFAULT;
  dropdown.BorderSizePixel = 0;
  dropdown.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
  dropdown.Text = defaultValue;
  dropdown.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  dropdown.TextScaled = true;
  dropdown.Parent = parent;

  // Add corner radius
  const corner = new Instance("UICorner");
  corner.CornerRadius = new UDim(0, 4);
  corner.Parent = dropdown;

  // Create dropdown list (initially hidden)
  const listFrame = new Instance("Frame");
  listFrame.Name = "DropdownList";
  listFrame.Size = new UDim2(1, 0, 0, math.min(items.size() * 25, 200));
  listFrame.Position = new UDim2(0, 0, 1, 2);
  listFrame.BackgroundColor3 = GUI_CONSTANTS.COLORS.BACKGROUND;
  listFrame.BorderSizePixel = 0;
  listFrame.Visible = false;
  listFrame.ZIndex = 10;
  listFrame.Parent = dropdown;

  const listCorner = new Instance("UICorner");
  listCorner.CornerRadius = new UDim(0, 4);
  listCorner.Parent = listFrame;

  // Create scrolling frame
  const scrollFrame = new Instance("ScrollingFrame");
  scrollFrame.Size = new UDim2(1, -4, 1, -4);
  scrollFrame.Position = new UDim2(0, 2, 0, 2);
  scrollFrame.BackgroundTransparency = 1;
  scrollFrame.BorderSizePixel = 0;
  scrollFrame.ScrollBarThickness = 4;
  scrollFrame.CanvasSize = new UDim2(0, 0, 0, items.size() * 25);
  scrollFrame.Parent = listFrame;

  // Create list layout
  const listLayout = new Instance("UIListLayout");
  listLayout.SortOrder = Enum.SortOrder.LayoutOrder;
  listLayout.Parent = scrollFrame;

  // Create items
  items.forEach((item, index) => {
    const itemButton = new Instance("TextButton");
    itemButton.Name = `Item_${index}`;
    itemButton.Size = new UDim2(1, 0, 0, 25);
    itemButton.BackgroundColor3 = GUI_CONSTANTS.COLORS.BACKGROUND;
    itemButton.BorderSizePixel = 0;
    itemButton.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
    itemButton.Text = item;
    itemButton.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    itemButton.TextScaled = true;
    itemButton.Parent = scrollFrame;

    // Hover effect
    itemButton.MouseEnter.Connect(() => {
      itemButton.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.HOVER;
    });

    itemButton.MouseLeave.Connect(() => {
      itemButton.BackgroundColor3 = GUI_CONSTANTS.COLORS.BACKGROUND;
    });

    // Click handler
    itemButton.MouseButton1Click.Connect(() => {
      dropdown.Text = item;
      listFrame.Visible = false;
      onChange(item);
    });
  });

  // Toggle dropdown on click
  let isOpen = false;
  dropdown.MouseButton1Click.Connect(() => {
    isOpen = !isOpen;
    listFrame.Visible = isOpen;
  });

  // Close dropdown when clicking elsewhere
  const userInputService = game.GetService("UserInputService");
  userInputService.InputBegan.Connect((input) => {
    if (input.UserInputType === Enum.UserInputType.MouseButton1 && isOpen) {
      wait(0.1); // Small delay to prevent immediate closing
      isOpen = false;
      listFrame.Visible = false;
    }
  });

  return dropdown;
}