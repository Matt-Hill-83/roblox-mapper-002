import { ConnectorService } from "./services/connector.service";
import { GameService } from "./services/game.service";

const gameService = new GameService();
gameService.startGame();

// Create security connectors
const connectorService = new ConnectorService();
connectorService.createSecurityConnectors();
