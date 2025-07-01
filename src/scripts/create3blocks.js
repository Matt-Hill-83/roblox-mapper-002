// Auto-update JSON from Lua script
// This Node.js script can modify your project files automatically

import fs from "fs";
import path from "path";

// Read current project file
const projectPath = "./default.project.json";
const project = JSON.parse(fs.readFileSync(projectPath, "utf8"));

// Clear existing blocks from MyStuff (keep only folder definition)
project.tree.Workspace.MyStuff = {
  $className: "Folder",
};

const numberOfBlocks = 6; // Number osafdf bsadflocks asdfto addasdf
const blockColor = [0.486275, 0.866667, 0.184314]; // Bright green RGB
// Add 5   new blocks
for (let i = 1; i <= numberOfBlocks; i++) {
  const blockName = `Block${i}`;
  project.tree.Workspace.MyStuff[blockName] = {
    $className: "Part",
    $properties: {
      Size: [2, 3, 1], // From your constants
      Position: [i * 3, 1, 1],
      Anchored: true,
      Color: blockColor,
      Material: "Plastic",
      Shape: "Block",
      TopSurface: "Smooth",
      BottomSurface: "Smooth",
    },
  };
}

// Write back to file
fs.writeFileSync(projectPath, JSON.stringify(project, null, 2));
console.log(`✅ Added ${numberOfBlocks} blocks to default.project.json`);
console.log("🔄 Rojo will sync them to Studio automatically!");
