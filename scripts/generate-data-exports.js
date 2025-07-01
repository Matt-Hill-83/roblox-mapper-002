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
const files = fs
  .readdirSync(dataFolderPath)
  .filter((file) => file.endsWith(".ts") && file !== "index.ts")
  .map((file) => file.replace(".ts", ""));

// Generate export statements
const exports = files
  .map((file) => {
    const exportName = file.replace("Data", "Data"); // Keep original casing
    return `export { ${exportName} } from "./${file}";`;
  })
  .join("\n");

// Generate import statements for the array
const imports = files
  .map((file) => {
    const importName = file.replace("Data", "Data");
    return `import { ${importName} } from "./${file}";`;
  })
  .join("\n");

// Generate array entries
const arrayEntries = files
  .map((file) => {
    const importName = file.replace("Data", "Data");
    const displayName = file.replace("entity", "").replace("Data", "");
    return `  { name: "entity${
      displayName.charAt(0).toUpperCase() + displayName.slice(1)
    }", data: ${importName} },`;
  })
  .join("\n");

// Generate the complete file content
const content = `// Auto-generated file - do not edit manually
// Run 'npm run generate-exports' to regenerate

${exports}

// Helper to get all data as an array
${imports}

export const allEntityData = [
${arrayEntries}
];
`;

// Write the file
fs.writeFileSync(outputPath, content);
console.log(`Generated index.ts with ${files.length} entity data files`);
