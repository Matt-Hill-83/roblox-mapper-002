import { addConnectors } from "../../shared/modules/connectorMaker";

export class ConnectorService {
  constructor() {
    print("🔗 ConnectorService initialized");
  }

  createSecurityConnectors(): void {
    print("🔗 Creating security connectors...");
    addConnectors();
  }
} 