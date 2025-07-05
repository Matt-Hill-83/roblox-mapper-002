import { TestDataConfig } from "../app/(pages)/hierarchy-tester/page";

export const initialConfig: TestDataConfig = {
  // Basic parameters (legacy)
  numberOfNodes: 10,
  numberOfConnectedChains: 1,
  depthOfLongestChain: 2,

  // Advanced parameters
  totalNodes: 10,
  maxDepth: 2,
  branchingMin: 2,
  branchingMax: 2,
  crossTreeConnections: 0, // 0%
  entityTypes: 2,
  connectorTypes: 1,
  clusteringCoeff: 0, // 0%
  hubNodes: 0,
  networkDensity: "sparse",
};