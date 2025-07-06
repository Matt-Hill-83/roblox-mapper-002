print("🚀 Server starting...");

import { GameService } from "./services/main/game.service";

print("📦 GameService imported successfully");

const gameService = new GameService();
print("🎮 GameService instance created");

gameService.startGame();
print("✅ Game started");
