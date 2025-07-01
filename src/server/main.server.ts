import { GameService } from "./services/game.service";
// import { listAllHexagons, listAllModelsWithGuids, checkAttachments, checkGuidMatches } from "../shared/modules/diagnostics";

const gameService = new GameService();
gameService.startGame();

// Add a delay to ensure all hexagons are created before running diagnostics
wait(3);

// Run diagnostics (commented out to reduce console output)
// print("🔍 Running diagnostics...");
// checkGuidMatches();
// listAllHexagons();
// listAllModelsWithGuids(); 
// checkAttachments();
