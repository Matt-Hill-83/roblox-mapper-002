const fs = require("fs");
const path = require("path");

// Set these paths as needed
const csvPath = path.join(__dirname, "relation_tests_data.csv");
const jsPath = path.join(__dirname, "relationTestsData.js");

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

const exportName = path.basename(jsPath, ".js");
const jsContent =
  `export const ${exportName} = [\n` + objects.join(",\n") + "\n];\n";

fs.writeFileSync(jsPath, jsContent);
console.log("Wrote", jsPath);
