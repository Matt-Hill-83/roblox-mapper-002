import { cubeMaker } from "./cubeMaker";

export interface InitCube {
  origin: Vector3;
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

  // Create 3x3x3 grid of cubes
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        const position = new Vector3(
          origin.X + (x * spacing - spacing),
          origin.Y + (y * spacing - spacing),
          origin.Z + (z * spacing - spacing)
        );
        cubeMaker(cubeSize, position, rubixCube);
      }
    }
  }

  return rubixCube;
}