import { makeBlock } from "./blockMaker/index";

export function cubeMaker(size: number, position: Vector3, index: number, parent: Instance): Part {
  // Create a cube using the blockMaker
  return makeBlock({
    position,
    size: new Vector3(size, size, size),
    parent,
    color: new Color3(math.random(), math.random(), math.random()),
    blockIndex: index,
  });
}