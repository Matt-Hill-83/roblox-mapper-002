import { Players, ReplicatedStorage, UserInputService } from "@rbxts/services";

export interface AxisMapping {
  xAxis: string;
  yAxis: string;
  zAxis: string;
}

/**
 * Client-side GUI service for GraphBlaster axis selection
 */
export class GraphBlasterGuiClientService {
  private gui?: ScreenGui;
  private frame?: Frame;
  private availableProperties: string[] = ["petType", "countryLivesIn", "country", "countryBornIn", "countryWorksIn"];
  private currentMapping: AxisMapping = {
    xAxis: "petType",
    yAxis: "countryLivesIn",
    zAxis: "country"
  };
  
  private remoteEvent?: RemoteEvent;

  constructor() {
    // Wait for remote event
    this.remoteEvent = ReplicatedStorage.WaitForChild("GraphBlasterRemoteEvent") as RemoteEvent;
  }

  /**
   * Create and show the axis mapping GUI
   */
  public createGui(): void {
    const player = Players.LocalPlayer;
    if (!player) {
      warn("LocalPlayer not available");
      return;
    }
    
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

    // Create ScreenGui
    this.gui = new Instance("ScreenGui");
    this.gui.Name = "GraphBlasterAxisGui";
    this.gui.ResetOnSpawn = false;
    this.gui.Parent = playerGui;

    // Create main frame
    this.frame = new Instance("Frame");
    this.frame.Name = "AxisMappingFrame";
    this.frame.Size = new UDim2(0, 300, 0, 250);
    this.frame.Position = new UDim2(1, -320, 0, 20);
    this.frame.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
    this.frame.BorderSizePixel = 0;
    this.frame.Parent = this.gui;

    // Add rounded corners
    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 8);
    corner.Parent = this.frame;

    // Create title
    const title = new Instance("TextLabel");
    title.Name = "Title";
    title.Text = "GraphBlaster Axis Mapping";
    title.Size = new UDim2(1, 0, 0, 40);
    title.Position = new UDim2(0, 0, 0, 0);
    title.BackgroundTransparency = 1;
    title.TextColor3 = new Color3(1, 1, 1);
    title.TextScaled = true;
    title.Font = Enum.Font.SourceSansBold;
    title.Parent = this.frame;

    // Create axis controls
    this.createAxisControl("X Axis", 60, "xAxis");
    this.createAxisControl("Y Axis", 110, "yAxis");
    this.createAxisControl("Z Axis", 160, "zAxis");

    // Create apply button
    const applyButton = new Instance("TextButton");
    applyButton.Name = "ApplyButton";
    applyButton.Text = "Apply";
    applyButton.Size = new UDim2(0.8, 0, 0, 30);
    applyButton.Position = new UDim2(0.1, 0, 0, 210);
    applyButton.BackgroundColor3 = new Color3(0.3, 0.6, 0.9);
    applyButton.TextColor3 = new Color3(1, 1, 1);
    applyButton.TextScaled = true;
    applyButton.Font = Enum.Font.SourceSansBold;
    applyButton.Parent = this.frame;

    const buttonCorner = new Instance("UICorner");
    buttonCorner.CornerRadius = new UDim(0, 4);
    buttonCorner.Parent = applyButton;

