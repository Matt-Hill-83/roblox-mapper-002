/**
 * Test service to demonstrate BaseService usage
 */

import { RunService, Players } from "@rbxts/services";
import { BaseService } from "./BaseService";

export class TestService extends BaseService {
  private testPart?: Part;
  private heartbeatCount = 0;

  constructor() {
    super("TestService");
    this.setupConnections();
    this.createTestPart();
  }

  private setupConnections(): void {
    // Example 1: Heartbeat connection
    const heartbeatConnection = RunService.Heartbeat.Connect((dt) => {
      this.heartbeatCount++;
      if (this.heartbeatCount % 60 === 0) {
        print(`[TestService] Heartbeat count: ${this.heartbeatCount}`);
      }
    });
    this.addConnection(heartbeatConnection);

    // Example 2: Player added connection
    const playerAddedConnection = Players.PlayerAdded.Connect((player) => {
      print(`[TestService] Player joined: ${player.Name}`);
    });
    this.addConnection(playerAddedConnection);

    // Example 3: Multiple connections at once
    this.addConnections(
      Players.PlayerRemoving.Connect((player) => {
        print(`[TestService] Player left: ${player.Name}`);
      }),
      RunService.Stepped.Connect(() => {
        // Some stepped logic
      })
    );
  }

  private createTestPart(): void {
    // Create a part and manage it
    this.testPart = new Instance("Part");
    this.testPart.Name = "TestServicePart";
    this.testPart.Size = new Vector3(4, 4, 4);
    this.testPart.Position = new Vector3(0, 10, 0);
    this.testPart.BrickColor = BrickColor.Green();
    this.testPart.Parent = game.Workspace;

    // Add it to managed instances
    this.addInstance(this.testPart);

    // Add a connection to the part
    const touchConnection = this.testPart.Touched.Connect((hit) => {
      print(`[TestService] Part touched by: ${hit.Name}`);
    });
    this.addConnection(touchConnection);
  }

  /**
   * Custom cleanup logic
   */
  protected onDestroy(): void {
    print(`[TestService] Performing custom cleanup...`);
    print(`[TestService] Total heartbeats: ${this.heartbeatCount}`);
  }

  /**
   * Example method to test early connection removal
   */
  public removeHeartbeat(): void {
    if (this.connections.size() > 0) {
      const firstConnection = this.connections[0];
      firstConnection.Disconnect();
      this.removeConnection(firstConnection);
      print("[TestService] Removed heartbeat connection");
    }
  }
}

// Example usage:
/*
const testService = new TestService();

// Later, when done:
testService.destroy();
*/