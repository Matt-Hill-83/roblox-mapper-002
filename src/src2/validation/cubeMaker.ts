import { blockMaker } from "./blockMaker";

export function cubeMaker(size: number, position: Vector3, parent: Instance): Part {
  // Just make a single cube block
  const cubeSize = new Vector3(size, size, size);
  return blockMaker(cubeSize, position, parent);
}