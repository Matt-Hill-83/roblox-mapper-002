import { makeBlock } from "./validation/blockMaker/index";
import { RubixCubeService, RubixConfig } from "./validation/rubixCubeService";

const GRAPH_BLASTER_CONSTANTS = {
  BASEPLATE: {
    HEIGHT: 4,
    SIZE_MULTIPLIER: 1,
    COLOR: new Color3(0.5, 0.7, 1), // Light blue
    TRANSPARENCY: 0.5, // 50% transparent
  },
  SHADOW: {
    Y_OFFSET_FROM_BASEPLATE_TOP: 0.1, // 0.1 above baseplate top
    HEIGHT: 1,
  },
  RUBIX_CUBE: {
    Y_OFFSET_FROM_SHADOW_TOP: 2, // 2 units above shadow top
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

export function graphBlasterLayoutMaker(config: GraphBlasterLayoutConfig): {
  layoutModel: Model;
  rubixCubeService: RubixCubeService;
} {
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

  // Calculate baseplate dimensions based on actual rubix cube size (including spacing)
  const baseplateWidth =
    rubixCubeSize.width * GRAPH_BLASTER_CONSTANTS.BASEPLATE.SIZE_MULTIPLIER;
  const baseplateHeight = GRAPH_BLASTER_CONSTANTS.BASEPLATE.HEIGHT;
  const baseplateDepth =
    rubixCubeSize.depth * GRAPH_BLASTER_CONSTANTS.BASEPLATE.SIZE_MULTIPLIER;

  // Create foundation
  makeBlock({
    position: origin,
    size: new Vector3(baseplateWidth, baseplateHeight, baseplateDepth),
    parent: layoutModel,
    color: GRAPH_BLASTER_CONSTANTS.BASEPLATE.COLOR,
    nameStub: "foundation",
    nameSuffix: "main",
    transparency: GRAPH_BLASTER_CONSTANTS.BASEPLATE.TRANSPARENCY,
  });

  // Calculate positions based on new order
  const baseplateTop = origin.Y + baseplateHeight / 2;
  const shadowBottom =
    baseplateTop + GRAPH_BLASTER_CONSTANTS.SHADOW.Y_OFFSET_FROM_BASEPLATE_TOP;
  const shadowTop = shadowBottom + GRAPH_BLASTER_CONSTANTS.SHADOW.HEIGHT;
  const rubixCubeBottom =
    shadowTop + GRAPH_BLASTER_CONSTANTS.RUBIX_CUBE.Y_OFFSET_FROM_SHADOW_TOP;

  // Calculate rubix cube position (centered at proper height)
  const rubixCubeOrigin = new Vector3(
    origin.X,
    rubixCubeBottom + rubixCubeSize.height / 2,
    origin.Z
  );

  // Generate data and render rubix cube
  rubixCubeService.generateData(rubixCubeOrigin, rubixConfig);
  rubixCubeService.render(layoutModel);

  // Create shadow grid at the correct position (shadowBottom + half height for center)
  const shadowCenterY =
    shadowBottom + GRAPH_BLASTER_CONSTANTS.SHADOW.HEIGHT / 2;
  rubixCubeService.createShadowGrid(undefined, shadowCenterY);

  return { layoutModel, rubixCubeService };
}
