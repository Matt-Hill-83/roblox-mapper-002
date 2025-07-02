import { createTextBox } from "./TextBoxMaker";

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

  // Calculate direction vector for rope alignment
  const direction = targetAttachment.WorldPosition.sub(
    sourceAttachment.WorldPosition
  ).Unit;

  // Create the elongated block aligned with rope
  const cube = new Instance("Part");
  cube.Name = `cube${padNumber(ropeIndex, 3)}-${relationTypeName}-midpoint`;

  // Set size back to original - long in Z direction
  cube.Size = new Vector3(1, 1, 3); // 3x longer in Z direction (forward)
  cube.BrickColor = new BrickColor("Institutional white"); // Near white brick color
  cube.Material = Enum.Material.Concrete; // Concrete material
  cube.Shape = Enum.PartType.Block;
  cube.Anchored = true; // Anchor it to prevent physics interference
  cube.CanCollide = false;

  // Use CFrame.lookAt to align the Z-axis (long dimension) with rope direction
  cube.CFrame = CFrame.lookAt(midpoint, midpoint.add(direction));

  cube.Parent = parent;

  // Add text boxes to all faces of the cube
  const faces = [
    Enum.NormalId.Front,
    Enum.NormalId.Back,
    Enum.NormalId.Left,
    Enum.NormalId.Right,
    Enum.NormalId.Top,
    Enum.NormalId.Bottom,
  ];

  faces.forEach((face) => {
    createTextBox({
      part: cube,
      face: face,
      text: "TEST",
    });
  });

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

  // Since both parts are anchored, we don't need a weld constraint
  // The cube will stay in position relative to the rope

  print(
    `✅ Created concrete block aligned with rope ${ropeIndex}: ${cube.Name}`
  );

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
