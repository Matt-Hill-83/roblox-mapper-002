import { makeBlock } from "./validation/blockMaker/index";
import { RubixCubeService, RubixConfig } from "./validation/rubixCubeService";

const GRAPH_BLASTER_CONSTANTS = {
  BASEPLATE: {
    HEIGHT: 4,
    SIZE_MULTIPLIER: 1.5,
    COLOR: new Color3(0.5, 0.7, 1), // Light blue
  },
  RUBIX_CUBE: {
    Y_OFFSET_FROM_BASEPLATE_TOP: 1, // 1 unit above baseplate top
    EDGE_COLOR: new Color3(0.68, 0.85, 0.9), // Baby blue
  },
};

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

export function graphBlasterLayoutMaker(
  config: GraphBlasterLayoutConfig
): { layoutModel: Model; rubixCubeService: RubixCubeService } {
  const { origin, rubixCubeProps, parent } = config;

  // Create Graph Blaster folder
  const graphBlasterFolder = new Instance("Folder");
  graphBlasterFolder.Name = "Graph Blaster";
  graphBlasterFolder.Parent = parent;

  // Create container model inside the folder
  const layoutModel = new Instance("Model");
  layoutModel.Name = "GraphBlasterLayout";
  layoutModel.Parent = graphBlasterFolder;

  // Create rubix cube service
  const rubixCubeService = new RubixCubeService();
  
  // Create rubix cube config
  const rubixConfig: RubixConfig = {
    numBlocks: rubixCubeProps.numBlocks,
    blockSize: rubixCubeProps.blockSize,
    edgeColor: GRAPH_BLASTER_CONSTANTS.RUBIX_CUBE.EDGE_COLOR,
  };
  
  // Calculate rubix cube size to properly position it
  const rubixCubeSize = rubixCubeService.calculateSize(rubixConfig);

  // Calculate total rubix cube dimensions for baseplate
  const totalWidth = rubixCubeProps.blockSize.x * rubixCubeProps.numBlocks.x;
  const totalDepth = rubixCubeProps.blockSize.z * rubixCubeProps.numBlocks.z;

  // Calculate baseplate dimensions (rubixCube total size * 1.1)
  const baseplateWidth =
    totalWidth * GRAPH_BLASTER_CONSTANTS.BASEPLATE.SIZE_MULTIPLIER;
  const baseplateHeight = GRAPH_BLASTER_CONSTANTS.BASEPLATE.HEIGHT;
  const baseplateDepth =
    totalDepth * GRAPH_BLASTER_CONSTANTS.BASEPLATE.SIZE_MULTIPLIER;

  // Create baseplate
  makeBlock({
    position: origin,
    size: new Vector3(baseplateWidth, baseplateHeight, baseplateDepth),
    parent: layoutModel,
    color: GRAPH_BLASTER_CONSTANTS.BASEPLATE.COLOR,
    nameStub: "baseplate",
    nameSuffix: "main",
    transparency: 0,
  });
  
  // Calculate rubix cube position (bottom of cube is 1 unit above baseplate top)
  const rubixCubeOrigin = new Vector3(
    origin.X,
    origin.Y + baseplateHeight / 2 + GRAPH_BLASTER_CONSTANTS.RUBIX_CUBE.Y_OFFSET_FROM_BASEPLATE_TOP + rubixCubeSize.height / 2,
    origin.Z
  );

  // Generate data and render rubix cube
  rubixCubeService.generateData(rubixCubeOrigin, rubixConfig);
  rubixCubeService.render(layoutModel);

  return { layoutModel, rubixCubeService };
}
