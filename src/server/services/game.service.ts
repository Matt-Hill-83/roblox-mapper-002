import { MakeOldStuffService } from "./makeOldStuff.service";

export class GameService {
  private makeOldStuffService = new MakeOldStuffService();
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

    // Use the makeOldStuff service to create all the old assets
    this.makeOldStuffService.createOldAssets(this.myStuffFolder);

    print("✅ GameService.startGame() completed");
  }
}
