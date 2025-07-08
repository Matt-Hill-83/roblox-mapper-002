/**
 * Collapsible frame component for the configuration GUI
 * Allows the main GUI to be minimized/expanded
 */

import { GUI_CONSTANTS } from "../constants";
import { createUICorner } from "../utilities";
import { ComponentFactory } from "../componentFactory";
import { TweenService } from "@rbxts/services";

export interface CollapsibleFrameOptions {
  parent: ScreenGui;
  size?: UDim2;
  collapsedSize?: UDim2;
  title?: string;
}

export interface CollapsibleFrameResult {
  frame: Frame;
  contentFrame: Frame;
  toggleButton: TextButton;
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

/**
 * Creates a collapsible main frame with header and toggle button
 */
export function createCollapsibleFrame(options: CollapsibleFrameOptions): CollapsibleFrameResult {
  const {
    parent,
    size = new UDim2(0, GUI_CONSTANTS.FRAME.ENHANCED_WIDTH, GUI_CONSTANTS.FRAME.ENHANCED_HEIGHT_SCALE, 0),
    collapsedSize = new UDim2(0, GUI_CONSTANTS.FRAME.ENHANCED_WIDTH, 0, 40),
    title = "Configuration GUI"
  } = options;

  let isCollapsed = true; // Start collapsed
  
  // Create main container frame
  const mainFrame = new Instance("Frame");
  mainFrame.Name = GUI_CONSTANTS.NAMES.MAIN_FRAME;
  mainFrame.Size = collapsedSize; // Start with collapsed size
  mainFrame.Position = GUI_CONSTANTS.FRAME.POSITION;
  mainFrame.BackgroundColor3 = GUI_CONSTANTS.COLORS.BACKGROUND;
  mainFrame.BorderSizePixel = 0;
  mainFrame.ClipsDescendants = true;
  mainFrame.Parent = parent;
  
  // Add corner rounding
  createUICorner(mainFrame);
  
  // Create header frame
  const headerFrame = new Instance("Frame");
  headerFrame.Name = "HeaderFrame";
  headerFrame.Size = new UDim2(1, 0, 0, 40);
  headerFrame.Position = new UDim2(0, 0, 0, 0);
  headerFrame.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
  headerFrame.BorderSizePixel = 0;
  headerFrame.Parent = mainFrame;
  
  // Add corner rounding to header (only top corners)
  const headerCorner = createUICorner(headerFrame);
  headerCorner.CornerRadius = new UDim(0, 8);
  
  // Create title label
  const titleLabel = new Instance("TextLabel");
  titleLabel.Name = "TitleLabel";
  titleLabel.Size = new UDim2(1, -50, 1, 0);
  titleLabel.Position = new UDim2(0, 10, 0, 0);
  titleLabel.BackgroundTransparency = 1;
  titleLabel.Font = GUI_CONSTANTS.TYPOGRAPHY.TITLE_FONT;
  titleLabel.Text = title;
  titleLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  titleLabel.TextScaled = true;
  titleLabel.TextXAlignment = Enum.TextXAlignment.Left;
  titleLabel.Parent = headerFrame;
  
  // Create toggle button
  const toggleButton = ComponentFactory.createButton({
    name: "ToggleButton",
    text: "+", // Plus sign for collapsed state
    position: new UDim2(1, -40, 0, 5),
    size: new UDim2(0, 30, 0, 30),
    parent: headerFrame,
    backgroundColor: new Color3(0.25, 0.25, 0.25)
  });
  
  // Style the toggle button
  toggleButton.Font = Enum.Font.SourceSansBold;
  toggleButton.TextSize = 24;
  
  // Create content frame (holds all GUI content)
  const contentFrame = new Instance("Frame");
  contentFrame.Name = "ContentFrame";
  contentFrame.Size = new UDim2(1, 0, 1, -40);
  contentFrame.Position = new UDim2(0, 0, 0, 40);
  contentFrame.BackgroundTransparency = 1;
  contentFrame.Visible = false; // Start hidden since we're collapsed
  contentFrame.Parent = mainFrame;
  
  // Create tween info for smooth animation
  const tweenInfo = new TweenInfo(
    0.3, // Duration
    Enum.EasingStyle.Quad,
    Enum.EasingDirection.InOut
  );
  
  // Toggle function
  const toggle = () => {
    isCollapsed = !isCollapsed;
    
    // Update button text
    toggleButton.Text = isCollapsed ? "+" : "−";
    
    // Animate frame size
    const targetSize = isCollapsed ? collapsedSize : size;
    const tween = TweenService.Create(mainFrame, tweenInfo, {
      Size: targetSize
    });
    
    // Hide/show content during animation
    if (isCollapsed) {
      contentFrame.Visible = false;
    } else {
      // Delay showing content until animation is partially complete
      task.wait(0.1);
      contentFrame.Visible = true;
    }
    
    tween.Play();
  };
  
  // Set collapsed state without animation
  const setCollapsed = (collapsed: boolean) => {
    isCollapsed = collapsed;
    toggleButton.Text = isCollapsed ? "+" : "−";
    mainFrame.Size = isCollapsed ? collapsedSize : size;
    contentFrame.Visible = !isCollapsed;
  };
  
  // Connect toggle button
  toggleButton.MouseButton1Click.Connect(toggle);
  
  // Allow dragging by header
  let dragging = false;
  let dragStart: Vector3 | undefined;
  let startPos: UDim2 | undefined;
  
  headerFrame.InputBegan.Connect((input) => {
    if (input.UserInputType === Enum.UserInputType.MouseButton1) {
      dragging = true;
      dragStart = input.Position;
      startPos = mainFrame.Position;
    }
  });
  
  headerFrame.InputChanged.Connect((input) => {
    if (dragging && input.UserInputType === Enum.UserInputType.MouseMovement && dragStart && startPos) {
      const delta = input.Position.sub(dragStart);
      mainFrame.Position = new UDim2(
        startPos.X.Scale,
        startPos.X.Offset + delta.X,
        startPos.Y.Scale,
        startPos.Y.Offset + delta.Y
      );
    }
  });
  
  headerFrame.InputEnded.Connect((input) => {
    if (input.UserInputType === Enum.UserInputType.MouseButton1) {
      dragging = false;
    }
  });
  
  return {
    frame: mainFrame,
    contentFrame,
    toggleButton,
    isCollapsed,
    toggle,
    setCollapsed
  };
}