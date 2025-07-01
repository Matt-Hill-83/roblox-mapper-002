import { ComponentStackService } from "./componentStack.service";
// import { HexStackService } from "./hexStack.service";
// import { NationsStackService } from "./nationsStack.service";
import { ToolStackService } from "./toolStack.service";
import { createRowOfStacks } from "../../shared/modules/createRowOfStacks";
import { createRingOfStacks } from "../../shared/modules/createRingOfStacks";
import { ConnectorService } from "./connector.service";

export class GameService {
    // private hexStackService = new HexStackService();
    // private nationsStackService = new NationsStackService();
    private componentStackService = new ComponentStackService();
    private toolStackService = new ToolStackService();
    private connectorService = new ConnectorService();
    private myStuffFolder!: Folder;

    public startGame(): void {
        // Create or find the myStuff folder at the start
        this.myStuffFolder = game.Workspace.FindFirstChild("myStuff") as Folder;
        if (!this.myStuffFolder) {
            this.myStuffFolder = new Instance("Folder");
            this.myStuffFolder.Name = "myStuff";
            this.myStuffFolder.Parent = game.Workspace;
            print("Created myStuff folder in workspace");
        } else {
            print("Found existing myStuff folder");
        }
        print("Game started!");
        // this.createHexagon();
        // this.createHexStack();
        // this.createNationsStack();
        this.createComponentStack();
        this.createToolStack();
        this.createEntityRow();
        this.createEntityRing();
        
        // Create connectors after all stacks are created
        this.createConnectors();
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

    
    private createEntityRow(): void {
        if (true) {  // Enable this
            print("Starting createEntityRow...");
            
            const startPosition: [number, number, number] = [80, 1, 1]; // Move to the right of tool stack
            print("Creating entity row at position:", startPosition);
            
            const stacks = createRowOfStacks({
                maxStacks: 10, // Reduce to make room for ring
                startPosition: startPosition,
            });
            
            print("Created", stacks.size(), "stacks in entity row");
            
            // Place each stack in the myStuff folder
            for (let i = 0; i < stacks.size(); i++) {
                const stack = stacks[i];
                stack.Parent = this.myStuffFolder;
                print("Placed stack", stack.Name, "in myStuff folder at position", stack.GetBoundingBox()[0]);
            }
            
            print("Entity row creation completed!");
        }
    }

    private createEntityRing(): void {
        print("Starting createEntityRing...");
        
        const centerPosition: [number, number, number] = [0, 1, -50]; // Position in front of the row, more visible
        print("Creating entity ring at center position:", centerPosition);
        
        const stacks = createRingOfStacks({
            maxStacks: 10, // Smaller ring for testing
            centerPosition: centerPosition,
            radius: 25, // Smaller radius
            startIndex: 10, // Start from entity 10 (we only have 15 total entities)
            color: [0.5, 0.9, 0.5], // Light green color
        });
        
        if (stacks.size() === 0) {
            print("ERROR: No stacks were created for the ring!");
            return;
        }
        
        print("Created", stacks.size(), "stacks in entity ring");
        
        // Place each stack in the myStuff folder
        for (let i = 0; i < stacks.size(); i++) {
            const stack = stacks[i];
            stack.Parent = this.myStuffFolder;
            print("Placed stack", stack.Name, "in myStuff folder at position", stack.GetBoundingBox()[0]);
        }
        
        print("Entity ring creation completed!");
    }

    private createConnectors(): void {
        print("🔗 Creating all connectors...");
        this.connectorService.createSecurityConnectors();
    }

}
