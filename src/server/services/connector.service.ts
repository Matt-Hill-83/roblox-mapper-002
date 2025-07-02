import {
  addConnectors,
  printConnectionColorLegend,
} from "../../shared/modules/connectorMaker";

export class ConnectorService {
  constructor() {
    // Service initialized
  }

  createSecurityConnectors(searchScope?: Instance): void {
    // Print color legend first
    printConnectionColorLegend();

    addConnectors({
      searchScope: searchScope, // Pass the search scope to limit where to find entities
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
