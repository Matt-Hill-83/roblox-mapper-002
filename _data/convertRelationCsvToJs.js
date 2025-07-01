const fs = require("fs");
const path = require("path");

function toCamelCase(str) {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/\.csv$/i, "");
}

const folder = process.argv[2] || __dirname;
const files = fs.readdirSync(folder).filter((f) => f.endsWith(".csv"));

files.forEach((csvFile) => {
  const csvPath = path.join(folder, csvFile);
  const baseName = path.basename(csvFile, ".csv");
  const exportName = toCamelCase(baseName);
  const jsFile = path.join(folder, exportName + ".js");

  const csv = fs.readFileSync(csvPath, "utf8").trim().split("\n");
  const [header, ...rows] = csv;
  const keys = header.split(",");

  const objects = rows.map((row) => {
    const values = row.split(",");
    return (
      "  {\n" +
      keys
        .map((k, i) => `    ${JSON.stringify(k)}: ${JSON.stringify(values[i])}`)
        .join(",\n") +
      "\n  }"
    );
  });

  const jsContent =
    `export const ${exportName} = [\n` + objects.join(",\n") + "\n];\n";

  fs.writeFileSync(jsFile, jsContent);
  console.log("Wrote", jsFile);
});
