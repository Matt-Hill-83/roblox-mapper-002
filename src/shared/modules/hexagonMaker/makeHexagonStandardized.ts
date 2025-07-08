/**
 * Standardized hexagon maker following IMaker pattern
 */

import { makeBar } from "../barMaker/barMakerAdapter";
import { HEXAGON_CONSTANTS } from "./constants";
import {
  generateHexagonName,
  createCenterCube,
  createCenterAttachment,
  calculateBarDimensions
} from "./utilities";
import { createTextBox } from "../TextBoxMaker";
import { IHexagonMakerConfig } from "./standardizedInterfaces";

/**
 * Creates a hexagon model with standardized configuration
 * @param config - Standardized hexagon configuration
 * @returns The created hexagon model
 */
export function makeHexagonStandardized(config: IHexagonMakerConfig): Model {
  // Extract configuration with defaults
  const {
    id = 1,
    position = new Vector3(0, 0, 0),
    width = HEXAGON_CONSTANTS.DEFAULT_WIDTH,
    height = HEXAGON_CONSTANTS.DEFAULT_HEIGHT,
    labels = HEXAGON_CONSTANTS.DEFAULT_LABELS,
    stackIndex = 1,
    hexIndex = 1,
    guid,
    barColor = new Color3(
      HEXAGON_CONSTANTS.DEFAULT_BAR_COLOR[0],
      HEXAGON_CONSTANTS.DEFAULT_BAR_COLOR[1],
      HEXAGON_CONSTANTS.DEFAULT_BAR_COLOR[2]
    ),
    barMaterial = Enum.Material.SmoothPlastic,
    barTransparency = 0,
    parent,
  } = config;

  // Calculate bar dimensions
  const dimensions = calculateBarDimensions(width, height);

  // Create the hexagon model
  const hexModel = new Instance("Model");
  const hexagonName = generateHexagonName(stackIndex, hexIndex);
  hexModel.Name = hexagonName;

  // Set GUID as attribute if provided
  if (guid) {
    hexModel.SetAttribute("guid", guid);
  }

  // Create center cube and attachment
  const centerCube = createCenterCube(
    [position.X, position.Y, position.Z], // Convert back to array for compatibility
    hexIndex,
    stackIndex
  );
  centerCube.Parent = hexModel;
  
  // Set the center cube as the primary part for positioning
  hexModel.PrimaryPart = centerCube;
  
  createCenterAttachment(centerCube, hexIndex, stackIndex);

  // Create 3 bars rotated 60 degrees apart
  for (let i = 0; i < HEXAGON_CONSTANTS.NUM_BARS; i++) {
    const rotation = i * HEXAGON_CONSTANTS.ROTATION_ANGLE; // 0°, 60°, 120°

    // Slightly raise the first bar to avoid z-fighting with the top label
    const yOffset = i === 0 ? 0.001 : 0;
    
    const bar = makeBar({
      id: `${id}_bar${i + 1}`,
      position: {
        x: position.X,
        y: position.Y + yOffset,
        z: position.Z,
      },
      rotation: { x: 0, y: rotation, z: 0 },
      props: {
        Size: [dimensions.barLength, dimensions.barHeight, dimensions.barWidth],
        Color: [barColor.R, barColor.G, barColor.B],
        Material: barMaterial.Name,
        Transparency: barTransparency,
      },
      label: labels[i] || `Bar${i + 1}`,
      stackIndex: stackIndex,
      hexIndex: hexIndex,
      barIndex: i + 1,
    });

    bar.Parent = hexModel;
    
    // Add top label on the first bar only
    if (i === 0 && labels.size() > 0) {
      createTextBox({
        part: bar,
        face: Enum.NormalId.Top,
        text: labels[0], // Use the first label (node name)
      });
    }
  }

  // Set parent if provided
  if (parent) {
    hexModel.Parent = parent;
  }

  return hexModel;
}