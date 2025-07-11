/**
 * GUI Debugger Utility
 * Helps debug and locate GUI elements
 */

import { Players } from "@rbxts/services";

export class GUIDebugger {
  /**
   * Search for the LinkTypesDisplay GUI and report its details
   */
  public static debugLinkTypesGUI(): void {
    print("[GUIDebugger] Searching for LinkTypesDisplay GUI...");
    
    const localPlayer = Players.LocalPlayer;
    if (!localPlayer) {
      print("[GUIDebugger] No LocalPlayer found");
      return;
    }
    
    const playerGui = localPlayer.WaitForChild("PlayerGui", 5) as PlayerGui | undefined;
    if (!playerGui) {
      print("[GUIDebugger] PlayerGui not found");
      return;
    }
    
    print("[GUIDebugger] Searching in PlayerGui...");
    
    // Search for any GUI containing LinkTypesDisplay
    let foundGUI = false;
    
    playerGui.GetChildren().forEach((child) => {
      if (child.IsA("ScreenGui")) {
        print(`[GUIDebugger] Found ScreenGui: ${child.Name} (Enabled: ${child.Enabled})`);
        
        // Search recursively for LinkTypesDisplay
        const searchResult = this.searchForLinkTypesDisplay(child);
        if (searchResult) {
          foundGUI = true;
          print(`[GUIDebugger] ✅ Found LinkTypesDisplay in ScreenGui: ${child.Name}`);
          print(`  - Position: ${searchResult.Position}`);
          print(`  - Size: ${searchResult.Size}`);
          print(`  - AbsolutePosition: ${searchResult.AbsolutePosition}`);
          print(`  - AbsoluteSize: ${searchResult.AbsoluteSize}`);
          print(`  - Visible: ${searchResult.Visible}`);
          print(`  - Parent hierarchy: ${this.getParentHierarchy(searchResult)}`);
          
          // Check if it has content
          const children = searchResult.GetChildren();
          print(`  - Children count: ${children.size()}`);
          children.forEach((child) => {
            print(`    - ${child.Name} (${child.ClassName})`);
          });
        }
      }
    });
    
    if (!foundGUI) {
      print("[GUIDebugger] ❌ LinkTypesDisplay GUI not found in any ScreenGui");
      
      // List all ScreenGuis for debugging
      print("[GUIDebugger] Available ScreenGuis:");
      playerGui.GetChildren().forEach((child) => {
        if (child.IsA("ScreenGui")) {
          print(`  - ${child.Name} (Enabled: ${child.Enabled})`);
          
          // List top-level children
          child.GetChildren().forEach((grandchild) => {
            print(`    - ${grandchild.Name} (${grandchild.ClassName})`);
            
            // If it's a frame, list its children too
            if (grandchild.IsA("Frame")) {
              grandchild.GetChildren().forEach((greatGrandchild) => {
                print(`      - ${greatGrandchild.Name} (${greatGrandchild.ClassName})`);
              });
            }
          });
        }
      });
    }
  }
  
  /**
   * Search for any element by name
   */
  public static searchForElement(elementName: string): void {
    print(`[GUIDebugger] Searching for element: ${elementName}`);
    
    const localPlayer = Players.LocalPlayer;
    if (!localPlayer) {
      print("[GUIDebugger] No LocalPlayer found");
      return;
    }
    
    const playerGui = localPlayer.WaitForChild("PlayerGui", 5) as PlayerGui | undefined;
    if (!playerGui) {
      print("[GUIDebugger] PlayerGui not found");
      return;
    }
    
    let foundCount = 0;
    
    playerGui.GetChildren().forEach((child) => {
      if (child.IsA("ScreenGui")) {
        const results = this.searchRecursively(child, elementName);
        results.forEach((result) => {
          foundCount++;
          print(`[GUIDebugger] Found ${elementName} #${foundCount}:`);
          print(`  - Position: ${result.Position}`);
          print(`  - Size: ${result.Size}`);
          print(`  - Visible: ${result.Visible}`);
          print(`  - Parent hierarchy: ${this.getParentHierarchy(result)}`);
        });
      }
    });
    
    if (foundCount === 0) {
      print(`[GUIDebugger] Element '${elementName}' not found`);
    } else {
      print(`[GUIDebugger] Found ${foundCount} instances of '${elementName}'`);
    }
  }
  
  /**
   * Recursively search for LinkTypesDisplay element
   */
  private static searchForLinkTypesDisplay(parent: Instance): GuiObject | undefined {
    if (parent.Name === "LinkTypesDisplay" && parent.IsA("GuiObject")) {
      return parent;
    }
    
    for (const child of parent.GetChildren()) {
      const result = this.searchForLinkTypesDisplay(child);
      if (result) {
        return result;
      }
    }
    
    return undefined;
  }
  
  /**
   * Recursively search for any element by name
   */
  private static searchRecursively(parent: Instance, targetName: string): GuiObject[] {
    const results: GuiObject[] = [];
    
    if (parent.Name === targetName && parent.IsA("GuiObject")) {
      results.push(parent);
    }
    
    for (const child of parent.GetChildren()) {
      const childResults = this.searchRecursively(child, targetName);
      childResults.forEach((result) => results.push(result));
    }
    
    return results;
  }
  
  /**
   * Get the parent hierarchy as a string
   */
  private static getParentHierarchy(obj: Instance): string {
    const hierarchy: string[] = [];
    let current: Instance | undefined = obj;
    
    while (current && current !== game) {
      hierarchy.unshift(current.Name);
      current = current.Parent;
    }
    
    return hierarchy.join(" -> ");
  }
}