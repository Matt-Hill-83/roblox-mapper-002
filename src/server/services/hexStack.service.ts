import { Workspace } from "@rbxts/services";
import { makeHexStack } from "../../shared/modules/hexStackMaker";

export class HexStackService {
  private getMyStuffFolder(): Folder {
    let myStuff = Workspace.FindFirstChild("MyStuff") as Folder;
    if (!myStuff) {
      myStuff = new Instance("Folder");
      myStuff.Name = "MyStuff";
      myStuff.Parent = Workspace;
    }
    return myStuff;
  }

  public createHexStack({ id, centerPosition, width, height, count, colors }: {
    id?: number;
    centerPosition?: [number, number, number];
    width?: number;
    height?: number;
    count?: number;
    colors?: [number, number, number][];
  }): Model[] {
    const hexagons = makeHexStack({ id, centerPosition, width, height, count, colors, stackIndex: id || 1 });
    
    // Parent all hexagons to MyStuff folder
    const myStuffFolder = this.getMyStuffFolder();
    hexagons.forEach(hexagon => {
      hexagon.Parent = myStuffFolder;
    });
    
    return hexagons;
  }
} 