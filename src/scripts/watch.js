// File Watcher - Auto-runs block generation when JS files change
import chokidar from "chokidar";
import { spawn } from "child_process";
import path from "path";

console.log("🔍 Starting file watcher for JavaScript files...");
console.log("📁 Watching: scripts/*.js");
console.log("🔄 Auto-running create3blocks.js when changes detected\n");

// Watch all JavaScript files in the scripts directory
const watcher = chokidar.watch(
  [
    "scripts/makeBlocks.js",
    "scripts/config.js",
    "scripts/createRectangles.js",
    "scripts/makeHexagon.js",
    "scripts/makeHexStack.js",
    "scripts/baseAssets/makeRectangle.js",
    "scripts/baseAssets/makeSquare.js",
    "scripts/baseAssets/makeCylinder.js",
  ],
  {
    persistent: true,
    ignoreInitial: true,
    usePolling: true, // Force polling for better compatibility
    interval: 100, // Check every 100ms
  }
);

let isRunning = false;

function runBlockScript() {
  if (isRunning) {
    console.log("⏳ Script already running, skipping...");
    return;
  }

  isRunning = true;
  console.log("🚀 Running makeBlocks.js...");

  const child = spawn("node", ["scripts/makeBlocks.js"], {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  child.on("close", (code) => {
    isRunning = false;
    if (code === 0) {
      console.log("✅ Block generation completed successfully!\n");
    } else {
      console.log(`❌ Script failed with code ${code}\n`);
    }
  });

  child.on("error", (err) => {
    isRunning = false;
    console.error("❌ Error running script:", err.message);
  });
}

// Set up event listeners
watcher
  .on("ready", () => {
    console.log("🎯 Watcher ready! Watching:", watcher.getWatched());
  })
  .on("change", (filePath) => {
    console.log(`📝 File changed: ${filePath}`);
    runBlockScript();
  })
  .on("add", (filePath) => {
    console.log(`➕ File added: ${filePath}`);
    runBlockScript();
  })
  .on("unlink", (filePath) => {
    console.log(`➖ File removed: ${filePath}`);
  })
  .on("error", (error) => {
    console.error("❌ Watcher error:", error);
  });

console.log("👀 File watcher is running!");
console.log("💡 Edit any .js file in scripts/ to trigger auto-update");
console.log("🛑 Press Ctrl+C to stop watching\n");

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Stopping file watcher...");
  watcher.close();
  process.exit(0);
});
