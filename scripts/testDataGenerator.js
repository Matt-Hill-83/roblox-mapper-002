#!/usr/bin/env node

/**
 * Test script for the Simple Data Generator
 * Outputs a Mermaid diagram visualization to a markdown file
 */

const fs = require("fs");
const path = require("path");

// Test configuration object
const TEST_CONFIG = {
  numLevel1Nodes: 3, // 2 root nodes
  numLevel2Nodes: 6, // 6 second-level nodes
  numLevel3Nodes: 12, // 12 third-level nodes
  childrenPerNode: 3, // Max 3 children per parent
  numNodeTypes: 2, // People and Animals
  numLinkTypes: 3, // Owns, Wants, Eats
};

// Constants
const GENERATOR_CONSTANTS = {
  PEOPLE_NAMES: [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
    "Iris",
    "Jack",
  ],
  ANIMAL_NAMES: [
    "Fifi",
    "Bongo",
    "Rex",
    "Luna",
    "Max",
    "Bella",
    "Rocky",
    "Daisy",
    "Shadow",
    "Buddy",
  ],
  ANIMAL_TYPES: [
    "cat",
    "dog",
    "bird",
    "rabbit",
    "hamster",
    "fish",
    "turtle",
    "snake",
    "lizard",
    "parrot",
  ],
};

// Simple mock generator for testing
class MockDataGenerator {
  constructor() {
    this.nodeCounter = 0;
    this.linkCounter = 0;
  }

  generateCluster(config) {
    const cluster = {
      groups: [],
      relations: [],
    };

    // Create nodes
    const allNodes = [];
    const nodesByLevel = new Map();

    // Generate Level 1 nodes
    const level1Nodes = [];
    for (let i = 0; i < config.numLevel1Nodes; i++) {
      const node = this.createNode(1);
      level1Nodes.push(node);
      allNodes.push(node);
    }
    nodesByLevel.set(1, level1Nodes);

    // Generate Level 2 nodes
    const level2Nodes = [];
    for (let i = 0; i < config.numLevel2Nodes; i++) {
      const node = this.createNode(2);
      level2Nodes.push(node);
      allNodes.push(node);
    }
    nodesByLevel.set(2, level2Nodes);

    // Generate Level 3 nodes
    const level3Nodes = [];
    for (let i = 0; i < config.numLevel3Nodes; i++) {
      const node = this.createNode(3);
      level3Nodes.push(node);
      allNodes.push(node);
    }
    nodesByLevel.set(3, level3Nodes);

    // Create main group
    cluster.groups.push({
      id: "group-0",
      name: "Main Group",
      nodes: allNodes,
    });

    // Create hierarchical relationships
    this.createHierarchy(nodesByLevel, config.childrenPerNode, cluster);

    // Create additional relations
    this.createRelations(allNodes, config.numLinkTypes, cluster);

    return cluster;
  }

  createNode(level) {
    const types = ["People", "Animals"];
    const type = types[Math.floor(Math.random() * types.length)];
    const uuid = `h-${this.nodeCounter++}`;

    const node = {
      uuid,
      name: this.getRandomName(type),
      type,
      color: type === "People" ? [0.2, 0.4, 0.8] : [0.8, 0.4, 0.2],
      position: { x: 0, y: 0, z: 0 },
      attachmentNames: [`att001-${uuid}`, `att002-${uuid}`, `att003-${uuid}`],
      properties: {},
    };

    if (type === "People") {
      node.properties.age = Math.floor(Math.random() * (80 - 18) + 18);
    } else {
      node.properties.animalType =
        GENERATOR_CONSTANTS.ANIMAL_TYPES[
          Math.floor(Math.random() * GENERATOR_CONSTANTS.ANIMAL_TYPES.length)
        ];
    }

    return node;
  }

  getRandomName(type) {
    const names =
      type === "People"
        ? GENERATOR_CONSTANTS.PEOPLE_NAMES
        : GENERATOR_CONSTANTS.ANIMAL_NAMES;
    return names[Math.floor(Math.random() * names.length)];
  }

  createHierarchy(nodesByLevel, maxChildren, cluster) {
    // Connect Level 1 to Level 2
    const level1 = nodesByLevel.get(1) || [];
    const level2 = nodesByLevel.get(2) || [];
    this.connectLevels(level1, level2, maxChildren, cluster);

    // Connect Level 2 to Level 3
    const level3 = nodesByLevel.get(3) || [];
    this.connectLevels(level2, level3, maxChildren, cluster);
  }

