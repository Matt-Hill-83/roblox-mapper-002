const fs = require("fs");
const path = require("path");

const folder = process.argv[2] || "./_data/_cleaned/entities";
const files = fs.readdirSync(folder).filter((f) => f.endsWith(".js"));

files.forEach((jsFile) => {
  const jsPath = path.join(folder, jsFile);
  const tsPath = path.join(folder, jsFile.replace(/\.js$/, ".ts"));
  const content = fs.readFileSync(jsPath, "utf8");
  fs.writeFileSync(tsPath, content);
  console.log("Wrote", tsPath);
});
