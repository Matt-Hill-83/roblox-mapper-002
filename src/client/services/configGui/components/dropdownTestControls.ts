/**
 * Dropdown Test Controls Component
 * Provides a test dropdown feature in the Advanced Controls GUI
 */

import { ComponentFactory } from "../componentFactory";

export interface DropdownTestControlsOptions {
  parent: GuiObject;
  onTestOptionChange: (value: string) => void;
}

/**
 * Creates dropdown test controls
 */
export function createDropdownTestControls(options: DropdownTestControlsOptions): Frame {
  const { parent, onTestOptionChange } = options;

  // Create container frame
  const frame = new Instance("Frame");
  frame.Name = "DropdownTestControls";
  frame.BackgroundTransparency = 1;
  frame.Parent = parent;

  // Create title label
  ComponentFactory.createLabel({
    name: "DropdownTestTitle",
    parent: frame,
    text: "Dropdown Test Feature",
    position: new UDim2(0, 0, 0, 0),
    size: new UDim2(1, 0, 0, 20),
    font: Enum.Font.SourceSansBold
  });

  // Test options
  const testOptions = [
    "Option A",
    "Option B", 
    "Option C",
    "Test Mode 1",
    "Test Mode 2",
    "Debug View",
    "Performance Test"
  ];

  // Create dropdown for test selection
  const dropdownFrame = new Instance("Frame");
  dropdownFrame.Name = "TestDropdownContainer";
  dropdownFrame.BackgroundTransparency = 1;
  dropdownFrame.Position = new UDim2(0, 0, 0, 25);
  dropdownFrame.Size = new UDim2(1, 0, 0, 30);
  dropdownFrame.Parent = frame;

  // Create the dropdown button
  const dropdownButton = new Instance("TextButton");
  dropdownButton.Name = "TestDropdownButton";
  dropdownButton.Text = "Select Test Option";
  dropdownButton.Size = new UDim2(1, -10, 1, 0);
  dropdownButton.Position = new UDim2(0, 5, 0, 0);
  dropdownButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
  dropdownButton.TextColor3 = new Color3(1, 1, 1);
  dropdownButton.Font = Enum.Font.SourceSans;
  dropdownButton.TextSize = 14;
  dropdownButton.Parent = dropdownFrame;

  // Create dropdown list (initially hidden)
  const dropdownList = new Instance("Frame");
  dropdownList.Name = "TestDropdownList";
  dropdownList.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
  dropdownList.BorderSizePixel = 1;
  dropdownList.BorderColor3 = new Color3(0.4, 0.4, 0.4);
  dropdownList.Position = new UDim2(0, 5, 1, 0);
  dropdownList.Size = new UDim2(1, -10, 0, testOptions.size() * 25);
  dropdownList.Visible = false;
  dropdownList.ZIndex = 10;
  dropdownList.Parent = dropdownFrame;

  // Create UIListLayout for dropdown items
  const listLayout = new Instance("UIListLayout");
  listLayout.SortOrder = Enum.SortOrder.LayoutOrder;
  listLayout.Parent = dropdownList;

  // Create dropdown items
  testOptions.forEach((option, index) => {
    const optionButton = new Instance("TextButton");
    optionButton.Name = `TestOption_${option}`;
    optionButton.Text = option;
    optionButton.Size = new UDim2(1, 0, 0, 25);
    optionButton.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
    optionButton.TextColor3 = new Color3(1, 1, 1);
    optionButton.Font = Enum.Font.SourceSans;
    optionButton.TextSize = 14;
    optionButton.BorderSizePixel = 0;
    optionButton.LayoutOrder = index;
    optionButton.Parent = dropdownList;

    // Hover effect
    optionButton.MouseEnter.Connect(() => {
      optionButton.BackgroundColor3 = new Color3(0.35, 0.35, 0.35);
    });

    optionButton.MouseLeave.Connect(() => {
      optionButton.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
    });

    // Selection handler
    optionButton.MouseButton1Click.Connect(() => {
      dropdownButton.Text = option;
      dropdownList.Visible = false;
      onTestOptionChange(option);
      print(`[DropdownTest] Selected option: ${option}`);
    });
  });

  // Toggle dropdown on button click
  let isOpen = false;
  dropdownButton.MouseButton1Click.Connect(() => {
    isOpen = !isOpen;
    dropdownList.Visible = isOpen;
  });

  // Close dropdown when clicking elsewhere
  const userInputService = game.GetService("UserInputService");
  userInputService.InputBegan.Connect((input) => {
    if (input.UserInputType === Enum.UserInputType.MouseButton1 && isOpen) {
      wait(0.1); // Small delay to allow button clicks to register
      isOpen = false;
      dropdownList.Visible = false;
    }
  });

  // Add description label
  ComponentFactory.createLabel({
    name: "DropdownTestDescription",
    parent: frame,
    text: "Test various dropdown configurations",
    position: new UDim2(0, 5, 0, 60),
    size: new UDim2(1, -10, 0, 20),
    textColor: new Color3(0.7, 0.7, 0.7)
  });

  return frame;
}