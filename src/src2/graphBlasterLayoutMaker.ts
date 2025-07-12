import { makeBlock } from "./validation/blockMaker/index";
import { wireframeBlockMaker } from "./validation/wireframeBlockMaker";
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
  
  // Create platform wireframe block using shadow dimensions
  const shadowDimensions = rubixCubeService.calcXZShadowDimensions();
  if (shadowDimensions) {
    const platformHeight = 0.5; // Thin platform
    const platformY = baseplateTop; // Coincident with foundation top
    
    wireframeBlockMaker({
      position: new Vector3(origin.X, platformY + platformHeight / 2, origin.Z),
      size: new Vector3(shadowDimensions.width, platformHeight, shadowDimensions.depth),
      parent: layoutModel,
      nameStub: "platform",
      nameSuffix: "shadow-footprint",
      transparency: 0.5,
      color: new Color3(1, 0.75, 0.8), // Pink
      edgeWidth: 0.1,
      edgeBlockColor: new Color3(0.8, 0.6, 0.65), // Darker pink for edges
    });
    
    // Create XZWall wireframe block (platform size + 20 units) coincident with platform
    const xzWallModel = wireframeBlockMaker({
      position: new Vector3(origin.X, platformY + platformHeight / 2, origin.Z),
      size: new Vector3(shadowDimensions.width + 20, 1, shadowDimensions.depth + 20),
      parent: layoutModel,
      nameStub: "XZWall",
      nameSuffix: "floor",
      transparency: 0, // Fully opaque
      color: new Color3(0.5, 0.7, 1), // Light blue
      edgeWidth: 0.2,
      edgeBlockColor: new Color3(0.7, 0.85, 1), // Lighter blue edges
    });
    
    // Set CanCollide to true on the main block
    const mainBlock = xzWallModel.FindFirstChild("XZWall-main") as Part;
    if (mainBlock) {
      mainBlock.CanCollide = true;
    }
    
    // Create vertical walls at edges of XZWall
    const wallHeight = 50; // Reasonable height for walls
    const wallThickness = 1; // 1 unit thick as specified
    
    // XYWall - runs along X axis, parallel to Y axis (at negative Z edge)
    const xyWallModel = wireframeBlockMaker({
      position: new Vector3(
        origin.X, 
        platformY + wallHeight / 2, 
        origin.Z - (shadowDimensions.depth + 20) / 2
      ),
      size: new Vector3(shadowDimensions.width + 20, wallHeight, wallThickness),
      parent: layoutModel,
      nameStub: "XYWall",
      nameSuffix: "back",
      transparency: 0, // Fully opaque
      color: new Color3(0.5, 0.7, 1), // Light blue
      edgeWidth: 0.2,
      edgeBlockColor: new Color3(0.7, 0.85, 1), // Lighter blue edges
    });
    
    // Set CanCollide to false on XYWall main block
    const xyWallMainBlock = xyWallModel.FindFirstChild("XYWall-main") as Part;
    if (xyWallMainBlock) {
      xyWallMainBlock.CanCollide = false;
    }
    
    // ZYWall - runs along Z axis, parallel to Y axis (at negative X edge)
    const zyWallModel = wireframeBlockMaker({
      position: new Vector3(
        origin.X - (shadowDimensions.width + 20) / 2,
        platformY + wallHeight / 2,
        origin.Z
      ),
      size: new Vector3(wallThickness, wallHeight, shadowDimensions.depth + 20),
      parent: layoutModel,
      nameStub: "ZYWall",
      nameSuffix: "left",
      transparency: 0, // Fully opaque
      color: new Color3(0.5, 0.7, 1), // Light blue
      edgeWidth: 0.2,
      edgeBlockColor: new Color3(0.7, 0.85, 1), // Lighter blue edges
    });
    
    // Set CanCollide to false on ZYWall main block
    const zyWallMainBlock = zyWallModel.FindFirstChild("ZYWall-main") as Part;
    if (zyWallMainBlock) {
      zyWallMainBlock.CanCollide = false;
    }
    
    // Create shadow projections on the XY wall (back wall)
    const xyWallZ = origin.Z - (shadowDimensions.depth + 20) / 2 + wallThickness / 2;
    rubixCubeService.createXYShadowProjections(layoutModel, xyWallZ);
    
    // Create shadow projections on the ZY wall (left wall)
    const zyWallX = origin.X - (shadowDimensions.width + 20) / 2 + wallThickness / 2;
    rubixCubeService.createZYShadowProjections(layoutModel, zyWallX);
  }

  return { layoutModel, rubixCubeService };
}
