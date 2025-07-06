/**
 * Group Animation Test Service
 * 
 * Demonstrates animated movement of grouped blocks in 3D space.
 * Creates two stacks of blocks (red and blue) and provides a GUI button
 * that triggers an animation where red blocks move to blue blocks' position.
 */

import { TweenService, Players } from "@rbxts/services";

// Block configuration constants
const BLOCK_CONFIG = {
  SIZE: new Vector3(4, 4, 4),
  SPACING: 2,
  COLORS: {
    RED: new Color3(1, 0, 0),
    BLUE: new Color3(0, 0, 1)
  }
};

// Animation configuration
const ANIMATION_CONFIG = {
  DURATION: 2,
  EASING_STYLE: Enum.EasingStyle.Quad,
  EASING_DIRECTION: Enum.EasingDirection.InOut
};

// Initial positions
const POSITIONS = {
  RED_STACK: new Vector3(-20, 10, 0),
  BLUE_STACK: new Vector3(20, 10, 0)
};

// GUI configuration
const GUI_CONFIG = {
  BUTTON: {
    SIZE: new UDim2(0, 200, 0, 50),
    POSITION: new UDim2(0.5, -100, 0, 20),
    TEXT: "Move Red to Blue",
    COLORS: {
      DEFAULT: new Color3(0.2, 0.6, 0.2),
      HOVER: new Color3(0.3, 0.7, 0.3),
      DISABLED: new Color3(0.5, 0.5, 0.5)
    }
  }
};

export class GroupAnimationTestService {
  private redBlocks: Part[] = [];
  private blueBlocks: Part[] = [];
  private gui?: ScreenGui;
  private button?: TextButton;
  private isAnimating = false;
  private testFolder?: Folder;

  /**
   * Runs the animation test
   */
  public runTest(parentFolder: Folder): void {
    print("🎬 Starting Group Animation Test...");
    
    // Cleanup any previous test
    this.cleanup();
    
    // Create test folder
    this.testFolder = new Instance("Folder");
    this.testFolder.Name = "AnimationTest";
    this.testFolder.Parent = parentFolder;
    
    // Create block stacks
    this.redBlocks = this.createStack(
      BLOCK_CONFIG.COLORS.RED,
      POSITIONS.RED_STACK,
      3
    );
    
    this.blueBlocks = this.createStack(
      BLOCK_CONFIG.COLORS.BLUE,
      POSITIONS.BLUE_STACK,
      3
    );
    
    // Create GUI
    this.gui = this.createGUI();
    
    print("✅ Animation test ready!");
  }

  /**
   * Creates a colored block at the specified position
   */
  private createBlock(color: Color3, position: Vector3): Part {
    const block = new Instance("Part");
    block.Size = BLOCK_CONFIG.SIZE;
    block.Position = position;
    block.Color = color;
    block.Material = Enum.Material.Neon;
    block.Anchored = true;
    block.Parent = this.testFolder;
    return block;
  }

  /**
   * Creates a vertical stack of blocks
   */
  private createStack(color: Color3, basePosition: Vector3, count: number): Part[] {
    const blocks: Part[] = [];
    
    for (let i = 0; i < count; i++) {
      const yOffset = i * (BLOCK_CONFIG.SIZE.Y + BLOCK_CONFIG.SPACING);
      const position = basePosition.add(new Vector3(0, yOffset, 0));
      const block = this.createBlock(color, position);
      block.Name = color === BLOCK_CONFIG.COLORS.RED ? `RedBlock${i + 1}` : `BlueBlock${i + 1}`;
      blocks.push(block);
    }
    
    return blocks;
  }

  /**
   * Creates the GUI with move button
   */
  private createGUI(): ScreenGui {
    const player = Players.LocalPlayer;
    if (!player) {
      warn("No local player found for GUI creation");
      return new Instance("ScreenGui");
    }

    // Create ScreenGui
    const screenGui = new Instance("ScreenGui");
    screenGui.Name = "AnimationTestGUI";
    screenGui.ResetOnSpawn = false;
    
    // Create transparent frame container
    const frame = new Instance("Frame");
    frame.Size = new UDim2(1, 0, 1, 0);
    frame.BackgroundTransparency = 1;
    frame.Parent = screenGui;
    
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
    this.button.MouseButton1Click.Connect(() => this.onMoveButtonClick());
    
    // Parent to PlayerGui
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
    screenGui.Parent = playerGui;
    
    return screenGui;
  }

  /**
   * Handles move button click
   */
  private onMoveButtonClick(): void {
    if (this.isAnimating) {
      return;
    }
    
    print("🚀 Starting block animation...");
    
    // Calculate target positions (where blue blocks are)
    const targetPositions = this.blueBlocks.map(block => block.Position);
    
    // Animate red blocks to blue positions
    this.animateBlocks(this.redBlocks, targetPositions);
  }

  /**
   * Animates blocks to target positions
   */
  private animateBlocks(blocks: Part[], targetPositions: Vector3[]): void {
    this.isAnimating = true;
    this.updateButtonState();
    
    const tweenInfo = new TweenInfo(
      ANIMATION_CONFIG.DURATION,
      ANIMATION_CONFIG.EASING_STYLE,
      ANIMATION_CONFIG.EASING_DIRECTION
    );
    
    // Create and play tweens for each block
    const tweens: Tween[] = [];
    blocks.forEach((block, index) => {
      const tween = TweenService.Create(
        block,
        tweenInfo,
        { Position: targetPositions[index] }
      );
      tweens.push(tween);
      tween.Play();
    });
    
    // Re-enable button after first tween completes
    if (tweens.size() > 0) {
      tweens[0].Completed.Connect(() => {
        this.isAnimating = false;
        this.updateButtonState();
        print("✅ Animation complete!");
      });
    }
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
   * Cleans up previous test instances
   */
  private cleanup(): void {
    // Destroy test folder and all blocks
    if (this.testFolder) {
      this.testFolder.Destroy();
      this.testFolder = undefined;
    }
    
    // Destroy GUI
    if (this.gui) {
      this.gui.Destroy();
      this.gui = undefined;
    }
    
    // Clear arrays
    this.redBlocks = [];
    this.blueBlocks = [];
    this.button = undefined;
    this.isAnimating = false;
  }
}