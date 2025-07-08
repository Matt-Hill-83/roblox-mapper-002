/**
 * Main Client Entry Point
 * 
 * This file serves as the primary entry point for all client-side functionality.
 * It is intentionally "orphaned" (not imported by other modules) because:
 * 1. It is the root bootstrapper for the client-side application
 * 2. Roblox automatically executes this file when placed in StarterPlayer.StarterPlayerScripts
 * 3. It initializes all client controllers and services that need to run on game start
 * 
 * Architecture Note: This follows the "composition root" pattern where all
 * dependencies are wired together at the application's entry point.
 */

import { ConfigGUIController } from "./controllers/configGUI.controller";
import { AnimationTestGUIController } from "./controllers/animationTestGUI.controller";
// import { ColorPickerController } from "./controllers/_orphaned/colorPicker.controller";
import { Players } from "@rbxts/services";
import { KeyboardShortcutsService } from "./services/keyboardShortcuts.service";
import { NodePropertiesInspectorService } from "./services/nodePropertiesInspector/nodePropertiesInspector.service";
import { DropdownGuiService } from "./services/dropdownGui";

// Disable the default Roblox chat
const starterGui = game.GetService("StarterGui");
starterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Chat, false);

// Wait for the player and character to be ready
const player = Players.LocalPlayer;
if (!player.Character) {
  player.CharacterAdded.Wait();
}

// Small delay to ensure everything is loaded
wait(0.5);

// Initialize the configuration GUI
const configGUIController = new ConfigGUIController();
configGUIController.initialize();

// Initialize the animation test GUI
const animationTestController = new AnimationTestGUIController();
animationTestController.initialize();

// Initialize the color picker GUI (disabled - moved to _orphaned)
// const colorPickerController = new ColorPickerController();
// colorPickerController.initialize();

// Initialize keyboard shortcuts service
new KeyboardShortcutsService();

// Initialize node properties inspector
const nodeInspector = NodePropertiesInspectorService.getInstance();
nodeInspector.initialize();

// Initialize dropdown GUI service
const dropdownGuiService = new DropdownGuiService();
dropdownGuiService.initialize();

print("🎮 Client initialized with Configuration GUI, Animation Test GUI, Keyboard Shortcuts, Node Properties Inspector, and Dropdown GUI");
