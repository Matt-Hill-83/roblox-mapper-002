import { makeLabelBlock, makeLabelBlockAllFaces } from "../../shared/modules/labelBlockMaker";

export class TestLabelBlockService {
  /**
   * Tests the label block primitive with various configurations
   */
  public testLabelBlocks(parentFolder: Folder): void {
    print("🧪 Testing label block primitive...");

    // Test 1: Basic label block with text on all faces
    makeLabelBlockAllFaces({
      id: "1",
      position: { x: 0, y: 10, z: 0 },
      text: "Level 1",
      parent: parentFolder,
    });
    print("✅ Test 1: Created label block with same text on all faces");

    // Test 2: Label block with different text on each face
    makeLabelBlock({
      id: "2",
      position: { x: 20, y: 10, z: 0 },
      props: {
        Size: 10,
        Color: [0.2, 0.4, 0.8], // Blue
      },
      labels: {
        top: { text: "TOP" },
        bottom: { text: "BOTTOM" },
        front: { text: "FRONT" },
        back: { text: "BACK" },
        left: { text: "LEFT" },
        right: { text: "RIGHT" },
      },
      parent: parentFolder,
    });
    print("✅ Test 2: Created label block with different text on each face");

    // Test 3: Label block with custom styling
    makeLabelBlock({
      id: "3",
      position: { x: 40, y: 10, z: 0 },
      props: {
        Size: 12,
        Color: [0.8, 0.4, 0.2], // Orange
      },
      labels: {
        front: {
          text: "Custom Style",
          textSize: 36,
          textColor: new Color3(1, 1, 1), // White text
          backgroundColor: new Color3(0, 0, 0), // Black background
          font: Enum.Font.SourceSansBold,
        },
        top: {
          text: "Level 2",
          textSize: 48,
          textColor: new Color3(0, 0, 1), // Blue text
        },
      },
      parent: parentFolder,
    });
    print("✅ Test 3: Created label block with custom styling");

    // Test 4: Small cube matching hex width
    const hexWidth = 8; // Standard hex width
    makeLabelBlockAllFaces({
      id: "4",
      position: { x: 60, y: 10, z: 0 },
      props: {
        Size: hexWidth,
        Color: [0.6, 0.6, 0.6], // Gray
      },
      text: "Row End",
      textProps: {
        textSize: 24,
        textColor: new Color3(0, 0, 0),
      },
      parent: parentFolder,
    });
    print("✅ Test 4: Created label block matching hex width");

    // Test 5: Rotated label block
    makeLabelBlockAllFaces({
      id: "5",
      position: { x: 80, y: 10, z: 0 },
      rotation: { x: 45, y: 45, z: 0 },
      props: {
        Size: 10,
        Color: [0.4, 0.8, 0.4], // Green
      },
      text: "Rotated",
      parent: parentFolder,
    });
    print("✅ Test 5: Created rotated label block");

    print("🎉 All label block tests completed!");
  }
}