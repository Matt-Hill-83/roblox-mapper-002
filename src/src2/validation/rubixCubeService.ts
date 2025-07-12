import { wireframeBlockMaker } from "./wireframeBlockMaker";
import { IBlockMakerConfig } from "./blockMaker/standardizedInterfaces";

export interface InitCube {
  origin: Vector3;
}

export interface RubixConfig {
  numBlocks: {
    x: number;
    y: number;
    z: number;
  };
  blockSize?: {
    x: number;
    y: number;
    z: number;
  };
  edgeColor?: Color3;
}

export interface RubixCubeSize {
  width: number;
  height: number;
  depth: number;
}

interface CubeData extends Omit<IBlockMakerConfig, "parent"> {
  x: number;
  y: number;
  z: number;
}

type CubeDataArray = CubeData[][][];

const labelProps = {
  TextColor3: new Color3(0, 0, 0), // Black text
  TextScaled: false,
  TextSize: 24,
  AnchorPoint: new Vector2(1, 0), // Right, Top anchor
  Position: new UDim2(1, -5, 0, 5), // Upper right with 5px padding
  Size: new UDim2(0.2, 0, 0.2, 0), // 20% of face size (50% of 40%)
  BackgroundColor3: new Color3(1, 1, 1), // White background
  BackgroundTransparency: 0, // Fully opaque
  BorderSizePixel: 5, // 50% of default 10
};

const SHADOW_CONSTANTS = {
  Y_OFFSET: 5, // 5 units beneath rubix cube bottom
  HEIGHT: 1,
  COLOR: new Color3(0, 0, 0), // Black
  TRANSPARENCY: 0.8, // 80% transparent
  EDGE_COLOR: new Color3(0.2, 0.5, 0.2), // Dark green edges
  BUFFER: 4, // 4 units wider on each side
};

export class RubixCubeService {
  private cubeData?: CubeDataArray;
  private config?: RubixConfig;
  private model?: Model;

  /**
   * Generate cube data based on configuration
   */
  public generateData(origin: Vector3, config: RubixConfig): CubeDataArray {
    this.config = config;
    
    const numBlocks = config.numBlocks;
    const blockSize = config.blockSize || { x: 10, y: 5, z: 10 };
    
    const spacingX = blockSize.x * 1.1;
    const spacingY = blockSize.y * 1.1;
    const spacingZ = blockSize.z * 1.1;
    
    const cubeData: CubeDataArray = [];

    for (let y = 0; y < numBlocks.y; y++) {
      cubeData[y] = [];
      for (let z = 0; z < numBlocks.z; z++) {
        cubeData[y][z] = [];
        for (let x = 0; x < numBlocks.x; x++) {
          const position = new Vector3(
            origin.X + (x * spacingX - spacingX),
            origin.Y + (y * spacingY - spacingY),
            origin.Z + (z * spacingZ - spacingZ)
          );

          const suffix = `x-${string.format("%02d", x + 1)}-y-${string.format(
            "%02d",
            y + 1
          )}-z-${string.format("%02d", z + 1)}`;
          const multiLineLabel = `x: ${x + 1}\ny: ${y + 1}\nz: ${z + 1}`;

          cubeData[y][z][x] = {
            x,
            y,
            z,
            position,
            size: new Vector3(blockSize.x, blockSize.y, blockSize.z),
            color: new Color3(math.random(), math.random(), math.random()),
            nameSuffix: suffix,
            labels: {
              front: multiLineLabel,
              back: multiLineLabel,
              left: multiLineLabel,
              right: multiLineLabel,
              top: multiLineLabel,
              bottom: multiLineLabel,
            },
            labelBackgroundTransparency: 0, // Fully opaque background for labels
            backgroundColor: new Color3(1, 1, 1), // White background
          };
        }
      }
    }

    this.cubeData = cubeData;
    return cubeData;
  }

  /**
   * Get the generated cube data
   */
  public getData(): CubeDataArray | undefined {
    return this.cubeData;
  }

  /**
   * Get current configuration
   */
  public getConfig(): RubixConfig | undefined {
    return this.config;
  }

  /**
   * Calculate the total size of the rubix cube
   */
  public calculateSize(config?: RubixConfig): RubixCubeSize {
    const activeConfig = config || this.config;
    if (!activeConfig) {
      error("No configuration provided");
    }
    
    const numBlocks = activeConfig.numBlocks;
    const blockSize = activeConfig.blockSize || { x: 10, y: 5, z: 10 };
    
    const spacingX = blockSize.x * 1.1;
    const spacingY = blockSize.y * 1.1;
    const spacingZ = blockSize.z * 1.1;
    
    // Total size is (numBlocks - 1) * spacing + blockSize
    // This accounts for the spacing between blocks
    return {
      width: (numBlocks.x - 1) * spacingX + blockSize.x,
      height: (numBlocks.y - 1) * spacingY + blockSize.y,
      depth: (numBlocks.z - 1) * spacingZ + blockSize.z,
    };
  }

