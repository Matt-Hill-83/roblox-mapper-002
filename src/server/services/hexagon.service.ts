import { Workspace } from "@rbxts/services";
import { makeHexagon } from "../../shared/modules/hexagonMaker";

export class HexagonService {
  private getMyStuffFolder(): Folder {
    let myStuff = Workspace.FindFirstChild("MyStuff") as Folder;
    if (!myStuff) {
      myStuff = new Instance("Folder");
      myStuff.Name = "MyStuff";
      myStuff.Parent = Workspace;
    }
    return myStuff;
  }

  public createHexagon({ id, centerPosition, width, height, barProps, labels }: {
    id?: number;
    centerPosition?: [number, number, number];
    width?: number;
    height?: number;
    barProps?: any;
    labels?: string[];
  }): Model {
    const hexagon = makeHexagon({ id, centerPosition, width, height, barProps, labels, stackIndex: id || 1, hexIndex: 1 });
    hexagon.Parent = this.getMyStuffFolder();
    return hexagon;
  }
} 