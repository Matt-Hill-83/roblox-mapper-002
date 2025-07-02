interface RopeLabelConfig {
  ropeIndex: number;
  relationTypeName: string;
  sourceAttachment: Attachment;
  targetAttachment: Attachment;
  parent: Instance;
}

export function createRopeLabel({
  ropeIndex,
  relationTypeName,
  sourceAttachment,
  targetAttachment,
  parent,
}: RopeLabelConfig): Part {
  // Calculate midpoint between attachments
  const midpoint = sourceAttachment.WorldPosition.add(
    targetAttachment.WorldPosition
  ).div(2);

  // Create the green cube
  const cube = new Instance("Part");
  cube.Name = `cube${padNumber(ropeIndex, 3)}-${relationTypeName}-midpoint`;
  cube.Size = new Vector3(1, 1, 1);
  cube.BrickColor = new BrickColor("Bright green");
  cube.Material = Enum.Material.Neon;
  cube.Shape = Enum.PartType.Block;
  cube.Anchored = false;
  cube.CanCollide = false;
  cube.Position = midpoint;
  cube.Parent = parent;

  // Create attachment on the cube
  const cubeAttachment = new Instance("Attachment");
  cubeAttachment.Name = `cubeAtt${padNumber(ropeIndex, 3)}`;
  cubeAttachment.Position = new Vector3(0, 0, 0); // Center of cube
  cubeAttachment.Parent = cube;

  // Create attachment at rope midpoint (invisible part for positioning)
  const midpointPart = new Instance("Part");
  midpointPart.Name = `ropeAnchor${padNumber(ropeIndex, 3)}`;
  midpointPart.Size = new Vector3(0.1, 0.1, 0.1);
  midpointPart.Transparency = 1; // Invisible
  midpointPart.Anchored = true;
  midpointPart.CanCollide = false;
  midpointPart.Position = midpoint;
  midpointPart.Parent = parent;

  const ropeAttachment = new Instance("Attachment");
  ropeAttachment.Name = `ropeAtt${padNumber(ropeIndex, 3)}`;
  ropeAttachment.Position = new Vector3(0, 0, 0);
  ropeAttachment.Parent = midpointPart;

  // Create weld between cube and rope anchor
  const weld = new Instance("WeldConstraint");
  weld.Name = `weld${padNumber(ropeIndex, 3)}-cube-to-rope`;
  weld.Part0 = cube;
  weld.Part1 = midpointPart;
  weld.Parent = cube;

  print(`✅ Created green cube and weld for rope ${ropeIndex}: ${cube.Name}`);

  return cube;
}

function padNumber(num: number, length: number): string {
  const str = tostring(num);
  let result = str;
  while (result.size() < length) {
    result = "0" + result;
  }
  return result;
}
