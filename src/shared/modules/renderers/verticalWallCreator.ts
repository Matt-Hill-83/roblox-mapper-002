/**
 * Vertical Wall Creator
 * Creates vertical walls around the platform for Y-axis property visualization
 */

export interface VerticalWallConfig {
  platformBounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  height: number;
  parent: Instance;
}

export function createVerticalWalls(config: VerticalWallConfig): Part[] {
  const { platformBounds, height, parent } = config;
  const walls: Part[] = [];
  
  const wallThickness = 0.5;
  const wallColor = new Color3(0.3, 0.3, 0.3);
  const wallTransparency = 0.7;
  
  // Calculate platform dimensions
  const platformWidth = platformBounds.maxX - platformBounds.minX;
  const platformDepth = platformBounds.maxZ - platformBounds.minZ;
  const centerX = (platformBounds.minX + platformBounds.maxX) / 2;
  const centerZ = (platformBounds.minZ + platformBounds.maxZ) / 2;
  
  // Front wall (negative Z)
  const frontWall = new Instance("Part");
  frontWall.Name = "VerticalWall_Front";
  frontWall.Size = new Vector3(platformWidth + wallThickness * 2, height, wallThickness);
  frontWall.Position = new Vector3(centerX, height / 2, platformBounds.minZ - wallThickness / 2);
  frontWall.Material = Enum.Material.Glass;
  frontWall.Color = wallColor;
  frontWall.Transparency = wallTransparency;
  frontWall.Anchored = true;
  frontWall.CanCollide = false;
  frontWall.Parent = parent;
  walls.push(frontWall);
  
  // Back wall (positive Z)
  const backWall = new Instance("Part");
  backWall.Name = "VerticalWall_Back";
  backWall.Size = new Vector3(platformWidth + wallThickness * 2, height, wallThickness);
  backWall.Position = new Vector3(centerX, height / 2, platformBounds.maxZ + wallThickness / 2);
  backWall.Material = Enum.Material.Glass;
  backWall.Color = wallColor;
  backWall.Transparency = wallTransparency;
  backWall.Anchored = true;
  backWall.CanCollide = false;
  backWall.Parent = parent;
  walls.push(backWall);
  
  // Left wall (negative X)
  const leftWall = new Instance("Part");
  leftWall.Name = "VerticalWall_Left";
  leftWall.Size = new Vector3(wallThickness, height, platformDepth);
  leftWall.Position = new Vector3(platformBounds.minX - wallThickness / 2, height / 2, centerZ);
  leftWall.Material = Enum.Material.Glass;
  leftWall.Color = wallColor;
  leftWall.Transparency = wallTransparency;
  leftWall.Anchored = true;
  leftWall.CanCollide = false;
  leftWall.Parent = parent;
  walls.push(leftWall);
  
  // Right wall (positive X)
  const rightWall = new Instance("Part");
  rightWall.Name = "VerticalWall_Right";
  rightWall.Size = new Vector3(wallThickness, height, platformDepth);
  rightWall.Position = new Vector3(platformBounds.maxX + wallThickness / 2, height / 2, centerZ);
  rightWall.Material = Enum.Material.Glass;
  rightWall.Color = wallColor;
  rightWall.Transparency = wallTransparency;
  rightWall.Anchored = true;
  rightWall.CanCollide = false;
  rightWall.Parent = parent;
  walls.push(rightWall);
  
  
  return walls;
}

/**
 * Create swimlane shadows on vertical walls
 */
