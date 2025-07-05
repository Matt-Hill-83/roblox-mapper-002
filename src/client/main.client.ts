import { ConfigGUIController } from "./controllers/configGUI.controller";

// Disable the default Roblox chat
const starterGui = game.GetService("StarterGui");
starterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Chat, false);

// Initialize the configuration GUI
const configGUIController = new ConfigGUIController();
configGUIController.initialize();

print("<� Client initialized with Configuration GUI");