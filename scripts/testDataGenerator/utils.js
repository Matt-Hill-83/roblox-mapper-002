/**
 * Utility functions for the test data generator
 */

// Function to generate summary statistics
function generateSummary(cluster, config) {
  let summary = "## Summary Statistics\n\n";

  summary += "### Configuration\n";
  summary += `- Level 1 Nodes: ${config.numLevel1Nodes}\n`;
  summary += `- Level 2 Nodes: ${config.numLevel2Nodes}\n`;
  summary += `- Level 3 Nodes: ${config.numLevel3Nodes}\n`;
  summary += `- Max Children per Node: ${config.childrenPerNode}\n`;
  summary += `- Node Types: ${config.numNodeTypes}\n`;
  summary += `- Link Types: ${config.numLinkTypes}\n\n`;

  summary += "### Generated Data\n";
  summary += `- Total Groups: ${cluster.groups.length}\n`;
  summary += `- Total Nodes: ${cluster.groups.reduce(
    (sum, g) => sum + g.nodes.length,
    0
  )}\n`;

  // Count by type
  const nodesByType = new Map();
  cluster.groups.forEach((group) => {
    group.nodes.forEach((node) => {
      nodesByType.set(node.type, (nodesByType.get(node.type) || 0) + 1);
    });
  });

  summary += "- Nodes by Type:\n";
  nodesByType.forEach((count, type) => {
    summary += `  - ${type}: ${count}\n`;
  });

  summary += `- Total Relations: ${cluster.relations.length}\n`;

  // Count by link type
  const linksByType = new Map();
  cluster.relations.forEach((link) => {
    linksByType.set(link.type, (linksByType.get(link.type) || 0) + 1);
  });

  summary += "- Relations by Type:\n";
  linksByType.forEach((count, type) => {
    summary += `  - ${type}: ${count}\n`;
  });

  return summary;
}

module.exports = {
  generateSummary
};