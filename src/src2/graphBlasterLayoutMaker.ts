import { makeBlock } from "./validation/blockMaker/index";
import { rubixCubeMaker, RubixConfig } from "./validation/rubixCubeMaker";

export interface RubixCubeProps {
  blockSize: {
    x: number;
    y: number;
    z: number;
  };
  numBlocks: {
    x: number;
    y: number;
    z: number;
  };
}

export interface GraphBlasterLayoutConfig {
  origin: Vector3;
  rubixCubeProps: RubixCubeProps;
  parent: Instance;
}

export function graphBlasterLayoutMaker(config: GraphBlasterLayoutConfig): Model {
  const { origin, rubixCubeProps, parent } = config;
  
  // Create container model
  const layoutModel = new Instance("Model");
  layoutModel.Name = "GraphBlasterLayout";
  layoutModel.Parent = parent;
  
  // Calculate total rubix cube dimensions
  const totalWidth = rubixCubeProps.blockSize.x * rubixCubeProps.numBlocks.x;
  const totalDepth = rubixCubeProps.blockSize.z * rubixCubeProps.numBlocks.z;
  
  // Calculate baseplate dimensions (rubixCube total size * 1.1)
  const baseplateWidth = totalWidth * 1.1;
  const baseplateHeight = 5; // 5 units tall as specified
  const baseplateDepth = totalDepth * 1.1;
  
  // Create baseplate
  makeBlock({
    position: origin,
    size: new Vector3(baseplateWidth, baseplateHeight, baseplateDepth),
    parent: layoutModel,
    color: new Color3(0.3, 0.3, 0.3), // Dark gray
    nameStub: "baseplate",
    nameSuffix: "main",
    transparency: 0,
  });
  
  // Calculate rubix cube position (center of baseplate, offset in y by 2)
  const rubixCubeOrigin = new Vector3(
    origin.X,
    origin.Y + baseplateHeight / 2 + 2, // Top of baseplate + 2 units
    origin.Z
  );
  
  // Create rubix cube config
  const rubixConfig: RubixConfig = {
    numBlocks: rubixCubeProps.numBlocks,
    blockSize: rubixCubeProps.blockSize
  };
  
  // Create rubix cube
  rubixCubeMaker(
    layoutModel,
    { origin: rubixCubeOrigin },
    rubixConfig
  );
  
  return layoutModel;
}