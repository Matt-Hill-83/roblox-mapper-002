export function blockMaker(size: Vector3, position: Vector3, parent: Instance): Part {
  const block = new Instance("Part");
  block.Name = "Block";
  block.Size = size;
  block.Position = position;
  block.Anchored = true;
  block.TopSurface = Enum.SurfaceType.Smooth;
  block.BottomSurface = Enum.SurfaceType.Smooth;
  block.Material = Enum.Material.SmoothPlastic;
  block.Color = new Color3(math.random(), math.random(), math.random());
  block.CanCollide = false;
  block.Parent = parent;

  return block;
}