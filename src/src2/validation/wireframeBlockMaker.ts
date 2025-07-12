import { makeBlock } from "./blockMaker/index";
import { IBlockMakerConfig } from "./blockMaker/standardizedInterfaces";

export interface WireframeBlockConfig extends IBlockMakerConfig {
  edgeThicknessRatio?: number; // Ratio of edge thickness to block size (default 0.2)
  edgeWidth?: number; // Absolute edge width (overrides edgeThicknessRatio if provided)
  edgeBlockColor?: Color3;
  labelProps?: Partial<TextLabel>; // Label property overrides
  overrideProps?: {
    mainBlock?: {
      transparency?: number;
      [key: string]: any;
    };
    edges?: {
      transparency?: number;
      [key: string]: any;
    };
  };
}

export function wireframeBlockMaker(config: WireframeBlockConfig): Model {
  const {
    position = new Vector3(0, 0, 0),
    size = new Vector3(10, 10, 10),
    parent,
    nameStub = "wireframe",
    edgeThicknessRatio = 0.2,
    edgeWidth,
    edgeBlockColor = new Color3(0.2, 0.2, 0.2),
    transparency = 0.5,
    labelProps,
    overrideProps,
  } = config;

  // Z-fighting prevention offset
  const Z_FIGHTING_OFFSET = 0.001;

  // Calculate edge thickness - use absolute width if provided, otherwise use ratio
  let edgeThickness: number;
  if (edgeWidth !== undefined) {
    edgeThickness = edgeWidth;
  } else {
    const minDimension = math.min(
      typeIs(size, "Vector3") ? size.X : size[0],
      typeIs(size, "Vector3") ? size.Y : size[1],
      typeIs(size, "Vector3") ? size.Z : size[2]
    );
    edgeThickness = minDimension * edgeThicknessRatio;
  }

  // Create container model
  const wireframeModel = new Instance("Model");
  wireframeModel.Name = `${nameStub}-block`;

  // Determine main block transparency
  const mainBlockTransparency = overrideProps?.mainBlock?.transparency ?? transparency;
  
  // Create main transparent block with all passed-in props
  const mainBlock = makeBlock({
    position,
    size,
    parent: wireframeModel,
    transparency: mainBlockTransparency,
    nameStub: nameStub,
    nameSuffix: "main",
    color: config.color,
    labels: config.labels,
    material: config.material,
    anchored: config.anchored,
    castShadow: config.castShadow,
    backgroundColor: config.backgroundColor,
    borderColor: config.borderColor,
    textColor: config.textColor,
    labelBackgroundTransparency: config.labelBackgroundTransparency,
    labelProps: labelProps,
  });
  
  // Apply any additional mainBlock overrides
  if (overrideProps?.mainBlock && mainBlock) {
    for (const [key, value] of pairs(overrideProps.mainBlock)) {
      if (key !== "transparency" && key in mainBlock) {
        (mainBlock as any)[key] = value;
      }
    }
  }

  // Create sub-models for organization
  const edgeBlocksModel = new Instance("Model");
  edgeBlocksModel.Name = "Edge Blocks";
  edgeBlocksModel.Parent = mainBlock;

  const cornerCubesModel = new Instance("Model");
  cornerCubesModel.Name = "Corner Cubes";
  cornerCubesModel.Parent = mainBlock;

  // Calculate half sizes for positioning
  const sizeVec = typeIs(size, "Vector3")
    ? size
    : new Vector3(size[0], size[1], size[2]);
  const halfX = sizeVec.X / 2;
  const halfY = sizeVec.Y / 2;
  const halfZ = sizeVec.Z / 2;
  const halfThickness = edgeThickness / 2;

  // Determine edge transparency
  const edgeTransparency = overrideProps?.edges?.transparency ?? 0;
  
  // Helper function to create a single edge block
  function createEdgeBlock(
    centerPos: Vector3,
    edgeSize: Vector3,
    edgeIndex: number
  ): void {
    const edgeBlock = makeBlock({
      position: centerPos,
      size: edgeSize,
      parent: edgeBlocksModel,
      color: edgeBlockColor,
      nameStub: nameStub,
      nameSuffix: `edge-${string.format("%02d", edgeIndex)}`,
      transparency: edgeTransparency,
    });
    
    // Apply any additional edge overrides
    if (overrideProps?.edges && edgeBlock) {
      for (const [key, value] of pairs(overrideProps.edges)) {
        if (key !== "transparency" && key in edgeBlock) {
          (edgeBlock as any)[key] = value;
        }
      }
    }
  }

  // Pre-calculate common values
  const edgeWithOffset = edgeThickness + Z_FIGHTING_OFFSET;
  const xLength = sizeVec.X - edgeThickness * 2 + Z_FIGHTING_OFFSET;
  const yLength = sizeVec.Y - edgeThickness * 2 + Z_FIGHTING_OFFSET;
  const zLength = sizeVec.Z - edgeThickness * 2 + Z_FIGHTING_OFFSET;

  // Edge definitions [position offset, size, index]
  const edgeDefinitions: [Vector3, Vector3, number][] = [
    // Bottom face - X-aligned
    [
      new Vector3(0, -halfY + halfThickness, -halfZ + halfThickness),
      new Vector3(xLength, edgeWithOffset, edgeWithOffset),
      1,
    ],
    [
      new Vector3(0, -halfY + halfThickness, halfZ - halfThickness),
      new Vector3(xLength, edgeWithOffset, edgeWithOffset),
      2,
    ],
    // Bottom face - Z-aligned
    [
      new Vector3(-halfX + halfThickness, -halfY + halfThickness, 0),
      new Vector3(edgeWithOffset, edgeWithOffset, zLength),
      3,
    ],
    [
      new Vector3(halfX - halfThickness, -halfY + halfThickness, 0),
      new Vector3(edgeWithOffset, edgeWithOffset, zLength),
      4,
    ],
    // Top face - X-aligned
    [
      new Vector3(0, halfY - halfThickness, -halfZ + halfThickness),
      new Vector3(xLength, edgeWithOffset, edgeWithOffset),
      5,
    ],
    [
      new Vector3(0, halfY - halfThickness, halfZ - halfThickness),
      new Vector3(xLength, edgeWithOffset, edgeWithOffset),
      6,
    ],
    // Top face - Z-aligned
    [
      new Vector3(-halfX + halfThickness, halfY - halfThickness, 0),
      new Vector3(edgeWithOffset, edgeWithOffset, zLength),
      7,
    ],
    [
      new Vector3(halfX - halfThickness, halfY - halfThickness, 0),
      new Vector3(edgeWithOffset, edgeWithOffset, zLength),
      8,
    ],
    // Vertical - Y-aligned
    [
      new Vector3(-halfX + halfThickness, 0, -halfZ + halfThickness),
      new Vector3(edgeWithOffset, yLength, edgeWithOffset),
      9,
    ],
    [
      new Vector3(halfX - halfThickness, 0, -halfZ + halfThickness),
      new Vector3(edgeWithOffset, yLength, edgeWithOffset),
      10,
    ],
    [
      new Vector3(halfX - halfThickness, 0, halfZ - halfThickness),
      new Vector3(edgeWithOffset, yLength, edgeWithOffset),
      11,
    ],
    [
      new Vector3(-halfX + halfThickness, 0, halfZ - halfThickness),
      new Vector3(edgeWithOffset, yLength, edgeWithOffset),
      12,
    ],
  ];

  // Create all edges
  edgeDefinitions.forEach(([offset, edgeSize, index]) => {
    createEdgeBlock(position.add(offset), edgeSize, index);
  });

  // Create corner cubes (8 corners)
  const cornerSize = new Vector3(
    edgeWithOffset,
    edgeWithOffset,
    edgeWithOffset
  );
  const xPositions = [-halfX + halfThickness, halfX - halfThickness];
  const yPositions = [-halfY + halfThickness, halfY - halfThickness];
  const zPositions = [-halfZ + halfThickness, halfZ - halfThickness];

  let cornerIndex = 1;
  yPositions.forEach((y) => {
    zPositions.forEach((z) => {
      xPositions.forEach((x) => {
        const cornerBlock = makeBlock({
          position: position.add(new Vector3(x, y, z)),
          size: cornerSize,
          parent: cornerCubesModel,
          color: edgeBlockColor,
          nameStub: nameStub,
          nameSuffix: `corner-${string.format("%02d", cornerIndex)}`,
          transparency: edgeTransparency,
        });
        
        // Apply any additional edge overrides to corner cubes
        if (overrideProps?.edges && cornerBlock) {
          for (const [key, value] of pairs(overrideProps.edges)) {
            if (key !== "transparency" && key in cornerBlock) {
              (cornerBlock as any)[key] = value;
            }
          }
        }
        
        cornerIndex++;
      });
    });
  });

  // Set parent if provided
  if (parent) {
    wireframeModel.Parent = parent;
  }

  return wireframeModel;
}
