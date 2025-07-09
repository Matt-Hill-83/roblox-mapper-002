/**
 * Main Server Entry Point
 * 
 * This file serves as the primary entry point for all server-side functionality.
 * It is intentionally "orphaned" (not imported by other modules) because:
 * 1. It is the root bootstrapper for the server-side application
 * 2. Roblox automatically executes this file when placed in ServerScriptService
 * 3. It initializes the main GameService which orchestrates all server operations
 * 
 * Architecture Note: This follows the "composition root" pattern where the
 * application's main service is instantiated and started from a single entry point.
 * All other services are managed by GameService through dependency injection.
 */


import { GameService } from "./services/main/game.service";


const gameService = new GameService();

gameService.startGame();
