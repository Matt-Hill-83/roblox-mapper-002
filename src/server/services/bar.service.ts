import { Workspace } from "@rbxts/services";
import { makeBar } from "../../shared/modules/barMaker";

export class BarService {
  private getMyStuffFolder(): Folder {
    let myStuff = Workspace.FindFirstChild("MyStuff") as Folder;
    if (!myStuff) {
      myStuff = new Instance("Folder");
      myStuff.Name = "MyStuff";
      myStuff.Parent = Workspace;
    }
    return myStuff;
  }

  public createBar({ id, position, rotation, props, label }: {
    id: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    props?: any;
    label?: string;
  }): Part {
    const bar = makeBar({ id, position, rotation, props, label });
    bar.Parent = this.getMyStuffFolder();
    return bar;
  }
} 