/**
 * Colors Test Service
 * 
 * Creates a line of blocks using specified BrickColors for testing
 * color appearance and selection.
 */

export class ColorsTestService {
  private testFolder?: Folder;
  private blocks: Part[] = [];

  // Selected BrickColors to test with their numbers
  private readonly TEST_COLORS = [
    { name: "Bright reddish violet", number: 124 },
    { name: "Light brick yellow", number: 226 },
    { name: "Bright bluish violet", number: 110 },
    { name: "Bright reddish lilac", number: 198 },
    { name: "Med. reddish violet", number: 22 },
    { name: "Medium bluish violet", number: 112 },
    { name: "Bright green", number: 37 },
    { name: "Bright blue", number: 23 },
    { name: "Light purple", number: 223 },
    { name: "Medium green", number: 29 }
  ];

  // Block configuration
  private readonly BLOCK_CONFIG = {
    SIZE: new Vector3(4, 4, 4),
    SPACING: 5,
    START_POSITION: new Vector3(30, 30, 30)
  };

  /**
   * Runs the color test
   */
  public runTest(parentFolder: Folder): void {
    print("🎨 Starting Colors Test...");
    
    // Cleanup any previous test
    this.cleanup();
    
    // Create test folder
    this.testFolder = new Instance("Folder");
    this.testFolder.Name = "ColorsTest";
    this.testFolder.Parent = parentFolder;
    
    // Create blocks for each color
    this.createColorBlocks();
    
    print(`✅ Created ${this.blocks.size()} color test blocks`);
  }

  /**
   * Creates a block for each BrickColor in the test array
   */
  private createColorBlocks(): void {
    if (!this.testFolder) return;

    // Create blocks in a line
    this.TEST_COLORS.forEach((colorData, index) => {
      // Create BrickColor from number
      const [success, brickColor] = pcall(() => new BrickColor(colorData.number));

      if (success && brickColor) {
        // Calculate position in line
        const xOffset = index * (this.BLOCK_CONFIG.SIZE.X + this.BLOCK_CONFIG.SPACING);
        const position = this.BLOCK_CONFIG.START_POSITION.add(new Vector3(xOffset, 0, 0));
        
        // Create block
        const block = this.createBlock(brickColor, position, colorData.name);
        this.blocks.push(block);
        
        print(`✅ Created block: ${colorData.name} (BrickColor ${colorData.number})`);
      } else {
        warn(`❌ Failed to create BrickColor: ${colorData.name} (${colorData.number})`);
      }
    });
  }

  /**
   * Creates a single colored block
   */
  private createBlock(brickColor: BrickColor, position: Vector3, displayName: string): Part {
    const block = new Instance("Part");
    block.Name = `ColorBlock_${displayName}`;
    block.Size = this.BLOCK_CONFIG.SIZE;
    block.Position = position;
    block.BrickColor = brickColor;
    block.Material = Enum.Material.SmoothPlastic;
    block.TopSurface = Enum.SurfaceType.Smooth;
    block.BottomSurface = Enum.SurfaceType.Smooth;
    block.Anchored = true;
    block.Parent = this.testFolder;

    // Add a billboard GUI to show the color name
    const billboardGui = new Instance("BillboardGui");
    billboardGui.Size = new UDim2(6, 0, 1, 0);
    billboardGui.StudsOffset = new Vector3(0, 3, 0);
    billboardGui.AlwaysOnTop = true;
    billboardGui.Parent = block;

    const textLabel = new Instance("TextLabel");
    textLabel.Size = new UDim2(1, 0, 1, 0);
    textLabel.BackgroundTransparency = 1;
    textLabel.Text = displayName;
    textLabel.TextColor3 = new Color3(1, 1, 1);
    textLabel.TextStrokeColor3 = new Color3(0, 0, 0);
    textLabel.TextStrokeTransparency = 0;
    textLabel.TextScaled = true;
    textLabel.Font = Enum.Font.SourceSansBold;
    textLabel.Parent = billboardGui;

    return block;
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
    this.blocks = [];
  }
}