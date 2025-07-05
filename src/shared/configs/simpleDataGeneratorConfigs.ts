import { GeneratorConfig } from "../../shared/interfaces/simpleDataGenerator.interface";

export const config001: Partial<GeneratorConfig> = {
  numLevel1Nodes: 1,   // 1 root node
  numLevel2Nodes: 6,   // 6 second-level nodes
  numLevel3Nodes: 12,  // 12 third-level nodes
  childrenPerNode: 3,  // Max 3 children per parent
  numNodeTypes: 2,     // Both People and Animals
  numLinkTypes: 3,     // All link types (Owns, Wants, Eats)
};
