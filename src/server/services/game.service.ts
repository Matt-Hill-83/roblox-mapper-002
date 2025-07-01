import { PartService } from "./part.service";
import { task } from "@rbxts/services";

export class GameService {
    private partService = new PartService();

    public startGame(): void {
        print("Game started!");
        this.gameLoop();
    }

    private gameLoop(): void {
        while (task.wait(3)) {
            this.partService.createPart();
        }
    }
}
