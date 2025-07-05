import { GeneratorConfig } from "../../shared/interfaces/simpleDataGenerator.interface";

export const config001: Partial<GeneratorConfig> = {
  numGroups: 1, // 2 main groups
  numLevels: 5, // 2 hierarchy levels
  numBranches: 3, // 2 branches per parent
  numNodeTypes: 2, // Both People and Animals
  numLinkTypes: 3, // All link types (Owns, Wants, Eats)
};
