/**
 * Link Types Display Component
 * A read-only GUI that shows every unique link type and their counts
 */

import { GUI_CONSTANTS } from "../constants";

export interface LinkTypeCount {
  type: string;
  count: number;
}

export interface LinkTypesDisplayProps {
  parent: Frame | ScrollingFrame;
  linkTypeCounts: LinkTypeCount[];
}

/**
 * Creates a read-only display showing link types and their counts
 */
export function createLinkTypesDisplay({
  parent,
  linkTypeCounts,
}: LinkTypesDisplayProps): Frame {
  // Create container frame
  const containerFrame = new Instance("Frame");
  containerFrame.Name = "LinkTypesDisplay";
  containerFrame.BackgroundColor3 = GUI_CONSTANTS.COLORS.BACKGROUND;
  containerFrame.BorderSizePixel = 0;
  containerFrame.Size = new UDim2(1, -20, 0, 0); // Height will be calculated
  containerFrame.Parent = parent;

  // Add rounded corners
  const corner = new Instance("UICorner");
  corner.CornerRadius = new UDim(0, 5);
  corner.Parent = containerFrame;

  // Create header
  const headerLabel = new Instance("TextLabel");
  headerLabel.Name = "Header";
  headerLabel.Text = "Link Types";
  headerLabel.Size = new UDim2(1, -20, 0, 30);
  headerLabel.Position = new UDim2(0, 10, 0, 5);
  headerLabel.BackgroundTransparency = 1;
  headerLabel.Font = Enum.Font.SourceSansBold;
  headerLabel.TextSize = 18;
  headerLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  headerLabel.TextXAlignment = Enum.TextXAlignment.Left;
  headerLabel.Parent = containerFrame;

  // Create scrolling frame for link types if there are many
  const scrollFrame = new Instance("ScrollingFrame");
  scrollFrame.Name = "LinkTypesList";
  scrollFrame.Size = new UDim2(1, -20, 0, math.min(linkTypeCounts.size() * 25 + 10, 150));
  scrollFrame.Position = new UDim2(0, 10, 0, 40);
  scrollFrame.BackgroundTransparency = 1;
  scrollFrame.BorderSizePixel = 0;
  scrollFrame.ScrollBarThickness = 4;
  scrollFrame.CanvasSize = new UDim2(0, 0, 0, linkTypeCounts.size() * 25);
  scrollFrame.Parent = containerFrame;

  // Sort link types by count (descending) then by name
  const sortedLinkTypes = [...linkTypeCounts];
  sortedLinkTypes.sort((a, b) => {
    if (a.count !== b.count) {
      return a.count > b.count;
    }
    return a.type < b.type;
  });

  // Create a row for each link type
  sortedLinkTypes.forEach((linkTypeCount, index) => {
    const rowFrame = new Instance("Frame");
    rowFrame.Name = `LinkType_${linkTypeCount.type}`;
    rowFrame.Size = new UDim2(1, -10, 0, 25);
    rowFrame.Position = new UDim2(0, 5, 0, index * 25);
    rowFrame.BackgroundTransparency = 1;
    rowFrame.Parent = scrollFrame;

    // Link type name
    const typeLabel = new Instance("TextLabel");
    typeLabel.Name = "TypeLabel";
    typeLabel.Text = linkTypeCount.type;
    typeLabel.Size = new UDim2(0.7, -5, 1, 0);
    typeLabel.Position = new UDim2(0, 0, 0, 0);
    typeLabel.BackgroundTransparency = 1;
    typeLabel.Font = Enum.Font.SourceSans;
    typeLabel.TextSize = 14;
    typeLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    typeLabel.TextXAlignment = Enum.TextXAlignment.Left;
    typeLabel.Parent = rowFrame;

    // Count
    const countLabel = new Instance("TextLabel");
    countLabel.Name = "CountLabel";
    countLabel.Text = tostring(linkTypeCount.count);
    countLabel.Size = new UDim2(0.3, -5, 1, 0);
    countLabel.Position = new UDim2(0.7, 5, 0, 0);
    countLabel.BackgroundTransparency = 1;
    countLabel.Font = Enum.Font.SourceSans;
    countLabel.TextSize = 14;
    countLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    countLabel.TextXAlignment = Enum.TextXAlignment.Right;
    countLabel.Parent = rowFrame;
  });

  // Add a summary at the bottom
  const summaryLabel = new Instance("TextLabel");
  summaryLabel.Name = "Summary";
  summaryLabel.Text = `Total: ${linkTypeCounts.size()} unique types`;
  summaryLabel.Size = new UDim2(1, -20, 0, 20);
  summaryLabel.Position = new UDim2(0, 10, 0, 40 + scrollFrame.Size.Y.Offset + 5);
  summaryLabel.BackgroundTransparency = 1;
  summaryLabel.Font = Enum.Font.SourceSansItalic;
  summaryLabel.TextSize = 12;
  summaryLabel.TextColor3 = new Color3(0.7, 0.7, 0.7);
  summaryLabel.TextXAlignment = Enum.TextXAlignment.Left;
  summaryLabel.Parent = containerFrame;

  // Calculate total height
  const totalHeight = 40 + scrollFrame.Size.Y.Offset + 35;
  containerFrame.Size = new UDim2(1, -20, 0, totalHeight);

  return containerFrame;
}

