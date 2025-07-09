/**
 * Animation Test GUI Controller
 * Handles the client-side GUI for the animation test
 */

import { Players, ReplicatedStorage } from "@rbxts/services";

// GUI configuration
const GUI_CONFIG = {
  BUTTON: {
    SIZE: new UDim2(0, 200, 0, 50),
    POSITION: new UDim2(1, -220, 0, 20), // Upper right with 20px margin
    TEXT: "Move Red Hexes to Blue",
    COLORS: {
      DEFAULT: new Color3(0.2, 0.6, 0.2),
      HOVER: new Color3(0.3, 0.7, 0.3),
      DISABLED: new Color3(0.5, 0.5, 0.5)
    }
  }
};

export class AnimationTestGUIController {
  private gui?: ScreenGui;
  private button?: TextButton;
  private remoteEvent?: RemoteEvent;
  private isAnimating = false;

  /**
   * Initializes the animation test GUI
   */
  public initialize(): void {
    
    // Wait for remote event
    const remoteEvent = ReplicatedStorage.WaitForChild("AnimationTestRemote", 5) as RemoteEvent | undefined;
    if (!remoteEvent) {
      warn("AnimationTestRemote not found - animation test may not be enabled");
      return;
    }
    
    this.remoteEvent = remoteEvent;
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Create GUI
    this.createGUI();
  }

  /**
   * Sets up remote event listeners
   */
  private setupEventListeners(): void {
    if (!this.remoteEvent) return;
    
    this.remoteEvent.OnClientEvent.Connect((eventType: string) => {
      if (eventType === "animationStarted") {
        this.isAnimating = true;
        this.updateButtonState();
      } else if (eventType === "animationCompleted") {
        this.isAnimating = false;
        this.updateButtonState();
      }
    });
  }

  /**
   * Creates the GUI with move button
   */
  private createGUI(): void {
    const player = Players.LocalPlayer;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
    
    // Create ScreenGui
    this.gui = new Instance("ScreenGui");
    this.gui.Name = "AnimationTestGUI";
    this.gui.ResetOnSpawn = false;
    
    // Create transparent frame container
    const frame = new Instance("Frame");
    frame.Size = new UDim2(1, 0, 1, 0);
    frame.BackgroundTransparency = 1;
    frame.Parent = this.gui;
    
    // Create button
    this.button = new Instance("TextButton");
    this.button.Size = GUI_CONFIG.BUTTON.SIZE;
    this.button.Position = GUI_CONFIG.BUTTON.POSITION;
    this.button.Text = GUI_CONFIG.BUTTON.TEXT;
    this.button.Font = Enum.Font.SourceSansBold;
    this.button.TextScaled = true;
    this.button.TextColor3 = new Color3(1, 1, 1);
    this.button.BackgroundColor3 = GUI_CONFIG.BUTTON.COLORS.DEFAULT;
    this.button.BorderSizePixel = 0;
    this.button.Parent = frame;
    
    // Add corner rounding
    const uiCorner = new Instance("UICorner");
    uiCorner.CornerRadius = new UDim(0, 8);
    uiCorner.Parent = this.button;
    
    // Add hover effects
    this.button.MouseEnter.Connect(() => {
      if (!this.isAnimating && this.button) {
        this.button.BackgroundColor3 = GUI_CONFIG.BUTTON.COLORS.HOVER;
      }
    });
    
    this.button.MouseLeave.Connect(() => {
      if (!this.isAnimating && this.button) {
        this.button.BackgroundColor3 = GUI_CONFIG.BUTTON.COLORS.DEFAULT;
      }
    });
    
    // Connect click event
    this.button.MouseButton1Click.Connect(() => this.onButtonClick());
    
    // Parent to PlayerGui
    this.gui.Parent = playerGui;
    
  }

  /**
   * Handles button click
   */
  private onButtonClick(): void {
    if (this.isAnimating || !this.remoteEvent) return;
    
    // Send request to server
    this.remoteEvent.FireServer("triggerAnimation");
  }

  /**
   * Updates button state based on animation status
   */
  private updateButtonState(): void {
    if (!this.button) return;
    
    if (this.isAnimating) {
      this.button.BackgroundColor3 = GUI_CONFIG.BUTTON.COLORS.DISABLED;
      this.button.Text = "Animating...";
    } else {
      this.button.BackgroundColor3 = GUI_CONFIG.BUTTON.COLORS.DEFAULT;
      this.button.Text = GUI_CONFIG.BUTTON.TEXT;
    }
  }

  /**
   * Cleans up the GUI
   */
  public destroy(): void {
    if (this.gui) {
      this.gui.Destroy();
      this.gui = undefined;
      this.button = undefined;
    }
  }
}