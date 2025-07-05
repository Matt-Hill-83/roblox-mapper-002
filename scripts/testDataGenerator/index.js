#!/usr/bin/env node

/**
 * Test script for the Simple Data Generator
 * Outputs a draw.io diagram visualization
 */

const fs = require("fs");
const path = require("path");

// Import modules
const { TEST_CONFIG } = require('./constants');
const MockDataGenerator = require('./MockDataGenerator');
const generateDrawIoDiagram = require('./drawIoDiagram');
const { generateSummary } = require('./utils');

// Main execution
function main() {
  console.log("Testing Data Generator with configuration:", TEST_CONFIG);

  // Create generator and generate data
  const generator = new MockDataGenerator();
  const cluster = generator.generateCluster(TEST_CONFIG);

  // Create output directory
  const outputDir = path.join(__dirname, "..", "..", "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  
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