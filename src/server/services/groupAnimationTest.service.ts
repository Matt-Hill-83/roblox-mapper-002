/**
 * Group Animation Test Service
 * 
 * Demonstrates animated movement of grouped hexagons in 3D space.
 * Creates two stacks of hexagons (red and blue) and provides a GUI button
 * that triggers an animation where red hexagons move to blue hexagons' position.
 */

import { TweenService, ReplicatedStorage } from "@rbxts/services";
import { makeHexagon } from "../../shared/modules/hexagonMaker";

// Hexagon configuration constants
const HEXAGON_CONFIG = {
  WIDTH: 8,
  HEIGHT: 0.5,
  SPACING: 4,
  COLORS: {
    RED: [1, 0, 0] as [number, number, number],
    BLUE: [0, 0, 1] as [number, number, number]
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
  private redHexagons: Model[] = [];
  private blueHexagons: Model[] = [];
  private remoteEvent?: RemoteEvent;
  private isAnimating = false;
  private testFolder?: Folder;

  /**
   * Runs the animation test
   */
  public runTest(parentFolder: Folder): void {
    
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
    
    // Create hexagon stacks
    this.redHexagons = this.createHexagonStack(
      HEXAGON_CONFIG.COLORS.RED,
      POSITIONS.RED_STACK,
      3,
      "red"
    );
    
    this.blueHexagons = this.createHexagonStack(
      HEXAGON_CONFIG.COLORS.BLUE,
      POSITIONS.BLUE_STACK,
      3,
      "blue"
    );
    
  }

  /**
   * Creates a vertical stack of hexagons
   */
  private createHexagonStack(
    color: [number, number, number], 
    basePosition: Vector3, 
    count: number,
    colorName: string
  ): Model[] {
    const hexagons: Model[] = [];
    
    for (let i = 0; i < count; i++) {
      const yOffset = i * (HEXAGON_CONFIG.HEIGHT + HEXAGON_CONFIG.SPACING);
      const position: [number, number, number] = [
        basePosition.X,
        basePosition.Y + yOffset,
        basePosition.Z
      ];
      
      const hexagon = makeHexagon({
        id: colorName === "red" ? 100 + i : 200 + i,
        position: new Vector3(position[0], position[1], position[2]),
        width: HEXAGON_CONFIG.WIDTH,
        height: HEXAGON_CONFIG.HEIGHT,
        barColor: new Color3(color[0], color[1], color[2]),
        labels: [`${colorName}-Front`, `${colorName}-Left`, `${colorName}-Right`],
        stackIndex: colorName === "red" ? 1 : 2,
        hexIndex: i + 1
      });
      
      hexagon.Name = `${colorName}Hexagon${i + 1}`;
      hexagon.Parent = this.testFolder;
      hexagons.push(hexagon);
    }
    
    return hexagons;
  }

  /**
   * Sets up remote event listener
   */
  private setupRemoteListener(): void {
    if (!this.remoteEvent) return;
    
    this.remoteEvent.OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
      const eventType = args[0] as string;
      if (eventType === "triggerAnimation" && !this.isAnimating) {
        this.startAnimation();
      }
    });
  }

  /**
   * Starts the animation
   */
  private startAnimation(): void {
    if (this.isAnimating) return;
    
    
    // Notify all clients that animation started
    if (this.remoteEvent) {
      this.remoteEvent.FireAllClients("animationStarted");
    }
    
    // Calculate target positions (where blue hexagons are)
    const targetPositions = this.blueHexagons.map(hexagon => {
      const primaryPart = hexagon.FindFirstChildWhichIsA("Part");
      return primaryPart ? primaryPart.Position : new Vector3(0, 0, 0);
    });
    
    // Animate red hexagons to blue positions
    this.animateHexagons(this.redHexagons, targetPositions);
  }

  /**
   * Animates hexagons to target positions
   */
  private animateHexagons(hexagons: Model[], targetPositions: Vector3[]): void {
    this.isAnimating = true;
    
    const tweenInfo = new TweenInfo(
      ANIMATION_CONFIG.DURATION,
      ANIMATION_CONFIG.EASING_STYLE,
      ANIMATION_CONFIG.EASING_DIRECTION
    );
    
    // Create and play tweens for each hexagon's parts
    const allTweens: Tween[] = [];
    
    hexagons.forEach((hexagon, hexIndex) => {
      const targetPos = targetPositions[hexIndex];
      const parts = hexagon.GetDescendants().filter((obj): obj is Part => obj.IsA("Part"));
      
      parts.forEach(part => {
        // Calculate offset from the hexagon's primary part
        const primaryPart = hexagon.FindFirstChildWhichIsA("Part");
        if (primaryPart) {
          const offset = part.Position.sub(primaryPart.Position);
          const newPosition = targetPos.add(offset);
          
          const tween = TweenService.Create(
            part,
            tweenInfo,
            { Position: newPosition }
          );
          allTweens.push(tween);
          tween.Play();
        }
      });
    });
    
    // Notify clients when animation completes
    if (allTweens.size() > 0) {
      allTweens[0].Completed.Connect(() => {
        this.isAnimating = false;
        if (this.remoteEvent) {
          this.remoteEvent.FireAllClients("animationCompleted");
        }
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
    this.redHexagons = [];
    this.blueHexagons = [];
    this.isAnimating = false;
  }
}