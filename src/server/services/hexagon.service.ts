import { Workspace } from "@rbxts/services";
import { makeHexagon } from "../../shared/modules/hexagonMaker";

export class HexagonService {
  public createHexagon({ id, centerPosition, width, height, barProps, labels }: {
    id?: number;
    centerPosition?: [number, number, number];
    width?: number;
    height?: number;
    barProps?: any;
    labels?: string[];
  }): Model {
    const hexagon = makeHexagon({ id, centerPosition, width, height, barProps, labels });
    hexagon.Parent = Workspace;
    return hexagon;
  }
} 