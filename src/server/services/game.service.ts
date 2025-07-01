import { BarService } from "./bar.service";

export class GameService {
    private barService = new BarService();

    public startGame(): void {
        print("Game started!");
        this.createBar();
    }

    private createBar(): void {
        this.barService.createBar({
            id: "TestBar",
            position: { x: 0, y: 5, z: 0 },
            rotation: { x: 0, y: -30, z: 0 },
            props: {
                Size: [4, 2, 8],
                Color: [0.2, 0.4, 0.8],
            },
            label: "Test Bar"
        });
        print("Bar created!");
    }
}
