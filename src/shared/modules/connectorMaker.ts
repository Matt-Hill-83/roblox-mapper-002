// Security relation data
const relationSecuresData = [
  {
    guid: "e93c9673-be57-7748-c7e9-528e562f803c",
    name: "snyk_secures_plugin_vm",
    source_guid: "7cd77dc3-c478-e728-98d2-803f4a71482d",
    source_type: "tool",
    target_guid: "2f890722-8a97-b54c-0a99-d9740869b2f3",
    target_type: "component",
    creation_timestamp: "2025-04-23T18:42:44.399163",
    creation_source: "posthog/posthog_fork/.github",
  },
  {
    guid: "30b06eb0-ee9e-2cb5-2ee2-ed0e511431ae",
    name: "sonarqube_secures_plugin_scheduler",
    source_guid: "dd315395-93ca-adb3-1e89-66447fd818cd",
    source_type: "tool",
    target_guid: "601fe84b-df42-86f0-ed9c-a76a71ea4b4a",
    target_type: "component",
    creation_timestamp: "2025-04-23T18:42:44.399205",
    creation_source: "posthog/posthog_fork/.github",
  },
  {
    guid: "9912b70b-1eef-fd93-bb9e-13322d0ca0e0",
    name: "veracode_secures_plugin_vm",
    source_guid: "a5dac4fc-e52d-d824-d2e6-7bf1be92a263",
    source_type: "tool",
    target_guid: "2f890722-8a97-b54c-0a99-d9740869b2f3",
    target_type: "component",
    creation_timestamp: "2025-04-23T18:42:44.399246",
    creation_source: "posthog/posthog_fork/.github",
  },
  {
    guid: "ab55f86e-bcf6-86cd-c943-c95069497236",
    name: "checkmarx_secures_notebook_components",
    source_guid: "63513246-3db3-b227-2234-e4d465dca4c1",
    source_type: "tool",
    target_guid: "9fa09542-12cc-cd21-a475-811c74c89038",
    target_type: "component",
    creation_timestamp: "2025-04-23T18:42:44.399287",
    creation_source: "posthog/posthog_fork/.github",
  },
  {
    guid: "342f278b-a3b3-307f-e0ed-491191daefe2",
    name: "trivy_secures_hogql_service",
    source_guid: "787bd85b-6113-a68a-fa50-212a216e232d",
    source_type: "tool",
    target_guid: "b2b7a571-6084-c563-ba64-cb3d22c1dd6f",
    target_type: "component",
    creation_timestamp: "2025-04-23T18:42:44.399328",
    creation_source: "posthog/posthog_fork/.github",
  },
];

interface ConnectorConfig {
  parent?: Instance;
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
  const hexagons = game.Workspace.GetDescendants().filter((desc: Instance) => 
    desc.IsA("Model") && 
    desc.Name.sub(1, 1) === "h" && 
    desc.GetAttribute("guid") === guid
  );
  return hexagons[0] as Model;
}

export function addConnectors({ parent = game.Workspace }: ConnectorConfig = {}): void {
  print("🔗 Creating security connectors...");

  // Create a folder for all connectors
  const connectorsFolder = new Instance("Folder");
  connectorsFolder.Name = "SecurityConnectors";
  connectorsFolder.Parent = parent;

  let ropeIndex = 1;

  for (const relation of relationSecuresData) {
    const sourceHexagon = findHexagonByGuid(relation.source_guid);
    const targetHexagon = findHexagonByGuid(relation.target_guid);

    if (sourceHexagon && targetHexagon) {
      // Find center attachments (att000)
      const sourceAttachment = sourceHexagon.FindFirstChild("att000-" + sourceHexagon.Name) as Attachment;
      const targetAttachment = targetHexagon.FindFirstChild("att000-" + targetHexagon.Name) as Attachment;

      if (sourceAttachment && targetAttachment) {
        // Create beam instead of rope for better TypeScript support
        const beam = new Instance("Beam");
        beam.Name = `beam${padNumber(ropeIndex, 3)}-secures-${sourceHexagon.Name}-to-${targetHexagon.Name}`;
        beam.Attachment0 = sourceAttachment;
        beam.Attachment1 = targetAttachment;
        beam.Width0 = 0.1;
        beam.Width1 = 0.1;
        beam.FaceCamera = true;
        beam.Color = new ColorSequence(new Color3(1, 0, 0)); // Red color for security connections
        beam.Parent = connectorsFolder;

        print(`Created beam ${beam.Name} from ${sourceHexagon.Name} to ${targetHexagon.Name}`);
        ropeIndex++;
      } else {
        print(`Warning: Could not find center attachments for ${sourceHexagon.Name} or ${targetHexagon.Name}`);
      }
    } else {
      print(`Warning: Could not find hexagons for GUIDs ${relation.source_guid} or ${relation.target_guid}`);
    }
  }

  print(`Created ${ropeIndex - 1} security connectors`);
} 