  /**
   * Render the rubix cube using the generated data
   */
  public render(parent: Instance): Model {
    if (!this.cubeData || !this.config) {
      error("Must call generateData before render");
    }

    print("=== RubixCubeService.render() ===");
    print(`Time: ${os.time()}`);
    print(`Parent: ${parent.GetFullName()}`);

    const rubixCube = new Instance("Model");
    rubixCube.Name = "RubixCube";
    rubixCube.Parent = parent;
    this.model = rubixCube;

    const edgeColor = this.config.edgeColor || new Color3(0, 0, 0);
    
    // Render blocks from data
    for (let y = 0; y < this.cubeData.size(); y++) {
      const layer = new Instance("Model");
      layer.Name = `Layer-y-${string.format("%02d", y + 1)}`;
      layer.Parent = rubixCube;

      for (let z = 0; z < this.cubeData[y].size(); z++) {
        const row = new Instance("Model");
        row.Name = `Row-y-${string.format("%02d", y + 1)}-z-${string.format(
          "%02d",
          z + 1
        )}`;
        row.Parent = layer;

        for (let x = 0; x < this.cubeData[y][z].size(); x++) {
          const data = this.cubeData[y][z][x];
          wireframeBlockMaker({
            ...data,
            parent: row,
            transparency: 1, // Fully transparent
            edgeWidth: 0.1,
            edgeBlockColor: edgeColor,
            labelProps,
          });
        }
      }
    }

    return rubixCube;
  }

  /**
   * Get the rendered model
   */
  public getModel(): Model | undefined {
    return this.model;
  }

  /**
   * Create shadow grid beneath the rubix cube
   */
  public createShadowGrid(parent?: Instance, shadowY?: number): Model {
    if (!this.cubeData || !this.config) {
      error("Must call generateData before createShadowGrid");
    }

    const shadowParent = parent || this.model;
    if (!shadowParent) {
      error("No parent specified and no model exists");
    }

    print("=== Creating shadow grid ===");
    
    // Create container for shadows
    const shadowGridModel = new Instance("Model");
    shadowGridModel.Name = "ShadowGrid";
    shadowGridModel.Parent = shadowParent;
    
    const numBlocks = this.config.numBlocks;
    const blockSize = this.config.blockSize || { x: 10, y: 5, z: 10 };
    
    // Use provided shadowY or calculate from cube position
    let shadowYPosition: number;
    if (shadowY !== undefined) {
      shadowYPosition = shadowY;
    } else {
      // Fallback to old calculation if shadowY not provided
      const firstCubeBlock = this.cubeData![0][0][0];
      if (!firstCubeBlock.position) {
        error("Invalid cube data - missing position");
      }
      const cubeBottomY = firstCubeBlock.position.Y - blockSize.y / 2;
      shadowYPosition = cubeBottomY - SHADOW_CONSTANTS.Y_OFFSET;
    }
    
    // Create one shadow block per Z row
    for (let z = 0; z < numBlocks.z; z++) {
      // Get the first block in this Z row to determine position
      const firstBlock = this.cubeData![0][z][0];
      const lastBlock = this.cubeData![0][z][numBlocks.x - 1];
      
      if (!firstBlock.position || !lastBlock.position) {
        error("Invalid cube data - missing position");
      }
      
      // Calculate shadow dimensions with buffer (only in X direction)
      const shadowLength = lastBlock.position.X + blockSize.x / 2 - (firstBlock.position.X - blockSize.x / 2) + (SHADOW_CONSTANTS.BUFFER * 2);
      const shadowWidth = blockSize.z;
      
      // Calculate shadow position (centered on the row)
      const shadowX = (firstBlock.position.X + lastBlock.position.X) / 2;
      const shadowZ = firstBlock.position.Z;
      
      const shadowPosition = new Vector3(shadowX, shadowYPosition, shadowZ);
      const shadowSize = new Vector3(shadowLength, SHADOW_CONSTANTS.HEIGHT, shadowWidth);
      
      // Create shadow block
      wireframeBlockMaker({
        position: shadowPosition,
        size: shadowSize,
        parent: shadowGridModel,
        nameStub: "shadow",
        nameSuffix: `z-${string.format("%02d", z + 1)}`,
        transparency: SHADOW_CONSTANTS.TRANSPARENCY,
        color: SHADOW_CONSTANTS.COLOR,
        edgeWidth: 0.1, // Same as rubix cube blocks
        edgeBlockColor: SHADOW_CONSTANTS.EDGE_COLOR,
      });
    }
    
    print(`Created ${numBlocks.z} shadow blocks`);
    return shadowGridModel;
  }

  /**
   * Clear all data and reset the service
   */
  public clear(): void {
    this.cubeData = undefined;
    this.config = undefined;
    if (this.model) {
      this.model.Destroy();
      this.model = undefined;
    }
  }
}

/**
 * Static helper function to calculate rubix cube size without instantiating the service
 */
export function calculateRubixCubeSize(config: RubixConfig): RubixCubeSize {
  const service = new RubixCubeService();
  return service.calculateSize(config);
}