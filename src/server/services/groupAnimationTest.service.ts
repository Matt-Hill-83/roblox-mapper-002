/**
 * Group Animation Test Service
 * 
 * Demonstrates animated movement of grouped blocks in 3D space.
 * Creates two stacks of blocks (red and blue) and provides a GUI button
 * that triggers an animation where red blocks move to blue blocks' position.
 */

import { TweenService, ReplicatedStorage } from "@rbxts/services";

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

export class GroupAnimationTestService {
  private redBlocks: Part[] = [];
  private blueBlocks: Part[] = [];
  private remoteEvent?: RemoteEvent;
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
    
    // Create or get RemoteEvent
    this.remoteEvent = ReplicatedStorage.FindFirstChild("AnimationTestRemote") as RemoteEvent;
    if (!this.remoteEvent) {
      this.remoteEvent = new Instance("RemoteEvent");
      this.remoteEvent.Name = "AnimationTestRemote";
      this.remoteEvent.Parent = ReplicatedStorage;
    }
    
    // Set up remote event listener
    this.setupRemoteListener();
    
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
   * Sets up remote event listener
   */
  private setupRemoteListener(): void {
    if (!this.remoteEvent) return;
    
    this.remoteEvent.OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
      const eventType = args[0] as string;
      if (eventType === "triggerAnimation" && !this.isAnimating) {
        print(`🎯 Animation triggered by ${player.Name}`);
        this.startAnimation();
      }
    });
  }

  /**
   * Starts the animation
   */
  private startAnimation(): void {
    if (this.isAnimating) return;
    
    print("🚀 Starting block animation...");
    
    // Notify all clients that animation started
    if (this.remoteEvent) {
      this.remoteEvent.FireAllClients("animationStarted");
    }
    
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
    
    // Notify clients when animation completes
    if (tweens.size() > 0) {
      tweens[0].Completed.Connect(() => {
        this.isAnimating = false;
        if (this.remoteEvent) {
          this.remoteEvent.FireAllClients("animationCompleted");
        }
        print("✅ Animation complete!");
      });
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
    
    // Clear arrays
    this.redBlocks = [];
    this.blueBlocks = [];
    this.isAnimating = false;
  }
}