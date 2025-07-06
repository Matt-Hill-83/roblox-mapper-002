import { createTextBox } from "./TextBoxMaker";

interface LabelGroupConfig {
  ropeIndex: number;
  sourceText: string;
  relationText: string;
  targetText: string;
  sourceAttachment: Attachment;
  targetAttachment: Attachment;
  parent: Instance;
  props?: { [key: string]: any };
}

function padNumber(num: number, length: number): string {
  const str = tostring(num);
  let result = str;
  while (result.size() < length) {
    result = "0" + result;
  }
  return result;
}

export function createLabelGroup({
  ropeIndex,
  sourceText,
  relationText,
  targetText,
  sourceAttachment,
  targetAttachment,
  parent,
  props = {},
}: LabelGroupConfig): Model {
  // Default properties for each label block
  const defaultProps = {
    size: new Vector3(1, 1, 3),
    brickColor: new BrickColor("Institutional white"),
    material: Enum.Material.Concrete,
    transparency: 0,
    spacing: 0.1,
  };

  // Merge default props with passed props
  const finalProps = {
    ...defaultProps,
    ...props,
  };

  // Calculate midpoint between attachments
  const midpoint = sourceAttachment.WorldPosition.add(
    targetAttachment.WorldPosition
  ).div(2);

  // Calculate direction vector for rope alignment
  const direction = targetAttachment.WorldPosition.sub(
    sourceAttachment.WorldPosition
  ).Unit;

  // Create a group to hold all three blocks
  const labelGroup = new Instance("Model");
  labelGroup.Name = `labelGroup${padNumber(
    ropeIndex,
    3
  )}-${sourceText}-${relationText}-${targetText}`;
  labelGroup.Parent = parent;

  // Calculate positions for the three blocks along the rope direction
  // Total length needed: 3 blocks + 2 gaps = 3 * blockLength + 2 * spacing
  const blockLength = finalProps.size.Z;
  const totalLength = 3 * blockLength + 2 * finalProps.spacing;
  const startOffset = -totalLength / 2;

  // Block positions along the rope direction
  const positions = [
    startOffset + blockLength / 2, // First block (source)
    startOffset + blockLength + finalProps.spacing + blockLength / 2, // Second block (relation)
    startOffset + 2 * blockLength + 2 * finalProps.spacing + blockLength / 2, // Third block (target)
  ];

  const texts = [sourceText, relationText, targetText];
  const blocks: Part[] = [];

  // Create three blocks
  for (let i = 0; i < 3; i++) {
    const cube = new Instance("Part");
    cube.Name = `block${i + 1}-${texts[i]}-${padNumber(ropeIndex, 3)}`;

    // Set properties
    cube.Size = finalProps.size;
    cube.BrickColor = finalProps.brickColor;
    cube.Material = finalProps.material;
    cube.Transparency = finalProps.transparency;
    cube.Shape = Enum.PartType.Block;
    cube.Anchored = false; // Unanchored so it can follow the rope
    cube.CanCollide = false;

    // Position the block along the rope direction
    const blockPosition = midpoint.add(direction.mul(positions[i]));
    // Create CFrame that aligns the block's Z axis (long dimension) with the rope direction
    // CFrame.lookAt points -Z at target, but we want +Z along the rope, so we rotate 180 degrees
    const lookAtCFrame = CFrame.lookAt(blockPosition, blockPosition.add(direction));
    // Rotate 180 degrees around Y axis to align +Z with rope direction
    cube.CFrame = lookAtCFrame.mul(CFrame.Angles(0, math.pi, 0));

    cube.Parent = labelGroup;
    blocks.push(cube);

    // Add text boxes to all faces except the small ends (front/back)
    const faces = [
      Enum.NormalId.Left,
      Enum.NormalId.Right,
      Enum.NormalId.Top,
      Enum.NormalId.Bottom,
    ];

    faces.forEach((face) => {
      createTextBox({
        part: cube,
        face: face,
        text: texts[i],
      });
    });

    // Create attachment on the center block (relation block)
    if (i === 1) {
      const cubeAttachment = new Instance("Attachment");
      cubeAttachment.Name = `groupAtt${padNumber(ropeIndex, 3)}`;
      cubeAttachment.Position = new Vector3(0, 0, 0);
      cubeAttachment.Parent = cube;
    }
  }

  // Create attachment at rope midpoint (invisible part for positioning)
  const midpointPart = new Instance("Part");
  midpointPart.Name = `ropeAnchor${padNumber(ropeIndex, 3)}`;
  midpointPart.Size = new Vector3(0.1, 0.1, 0.1);
  midpointPart.Transparency = 1; // Invisible
  midpointPart.Anchored = false; // Unanchored to follow rope physics
  midpointPart.CanCollide = false;
  midpointPart.Position = midpoint;
  midpointPart.Parent = parent;

  const ropeAttachment = new Instance("Attachment");
  ropeAttachment.Name = `ropeAtt${padNumber(ropeIndex, 3)}`;
  ropeAttachment.Position = new Vector3(0, 0, 0);
  ropeAttachment.Parent = midpointPart;
  
  // Create a RodConstraint to connect the midpoint part to the rope's midpoint
  // This will keep the labels positioned at the rope's midpoint
  const rodConstraint = new Instance("RodConstraint");
  rodConstraint.Name = `labelRod${padNumber(ropeIndex, 3)}`;
  rodConstraint.Attachment0 = ropeAttachment;
  rodConstraint.Attachment1 = sourceAttachment; // Connect to one of the rope's attachments
  rodConstraint.Length = sourceAttachment.WorldPosition.sub(midpoint).Magnitude;
  rodConstraint.Parent = midpointPart;
  
  // Create another rod to the target for stability
  const rodConstraint2 = new Instance("RodConstraint");
  rodConstraint2.Name = `labelRod2${padNumber(ropeIndex, 3)}`;
  rodConstraint2.Attachment0 = ropeAttachment;
  rodConstraint2.Attachment1 = targetAttachment;
  rodConstraint2.Length = targetAttachment.WorldPosition.sub(midpoint).Magnitude;
  rodConstraint2.Parent = midpointPart;
  
  // Weld each block to the midpoint part
  for (let i = 0; i < blocks.size(); i++) {
    const weld = new Instance("WeldConstraint");
    weld.Name = `labelWeld${i + 1}`;
    weld.Part0 = blocks[i];
    weld.Part1 = midpointPart;
    weld.Parent = blocks[i];
  }

  return labelGroup;
}
