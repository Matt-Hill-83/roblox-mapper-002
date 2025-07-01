// Square Generator
export function generateSquare(id, position = [0, 0, 0]) {
  return {
    [`Square${id}`]: {
      $className: "Part",
      $properties: {
        Size: [3, 3, 3], // Perfect cube/square
        Position: position,
        Anchored: true,
        Color: [0.8, 0.2, 0.2], // Red
        Material: "Plastic",
        Shape: "Block",
        TopSurface: "Smooth",
        BottomSurface: "Smooth",
      },
    },
  };
}

export default generateSquare;
