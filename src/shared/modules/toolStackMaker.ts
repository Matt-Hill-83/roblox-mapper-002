import { makeSmartHexStack } from "./smartHexStackMaker";

// Import tool data with type assertion
const toolDataArray = [
  {
    name: "snyk",
    spec_description: "snyk for security",
    spec_purpose: "security",
    creation_source: "posthog/posthog_fork/.github",
    guid: "7cd77dc3-c478-e728-98d2-803f4a71482d",
    creation_timestamp: "2025-04-23T18:42:44.399143",
  },
  {
    name: "sonarqube",
    spec_description: "sonarqube for security",
    spec_purpose: "security",
    creation_source: "posthog/posthog_fork/.github",
    guid: "dd315395-93ca-adb3-1e89-66447fd818cd",
    creation_timestamp: "2025-04-23T18:42:44.399184",
  },
  {
    name: "veracode",
    spec_description: "veracode for security",
    spec_purpose: "security",
    creation_source: "posthog/posthog_fork/.github",
    guid: "a5dac4fc-e52d-d824-d2e6-7bf1be92a263",
    creation_timestamp: "2025-04-23T18:42:44.399225",
  },
  {
    name: "checkmarx",
    spec_description: "checkmarx for security",
    spec_purpose: "security",
    creation_source: "posthog/posthog_fork/.github",
    guid: "63513246-3db3-b227-2234-e4d465dca4c1",
    creation_timestamp: "2025-04-23T18:42:44.399266",
  },
  {
    name: "trivy",
    spec_description: "trivy for security",
    spec_purpose: "security",
    creation_source: "posthog/posthog_fork/.github",
    guid: "787bd85b-6113-a68a-fa50-212a216e232d",
    creation_timestamp: "2025-04-23T18:42:44.399307",
  },
];

interface ToolStackConfig {
  id?: string;
  centerPosition?: [number, number, number];
  width?: number;
  height?: number;
  maxItems?: number;
}

interface StackItem {
  name: string;
  labels: string[];
  guid?: string;
}

export function makeToolStack({
  id = "toolStack1",
  centerPosition = [0, 2, 0],
  width = 8,
  height = 2,
  maxItems = 1,
}: ToolStackConfig): Model {
  const stackItemsTools: StackItem[] = [];
  for (let i = 0; i < math.min(maxItems, toolDataArray.size()); i++) {
    const item = toolDataArray[i];
    const labels = [
      item.name,
      item.spec_description,
      item.spec_purpose,
      item.creation_source,
      item.guid,
      item.creation_timestamp,
    ];
    stackItemsTools.push({
      name: item.name,
      labels,
      guid: item.guid,
    });
  }

  const stackModel = makeSmartHexStack({
    id,
    centerPosition,
    width,
    height,
    stackItems: stackItemsTools,
    stackIndex: 5, // Tool stack gets index 5
  });

  return stackModel;
} 