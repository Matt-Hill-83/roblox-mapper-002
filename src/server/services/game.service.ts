import { MakeOldStuffService } from "./makeOldStuff.service";
import { BarService } from "./bar.service";

export class GameService {
  private makeOldStuffService = new MakeOldStuffService();
  private barService = new BarService();
  private myStuffFolder!: Folder;
  private gameStarted = false; // Flag to prevent duplicate initialization

  public startGame(): void {
    if (this.gameStarted) {
      print(
        "⚠️ GameService.startGame() already called, skipping duplicate call"
      );
      return;
    }

    print("🎮 GameService.startGame() called");
    this.gameStarted = true;

    // Create or find the MyStuff folder at the start
    this.myStuffFolder = game.Workspace.FindFirstChild("MyStuff") as Folder;
    if (!this.myStuffFolder) {
      this.myStuffFolder = new Instance("Folder");
      this.myStuffFolder.Name = "MyStuff";
      this.myStuffFolder.Parent = game.Workspace;
    }

    // Disable old assets for now
    if (false) {
      this.makeOldStuffService.createOldAssets(this.myStuffFolder);
    }

    // Create a single bar at (20, 20, 20)
    print("🔷 Creating single bar at (20, 20, 20)...");
    this.barService.createBar({
      id: "singleBar",
      position: { x: 20, y: 20, z: 20 },
      props: {
        Size: [8, 2, 1],     // 8 wide, 2 tall, 1 deep
        Color: [0.2, 0.6, 1] // Light blue
      },
      label: "Test Bar"
    });

    print("✅ GameService.startGame() completed");
  }
}
