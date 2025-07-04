print("🔷 Bar test script starting...");

// Create a simple bar directly without services
const bar = new Instance("Part");
bar.Name = "TestBar";
bar.Size = new Vector3(10, 1, 1);
bar.Position = new Vector3(0, 10, 0);
bar.Color = new Color3(1, 0, 0); // Red
bar.Anchored = true;
bar.Parent = game.Workspace;

print("✅ Red bar created at (0, 10, 0)!");

// Also create the MyStuff folder
const myStuffFolder = new Instance("Folder");
myStuffFolder.Name = "MyStuff";
myStuffFolder.Parent = game.Workspace;

print("📁 MyStuff folder created!");