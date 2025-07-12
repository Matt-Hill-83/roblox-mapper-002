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
      parent: mainBlock,
      color: edgeBlockColor,
      nameStub: nameStub,
      nameSuffix: `edge-${string.format("%02d", edgeIndex)}`,
    });
  }

  // Define the 12 edges of a cube
  // Bottom face edges (4) - X-aligned
  createEdgeBlock(
    position.add(new Vector3(0, -halfY + halfThickness, -halfZ + halfThickness)),
    new Vector3(size.X + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET),
    1
  );
  createEdgeBlock(
    position.add(new Vector3(0, -halfY + halfThickness, halfZ - halfThickness)),
    new Vector3(size.X + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET),
    2
  );
  
  // Bottom face edges (4) - Z-aligned
  createEdgeBlock(
    position.add(new Vector3(-halfX + halfThickness, -halfY + halfThickness, 0)),
    new Vector3(edgeThickness + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET, size.Z + Z_FIGHTING_OFFSET),
    3
  );
  createEdgeBlock(
    position.add(new Vector3(halfX - halfThickness, -halfY + halfThickness, 0)),
    new Vector3(edgeThickness + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET, size.Z + Z_FIGHTING_OFFSET),
    4
  );

  // Top face edges (4) - X-aligned
  createEdgeBlock(
    position.add(new Vector3(0, halfY - halfThickness, -halfZ + halfThickness)),
    new Vector3(size.X + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET),
    5
  );
  createEdgeBlock(
    position.add(new Vector3(0, halfY - halfThickness, halfZ - halfThickness)),
    new Vector3(size.X + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET),
    6
  );
  
  // Top face edges (4) - Z-aligned
  createEdgeBlock(
    position.add(new Vector3(-halfX + halfThickness, halfY - halfThickness, 0)),
    new Vector3(edgeThickness + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET, size.Z + Z_FIGHTING_OFFSET),
    7
  );
  createEdgeBlock(
    position.add(new Vector3(halfX - halfThickness, halfY - halfThickness, 0)),
    new Vector3(edgeThickness + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET, size.Z + Z_FIGHTING_OFFSET),
    8
  );

  // Vertical edges (4) - Y-aligned
  createEdgeBlock(
    position.add(new Vector3(-halfX + halfThickness, 0, -halfZ + halfThickness)),
    new Vector3(edgeThickness + Z_FIGHTING_OFFSET, size.Y + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET),
    9
  );
  createEdgeBlock(
    position.add(new Vector3(halfX - halfThickness, 0, -halfZ + halfThickness)),
    new Vector3(edgeThickness + Z_FIGHTING_OFFSET, size.Y + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET),
    10
  );
  createEdgeBlock(
    position.add(new Vector3(halfX - halfThickness, 0, halfZ - halfThickness)),
    new Vector3(edgeThickness + Z_FIGHTING_OFFSET, size.Y + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET),
    11
  );
  createEdgeBlock(
    position.add(new Vector3(-halfX + halfThickness, 0, halfZ - halfThickness)),
    new Vector3(edgeThickness + Z_FIGHTING_OFFSET, size.Y + Z_FIGHTING_OFFSET, edgeThickness + Z_FIGHTING_OFFSET),
    12
  );

  // Set parent if provided
  if (parent) {
    wireframeModel.Parent = parent;
  }

  return wireframeModel;
}