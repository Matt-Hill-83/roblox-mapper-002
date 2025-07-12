import { makeBlock } from "./blockMaker/index";

export interface WireframeBlockConfig {
  position: Vector3;
  size: Vector3;
  parent?: Instance;
  nameStub?: string;
  edgeThickness?: number;
  mainBlockTransparency?: number;
  mainBlockColor?: Color3;
  edgeBlockColor?: Color3;
}

export function wireframeBlockMaker(config: WireframeBlockConfig): Model {
  const {
    position,
    size,
    parent,
    nameStub = "wireframe",
    edgeThickness = 2,
    mainBlockTransparency = 0.5,
    mainBlockColor = new Color3(0.5, 0.5, 0.5),
    edgeBlockColor = new Color3(0.2, 0.2, 0.2),
  } = config;

  // Z-fighting prevention offset
  const Z_FIGHTING_OFFSET = 0.01;

  // Create container model
  const wireframeModel = new Instance("Model");
  wireframeModel.Name = `${nameStub}-block`;
  
  // Create main transparent block
  const mainBlock = makeBlock({
    position,
    size,
    parent: wireframeModel,
    transparency: mainBlockTransparency,
    color: mainBlockColor,
    nameStub: nameStub,
    nameSuffix: "main",
  });

  // Create sub-models for organization
  const edgeBlocksModel = new Instance("Model");
  edgeBlocksModel.Name = "Edge Blocks";
  edgeBlocksModel.Parent = mainBlock;

  const cornerCubesModel = new Instance("Model");
  cornerCubesModel.Name = "Corner Cubes";
  cornerCubesModel.Parent = mainBlock;

  // Calculate half sizes for positioning
  const halfX = size.X / 2;
  const halfY = size.Y / 2;
  const halfZ = size.Z / 2;
  const halfThickness = edgeThickness / 2;

  // Helper function to create a single edge block
  function createEdgeBlock(
    centerPos: Vector3,
    edgeSize: Vector3,
    edgeIndex: number
  ): void {
    makeBlock({
      position: centerPos,
      size: edgeSize,
      parent: edgeBlocksModel,
      color: edgeBlockColor,
      nameStub: nameStub,
      nameSuffix: `edge-${string.format("%02d", edgeIndex)}`,
    });
  }

  // Pre-calculate common values
  const edgeWithOffset = edgeThickness + Z_FIGHTING_OFFSET;
  const xLength = size.X - edgeThickness * 2 + Z_FIGHTING_OFFSET;
  const yLength = size.Y - edgeThickness * 2 + Z_FIGHTING_OFFSET;
  const zLength = size.Z - edgeThickness * 2 + Z_FIGHTING_OFFSET;

  // Edge definitions [position offset, size, index]
  const edgeDefinitions: [Vector3, Vector3, number][] = [
    // Bottom face - X-aligned
    [new Vector3(0, -halfY + halfThickness, -halfZ + halfThickness), new Vector3(xLength, edgeWithOffset, edgeWithOffset), 1],
    [new Vector3(0, -halfY + halfThickness, halfZ - halfThickness), new Vector3(xLength, edgeWithOffset, edgeWithOffset), 2],
    // Bottom face - Z-aligned
    [new Vector3(-halfX + halfThickness, -halfY + halfThickness, 0), new Vector3(edgeWithOffset, edgeWithOffset, zLength), 3],
    [new Vector3(halfX - halfThickness, -halfY + halfThickness, 0), new Vector3(edgeWithOffset, edgeWithOffset, zLength), 4],
    // Top face - X-aligned
    [new Vector3(0, halfY - halfThickness, -halfZ + halfThickness), new Vector3(xLength, edgeWithOffset, edgeWithOffset), 5],
    [new Vector3(0, halfY - halfThickness, halfZ - halfThickness), new Vector3(xLength, edgeWithOffset, edgeWithOffset), 6],
    // Top face - Z-aligned
    [new Vector3(-halfX + halfThickness, halfY - halfThickness, 0), new Vector3(edgeWithOffset, edgeWithOffset, zLength), 7],
    [new Vector3(halfX - halfThickness, halfY - halfThickness, 0), new Vector3(edgeWithOffset, edgeWithOffset, zLength), 8],
    // Vertical - Y-aligned
    [new Vector3(-halfX + halfThickness, 0, -halfZ + halfThickness), new Vector3(edgeWithOffset, yLength, edgeWithOffset), 9],
    [new Vector3(halfX - halfThickness, 0, -halfZ + halfThickness), new Vector3(edgeWithOffset, yLength, edgeWithOffset), 10],
    [new Vector3(halfX - halfThickness, 0, halfZ - halfThickness), new Vector3(edgeWithOffset, yLength, edgeWithOffset), 11],
    [new Vector3(-halfX + halfThickness, 0, halfZ - halfThickness), new Vector3(edgeWithOffset, yLength, edgeWithOffset), 12],
  ];

  // Create all edges
  edgeDefinitions.forEach(([offset, edgeSize, index]) => {
    createEdgeBlock(position.add(offset), edgeSize, index);
  });

  // Create corner cubes (8 corners)
  const cornerSize = new Vector3(edgeWithOffset, edgeWithOffset, edgeWithOffset);
  const xPositions = [-halfX + halfThickness, halfX - halfThickness];
  const yPositions = [-halfY + halfThickness, halfY - halfThickness];
  const zPositions = [-halfZ + halfThickness, halfZ - halfThickness];

  let cornerIndex = 1;
  yPositions.forEach((y) => {
    zPositions.forEach((z) => {
      xPositions.forEach((x) => {
        makeBlock({
          position: position.add(new Vector3(x, y, z)),
          size: cornerSize,
          parent: cornerCubesModel,
          color: edgeBlockColor,
          nameStub: nameStub,
          nameSuffix: `corner-${string.format("%02d", cornerIndex)}`,
        });
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