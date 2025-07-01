import { Workspace } from "@rbxts/services";
import { makeComponentStack } from "../../shared/modules/componentStackMaker";

export class ComponentStackService {
  private getMyStuffFolder(): Folder {
    let myStuff = Workspace.FindFirstChild("MyStuff") as Folder;
    if (!myStuff) {
      myStuff = new Instance("Folder");
      myStuff.Name = "MyStuff";
      myStuff.Parent = Workspace;
    }
    return myStuff;
  }

  public createComponentStack({ id, centerPosition, width, height, maxItems }: {
    id?: string;
    centerPosition?: [number, number, number];
    width?: number;
    height?: number;
    maxItems?: number;
  }): Model {
    const stackModel = makeComponentStack({ id, centerPosition, width, height, maxItems });
    
    // Parent the stack model to MyStuff folder
    stackModel.Parent = this.getMyStuffFolder();
    
    return stackModel;
  }
} 