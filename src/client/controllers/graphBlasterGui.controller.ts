import { ReplicatedStorage } from "@rbxts/services";
import { GraphBlasterGuiClientService } from "../services/graphBlasterGui/graphBlasterGui.client.service";

/**
 * Client controller for GraphBlaster GUI
 */
export class GraphBlasterGuiController {
  private guiService?: GraphBlasterGuiClientService;
  private remoteEvent?: RemoteEvent;

  constructor() {
    // Wait for remote event
    const remoteEvent = ReplicatedStorage.WaitForChild("GraphBlasterRemoteEvent", 10) as RemoteEvent;
    if (remoteEvent) {
      this.remoteEvent = remoteEvent;
      this.setupRemoteEventListener();
    } else {
      warn("GraphBlasterRemoteEvent not found");
    }
  }

  /**
   * Setup listener for server commands
   */
  private setupRemoteEventListener(): void {
    if (!this.remoteEvent) return;
    
    this.remoteEvent.OnClientEvent.Connect((command: string) => {
      if (command === "CreateGui") {
        this.createGui();
      } else if (command === "DestroyGui") {
        this.destroyGui();
      }
    });
  }

  /**
   * Create the GUI
   */
  private createGui(): void {
    if (!this.guiService) {
      this.guiService = new GraphBlasterGuiClientService();
      this.guiService.createGui();
      print("GraphBlaster GUI created on client");
    }
  }

  /**
   * Destroy the GUI
   */
  private destroyGui(): void {
    if (this.guiService) {
      this.guiService.destroy();
      this.guiService = undefined;
      print("GraphBlaster GUI destroyed on client");
    }
  }
}

// Create singleton instance
new GraphBlasterGuiController();