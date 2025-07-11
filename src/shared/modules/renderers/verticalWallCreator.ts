/**
 * Vertical Wall Creator
 * Creates vertical walls around the platform for Y-axis property visualization
 */

interface VerticalWallConfig {
  platformBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  height: number;
  parent: Instance;
}

export function createVerticalWalls(config: VerticalWallConfig): Part[] {
  const { platformBounds, height, parent } = config;
  const walls: Part[] = [];
  
  print(`[VerticalWallCreator] Creating walls with height ${height} for parent ${parent.Name}`);
  
  const wallThickness = 0.5;
  const wallColor = new Color3(0.3, 0.3, 0.3);
  const wallTransparency = 0.7;
  
  // Calculate platform dimensions
  const platformWidth = platformBounds.maxX - platformBounds.minX;
  const platformDepth = platformBounds.maxZ - platformBounds.minZ;
  const centerX = (platformBounds.minX + platformBounds.maxX) / 2;
  const centerZ = (platformBounds.minZ + platformBounds.maxZ) / 2;
  
  // Back wall (positive Z) - keep only back and right walls
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
  print(`[VerticalWallCreator] Created back wall at position (${backWall.Position.X}, ${backWall.Position.Y}, ${backWall.Position.Z})`);
  
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
  print(`[VerticalWallCreator] Created right wall at position (${rightWall.Position.X}, ${rightWall.Position.Y}, ${rightWall.Position.Z})`);
  
  print(`[VerticalWallCreator] Created ${walls.size()} vertical walls total`);
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

/**
 * Create a single vertical wall at the far X edge of a shadow block
 * Wall is parallel to Z-axis with same depth as shadow block
 */
