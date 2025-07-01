import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const relationsSourcePath = path.join(
  __dirname,
  "../src/_data/_cleaned/relations"
);
const relationsTargetPath = path.join(__dirname, "../src/shared/data");

// Read all .js files from relations folder
const relationFiles = fs
  .readdirSync(relationsSourcePath)
  .filter((file) => file.endsWith(".js"));

console.log(`Found ${relationFiles.length} relation files to convert`);

relationFiles.forEach((file) => {
  const sourcePath = path.join(relationsSourcePath, file);
  const targetFileName = file.replace(".js", ".ts");
  const targetPath = path.join(relationsTargetPath, targetFileName);

  // Read the JavaScript file
  let content = fs.readFileSync(sourcePath, "utf8");

  // Convert to TypeScript:
  // 1. Replace the weird \r keys with clean keys
  content = content.replace(/("creation_source\\r")/g, '"creation_source"');
  content = content.replace(/\r/g, "");

  // 2. Add TypeScript interface
  const variableName = file
    .replace(".js", "")
    .replace("relation", "relation")
    .replace("Data", "Data");

  const tsContent = `// Auto-converted from ${file}
export interface RelationData {
  guid: string;
  name: string;
  source_guid: string;
  source_type: string;
  target_guid: string;
  target_type: string;
  creation_timestamp: string;
  creation_source: string;
}

${content}`;

  // Write the TypeScript file
  fs.writeFileSync(targetPath, tsContent);
  console.log(`Converted ${file} -> ${targetFileName}`);
});

console.log("Conversion complete!");
