import { Players } from "@rbxts/services";

// Store reference to the shared GUI
let axisDropdownGUI: ScreenGui | undefined;

/**
 * Gets or creates the shared ScreenGui for axis dropdown controls
 */
export function getOrCreateScreenGui(): ScreenGui {
  if (!axisDropdownGUI) {
    const player = Players.LocalPlayer;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
    
    axisDropdownGUI = new Instance("ScreenGui");
    axisDropdownGUI.Name = "AxisDropdownGUI";
    axisDropdownGUI.ResetOnSpawn = false;
    axisDropdownGUI.Parent = playerGui;
  }
  
  return axisDropdownGUI;
}

/**
 * Destroys and recreates the axis dropdown GUI
 * Used to refresh the GUI when properties are discovered
 */
export function refreshAxisDropdownGUI(): void {
  if (axisDropdownGUI) {
    
    axisDropdownGUI.Destroy();
    axisDropdownGUI = undefined;
  }
}