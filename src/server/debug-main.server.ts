print("🔍 DEBUG: Starting debug main script");

// Test if we can access ReplicatedStorage and the include folder
const repStorage = game.GetService("ReplicatedStorage");
print("🔍 DEBUG: Got ReplicatedStorage");

const includeFolder = repStorage.WaitForChild("include", 5);
if (includeFolder) {
    print("✅ DEBUG: Found include folder");
    
    const runtimeLib = includeFolder.WaitForChild("RuntimeLib", 5);
    if (runtimeLib) {
        print("✅ DEBUG: Found RuntimeLib");
    } else {
        warn("❌ DEBUG: RuntimeLib not found in include folder!");
    }
} else {
    warn("❌ DEBUG: include folder not found in ReplicatedStorage!");
}

// List what's in ReplicatedStorage
print("🔍 DEBUG: Contents of ReplicatedStorage:");
for (const child of repStorage.GetChildren()) {
    print(`  - ${child.Name} (${child.ClassName})`);
}