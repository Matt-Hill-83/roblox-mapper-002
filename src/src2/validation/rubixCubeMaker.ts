import { makeBlock } from "./blockMaker/index";

export interface InitCube {
  origin: Vector3;
}

function makeRowOfBlocks(
  parent: Instance,
  origin: Vector3,
  y: number,
  z: number,
  cubeSize: number,
  spacing: number
): Model {
  const row = new Instance("Model");
  row.Name = `Row-y-${string.format("%02d", y + 1)}-z-${string.format(
    "%02d",
    z + 1
  )}`;
  row.Parent = parent;

  for (let x = 0; x < 3; x++) {
    const position = new Vector3(
      origin.X + (x * spacing - spacing),
      origin.Y + (y * spacing - spacing),
      origin.Z + (z * spacing - spacing)
    );
    const suffix = `x-${string.format("%02d", x + 1)}-y-${string.format(
      "%02d",
      y + 1
    )}-z-${string.format("%02d", z + 1)}`;
    const multiLineLabel = `x: ${x + 1}\ny: ${y + 1}\nz: ${z + 1}`;
    const labels = {
      front: multiLineLabel,
      back: multiLineLabel,
      left: multiLineLabel,
      right: multiLineLabel,
      top: multiLineLabel,
      bottom: multiLineLabel,
    };
    makeBlock({
      position,
      size: new Vector3(cubeSize, cubeSize, cubeSize),
      parent: row,
      color: new Color3(math.random(), math.random(), math.random()),
      nameSuffix: suffix,
      labels: labels,
    });
  }

  return row;
}

function makeLayerOfRows(
  parent: Instance,
  origin: Vector3,
  y: number,
  cubeSize: number,
  spacing: number
): Model {
  const layer = new Instance("Model");
  layer.Name = `Layer-y-${string.format("%02d", y + 1)}`;
  layer.Parent = parent;

  for (let z = 0; z < 3; z++) {
    makeRowOfBlocks(layer, origin, y, z, cubeSize, spacing);
  }

  return layer;
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

  // Create 3 layers
  for (let y = 0; y < 3; y++) {
    makeLayerOfRows(rubixCube, origin, y, cubeSize, spacing);
  }

  return rubixCube;
}
