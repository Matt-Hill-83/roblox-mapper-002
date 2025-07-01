// Fix and transform generated JSON to be compatible with Rojo format
import fs from "fs";

const projectPath = "./default.project.json";

function transformRobloxTypes(obj) {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(transformRobloxTypes);
  }

  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    // Convert UDim2-style Size if it's [scaleX, offsetX, scaleY, offsetY]
    if (key === "Size" && Array.isArray(value) && value.length === 4) {
      result[key] = {
        X: { Scale: value[0], Offset: value[1] },
        Y: { Scale: value[2], Offset: value[3] },
      };
    }
    // Pass UDim2-style objects through
    else if (
      key === "Size" &&
      value?.X?.Scale !== undefined &&
      value?.Y?.Scale !== undefined
    ) {
      result[key] = value;
    }
    // Convert Vector3-style object { X, Y, Z } to [x, y, z]
    else if (
      typeof value === "object" &&
      value !== null &&
      "X" in value &&
      "Y" in value &&
      "Z" in value &&
      typeof value.X === "number"
    ) {
      result[key] = [value.X, value.Y, value.Z];
    }
    // Keep Color3/Vector3/CFrame string literals (e.g., "Color3.new(1,1,1)")
    else if (
      typeof value === "string" &&
      (value.startsWith("Vector3.") ||
        value.startsWith("Color3.") ||
        value.startsWith("CFrame.") ||
        value.startsWith("UDim2."))
    ) {
      result[key] = value;
    }
    // Keep Enum strings as-is (e.g., "Enum.Font.SourceSans")
    else if (typeof value === "string" && value.startsWith("Enum.")) {
      result[key] = value;
    }
    // Recurse for nested objects
    else {
      result[key] = transformRobloxTypes(value);
    }
  }

  return result;
}

function main() {
  try {
    console.log("🔄 Transforming JSON for Rojo compatibility...");

    const raw = fs.readFileSync(projectPath, "utf8");
    const project = JSON.parse(raw);

    const transformed = transformRobloxTypes(project);

    fs.writeFileSync(projectPath, JSON.stringify(transformed, null, 2));

    console.log("✅ Transformation complete! JSON is now Rojo-compatible.");
  } catch (error) {
    console.error("❌ Error transforming JSON:", error.message);
    process.exit(1);
  }
}

main();