/**
 * Updates the link types display with new data
 */
export function updateLinkTypesDisplay(
  displayFrame: Frame,
  linkTypeCounts: LinkTypeCount[]
): void {
  const scrollFrame = displayFrame.FindFirstChild("LinkTypesList") as ScrollingFrame;
  if (!scrollFrame) return;

  // Clear existing rows
  scrollFrame.GetChildren().forEach((child) => {
    if (child.IsA("Frame")) {
      child.Destroy();
    }
  });

  // Sort and recreate rows
  const sortedLinkTypes = [...linkTypeCounts];
  sortedLinkTypes.sort((a, b) => {
    if (a.count !== b.count) {
      return a.count > b.count;
    }
    return a.type < b.type;
  });

  sortedLinkTypes.forEach((linkTypeCount, index) => {
    const rowFrame = new Instance("Frame");
    rowFrame.Name = `LinkType_${linkTypeCount.type}`;
    rowFrame.Size = new UDim2(1, -10, 0, 25);
    rowFrame.Position = new UDim2(0, 5, 0, index * 25);
    rowFrame.BackgroundTransparency = 1;
    rowFrame.Parent = scrollFrame;

    const typeLabel = new Instance("TextLabel");
    typeLabel.Name = "TypeLabel";
    typeLabel.Text = linkTypeCount.type;
    typeLabel.Size = new UDim2(0.7, -5, 1, 0);
    typeLabel.Position = new UDim2(0, 0, 0, 0);
    typeLabel.BackgroundTransparency = 1;
    typeLabel.Font = Enum.Font.SourceSans;
    typeLabel.TextSize = 14;
    typeLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    typeLabel.TextXAlignment = Enum.TextXAlignment.Left;
    typeLabel.Parent = rowFrame;

    const countLabel = new Instance("TextLabel");
    countLabel.Name = "CountLabel";
    countLabel.Text = tostring(linkTypeCount.count);
    countLabel.Size = new UDim2(0.3, -5, 1, 0);
    countLabel.Position = new UDim2(0.7, 5, 0, 0);
    countLabel.BackgroundTransparency = 1;
    countLabel.Font = Enum.Font.SourceSans;
    countLabel.TextSize = 14;
    countLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    countLabel.TextXAlignment = Enum.TextXAlignment.Right;
    countLabel.Parent = rowFrame;
  });

  // Update canvas size
  scrollFrame.CanvasSize = new UDim2(0, 0, 0, linkTypeCounts.size() * 25);

  // Update summary
  const summaryLabel = displayFrame.FindFirstChild("Summary") as TextLabel;
  if (summaryLabel) {
    summaryLabel.Text = `Total: ${linkTypeCounts.size()} unique types`;
  }
}