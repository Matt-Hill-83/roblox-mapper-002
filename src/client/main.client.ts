import { ConfigGUIController } from "./controllers/configGUI.controller";
import { AnimationTestGUIController } from "./controllers/animationTestGUI.controller";
import { Players } from "@rbxts/services";

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

print("🎮 Client initialized with Configuration GUI and Animation Test GUI");