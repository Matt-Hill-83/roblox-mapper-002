import { HexStackService } from "./hexStack.service";
import { HexagonService } from "./hexagon.service";
import { NationsStackService } from "./nationsStack.service";

export class GameService {
    private hexagonService = new HexagonService();
    private hexStackService = new HexStackService();
    private nationsStackService = new NationsStackService();

    public startGame(): void {
        print("Game started!");
        this.createHexagon();
        this.createHexStack();
        this.createNationsStack();
    }

    private createHexagon(): void {
        this.hexagonService.createHexagon({
            id: 1,
            centerPosition: [5, 5, 5],
            width: 10,
            height: 0.5,
            barProps: {
                Color: [0.9, 0.7, 0.3], // Golden color
            },
            labels: ["North", "East", "West"]
        });
        print("Hexagon created at (5, 5, 5)!");
    }

    private createHexStack(): void {
        this.hexStackService.createHexStack({
            id: 2,
            centerPosition: [20, 5, 5], // Positioned next to the hexagon
            width: 8,
            height: 0.5,
            count: 6,
            colors: [
                [1, 0, 0], // Red
                [0, 1, 0], // Green
                [0, 0, 1], // Blue
                [1, 1, 0], // Yellow
                [1, 0, 1], // Magenta
                [0, 1, 1], // Cyan
            ]
        });
        print("Hex stack created at (20, 5, 5)!");
    }

    private createNationsStack(): void {
        this.nationsStackService.createNationsStack({
            id: "nationsStack1",
            centerPosition: [35, 5, 5], // Positioned next to the hex stack
            width: 8,
            height: 2,
            maxItems: 3, // Create 3 nations
        });
        print("Nations stack created at (35, 5, 5)!");
    }
}
