import { ComponentStackService } from "./componentStack.service";
// import { HexStackService } from "./hexStack.service";
// import { NationsStackService } from "./nationsStack.service";
import { ToolStackService } from "./toolStack.service";

export class GameService {
    // private hexStackService = new HexStackService();
    // private nationsStackService = new NationsStackService();
    private componentStackService = new ComponentStackService();
    private toolStackService = new ToolStackService();

    public startGame(): void {
        print("Game started!");
        // this.createHexagon();
        // this.createHexStack();
        // this.createNationsStack();
        this.createComponentStack();
        this.createToolStack();
        this.createTestRopes();
    }

    // private createHexagon(): void {
    //     this.hexagonService.createHexagon({
    //         id: 1,
    //         centerPosition: [5, 5, 5],
    //         width: 10,
    //         height: 0.5,
    //         barProps: {
    //             Color: [0.9, 0.7, 0.3], // Golden color
    //         },
    //         labels: ["North", "East", "West"]
    //     });
    //     print("Hexagon created at (5, 5, 5)!");
    // }

    // private createHexStack(): void {
    //     this.hexStackService.createHexStack({
    //         id: 2,
    //         centerPosition: [20, 5, 5], // Positioned next to the hexagon
    //         width: 8,
    //         height: 0.5,
    //         count: 6,
    //         colors: [
    //             [1, 0, 0], // Red
    //             [0, 1, 0], // Green
    //             [0, 0, 1], // Blue
    //             [1, 1, 0], // Yellow
    //             [1, 0, 1], // Magenta
    //             [0, 1, 1], // Cyan
    //         ]
    //     });
    //     print("Hex stack created at (20, 5, 5)!");
    // }

    // private createNationsStack(): void {
    //     this.nationsStackService.createNationsStack({
    //         id: "nationsStack1",
    //         centerPosition: [35, 5, 5], // Positioned next to the hex stack
    //         width: 8,
    //         height: 2,
    //         maxItems: 3, // Create 3 nations
    //     });
    //     print("Nations stack created at (35, 5, 5)!");
    // }

    private createComponentStack(): void {
        this.componentStackService.createComponentStack({
            id: "componentStack1",
            centerPosition: [50, 1, 1], // Positioned next to the nations stack
            width: 8,
            height: 1, // Limited to height 1
            maxItems: 100, // Create 16 components (can be increased up to 64)
        });
        
    }

    private createToolStack(): void {
        this.toolStackService.createToolStack({
            id: "toolStack1",
            centerPosition: [65, 1, 1], // Positioned next to the component stack
            width: 8,
            height: 1, // Limited to height 1
            maxItems: 100, // Create all 8 tools
        });
        
    }

    private createTestRopes(): void {
        // Create first cube
        const cubeA = new Instance("Part");
        cubeA.Name = "cubeA";
        cubeA.Size = new Vector3(4, 4, 4);
        cubeA.Position = new Vector3(0, 4, 0);
        cubeA.Anchored = true;
        cubeA.Material = Enum.Material.Glass;
        cubeA.Transparency = 0.3;
        cubeA.Parent = game.Workspace;
        print("Created cubeA at (0, 4, 0)");

        // Create center attachment for cubeA
        const centerAttachmentA = new Instance("Attachment");
        centerAttachmentA.Name = "centerAttachmentA";
        centerAttachmentA.Position = new Vector3(0, 0, 0);
        centerAttachmentA.Parent = cubeA;
        print("Created centerAttachmentA in cubeA");

        // Create second cube
        const cubeB = new Instance("Part");
        cubeB.Name = "cubeB";
        cubeB.Size = new Vector3(4, 4, 4);
        cubeB.Position = new Vector3(16, 4, 0);
        cubeB.Anchored = true;
        cubeB.Material = Enum.Material.Glass;
        cubeB.Transparency = 0.3;
        cubeB.Parent = game.Workspace;
        print("Created cubeB at (16, 4, 0)");

        // Create center attachment for cubeB
        const centerAttachmentB = new Instance("Attachment");
        centerAttachmentB.Name = "centerAttachmentB";
        centerAttachmentB.Position = new Vector3(0, 0, 0);
        centerAttachmentB.Parent = cubeB;
        print("Created centerAttachmentB in cubeB");

        // Lookup cubes and attachments
        const foundCubeA = game.Workspace.FindFirstChild("cubeA") as Part;
        const foundCubeB = game.Workspace.FindFirstChild("cubeB") as Part;
        print("Lookup: foundCubeA:", foundCubeA ? "yes" : "no", " foundCubeB:", foundCubeB ? "yes" : "no");
        if (foundCubeA && foundCubeB) {
            const foundAttachmentA = foundCubeA.FindFirstChild("centerAttachmentA") as Attachment;
            const foundAttachmentB = foundCubeB.FindFirstChild("centerAttachmentB") as Attachment;
            print("Lookup: foundAttachmentA:", foundAttachmentA ? "yes" : "no", " foundAttachmentB:", foundAttachmentB ? "yes" : "no");
            if (foundAttachmentA && foundAttachmentB) {
                // Create rope between the two attachments
                const rope = new Instance("RopeConstraint");
                rope.Name = "testRopeBetweenCubes";
                rope.Attachment0 = foundAttachmentA;
                rope.Attachment1 = foundAttachmentB;
                rope.Length = (foundAttachmentA.WorldPosition.sub(foundAttachmentB.WorldPosition)).Magnitude * 1.0001;
                rope.Visible = true;
                rope.Color = new BrickColor("Bright blue");
                rope.Thickness = 0.4;
                rope.Parent = game.Workspace;
                print("Created rope between cubeA and cubeB, length:", rope.Length);
            } else {
                print("ERROR: Could not find one or both attachments");
            }
        } else {
            print("ERROR: Could not find one or both cubes");
        }
    }
}
