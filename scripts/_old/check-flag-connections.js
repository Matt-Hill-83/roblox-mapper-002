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
function checkFlagConnections() {
  const dataDir = path.join(__dirname, "../src/shared/data");

  console.log("🔍 Checking entity flag GUIDs against relation files...\n");

  // Get all entity flag GUIDs
  const entityFlagPath = path.join(dataDir, "entityFlagData.ts");
  const flagGUIDs = extractGUIDs(entityFlagPath);
  console.log(`📋 Found ${flagGUIDs.length} entity flag GUIDs`);

  // Get all relation files
  const relationFiles = fs
    .readdirSync(dataDir)
    .filter((file) => file.startsWith("relation") && file.endsWith("Data.ts"))
    .map((file) => path.join(dataDir, file));

  console.log(`📋 Found ${relationFiles.length} relation files to check\n`);

  // Collect all relation GUIDs
  const allRelationGUIDs = new Set();
  const relationFileResults = {};

  relationFiles.forEach((file) => {
    const fileName = path.basename(file, ".ts");
    const relationGUIDs = extractRelationGUIDs(file);
    relationFileResults[fileName] = relationGUIDs;

    relationGUIDs.forEach((guid) => allRelationGUIDs.add(guid));

    console.log(`📄 ${fileName}: ${relationGUIDs.length} GUIDs`);
  });

  console.log(
    `\n📊 Total unique GUIDs in all relation files: ${allRelationGUIDs.size}`
  );

  // Check which flag GUIDs appear in relations
  const flagsInRelations = [];
  const flagsNotInRelations = [];

  flagGUIDs.forEach((flagGUID) => {
    if (allRelationGUIDs.has(flagGUID)) {
      flagsInRelations.push(flagGUID);
    } else {
      flagsNotInRelations.push(flagGUID);
    }
  });

  console.log(`\n🎯 RESULTS:`);
  console.log(`✅ Entity flags WITH connections: ${flagsInRelations.length}`);
  console.log(
    `❌ Entity flags WITHOUT connections: ${flagsNotInRelations.length}`
  );
  console.log(
    `📈 Connection rate: ${(
      (flagsInRelations.length / flagGUIDs.length) *
      100
    ).toFixed(1)}%`
  );

  if (flagsInRelations.length > 0) {
    console.log(`\n🔗 Entity flags that appear in relations:`);
    flagsInRelations.forEach((guid, index) => {
      // Find which relation files contain this GUID
      const appearingIn = [];
      Object.entries(relationFileResults).forEach(([fileName, guids]) => {
        if (guids.includes(guid)) {
          appearingIn.push(fileName.replace("Data", ""));
        }
      });

      console.log(`  ${index + 1}. ${guid} (in: ${appearingIn.join(", ")})`);
    });
  }

  if (flagsNotInRelations.length > 0 && flagsNotInRelations.length <= 10) {
    console.log(`\n❌ Entity flags with NO connections (first 10):`);
    flagsNotInRelations.slice(0, 10).forEach((guid, index) => {
      console.log(`  ${index + 1}. ${guid}`);
    });
    if (flagsNotInRelations.length > 10) {
      console.log(`  ... and ${flagsNotInRelations.length - 10} more`);
    }
  }
}

// Run the script
checkFlagConnections();
