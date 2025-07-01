import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the data folder
const dataFolderPath = path.join(__dirname, "../src/shared/data");
const outputPath = path.join(__dirname, "../src/shared/data/index.ts");

// Read all .ts files (excluding index.ts)
const allFiles = fs
  .readdirSync(dataFolderPath)
  .filter((file) => file.endsWith(".ts") && file !== "index.ts")
  .map((file) => file.replace(".ts", ""));

// Separate entity and relation files
const entityFiles = allFiles.filter((file) => file.startsWith("entity"));
const relationFiles = allFiles.filter((file) => file.startsWith("relation"));

// Generate export statements for all files
const allExports = allFiles
  .map((file) => {
    return `export { ${file} } from "./${file}";`;
  })
  .join("\n");

// Generate import statements for entities
const entityImports = entityFiles
  .map((file) => {
    return `import { ${file} } from "./${file}";`;
  })
  .join("\n");

// Generate import statements for relations
const relationImports = relationFiles
  .map((file) => {
    return `import { ${file} } from "./${file}";`;
  })
  .join("\n");

// Generate entity array entries
const entityArrayEntries = entityFiles
  .map((file) => {
    const displayName = file.replace("entity", "").replace("Data", "");
    return `  { name: "entity${
      displayName.charAt(0).toUpperCase() + displayName.slice(1)
    }", data: ${file} },`;
  })
  .join("\n");

// Generate relation array entries
const relationArrayEntries = relationFiles
  .map((file) => {
    const displayName = file.replace("relation", "").replace("Data", "");
    return `  { name: "relation${
      displayName.charAt(0).toUpperCase() + displayName.slice(1)
    }", data: ${file} },`;
  })
  .join("\n");

// Generate the complete file content
const content = `// Auto-generated file - do not edit manually
// Run 'npm run generate-exports' to regenerate

${allExports}

// Helper to get all entity data as an array
${entityImports}

export const allEntityData = [
${entityArrayEntries}
];

// Helper to get all relation data as an array
${relationImports}

export const allRelationData = [
${relationArrayEntries}
];
`;

// Write the file
fs.writeFileSync(outputPath, content);
console.log(
  `Generated index.ts with ${entityFiles.length} entity files and ${relationFiles.length} relation files`
);
