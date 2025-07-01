import {
  addConnectors,
  printConnectionColorLegend,
} from "../../shared/modules/connectorMaker";

export class ConnectorService {
  constructor() {
    // Service initialized
  }

  createSecurityConnectors(): void {
    // Print color legend first
    printConnectionColorLegend();

    addConnectors({
      relationTypes: [
        "relationSecures",
        "relationDependsOn",
        "relationUses",
        "relationContains",
        "relationCreates",
        "relationManages",
        "relationOwns",
        "relationMaintains",
      ],
    });
  }
}
