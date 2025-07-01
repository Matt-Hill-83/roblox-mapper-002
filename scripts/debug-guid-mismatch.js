#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Helper function to extract and analyze GUIDs from relation files
function analyzeRelationGUIDs() {
  const dataDir = path.join(__dirname, "../src/shared/data");

  console.log("🔍 Analyzing what GUIDs actually exist in relation files...\n");

  // Get all relation files
  const relationFiles = fs
    .readdirSync(dataDir)
    .filter((file) => file.startsWith("relation") && file.endsWith("Data.ts"))
    .map((file) => path.join(dataDir, file));

  const allGUIDs = new Set();

  relationFiles.forEach((file) => {
    const fileName = path.basename(file, ".ts");
    console.log(`📄 Analyzing ${fileName}...`);

    try {
      const content = fs.readFileSync(file, "utf8");

      // Extract all GUID patterns
      const guidMatches = content.match(/"[a-fA-F0-9-]{36}"/g) || [];
      const uniqueGuids = [
        ...new Set(guidMatches.map((match) => match.replace(/"/g, ""))),
      ];

      uniqueGuids.forEach((guid) => allGUIDs.add(guid));

      console.log(`   Found ${uniqueGuids.length} unique GUIDs`);

      if (uniqueGuids.length > 0 && uniqueGuids.length <= 5) {
        console.log(`   Examples: ${uniqueGuids.slice(0, 3).join(", ")}`);
      }
    } catch (error) {
      console.error(`   Error: ${error.message}`);
    }

    console.log();
  });

  console.log(
    `🎯 TOTAL UNIQUE GUIDs across all relation files: ${allGUIDs.size}`
  );

  if (allGUIDs.size > 0 && allGUIDs.size <= 20) {
    console.log(`\n📋 All relation GUIDs:`);
    [...allGUIDs].forEach((guid, index) => {
      console.log(`  ${index + 1}. ${guid}`);
    });
  }

  // Now check if these GUIDs appear in entity files
  console.log(`\n🔍 Checking if relation GUIDs appear in entity files...`);

  const entityFiles = fs
    .readdirSync(dataDir)
    .filter((file) => file.startsWith("entity") && file.endsWith("Data.ts"));

  const entityGUIDs = new Set();
  entityFiles.forEach((file) => {
    const filePath = path.join(dataDir, file);
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const guidMatches = content.match(/"guid":\s*"([^"]+)"/g) || [];
      guidMatches.forEach((match) => {
        const guid = match.match(/"([^"]+)"/)[1];
        entityGUIDs.add(guid);
      });
    } catch (error) {
      console.error(`Error reading ${file}: ${error.message}`);
    }
  });

  console.log(`📊 Total entity GUIDs: ${entityGUIDs.size}`);
  console.log(`📊 Total relation GUIDs: ${allGUIDs.size}`);

  const matchingGUIDs = [...allGUIDs].filter((guid) => entityGUIDs.has(guid));
  console.log(`🎯 Matching GUIDs: ${matchingGUIDs.length}`);

  if (matchingGUIDs.length > 0) {
    console.log(`\n✅ GUIDs that match between entities and relations:`);
    matchingGUIDs.forEach((guid) => console.log(`   ${guid}`));
  } else {
    console.log(`\n❌ NO GUIDs match between entity and relation files!`);
    console.log(`   This explains why you have no connections.`);
  }
}

// Run the analysis
analyzeRelationGUIDs();
