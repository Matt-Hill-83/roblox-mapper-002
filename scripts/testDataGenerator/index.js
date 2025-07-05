#!/usr/bin/env node

/**
 * Test script for the Simple Data Generator
 * Outputs a Mermaid diagram visualization to a markdown file
 */

const fs = require("fs");
const path = require("path");

// Import modules
const { TEST_CONFIG } = require('./constants');
const MockDataGenerator = require('./MockDataGenerator');
const generateMermaidDiagram = require('./mermaidDiagram');
const generateDrawIoDiagram = require('./drawIoDiagram');
const { generateSummary } = require('./utils');

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

  // Add diagrams
  markdown += "## Hierarchical Graph Visualization\n\n";
  markdown += "### Mermaid Diagram\n\n";
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
  const outputDir = path.join(__dirname, "..", "..", "output");
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
  
  // Generate draw.io file
  const drawioXml = generateDrawIoDiagram(cluster);
  const drawioFile = path.join(
    outputDir,
    `data-generator-diagram-${timestamp}.drawio`
  );
  fs.writeFileSync(drawioFile, drawioXml);
  console.log(`Draw.io diagram written to: ${drawioFile}`);

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