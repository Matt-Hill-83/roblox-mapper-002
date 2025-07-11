/**
 * Rope and connector creation logic
 * 
 * TEST: Using RodConstraints instead of Beams
 * - Testing visual appearance and performance
 * - RodConstraints provide simpler cylindrical connections
 * - May have different performance characteristics
 */

import { Cluster, Link } from "../../../interfaces/simpleDataGenerator.interface";
import { createRopeLabel as createRopeLabelFromMaker } from "../../ropeLabelMaker/ropeLabelMaker";
import { RENDERER_CONSTANTS } from "./constants";
import { padNumber } from "../../../utils/stringUtils";
import { VisualizationOptions } from "../../../interfaces/enhancedGenerator.interface";
import { LINK_COLORS } from "../constants/robloxColors";

interface RopeCreationContext {
  cluster: Cluster;
  nodeToHexagon: Map<string, Model>;
  linksFolder: Folder;
  visualization?: VisualizationOptions;
  linkDiameter?: number;
}

/**
 * Creates rope connectors between hexagons based on relationships
 */
export function createRopeConnectors(context: RopeCreationContext): void {
  const { cluster, nodeToHexagon, linksFolder, visualization, linkDiameter } = context;
  
  // Check if connectors should be shown
  const showConnectors = visualization?.showConnectors ?? false;
  const showLinkLabels = visualization?.showLinkLabels ?? true;
  
  // Early return if connectors are disabled
  if (!showConnectors) {
    return;
  }
  
  let ropeIndex = 1;
  
  cluster.relations.forEach(link => {
    const sourceHex = nodeToHexagon.get(link.sourceNodeUuid);
    const targetHex = nodeToHexagon.get(link.targetNodeUuid);
    
    if (sourceHex && targetHex) {
      
      // Find center attachments
      const sourceAttachment = findCenterAttachment(sourceHex);
      const targetAttachment = findCenterAttachment(targetHex);
      
      if (sourceAttachment && targetAttachment) {
        // Create rod connector
        const rod = createRope(link, sourceHex, targetHex, sourceAttachment, targetAttachment, ropeIndex, linkDiameter);
        
        // Parent rod to links folder
        rod.Parent = linksFolder;
        
        // Create rope label only if showLinkLabels is true
        if (showLinkLabels) {
          const labelParent = findCenterCube(targetHex) || findCenterCube(sourceHex) || linksFolder;
          createRopeLabel(
            sourceHex, 
            targetHex, 
            link, 
            sourceAttachment, 
            targetAttachment, 
            labelParent,
            ropeIndex
          );
        }
        
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
 * Create a rod connector (testing physical cylinder part instead of Beam)
 */
function createRope(
  link: Link,
  sourceHex: Model,
  targetHex: Model,
  sourceAttachment: Attachment,
  targetAttachment: Attachment,
  ropeIndex: number,
  linkDiameter?: number
): Part {
  // Get world positions of attachments
  const sourcePos = sourceAttachment.WorldPosition;
  const targetPos = targetAttachment.WorldPosition;
  
  // Calculate cylinder properties
  const distance = sourcePos.sub(targetPos).Magnitude;
  const midpoint = sourcePos.add(targetPos).div(2);
  const direction = targetPos.sub(sourcePos).Unit;
  
  // Create cylinder part
  const cylinder = new Instance("Part");
  cylinder.Name = `rod${padNumber(ropeIndex, 3)}-${link.type.lower()}-${link.sourceNodeUuid}-to-${link.targetNodeUuid}`;
  cylinder.Shape = Enum.PartType.Cylinder;
  cylinder.Material = Enum.Material.Concrete;
  cylinder.TopSurface = Enum.SurfaceType.Smooth;
  cylinder.BottomSurface = Enum.SurfaceType.Smooth;
  cylinder.CastShadow = false;
  
  // Set size
  const diameter = linkDiameter ?? RENDERER_CONSTANTS.ROPE.THICKNESS;
  cylinder.Size = new Vector3(distance, diameter, diameter);
  
  // Set color using LINK_COLORS array
  const color3 = getLinkColor3(link.type);
  cylinder.Color = color3;
  
  // Position and orient the cylinder
  cylinder.CFrame = CFrame.lookAt(midpoint, midpoint.add(direction))
    .mul(CFrame.Angles(0, math.rad(90), 0));
  
  // Make it non-collidable
  cylinder.CanCollide = false;
  cylinder.CanQuery = false;
  cylinder.CanTouch = false;
  cylinder.Anchored = true;
  
  return cylinder;
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
  const relationName = `${getNodeName(sourceHex)}_${link.type}_${getNodeName(targetHex)}`;
  
  createRopeLabelFromMaker({
    ropeIndex,
    relationTypeName: link.type,
    sourceAttachment,
    targetAttachment,
    parent: labelParent,
    relationName
  });
}

/**
 * Get Color3 for link type using LINK_COLORS array
 */
function getLinkColor3(linkType: string): Color3 {
  // Extract numeric part from link type (e.g., "Link1" -> 1, "Link10" -> 10)
  const match = linkType.match("[0-9]+");
  if (match && match[0]) {
    const linkIndex = tonumber(match[0]);
    if (linkIndex && linkIndex > 0 && linkIndex <= LINK_COLORS.size()) {
      return LINK_COLORS[linkIndex - 1]; // Array is 0-indexed
    }
  }
  
  // Fallback for non-numeric link types or out of range
  // Use hash of link type string to consistently assign a color
  let hash = 0;
  for (let i = 1; i <= linkType.size(); i++) {
    const char = linkType.sub(i, i);
    hash = ((hash << 5) - hash) + char.byte()[0];
    hash = hash & hash; // Convert to 32bit integer
  }
  const colorIndex = math.abs(hash) % LINK_COLORS.size();
  return LINK_COLORS[colorIndex];
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