    // Connect apply button
    applyButton.MouseButton1Click.Connect(() => {
      this.applyMapping();
    });
  }

  /**
   * Create a single axis control (label + dropdown)
   */
  private createAxisControl(labelText: string, yPosition: number, axis: keyof AxisMapping): void {
    // Create label
    const label = new Instance("TextLabel");
    label.Name = `${axis}Label`;
    label.Text = labelText;
    label.Size = new UDim2(0.3, 0, 0, 30);
    label.Position = new UDim2(0.05, 0, 0, yPosition);
    label.BackgroundTransparency = 1;
    label.TextColor3 = new Color3(1, 1, 1);
    label.TextScaled = true;
    label.Font = Enum.Font.SourceSans;
    label.TextXAlignment = Enum.TextXAlignment.Left;
    label.Parent = this.frame!;

    // Create dropdown button
    const dropdown = new Instance("TextButton");
    dropdown.Name = `${axis}Dropdown`;
    dropdown.Text = this.currentMapping[axis];
    dropdown.Size = new UDim2(0.6, 0, 0, 30);
    dropdown.Position = new UDim2(0.35, 0, 0, yPosition);
    dropdown.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
    dropdown.TextColor3 = new Color3(1, 1, 1);
    dropdown.TextScaled = true;
    dropdown.Font = Enum.Font.SourceSans;
    dropdown.Parent = this.frame!;

    const dropdownCorner = new Instance("UICorner");
    dropdownCorner.CornerRadius = new UDim(0, 4);
    dropdownCorner.Parent = dropdown;

    // Create dropdown functionality
    this.createDropdown(dropdown, axis);
  }

  /**
   * Create dropdown functionality for a button
   */
  private createDropdown(button: TextButton, axis: keyof AxisMapping): void {
    let isOpen = false;
    let optionsFrame: Frame | undefined;
    let inputConnection: RBXScriptConnection | undefined;

    button.MouseButton1Click.Connect(() => {
      if (!isOpen) {
        // Close any other open dropdowns
        this.closeAllDropdowns();
        
        // Create options frame
        optionsFrame = this.createOptionsFrame(button, axis, (value) => {
          // Update the mapping
          this.currentMapping[axis] = value;
          button.Text = value;
          closeDropdown();
        });
        
        isOpen = true;

        // Setup click-away handler
        wait(0.1); // Small delay to prevent immediate closing
        inputConnection = UserInputService.InputBegan.Connect((input) => {
          if (input.UserInputType === Enum.UserInputType.MouseButton1 && isOpen) {
            wait(0.1);
            closeDropdown();
          }
        });
      } else {
        closeDropdown();
      }
    });

    const closeDropdown = () => {
      if (optionsFrame) {
        optionsFrame.Destroy();
        optionsFrame = undefined;
      }
      if (inputConnection) {
        inputConnection.Disconnect();
        inputConnection = undefined;
      }
      isOpen = false;
    };

    // Store cleanup function
    if (!this.dropdownCleanups) {
      this.dropdownCleanups = [];
    }
    this.dropdownCleanups.push(closeDropdown);
  }

  private dropdownCleanups: (() => void)[] = [];

  /**
   * Close all open dropdowns
   */
  private closeAllDropdowns(): void {
    this.dropdownCleanups.forEach(cleanup => cleanup());
  }

  /**
   * Create options frame for dropdown
   */
  private createOptionsFrame(
    button: TextButton,
    axis: keyof AxisMapping,
    onSelect: (value: string) => void
  ): Frame {
    const optionsFrame = new Instance("Frame");
    optionsFrame.Name = button.Name + "Options";
    
    // Position dropdown below the button
    const buttonPos = button.Position;
    const buttonSize = button.Size;
    optionsFrame.Position = new UDim2(
      buttonPos.X.Scale,
      buttonPos.X.Offset,
      buttonPos.Y.Scale,
      buttonPos.Y.Offset + buttonSize.Y.Offset + 5
    );
    
    const itemHeight = 30;
    const maxVisibleItems = 5;
    const visibleHeight = math.min(
      this.availableProperties.size() * itemHeight,
      maxVisibleItems * itemHeight
    );
    
    optionsFrame.Size = new UDim2(buttonSize.X.Scale, buttonSize.X.Offset, 0, visibleHeight);
    optionsFrame.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
    optionsFrame.BorderSizePixel = 0;
    optionsFrame.ZIndex = 10;
    optionsFrame.Parent = this.frame!;

    const optionsCorner = new Instance("UICorner");
    optionsCorner.CornerRadius = new UDim(0, 4);
    optionsCorner.Parent = optionsFrame;

    // Create scrolling frame
    const scrollFrame = new Instance("ScrollingFrame");
    scrollFrame.Size = new UDim2(1, 0, 1, 0);
    scrollFrame.Position = new UDim2(0, 0, 0, 0);
    scrollFrame.BackgroundTransparency = 1;
    scrollFrame.BorderSizePixel = 0;
    scrollFrame.ScrollBarThickness = 4;
    scrollFrame.CanvasSize = new UDim2(0, 0, 0, this.availableProperties.size() * itemHeight);
    scrollFrame.Parent = optionsFrame;

    // Create option buttons
    this.availableProperties.forEach((property, index) => {
      const optionButton = new Instance("TextButton");
      optionButton.Name = `Option_${property}`;
      optionButton.Text = property;
      optionButton.Position = new UDim2(0, 0, 0, index * itemHeight);
      optionButton.Size = new UDim2(1, -4, 0, itemHeight);
      optionButton.BackgroundTransparency = 1;
      optionButton.TextColor3 = new Color3(1, 1, 1);
      optionButton.Font = Enum.Font.SourceSans;
      optionButton.TextScaled = true;
      optionButton.BorderSizePixel = 0;
      optionButton.ZIndex = 11;
      optionButton.Parent = scrollFrame;

      // Hover effect
      optionButton.MouseEnter.Connect(() => {
        optionButton.BackgroundTransparency = 0;
        optionButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
      });

      optionButton.MouseLeave.Connect(() => {
        optionButton.BackgroundTransparency = 1;
      });

      // Selection
      optionButton.MouseButton1Click.Connect(() => {
        // Check if this property is already used on another axis
        const isUsed = this.isPropertyUsed(property, axis);
        if (isUsed) {
          warn(`Property "${property}" is already assigned to another axis`);
          return;
        }
        onSelect(property);
      });
    });

    return optionsFrame;
  }

  /**
   * Check if a property is already used on another axis
   */
  private isPropertyUsed(property: string, currentAxis: keyof AxisMapping): boolean {
    const axes: (keyof AxisMapping)[] = ["xAxis", "yAxis", "zAxis"];
    for (const axis of axes) {
      if (axis !== currentAxis && this.currentMapping[axis] === property) {
        return true;
      }
    }
    return false;
  }

  /**
   * Apply the current mapping
   */
  private applyMapping(): void {
    // Send mapping to server
    if (this.remoteEvent) {
      this.remoteEvent.FireServer("UpdateAxisMapping", this.currentMapping);
    }

    print("GraphBlaster axis mapping updated:");
    print(`  X Axis: ${this.currentMapping.xAxis}`);
    print(`  Y Axis: ${this.currentMapping.yAxis}`);
    print(`  Z Axis: ${this.currentMapping.zAxis}`);
  }

  /**
   * Destroy the GUI
   */
  public destroy(): void {
    // Close all dropdowns
    this.closeAllDropdowns();
    
    if (this.gui) {
      this.gui.Destroy();
      this.gui = undefined;
      this.frame = undefined;
    }
    
    // Clear cleanup functions
    this.dropdownCleanups = [];
  }
}