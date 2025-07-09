/**
 * Origin Block Module
 * Creates a labeled orientation reference block
 */

// Legacy function signature for backward compatibility
import { makeLabelBlock } from "./labelBlockMaker";

export interface OriginBlockConfig {
  origin: { x: number; y: number; z: number };
  parent: Instance;
  offset?: { x: number; y: number; z: number };
  size?: number;
}

/**
 * Creates an orientation reference block with labeled faces
 */
export function makeOriginBlock({
  origin,
  parent,
  offset = { x: 0, y: 0, z: 0 },
  size = 4
}: OriginBlockConfig): Part {
  const orientationFolder = new Instance("Folder");
  orientationFolder.Name = "OrientationReference";
  orientationFolder.Parent = parent;

  const block = makeLabelBlock({
    id: "orientation-ref",
    text: "ORIENT", // Required text field
    position: new Vector3(
      origin.x + offset.x,
      origin.y + offset.y,
      origin.z + offset.z
    ),
    size: size,
    color: new Color3(0.3, 0.3, 0.3), // Dark gray
    transparency: 0.2,
    material: Enum.Material.SmoothPlastic,
    anchored: true,
    castShadow: false,
    labels: {
      front: {
        text: "FRONT\nX-Y",
        textColor: new Color3(0, 0, 0.8), // Dark blue text
        backgroundColor: new Color3(0.5, 0.5, 0.8), // Medium blue background
        borderColor: new Color3(0, 0, 0.3), // Very dark blue border
      },
      back: {
        text: "BACK\nX-Y",
        textColor: new Color3(0, 0, 0.8), // Dark blue text
        backgroundColor: new Color3(0.5, 0.5, 0.8), // Medium blue background
        borderColor: new Color3(0, 0, 0.3), // Very dark blue border
      },
      left: {
        text: "LEFT\nZ-Y",
        textColor: new Color3(0.8, 0, 0), // Dark red text
        backgroundColor: new Color3(0.8, 0.5, 0.5), // Medium red background
        borderColor: new Color3(0.3, 0, 0), // Very dark red border
      },
      right: {
        text: "RIGHT\nZ-Y",
        textColor: new Color3(0.8, 0, 0), // Dark red text
        backgroundColor: new Color3(0.8, 0.5, 0.5), // Medium red background
        borderColor: new Color3(0.3, 0, 0), // Very dark red border
      },
      top: {
        text: "TOP\nX-Y",
        textColor: new Color3(0, 0.8, 0), // Dark green text
        backgroundColor: new Color3(0.5, 0.8, 0.5), // Medium green background
        borderColor: new Color3(0, 0.3, 0), // Very dark green border
      },
      bottom: {
        text: "BOTTOM\nX-Y",
        textColor: new Color3(0, 0.8, 0), // Dark green text
        backgroundColor: new Color3(0.5, 0.8, 0.5), // Medium green background
        borderColor: new Color3(0, 0.3, 0), // Very dark green border
      },
    },
    textBoxOverrides: {
      textSize: 50, // Reduced by 50% from 100
      font: Enum.Font.SourceSansBold,
      borderSizePixel: 10, // Wider borders for better visibility
    },
    parent: orientationFolder,
  });

  
  return block;
}