  connectLevels(parents, children, maxChildren, cluster) {
    if (parents.length === 0 || children.length === 0) return;

    const childrenPerParent = new Map();
    parents.forEach((p) => childrenPerParent.set(p.uuid, 0));

    children.forEach((child, index) => {
      // Find parent with fewest children
      let selectedParent = parents[0];
      let minChildren = maxChildren + 1;

      parents.forEach((parent) => {
        const count = childrenPerParent.get(parent.uuid) || 0;
        if (count < maxChildren && count < minChildren) {
          selectedParent = parent;
          minChildren = count;
        }
      });

      // If all parents are full, distribute evenly
      if (minChildren >= maxChildren) {
        selectedParent = parents[index % parents.length];
      }

      // Create parent-child link
      cluster.relations.push({
        uuid: `link-${this.linkCounter++}`,
        type: "Parent-Child",
        sourceNodeUuid: selectedParent.uuid,
        targetNodeUuid: child.uuid,
        color: [0.5, 0.5, 0.5],
      });

      childrenPerParent.set(
        selectedParent.uuid,
        (childrenPerParent.get(selectedParent.uuid) || 0) + 1
      );
    });
  }

  createRelations(nodes, numLinkTypes, cluster) {
    const linkTypes = ["Owns", "Wants", "Eats", "Link4", "Link5"].slice(
      0,
      numLinkTypes
    );
    const maxLinks = Math.floor(nodes.length * 0.5); // Fewer links for clarity

    for (let i = 0; i < maxLinks; i++) {
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      const target = nodes[Math.floor(Math.random() * nodes.length)];

      if (source.uuid === target.uuid) continue;

      const linkType = linkTypes[Math.floor(Math.random() * linkTypes.length)];

      // Apply some logic constraints
      if (linkType === "Eats" && source.type !== "Animals") continue;
      if (linkType === "Owns" && target.type !== "Animals") continue;

      cluster.relations.push({
        uuid: `link-${this.linkCounter++}`,
        type: linkType,
        sourceNodeUuid: source.uuid,
        targetNodeUuid: target.uuid,
        color: [0.5, 0.5, 0.5],
      });
    }
  }
}

// Function to generate Mermaid diagram
function generateMermaidDiagram(cluster) {
  let mermaid = "```mermaid\ngraph TD\n";

  // Add nodes
  cluster.groups.forEach((group) => {
    group.nodes.forEach((node) => {
      const label = `${node.name}<br/>${node.type}`;
      const shape = node.type === "People" ? `[${label}]` : `(${label})`;
      mermaid += `    ${node.uuid}${shape}\n`;
    });
  });

  mermaid += "\n";

  // Add relations
  cluster.relations.forEach((link) => {
    const arrow = link.type === "Parent-Child" ? "-->" : "-.->";
    const label = link.type !== "Parent-Child" ? `|${link.type}|` : "";
    mermaid += `    ${link.sourceNodeUuid} ${arrow}${label} ${link.targetNodeUuid}\n`;
  });

  // Add styling
  mermaid += "\n";
  mermaid +=
    "    classDef people fill:#3366cc,stroke:#1a3d7a,stroke-width:2px,color:#fff\n";
  mermaid +=
    "    classDef animals fill:#cc6633,stroke:#7a3d1a,stroke-width:2px,color:#fff\n";

  // Apply styles to nodes
  cluster.groups.forEach((group) => {
    const peopleNodes = group.nodes
      .filter((n) => n.type === "People")
      .map((n) => n.uuid)
      .join(",");
    const animalNodes = group.nodes
      .filter((n) => n.type === "Animals")
      .map((n) => n.uuid)
      .join(",");

    if (peopleNodes) mermaid += `    class ${peopleNodes} people\n`;
    if (animalNodes) mermaid += `    class ${animalNodes} animals\n`;
  });

  mermaid += "```";

  return mermaid;
}

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

// Main execution
function main() {
  console.log("Testing Data Generator with configuration:", TEST_CONFIG);

  // Create generator and generate data
  const generator = new MockDataGenerator();
  const cluster = generator.generateCluster(TEST_CONFIG);

  // Generate markdown content
  let markdown = "# Data Generator Test Output\n\n";
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;

  // Add summary
  markdown += generateSummary(cluster, TEST_CONFIG);
  markdown += "\n";

  // Add diagram
  markdown += "## Hierarchical Graph Visualization\n\n";
  markdown += generateMermaidDiagram(cluster);
  markdown += "\n\n";

  // Add node details
  markdown += "## Node Details\n\n";
  cluster.groups.forEach((group) => {
    markdown += `### ${group.name}\n\n`;
    markdown += "| UUID | Name | Type | Properties |\n";
    markdown += "|------|------|------|------------|\n";

    group.nodes.forEach((node) => {
      const props = node.properties ? JSON.stringify(node.properties) : "{}";
      markdown += `| ${node.uuid} | ${node.name} | ${node.type} | ${props} |\n`;
    });
    markdown += "\n";
  });

  // Write to file
  const outputDir = path.join(__dirname, "..", "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputFile = path.join(
    outputDir,
    `data-generator-test-${timestamp}.md`
  );

  fs.writeFileSync(outputFile, markdown);
  console.log(`Output written to: ${outputFile}`);

  // Also log summary to console
  console.log("\nGeneration Summary:");
  console.log(
    `- Total Nodes: ${cluster.groups.reduce(
      (sum, g) => sum + g.nodes.length,
      0
    )}`
  );
  console.log(`- Total Relations: ${cluster.relations.length}`);
}

// Run the test
main();