export function createWallSwimlanes(
  walls: Part[],
  propertyGroups: Map<string, { minY: number; maxY: number }>,
  colors: Map<string, Color3>
): void {
  walls.forEach(wall => {
    propertyGroups.forEach((bounds, propertyValue) => {
      const shadowHeight = bounds.maxY - bounds.minY;
      const shadowY = (bounds.minY + bounds.maxY) / 2;
      
      // Create a shadow block on the wall
      const shadow = new Instance("Part");
      shadow.Name = `WallShadow_${wall.Name}_${propertyValue}`;
      
      // Adjust size and position based on wall orientation
      if (wall.Name.find("Front") || wall.Name.find("Back")) {
        // Front/Back walls - shadows span width
        shadow.Size = new Vector3(wall.Size.X, shadowHeight, 0.1);
        shadow.Position = new Vector3(wall.Position.X, shadowY, wall.Position.Z);
      } else {
        // Left/Right walls - shadows span depth
        shadow.Size = new Vector3(0.1, shadowHeight, wall.Size.Z);
        shadow.Position = new Vector3(wall.Position.X, shadowY, wall.Position.Z);
      }
      
      shadow.Material = Enum.Material.Concrete;
      shadow.Color = colors.get(propertyValue) || new Color3(0.5, 0.5, 0.5);
      shadow.Transparency = 0.8;
      shadow.Anchored = true;
      shadow.CanCollide = false;
      shadow.Parent = wall;
      
      // Add label using SurfaceGui
      const surfaceGui = new Instance("SurfaceGui");
      surfaceGui.Face = wall.Name.find("Front") ? Enum.NormalId.Front 
                     : wall.Name.find("Back") ? Enum.NormalId.Back
                     : wall.Name.find("Left") ? Enum.NormalId.Left
                     : Enum.NormalId.Right;
      surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
      surfaceGui.PixelsPerStud = 50;
      surfaceGui.Parent = shadow;
      
      const label = new Instance("TextLabel");
      label.Size = new UDim2(1, 0, 1, 0);
      label.BackgroundTransparency = 1;
      label.Text = propertyValue;
      label.TextColor3 = new Color3(1, 1, 1);
      label.TextScaled = true;
      label.Font = Enum.Font.SourceSansBold;
      label.TextStrokeTransparency = 0;
      label.TextStrokeColor3 = new Color3(0, 0, 0);
      label.Parent = surfaceGui;
    });
  });
  
  
}

/**
 * Create a single vertical wall at the far Z edge of a shadow block
 * Wall is parallel to X-axis with same width as shadow block
 */
export function createFarZEdgeWall(shadowBlock: Part, height: number): Part {
  const wallThickness = 0.5;
  const wallColor = new Color3(0.3, 0.3, 0.3);
  const wallTransparency = 0.7;
  
  // Get shadow block dimensions
  const shadowWidth = shadowBlock.Size.X;
  const shadowDepth = shadowBlock.Size.Z;
  
  // Calculate wall position at far Z edge (positive Z)
  const wallX = shadowBlock.Position.X;
  const wallY = shadowBlock.Position.Y + shadowBlock.Size.Y / 2 + height / 2; // Position above shadow block
  const wallZ = shadowBlock.Position.Z + shadowDepth / 2 + wallThickness / 2;
  
  // Create the wall
  const wall = new Instance("Part");
  wall.Name = "FarZEdgeWall";
  wall.Size = new Vector3(shadowWidth, height, wallThickness);
  wall.Position = new Vector3(wallX, wallY, wallZ);
  wall.Material = Enum.Material.Glass;
  wall.Color = wallColor;
  wall.Transparency = wallTransparency;
  wall.Anchored = true;
  wall.CanCollide = false;
  wall.Parent = shadowBlock.Parent;
  
  
  return wall;
}

/**
 * Create a single vertical wall at the far X edge of a shadow block
 * Wall is parallel to Z-axis with same depth as shadow block
 */
export function createFarXEdgeWall(shadowBlock: Part, height: number): Part {
  const wallThickness = 0.5;
  const wallColor = new Color3(0.3, 0.3, 0.3);
  const wallTransparency = 0.7;
  
  // Get shadow block dimensions
  const shadowWidth = shadowBlock.Size.X;
  const shadowDepth = shadowBlock.Size.Z;
  
  // Calculate wall position at far X edge (positive X)
  const wallX = shadowBlock.Position.X + shadowWidth / 2 + wallThickness / 2;
  const wallY = shadowBlock.Position.Y + shadowBlock.Size.Y / 2 + height / 2; // Position above shadow block
  const wallZ = shadowBlock.Position.Z;
  
  // Create the wall
  const wall = new Instance("Part");
  wall.Name = "FarXEdgeWall";
  wall.Size = new Vector3(wallThickness, height, shadowDepth);
  wall.Position = new Vector3(wallX, wallY, wallZ);
  wall.Material = Enum.Material.Glass;
  wall.Color = wallColor;
  wall.Transparency = wallTransparency;
  wall.Anchored = true;
  wall.CanCollide = false;
  wall.Parent = shadowBlock.Parent;
  
  
  return wall;
}