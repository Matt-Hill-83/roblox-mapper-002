import { allRelationData } from "../data";
import { RopeLabelService } from "./ropeLabelService";

interface ConnectorConfig {
  parent?: Instance;
  relationTypes?: string[]; // Which types of relations to create connectors for
}

// Color mapping for different relation types
const relationColors: Record<string, BrickColor> = {
  relationSecures: new BrickColor("Bright red"), // Red for security
  relationDependsOn: new BrickColor("Bright blue"), // Blue for dependencies
  relationUses: new BrickColor("Bright green"), // Green for usage
  relationContains: new BrickColor("Bright yellow"), // Yellow for containment
  relationCreates: new BrickColor("Bright orange"), // Orange for creation
  relationManages: new BrickColor("Bright violet"), // Violet for management
  relationOwns: new BrickColor("Brown"), // Brown for ownership
  relationMaintains: new BrickColor("Dark green"), // Dark green for maintenance
  relationControls: new BrickColor("Light blue"), // Light blue for control
  relationConsumes: new BrickColor("Pink"), // Pink for consumption
  relationExposes: new BrickColor("Cyan"), // Cyan for exposure
  relationMonitors: new BrickColor("White"), // White for monitoring
  relationTests: new BrickColor("Lime green"), // Lime green for testing
  relationDeployedIn: new BrickColor("Nougat"), // Nougat for deployment
  relationDeployedTo: new BrickColor("Light blue"), // Light blue for deployment target
  relationProvidedBy: new BrickColor("Lavender"), // Lavender for provision
  relationUsedBy: new BrickColor("Teal"), // Teal for reverse usage
  relationBelongsTo: new BrickColor("Light orange"), // Light orange for belonging
  relationMemberOf: new BrickColor("Lavender"), // Lavender for membership
  relationPartOf: new BrickColor("Light orange"), // Light orange for parts
  relationDefinedIn: new BrickColor("Mint"), // Mint for definitions
  relationPackagedAs: new BrickColor("Bright orange"), // Bright orange for packaging
  relationTracksErrors: new BrickColor("Magenta"), // Magenta for error tracking
};

function padNumber(num: number, length: number): string {
  const str = tostring(num);
  let result = str;
  while (result.size() < length) {
    result = "0" + result;
  }
  return result;
}

function findHexagonByGuid(guid: string): Model | undefined {
  // Search for any hexagon model with the matching GUID
  const allModels = game.Workspace.GetDescendants().filter(
    (desc: Instance) => desc.IsA("Model") && desc.GetAttribute("guid") === guid
  );

  if (allModels.size() > 0) {
    return allModels[0] as Model;
  }

  // If not found by GUID, also search for hexagon patterns in the names
  const hexagons = game.Workspace.GetDescendants().filter(
    (desc: Instance) =>
      desc.IsA("Model") &&
      (desc.Name.sub(1, 1) === "h" || desc.Name.find("hex") !== undefined)
  );

  for (const hexagon of hexagons) {
    if (hexagon.GetAttribute("guid") === guid) {
      return hexagon as Model;
    }
  }

  return undefined;
}

function findAttachmentRecursive(
  model: Instance,
  attachmentName: string
): Attachment | undefined {
  for (const desc of model.GetDescendants()) {
    if (desc.IsA("Attachment") && desc.Name === attachmentName)
      return desc as Attachment;
  }
  return undefined;
}

export function addConnectors({
  parent = game.Workspace,
  relationTypes = ["relationSecures"],
}: ConnectorConfig = {}): void {
  // First, collect all available GUIDs in the workspace
  const availableGUIDs = new Set<string>();
  const allModels = game.Workspace.GetDescendants().filter((desc: Instance) =>
    desc.IsA("Model")
  );
  for (const model of allModels) {
    const guid = model.GetAttribute("guid") as string;
    if (guid) {
      availableGUIDs.add(guid);
    }
  }

  print(
    `🔍 DIAGNOSTIC: Found ${availableGUIDs.size()} models with GUIDs in workspace`
  );

  // Create a folder for all connectors
  const connectorsFolder = new Instance("Folder");
  connectorsFolder.Name = "Connectors";
  connectorsFolder.Parent = parent;

  let ropeIndex = 1;
  let totalConnectors = 0;
  let totalPossibleConnections = 0;

  // Process each requested relation type
  for (const relationType of relationTypes) {
    // Find the relation data for this type
    const relationInfo = allRelationData.find(
      (rel) => rel.name === relationType
    );
    if (!relationInfo) {
      continue;
    }

    const relationData = relationInfo.data;
    totalPossibleConnections += relationData.size();

    // Filter relations to only include ones where both GUIDs exist in workspace
    const validRelations = relationData.filter(
      (relation) =>
        availableGUIDs.has(relation.source_guid) &&
        availableGUIDs.has(relation.target_guid)
    );

    const relationColor =
      relationColors[relationType] || new BrickColor("Bright red");
    print(
      `🔍 ${relationType}: ${relationData.size()} total, ${validRelations.size()} valid for workspace (Color: ${
        relationColor.Name
      })`
    );

    for (const relation of validRelations) {
      const sourceHexagon = findHexagonByGuid(relation.source_guid);
      const targetHexagon = findHexagonByGuid(relation.target_guid);

      if (sourceHexagon && targetHexagon) {
        // Find center attachments (att000)
        const sourceAttachment = findAttachmentRecursive(
          sourceHexagon,
          "att000-" + sourceHexagon.Name
        );
        const targetAttachment = findAttachmentRecursive(
          targetHexagon,
          "att000-" + targetHexagon.Name
        );

        if (sourceAttachment && targetAttachment) {
          // Create rope constraint for connections
          const rope = new Instance("RopeConstraint");
          const relationTypeName = relationType.sub(9).lower(); // Remove "relation" prefix and lowercase
          rope.Name = `rope${padNumber(ropeIndex, 3)}-${relationTypeName}-${
            sourceHexagon.Name
          }-to-${targetHexagon.Name}`;
          rope.Attachment0 = sourceAttachment;
          rope.Attachment1 = targetAttachment;
          // Make the rope a bit longer for sag
          rope.Length =
            sourceAttachment.WorldPosition.sub(targetAttachment.WorldPosition)
              .Magnitude * 1.0001;
          rope.Visible = true;
          // Use color from mapping, fallback to red if type not found
          rope.Color =
            relationColors[relationType] || new BrickColor("Bright red");
          rope.Thickness = 0.4; // Thickness of the rope
          rope.Parent = connectorsFolder;

          // Create green cube at rope midpoint using the service
          const ropeLabelService = RopeLabelService.getInstance();
          ropeLabelService.createLabel(
            ropeIndex,
            relationTypeName,
            sourceAttachment,
            targetAttachment,
            connectorsFolder,
            relation.name
          );

          ropeIndex++;
          totalConnectors++;
        }
      }
    }
  }

  print(
    `🔍 FINAL RESULTS: Created ${totalConnectors} connectors out of ${totalPossibleConnections} total possible relations`
  );
}

export function printConnectionColorLegend(): void {
  print("🎨 CONNECTION COLOR LEGEND:");
  for (const [relationType, color] of pairs(relationColors)) {
    const displayName = relationType.sub(9); // Remove "relation" prefix
    print(`  ${displayName}: ${color.Name}`);
  }
}
