import { Workspace } from "@rbxts/services";
import { makeBar } from "../../shared/modules/barMaker";

export class BarService {
  public createBar({ id, position, rotation, props, label }: {
    id: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    props?: any;
    label?: string;
  }): Part {
    const bar = makeBar({ id, position, rotation, props, label });
    bar.Parent = Workspace;
    return bar;
  }
} 