// Cylinder Generator
export function generateCylinder(id, position = [0, 0, 0]) {
  return {
    [`Cylinder${id}`]: {
      $className: "Part",
      $properties: {
        Size: [4, 6, 4], // Tall cylinder
        Position: position,
        Anchored: true,
        Color: [0.2, 0.8, 0.2], // Green
        Material: "Plastic",
        Shape: "Cylinder",
        TopSurface: "Smooth",
        BottomSurface: "Smooth",
      },
    },
  };
}

export default generateCylinder;
