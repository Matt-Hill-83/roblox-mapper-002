import { HexagonService } from "./hexagon.service";

export class GameService {
    private hexagonService = new HexagonService();

    public startGame(): void {
        print("Game started!");
        this.createHexagon();
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
            labels: ["Front", "Left", "Right"]
        });
        print("Hexagon created at (5, 5, 5)!");
    }
}
