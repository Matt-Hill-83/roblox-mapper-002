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