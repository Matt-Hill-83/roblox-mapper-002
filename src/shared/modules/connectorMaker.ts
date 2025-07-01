import { allRelationData } from "../data";

interface ConnectorConfig {
  parent?: Instance;
  relationTypes?: string[]; // Which types of relations to create connectors for
}

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
  const allModels = game.Workspace.GetDescendants().filter((desc: Instance) => 
    desc.IsA("Model") && 
    desc.GetAttribute("guid") === guid
  );
  
  if (allModels.size() > 0) {
    print(`Found hexagon with GUID ${guid}: ${allModels[0].Name}`);
    return allModels[0] as Model;
  }
  
  // If not found by GUID, also search for hexagon patterns in the names
  const hexagons = game.Workspace.GetDescendants().filter((desc: Instance) => 
    desc.IsA("Model") && 
    (desc.Name.sub(1, 1) === "h" || desc.Name.find("hex") !== undefined)
  );
  
  print(`Searching ${hexagons.size()} hexagon models for GUID ${guid}`);
  for (const hexagon of hexagons) {
    if (hexagon.GetAttribute("guid") === guid) {
      print(`Found hexagon with GUID ${guid} in secondary search: ${hexagon.Name}`);
      return hexagon as Model;
    }
  }
  
  print(`Warning: Could not find hexagon with GUID: ${guid}`);
  return undefined;
}

function findAttachmentRecursive(model: Instance, attachmentName: string): Attachment | undefined {
  for (const desc of model.GetDescendants()) {
    if (desc.IsA("Attachment") && desc.Name === attachmentName) return desc as Attachment;
  }
  return undefined;
}

export function addConnectors({ 
  parent = game.Workspace, 
  relationTypes = ["relationSecures"] 
}: ConnectorConfig = {}): void {
  print("🔗 Creating connectors...");
  print(`🔗 Requested relation types: ${relationTypes.join(", ")}`);
  print(`🔗 Total available relation types: ${allRelationData.size()}`);

  // Create a folder for all connectors
  const connectorsFolder = new Instance("Folder");
  connectorsFolder.Name = "Connectors";
  connectorsFolder.Parent = parent;

  let ropeIndex = 1;
  let totalConnectors = 0;

  // Process each requested relation type
  for (const relationType of relationTypes) {
    // Find the relation data for this type
    const relationInfo = allRelationData.find(rel => rel.name === relationType);
    if (!relationInfo) {
      print(`Warning: Relation type '${relationType}' not found`);
      print(`Available types: ${allRelationData.map(rel => rel.name).join(", ")}`);
      continue;
    }

    print(`🔗 Creating ${relationType} connectors...`);
    const relationData = relationInfo.data;
    print(`🔗 Found ${relationData.size()} relations for type ${relationType}`);

    for (const relation of relationData) {
      const sourceHexagon = findHexagonByGuid(relation.source_guid);
      const targetHexagon = findHexagonByGuid(relation.target_guid);

      if (sourceHexagon && targetHexagon) {
        // Find center attachments (att000)
        const sourceAttachment = findAttachmentRecursive(sourceHexagon, "att000-" + sourceHexagon.Name);
        const targetAttachment = findAttachmentRecursive(targetHexagon, "att000-" + targetHexagon.Name);

        if (sourceAttachment && targetAttachment) {
          // Create rope constraint for connections
          const rope = new Instance("RopeConstraint");
          const relationTypeName = relationType.sub(9).lower(); // Remove "relation" prefix and lowercase
          rope.Name = `rope${padNumber(ropeIndex, 3)}-${relationTypeName}-${sourceHexagon.Name}-to-${targetHexagon.Name}`;
          rope.Attachment0 = sourceAttachment;
          rope.Attachment1 = targetAttachment;
          // Make the rope a bit longer for sag
          rope.Length = (sourceAttachment.WorldPosition.sub(targetAttachment.WorldPosition)).Magnitude * 1.0001;
          rope.Visible = true;
          rope.Color = new BrickColor("Bright red"); // Red color for connections
          rope.Thickness = 0.4; // Thickness of the rope
          rope.Parent = connectorsFolder;

          print(`Created rope ${rope.Name} from ${sourceHexagon.Name} to ${targetHexagon.Name}`);
          ropeIndex++;
          totalConnectors++;
        } else {
          print(`Warning: Could not find center attachments for ${sourceHexagon.Name} or ${targetHexagon.Name}`);
          if (!sourceAttachment) print(`  Missing source attachment: att000-${sourceHexagon.Name}`);
          if (!targetAttachment) print(`  Missing target attachment: att000-${targetHexagon.Name}`);
        }
      } else {
        print(`Warning: Could not find hexagons for GUIDs ${relation.source_guid} or ${relation.target_guid}`);
        if (!sourceHexagon) print(`  Missing source hexagon with GUID: ${relation.source_guid}`);
        if (!targetHexagon) print(`  Missing target hexagon with GUID: ${relation.target_guid}`);
      }
    }
  }

  print(`Created ${totalConnectors} total connectors`);
} 