/**
 * Rope and connector creation logic
 */

import { Cluster, Link } from "../../../shared/interfaces/simpleDataGenerator.interface";
import { RopeLabelService } from "../../../shared/modules/ropeLabelService";
import { RENDERER_CONSTANTS } from "./constants";

interface RopeCreationContext {
  cluster: Cluster;
  nodeToHexagon: Map<string, Model>;
  linksFolder: Folder;
}

/**
 * Creates rope connectors between hexagons based on relationships
 */
export function createRopeConnectors(context: RopeCreationContext): void {
  const { cluster, nodeToHexagon, linksFolder } = context;
  let ropeIndex = 1;
  
  cluster.relations.forEach(link => {
    const sourceHex = nodeToHexagon.get(link.sourceNodeUuid);
    const targetHex = nodeToHexagon.get(link.targetNodeUuid);
    
    if (sourceHex && targetHex) {
      // Find center attachments
      const sourceAttachment = findCenterAttachment(sourceHex);
      const targetAttachment = findCenterAttachment(targetHex);
      
      if (sourceAttachment && targetAttachment) {
        // Create rope
        const rope = createRope(link, sourceHex, targetHex, sourceAttachment, targetAttachment, ropeIndex);
        
        // Parent rope to target's center cube
        const targetCenterCube = findCenterCube(targetHex);
        rope.Parent = targetCenterCube || linksFolder;
        
        // Create rope label
        createRopeLabel(
          sourceHex, 
          targetHex, 
          link, 
          sourceAttachment, 
          targetAttachment, 
          targetCenterCube || findCenterCube(sourceHex) || linksFolder,
          ropeIndex
        );
        
        ropeIndex++;
      }
    }
  });
}

/**
 * Find center attachment on a hexagon
 */
function findCenterAttachment(hexagon: Model): Attachment | undefined {
  // First try the expected pattern
  let attachment = findAttachmentRecursive(hexagon, `att000-${hexagon.Name}`);
  
  if (!attachment) {
    // Find any attachment starting with att000
    for (const desc of hexagon.GetDescendants()) {
      if (desc.IsA("Attachment") && desc.Name.sub(1, 6) === "att000") {
        attachment = desc as Attachment;
        break;
      }
    }
  }
  
  return attachment;
}

/**
 * Find attachment recursively in a model
 */
function findAttachmentRecursive(model: Instance, attachmentName: string): Attachment | undefined {
  for (const desc of model.GetDescendants()) {
    if (desc.IsA("Attachment") && desc.Name === attachmentName) {
      return desc as Attachment;
    }
  }
  return undefined;
}

/**
 * Find center cube in a hexagon
 */
function findCenterCube(hexagon: Model): Part | undefined {
  let centerCube = hexagon.FindFirstChild("center") as Part;
  if (!centerCube) {
    const children = hexagon.GetChildren();
    for (const child of children) {
      if (child.IsA("Part") && child.Name.find("centerCube-") !== undefined) {
        centerCube = child as Part;
        break;
      }
    }
  }
  return centerCube;
}

/**
 * Create a rope constraint
 */
function createRope(
  link: Link,
  sourceHex: Model,
  targetHex: Model,
  sourceAttachment: Attachment,
  targetAttachment: Attachment,
  ropeIndex: number
): RopeConstraint {
  const rope = new Instance("RopeConstraint");
  rope.Name = `rope${padNumber(ropeIndex, 3)}-${link.type.lower()}-${sourceHex.Name}-to-${targetHex.Name}`;
  rope.Attachment0 = sourceAttachment;
  rope.Attachment1 = targetAttachment;
  
  // Set rope length to exact distance (no sag)
  rope.Length = sourceAttachment.WorldPosition.sub(targetAttachment.WorldPosition).Magnitude * 
    RENDERER_CONSTANTS.ROPE.LENGTH_MULTIPLIER;
  
  rope.Visible = true;
  rope.Color = getLinkBrickColor(link.type);
  rope.Thickness = RENDERER_CONSTANTS.ROPE.THICKNESS;
  
  return rope;
}

/**
 * Create rope label
 */
function createRopeLabel(
  sourceHex: Model,
  targetHex: Model,
  link: Link,
  sourceAttachment: Attachment,
  targetAttachment: Attachment,
  labelParent: Instance,
  ropeIndex: number
): void {
  const ropeLabelService = RopeLabelService.getInstance();
  const relationName = `${getNodeName(sourceHex)}_${link.type}_${getNodeName(targetHex)}`;
  
  ropeLabelService.createLabel(
    ropeIndex,
    link.type,
    sourceAttachment,
    targetAttachment,
    labelParent,
    relationName
  );
}

/**
 * Get BrickColor for link type
 */
function getLinkBrickColor(linkType: string): BrickColor {
  return RENDERER_CONSTANTS.LINK_COLORS[linkType as keyof typeof RENDERER_CONSTANTS.LINK_COLORS] || 
    RENDERER_CONSTANTS.DEFAULT_COLOR;
}

/**
 * Get node name from hexagon model for label creation
 */
function getNodeName(hexagon: Model): string {
  // Try to find a text label inside the hexagon that contains the node name
  const textLabels = hexagon.GetDescendants().filter(desc => 
    desc.IsA("TextLabel") || desc.IsA("BillboardGui")
  );
  
  if (textLabels.size() > 0) {
    const firstLabel = textLabels[0];
    if (firstLabel.IsA("TextLabel")) {
      return firstLabel.Text;
    } else if (firstLabel.IsA("BillboardGui")) {
      const textLabel = firstLabel.FindFirstChildOfClass("TextLabel");
      if (textLabel) {
        return textLabel.Text;
      }
    }
  }
  
  // Fallback to hexagon name
  return hexagon.Name;
}

/**
 * Pad number with leading zeros
 */
function padNumber(num: number, length: number): string {
  const str = tostring(num);
  let result = str;
  while (result.size() < length) {
    result = "0" + result;
  }
  return result;
}