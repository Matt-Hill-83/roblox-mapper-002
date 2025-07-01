import { Workspace } from "@rbxts/services";
import { makeToolStack } from "../../shared/modules/toolStackMaker";

export class ToolStackService {
  private getMyStuffFolder(): Folder {
    let myStuff = Workspace.FindFirstChild("MyStuff") as Folder;
    if (!myStuff) {
      myStuff = new Instance("Folder");
      myStuff.Name = "MyStuff";
      myStuff.Parent = Workspace;
    }
    return myStuff;
  }

  public createToolStack({ id, centerPosition, width, height, maxItems }: {
    id?: string;
    centerPosition?: [number, number, number];
    width?: number;
    height?: number;
    maxItems?: number;
  }): Model {
    const stackModel = makeToolStack({ id, centerPosition, width, height, maxItems });
    
    // Parent the stack model to MyStuff folder
    stackModel.Parent = this.getMyStuffFolder();
    
    return stackModel;
  }
} 