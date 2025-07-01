import { Workspace } from "@rbxts/services";

export class PartService {
    public createPart(): Part {
        const part = new Instance("Part");
        part.Parent = Workspace;
        part.Anchored = false;
        part.Size = new Vector3(4, 4, 4);
        part.Position = new Vector3(math.random(-50, 50), 20, math.random(-50, 50));
        part.Color = Color3.fromRGB(0, 0, 255);
        return part;
    }
}
