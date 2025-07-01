// Rectangle Generator
export function generateRectangle(id, position = [0, 0, 0]) {
  return {
    [`Rectangle${id}`]: {
      $className: "Part",
      $properties: {
        Size: [4, 2, 8], // Rectangle: wider and longer than tall
        Position: position,
        Anchored: true,
        Color: [0.2, 0.4, 0.8], // Blue
        Material: "Plastic",
        Shape: "Block",
        TopSurface: "Smooth",
        BottomSurface: "Smooth",
      },
    },
  };
}

export default generateRectangle;
