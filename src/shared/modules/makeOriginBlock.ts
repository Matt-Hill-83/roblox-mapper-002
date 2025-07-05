import { makeLabelBlock } from "./labelBlockMaker";

interface OriginBlockConfig {
  origin: { x: number; y: number; z: number };
  parent: Instance;
  offset?: { x: number; y: number; z: number };
  size?: number;
}

/**
 * Creates an orientation reference block to help users understand the 3D space
 * The block has labeled faces (FRONT, BACK, LEFT, RIGHT, TOP, BOTTOM) with color coding
 */
export function makeOriginBlock({
  origin,
  parent,
  offset = { x: -20, y: 20, z: -20 },
  size = 4
}: OriginBlockConfig): Part {
  const orientationFolder = new Instance("Folder");
  orientationFolder.Name = "OrientationReference";
  orientationFolder.Parent = parent;

  const block = makeLabelBlock({
    id: "orientation-ref",
    position: {
      x: origin.x + offset.x,
      y: origin.y + offset.y,
      z: origin.z + offset.z,
    },
    props: {
      Size: size,
      Color: [0.3, 0.3, 0.3], // Dark gray
      Transparency: 0.2,
      Material: "Neon",
      CanCollide: false,
      CastShadow: false,
    },
    labels: {
      front: {
        text: "FRONT",
        textColor: new Color3(0, 0, 0.8), // Dark blue text
        backgroundColor: new Color3(0.5, 0.5, 0.8), // Medium blue background
        borderColor: new Color3(0, 0, 0.3), // Very dark blue border
      },
      back: {
        text: "BACK",
        textColor: new Color3(0, 0, 0.8), // Dark blue text
        backgroundColor: new Color3(0.5, 0.5, 0.8), // Medium blue background
        borderColor: new Color3(0, 0, 0.3), // Very dark blue border
      },
      left: {
        text: "LEFT",
        textColor: new Color3(0.8, 0, 0), // Dark red text
        backgroundColor: new Color3(0.8, 0.5, 0.5), // Medium red background
        borderColor: new Color3(0.3, 0, 0), // Very dark red border
      },
      right: {
        text: "RIGHT",
        textColor: new Color3(0.8, 0, 0), // Dark red text
        backgroundColor: new Color3(0.8, 0.5, 0.5), // Medium red background
        borderColor: new Color3(0.3, 0, 0), // Very dark red border
      },
      top: {
        text: "TOP",
        textColor: new Color3(0, 0.8, 0), // Dark green text
        backgroundColor: new Color3(0.5, 0.8, 0.5), // Medium green background
        borderColor: new Color3(0, 0.3, 0), // Very dark green border
      },
      bottom: {
        text: "BOTTOM",
        textColor: new Color3(0, 0.8, 0), // Dark green text
        backgroundColor: new Color3(0.5, 0.8, 0.5), // Medium green background
        borderColor: new Color3(0, 0.3, 0), // Very dark green border
      },
    },
    textBoxOverrides: {
      textSize: 100, // Maximum font size in Roblox
      font: Enum.Font.SourceSansBold,
      borderSizePixel: 10, // Wider borders for better visibility
    },
    parent: orientationFolder,
  });

  print("🧭 Created orientation reference block");
  
  return block;
}