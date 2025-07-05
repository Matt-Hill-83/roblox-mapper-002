import { MakeOldStuffService } from "./makeOldStuff.service";
import { SimpleGraphService } from "./simpleGraph.service";

export class GameService {
  private makeOldStuffService = new MakeOldStuffService();
  private simpleGraphService = new SimpleGraphService();
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

    // Create simple graph with 3 hexagons
    this.simpleGraphService.createSimpleGraph(this.myStuffFolder);

    print("✅ GameService.startGame() completed");
  }
}
