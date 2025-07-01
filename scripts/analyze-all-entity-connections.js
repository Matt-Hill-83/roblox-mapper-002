#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Helper function to extract GUIDs from a TypeScript data file
function extractGUIDs(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const guidMatches = content.match(/"guid":\s*"([^"]+)"/g);
    if (!guidMatches) return [];

    return guidMatches.map((match) => {
      const guid = match.match(/"([^"]+)"/)[1];
      return guid;
    });
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

// Helper function to extract source_guid and target_guid from relation files
function extractRelationGUIDs(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const sourceGuidMatches =
      content.match(/"source_guid":\s*"([^"]+)"/g) || [];
    const targetGuidMatches =
      content.match(/"target_guid":\s*"([^"]+)"/g) || [];

    const sourceGuids = sourceGuidMatches.map(
      (match) => match.match(/"([^"]+)"/)[1]
    );
    const targetGuids = targetGuidMatches.map(
      (match) => match.match(/"([^"]+)"/)[1]
    );

    return [...sourceGuids, ...targetGuids];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

// Main script
function analyzeAllEntityConnections() {
  const dataDir = path.join(__dirname, "../src/shared/data");

  console.log(
    "🔍 Analyzing ALL entity types for relationship connections...\n"
  );

  // Get all entity files
  const entityFiles = fs
    .readdirSync(dataDir)
    .filter((file) => file.startsWith("entity") && file.endsWith("Data.ts"))
    .map((file) => path.join(dataDir, file));

  // Get all relation files and collect all relation GUIDs
  const relationFiles = fs
    .readdirSync(dataDir)
    .filter((file) => file.startsWith("relation") && file.endsWith("Data.ts"))
    .map((file) => path.join(dataDir, file));

  const allRelationGUIDs = new Set();
  relationFiles.forEach((file) => {
    const relationGUIDs = extractRelationGUIDs(file);
    relationGUIDs.forEach((guid) => allRelationGUIDs.add(guid));
  });

  console.log(
    `📊 Total unique GUIDs in all relation files: ${allRelationGUIDs.size}\n`
  );

  // Analyze each entity type
  const results = [];

  entityFiles.forEach((file) => {
    const entityType = path.basename(file, ".ts").replace("Data", "");
    const entityGUIDs = extractGUIDs(file);

    const connectedGUIDs = entityGUIDs.filter((guid) =>
      allRelationGUIDs.has(guid)
    );
    const connectionRate =
      entityGUIDs.length > 0
        ? (connectedGUIDs.length / entityGUIDs.length) * 100
        : 0;

    results.push({
      entityType,
      totalCount: entityGUIDs.length,
      connectedCount: connectedGUIDs.length,
      connectionRate,
      connectedGUIDs,
    });
  });

  // Sort by connection rate (descending)
  results.sort((a, b) => b.connectionRate - a.connectionRate);

  console.log("📈 ENTITY CONNECTION ANALYSIS (sorted by connection rate):\n");
  console.log(
    "Entity Type".padEnd(25) +
      "Total".padEnd(8) +
      "Connected".padEnd(12) +
      "Rate".padEnd(8) +
      "Status"
  );
  console.log("─".repeat(70));

  results.forEach((result) => {
    const status =
      result.connectionRate === 0
        ? "❌ Isolated"
        : result.connectionRate < 50
        ? "🔶 Sparse"
        : "✅ Well connected";

    console.log(
      result.entityType.padEnd(25) +
        result.totalCount.toString().padEnd(8) +
        result.connectedCount.toString().padEnd(12) +
        `${result.connectionRate.toFixed(1)}%`.padEnd(8) +
        status
    );
  });

  // Find the most connected entity types
  const wellConnected = results.filter((r) => r.connectionRate > 0);

  console.log(`\n🎯 SUMMARY:`);
  console.log(`📋 Total entity types: ${results.length}`);
  console.log(`✅ Entity types with connections: ${wellConnected.length}`);
  console.log(
    `❌ Entity types without connections: ${
      results.length - wellConnected.length
    }`
  );

  if (wellConnected.length > 0) {
    console.log(`\n🏆 TOP CONNECTED ENTITY TYPES (for visualization):`);
    wellConnected.slice(0, 5).forEach((result, index) => {
      console.log(
        `  ${index + 1}. ${result.entityType}: ${result.connectedCount}/${
          result.totalCount
        } (${result.connectionRate.toFixed(1)}%)`
      );
    });

    console.log(`\n💡 RECOMMENDATION:`);
    console.log(
      `   Focus your entity ring on the top connected entity types for maximum connections.`
    );
    console.log(
      `   Consider using only: ${wellConnected
        .slice(0, 8)
        .map((r) => r.entityType)
        .join(", ")}`
    );
  }
}

// Run the script
analyzeAllEntityConnections();
