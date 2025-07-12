import { makeBlock } from "./blockMaker/index";
import { IBlockMakerConfig } from "./blockMaker/standardizedInterfaces";

export interface InitCube {
  origin: Vector3;
}

interface CubeData extends Omit<IBlockMakerConfig, "parent"> {
  x: number;
  y: number;
  z: number;
}

type CubeDataArray = CubeData[][][];

function generateCubeData(origin: Vector3, cubeSize: number, spacing: number): CubeDataArray {
  const cubeData: CubeDataArray = [];
  
  for (let y = 0; y < 3; y++) {
    cubeData[y] = [];
    for (let z = 0; z < 3; z++) {
      cubeData[y][z] = [];
      for (let x = 0; x < 3; x++) {
        const position = new Vector3(
          origin.X + (x * spacing - spacing),
          origin.Y + (y * spacing - spacing),
          origin.Z + (z * spacing - spacing)
        );
        
        const suffix = `x-${string.format("%02d", x + 1)}-y-${string.format("%02d", y + 1)}-z-${string.format("%02d", z + 1)}`;
        const multiLineLabel = `x: ${x + 1}\ny: ${y + 1}\nz: ${z + 1}`;
        
        cubeData[y][z][x] = {
          x,
          y,
          z,
          position,
          size: new Vector3(cubeSize, cubeSize, cubeSize),
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
        };
      }
    }
  }
  
  return cubeData;
}

function renderBlocks(cubeData: CubeDataArray, parent: Instance): void {
  for (let y = 0; y < 3; y++) {
    const layer = new Instance("Model");
    layer.Name = `Layer-y-${string.format("%02d", y + 1)}`;
    layer.Parent = parent;
    
    for (let z = 0; z < 3; z++) {
      const row = new Instance("Model");
      row.Name = `Row-y-${string.format("%02d", y + 1)}-z-${string.format("%02d", z + 1)}`;
      row.Parent = layer;
      
      for (let x = 0; x < 3; x++) {
        const data = cubeData[y][z][x];
        makeBlock({
          ...data,
          parent: row,
        });
      }
    }
  }
}

export function rubixCubeMaker(parent: Instance, initCube?: InitCube): Model {
  print("=== rubixCubeMaker called ===");
  print(`Time: ${os.time()}`);
  print(`Parent: ${parent.GetFullName()}`);

  print("Creating new RubixCube");
  const rubixCube = new Instance("Model");
  rubixCube.Name = "RubixCube";
  rubixCube.Parent = parent;

  const origin = initCube?.origin || new Vector3(0, 0, 0);
  const cubeSize = 10;
  const spacing = cubeSize * 1.1;

  // Generate cube data
  const cubeData = generateCubeData(origin, cubeSize, spacing);
  
  // Render blocks from data
  renderBlocks(cubeData, rubixCube);

  return rubixCube;
}
