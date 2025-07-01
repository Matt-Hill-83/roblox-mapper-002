import { addConnectors } from "../../shared/modules/connectorMaker";

export class ConnectorService {
  constructor() {
    // Service initialized
  }

  createSecurityConnectors(): void {
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
