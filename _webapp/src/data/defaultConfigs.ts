import { TestDataConfig } from "../app/(pages)/hierarchy-tester/page";

export const initialConfig: TestDataConfig = {
  // Basic parameters (legacy)
  numberOfNodes: 15,
  numberOfConnectedChains: 3,
  depthOfLongestChain: 3,

  // Advanced parameters
  totalNodes: 50,
  maxDepth: 4,
  branchingMin: 2,
  branchingMax: 5,
  crossTreeConnections: 15, // 15%
  entityTypes: 4,
  connectorTypes: 3,
  clusteringCoeff: 30, // 30%
  hubNodes: 2,
  networkDensity: "medium",
};