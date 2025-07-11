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
import { Players, ReplicatedStorage } from "@rbxts/services";
import { KeyboardShortcutsService } from "./services/keyboardShortcuts.service";
import { NodePropertiesInspectorService } from "./services/nodePropertiesInspector/nodePropertiesInspector.service";
import { PropertiesGuiService } from "./services/propertiesGui/propertiesGui.service";

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

// Create LinkTypes GUI in lower left corner
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

const linkTypesGui = new Instance("ScreenGui");
linkTypesGui.Name = "LinkTypesGUI";
linkTypesGui.Parent = playerGui;

const linkTypesFrame = new Instance("Frame");
linkTypesFrame.Name = "LinkTypesFrame";
linkTypesFrame.Size = new UDim2(0, 250, 0, 200);
linkTypesFrame.Position = new UDim2(0, 10, 1, -210); // Lower left corner
linkTypesFrame.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
linkTypesFrame.BorderSizePixel = 2;
linkTypesFrame.BorderColor3 = new Color3(0.4, 0.4, 0.4);
linkTypesFrame.Parent = linkTypesGui;

// Header
const headerLabel = new Instance("TextLabel");
headerLabel.Text = "Link Types";
headerLabel.Size = new UDim2(1, 0, 0, 25);
headerLabel.Position = new UDim2(0, 0, 0, 0);
headerLabel.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
headerLabel.TextColor3 = new Color3(1, 1, 1);
headerLabel.TextScaled = true;
headerLabel.Font = Enum.Font.SourceSansBold;
headerLabel.Parent = linkTypesFrame;

// Scrolling area
const scrollFrame = new Instance("ScrollingFrame");
scrollFrame.Size = new UDim2(1, -10, 1, -35);
scrollFrame.Position = new UDim2(0, 5, 0, 30);
scrollFrame.BackgroundTransparency = 1;
scrollFrame.BorderSizePixel = 0;
scrollFrame.ScrollBarThickness = 6;
scrollFrame.CanvasSize = new UDim2(0, 0, 0, 0);
scrollFrame.Parent = linkTypesFrame;

// Function to get link type counts from existing server
function getLinkTypeCounts(): { name: string; count: number }[] {
  const remoteFunction = ReplicatedStorage.FindFirstChild("GetLinkTypeCounts") as RemoteFunction;
  if (remoteFunction) {
    try {
      const result: unknown = remoteFunction.InvokeServer();
      if (result && typeIs(result, "table")) {
        const serverData = result as { type: string; count: number }[];
        // Convert from server format {type, count} to client format {name, count}
        return serverData.map(item => ({ name: item.type, count: item.count }));
      }
    } catch (error) {
      warn("Failed to get link type counts:", error);
    }
  }
  return [{ name: "Loading...", count: 0 }];
}

// Function to update the GUI with current data
function updateLinkTypesDisplay() {
  // Clear existing entries
  scrollFrame.GetChildren().forEach(child => {
    if (child.IsA("Frame")) {
      child.Destroy();
    }
  });
  
  // Get current link type counts from server
  const linkTypes = getLinkTypeCounts();
  
  let yPos = 5;
  linkTypes.forEach((linkType, index) => {
    const entryFrame = new Instance("Frame");
    entryFrame.Size = new UDim2(1, -10, 0, 25);
    entryFrame.Position = new UDim2(0, 5, 0, yPos);
    entryFrame.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
    entryFrame.BorderSizePixel = 1;
    entryFrame.BorderColor3 = new Color3(0.3, 0.3, 0.3);
    entryFrame.Parent = scrollFrame;
    
    const nameLabel = new Instance("TextLabel");
    nameLabel.Text = linkType.name;
    nameLabel.Size = new UDim2(0.7, 0, 1, 0);
    nameLabel.Position = new UDim2(0, 5, 0, 0);
    nameLabel.BackgroundTransparency = 1;
    nameLabel.TextColor3 = new Color3(1, 1, 1);
    nameLabel.TextScaled = true;
    nameLabel.Font = Enum.Font.SourceSans;
    nameLabel.TextXAlignment = Enum.TextXAlignment.Left;
    nameLabel.Parent = entryFrame;
    
    const countLabel = new Instance("TextLabel");
    countLabel.Text = tostring(linkType.count);
    countLabel.Size = new UDim2(0.3, -5, 1, 0);
    countLabel.Position = new UDim2(0.7, 0, 0, 0);
    countLabel.BackgroundTransparency = 1;
    countLabel.TextColor3 = new Color3(0.8, 0.8, 1);
    countLabel.TextScaled = true;
    countLabel.Font = Enum.Font.SourceSansBold;
    countLabel.TextXAlignment = Enum.TextXAlignment.Right;
    countLabel.Parent = entryFrame;
    
    yPos += 30;
  });
  
  // Update canvas size
  scrollFrame.CanvasSize = new UDim2(0, 0, 0, yPos);
}

// Initial display
updateLinkTypesDisplay();

// Update every 2 seconds to reflect server changes
spawn(() => {
  while (true) {
    wait(2);
    updateLinkTypesDisplay();
  }
});

// Create Properties GUI
const propertiesGui = new PropertiesGuiService();

// Request property values from server after data is loaded
const configRemote = ReplicatedStorage.WaitForChild("ConfigGUIRemote") as RemoteEvent;

// Listen for when data is regenerated to update property values
configRemote.OnClientEvent.Connect((eventType: string, data?: unknown) => {
  if (eventType === "regenerateSuccess" || eventType === "updateSuccess") {
    // Request property values after data is loaded
    wait(0.5); // Short delay to ensure data is processed
    configRemote.FireServer("getPropertyValues");
  } else if (eventType === "propertyValues" && typeIs(data, "table")) {
    const propertyData = data as { [key: string]: string[] };
    
    // Update properties data if GUI exists, otherwise create it
    if (propertiesGui && propertiesGui.isGuiCreated && propertiesGui.isGuiCreated()) {
      propertiesGui.updatePropertiesData(propertyData);
    } else {
      // Create GUI with all properties data
      propertiesGui.createGUI(propertyData, (filters) => {
        // Handle filter changes - send to server
        print("[Main] Filter state changed:", filters);
        configRemote.FireServer("updateFilters", filters);
      });
    }
  }
});

// Request initial property values
spawn(() => {
  wait(2); // Wait for initial data load
  configRemote.FireServer("getPropertyValues");
});

