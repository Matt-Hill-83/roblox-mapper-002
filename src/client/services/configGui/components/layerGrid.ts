import { GUI_CONSTANTS } from "../constants";
import { LayerConfig } from "../interfaces";

interface LayerGridProps {
  parent: Frame;
  onLayerUpdate: (layers: LayerConfig[]) => void;
  nodeTypes: string[];
  linkTypes: string[];
  initialLayers?: LayerConfig[];
}

interface LayerRow {
  frame: Frame;
  config: LayerConfig;
}

export function createLayerGrid({
  parent,
  onLayerUpdate,
  nodeTypes,
  linkTypes,
  initialLayers
}: LayerGridProps): Frame {
  const layers: LayerRow[] = [];
  
  // Create container for the grid
  const gridContainer = new Instance("Frame");
  gridContainer.Name = "LayerGrid";
  gridContainer.Size = new UDim2(1, -20, 1, -GUI_CONSTANTS.ENHANCED.GLOBAL_SETTINGS_HEIGHT - 80);
  gridContainer.Position = new UDim2(0, 10, 0, GUI_CONSTANTS.ENHANCED.GLOBAL_SETTINGS_HEIGHT + 10);
  gridContainer.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
  gridContainer.BorderSizePixel = 0;
  gridContainer.Parent = parent;

  const gridCorner = new Instance("UICorner");
  gridCorner.CornerRadius = new UDim(0, 4);
  gridCorner.Parent = gridContainer;

  // Create header
  createGridHeader(gridContainer);

  // Create scrolling frame for rows
  const scrollFrame = new Instance("ScrollingFrame");
  scrollFrame.Name = "LayerRows";
  scrollFrame.Size = new UDim2(1, -10, 1, -GUI_CONSTANTS.ENHANCED.GRID_HEADER_HEIGHT - 40);
  scrollFrame.Position = new UDim2(0, 5, 0, GUI_CONSTANTS.ENHANCED.GRID_HEADER_HEIGHT);
  scrollFrame.BackgroundTransparency = 1;
  scrollFrame.BorderSizePixel = 0;
  scrollFrame.ScrollBarThickness = 6;
  scrollFrame.CanvasSize = new UDim2(0, 0, 0, 0);
  scrollFrame.Parent = gridContainer;

  // Create list layout for rows
  const rowLayout = new Instance("UIListLayout");
  rowLayout.SortOrder = Enum.SortOrder.LayoutOrder;
  rowLayout.Padding = new UDim(0, 2);
  rowLayout.Parent = scrollFrame;

  // Function to update canvas size
  const updateCanvasSize = () => {
    const contentHeight = (layers.size() * (GUI_CONSTANTS.ENHANCED.GRID_ROW_HEIGHT + 2)) + 40;
    scrollFrame.CanvasSize = new UDim2(0, 0, 0, contentHeight);
  };

  // Function to notify about layer changes
  const notifyLayerChange = () => {
    const configs = layers.map(row => row.config);
    onLayerUpdate(configs);
  };

  // Function to add a new layer
  const addLayer = () => {
    if (layers.size() >= GUI_CONSTANTS.ENHANCED.MAX_LAYERS) {
      return;
    }

    const layerNumber = layers.size() + 1;
    const layerConfig: LayerConfig = {
      layerNumber,
      numNodes: 1,
      connectionsPerNode: 2,
      nodeType: nodeTypes[0],
      linkType: linkTypes[0]
    };

    const row = createLayerRow({
      parent: scrollFrame,
      config: layerConfig,
      nodeTypes,
      linkTypes,
      onUpdate: (updatedConfig) => {
        const index = layers.findIndex(r => r.config.layerNumber === updatedConfig.layerNumber);
        if (index >= 0) {
          layers[index].config = updatedConfig;
          notifyLayerChange();
        }
      },
      onDelete: () => {
        const index = layers.findIndex(r => r.config.layerNumber === layerConfig.layerNumber);
        if (index >= 0) {
          layers[index].frame.Destroy();
          layers.remove(index);
          // Renumber remaining layers
          layers.forEach((row, idx) => {
            row.config.layerNumber = idx + 1;
            updateLayerNumber(row.frame, idx + 1);
          });
          updateCanvasSize();
          notifyLayerChange();
        }
      }
    });

    layers.push({ frame: row, config: layerConfig });
    updateCanvasSize();
    notifyLayerChange();
  };

  // Create Add Layer button
  const addButton = new Instance("TextButton");
  addButton.Name = "AddLayerButton";
  addButton.Size = new UDim2(0, 120, 0, 30);
  addButton.Position = new UDim2(0, 5, 1, -35);
  addButton.BackgroundColor3 = GUI_CONSTANTS.COLORS.BUTTON.DEFAULT;
  addButton.BorderSizePixel = 0;
  addButton.Font = GUI_CONSTANTS.TYPOGRAPHY.BUTTON_FONT;
  addButton.Text = "[+] Add Layer";
  addButton.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  addButton.TextScaled = true;
  addButton.Parent = gridContainer;

  const addButtonCorner = new Instance("UICorner");
  addButtonCorner.CornerRadius = new UDim(0, 4);
  addButtonCorner.Parent = addButton;

  addButton.MouseButton1Click.Connect(addLayer);

  // Add initial layers from config or default to 3 empty layers
  print(`🔍 LayerGrid: initialLayers = ${initialLayers ? tostring(initialLayers.size()) : "undefined"}`);
  if (initialLayers && initialLayers.size() > 0) {
    print(`✅ Creating ${initialLayers.size()} layers from initial config`);
    initialLayers.forEach((layerConfig) => {
      print(`  - Layer ${layerConfig.layerNumber}: ${layerConfig.numNodes} nodes, ${layerConfig.connectionsPerNode} connections`);
      const row = createLayerRow({
        parent: scrollFrame,
        config: layerConfig,
        nodeTypes,
        linkTypes,
        onUpdate: (updatedConfig) => {
          const index = layers.findIndex(r => r.config.layerNumber === updatedConfig.layerNumber);
          if (index >= 0) {
            layers[index].config = updatedConfig;
            notifyLayerChange();
          }
        },
        onDelete: () => {
          const index = layers.findIndex(r => r.config.layerNumber === layerConfig.layerNumber);
          if (index >= 0) {
            layers[index].frame.Destroy();
            layers.remove(index);
            // Renumber remaining layers
            layers.forEach((row, idx) => {
              row.config.layerNumber = idx + 1;
              updateLayerNumber(row.frame, idx + 1);
            });
            updateCanvasSize();
            notifyLayerChange();
          }
        }
      });
      layers.push({ frame: row, config: layerConfig });
    });
    updateCanvasSize();
  } else {
    print("❌ No initial layers provided, creating 3 empty layers");
    // Default to 3 empty layers
    for (let i = 0; i < 3; i++) {
      addLayer();
    }
  }

  return gridContainer;
}

function createGridHeader(parent: Frame): Frame {
  const header = new Instance("Frame");
  header.Name = "GridHeader";
  header.Size = new UDim2(1, -10, 0, GUI_CONSTANTS.ENHANCED.GRID_HEADER_HEIGHT);
  header.Position = new UDim2(0, 5, 0, 5);
  header.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
  header.BorderSizePixel = 0;
  header.Parent = parent;

  const headerCorner = new Instance("UICorner");
  headerCorner.CornerRadius = new UDim(0, 4);
  headerCorner.Parent = header;

  // Create column headers
  const columns = [
    { text: "Layer", width: GUI_CONSTANTS.ENHANCED.COLUMN_WIDTHS.LAYER },
    { text: "# Nodes", width: GUI_CONSTANTS.ENHANCED.COLUMN_WIDTHS.NODES },
    { text: "Connections/Node", width: GUI_CONSTANTS.ENHANCED.COLUMN_WIDTHS.CONNECTIONS },
    { text: "Del", width: GUI_CONSTANTS.ENHANCED.COLUMN_WIDTHS.DELETE }
  ];

  let xOffset = 5;
  columns.forEach(col => {
    const label = new Instance("TextLabel");
    label.Size = new UDim2(0, col.width, 1, 0);
    label.Position = new UDim2(0, xOffset, 0, 0);
    label.BackgroundTransparency = 1;
    label.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
    label.Text = col.text;
    label.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
    label.TextScaled = true;
    label.Parent = header;
    xOffset += col.width + 5;
  });

  return header;
}

interface LayerRowProps {
  parent: ScrollingFrame;
  config: LayerConfig;
  nodeTypes: string[];
  linkTypes: string[];
  onUpdate: (config: LayerConfig) => void;
  onDelete: () => void;
}

function createLayerRow({
  parent,
  config,
  nodeTypes,
  linkTypes,
  onUpdate,
  onDelete
}: LayerRowProps): Frame {
  const row = new Instance("Frame");
  row.Name = `LayerRow_${config.layerNumber}`;
  row.Size = new UDim2(1, 0, 0, GUI_CONSTANTS.ENHANCED.GRID_ROW_HEIGHT);
  row.BackgroundColor3 = new Color3(0.18, 0.18, 0.18);
  row.BorderSizePixel = 0;
  row.Parent = parent;

  const rowCorner = new Instance("UICorner");
  rowCorner.CornerRadius = new UDim(0, 4);
  rowCorner.Parent = row;

  let xOffset = 5;

  // Layer number (read-only)
  const layerLabel = new Instance("TextLabel");
  layerLabel.Name = "LayerNumber";
  layerLabel.Size = new UDim2(0, GUI_CONSTANTS.ENHANCED.COLUMN_WIDTHS.LAYER, 1, -4);
  layerLabel.Position = new UDim2(0, xOffset, 0, 2);
  layerLabel.BackgroundTransparency = 1;
  layerLabel.Font = GUI_CONSTANTS.TYPOGRAPHY.LABEL_FONT;
  layerLabel.Text = tostring(config.layerNumber);
  layerLabel.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  layerLabel.TextScaled = true;
  layerLabel.Parent = row;
  xOffset += GUI_CONSTANTS.ENHANCED.COLUMN_WIDTHS.LAYER + 5;

  // Number of nodes input
  const nodesInput = new Instance("TextBox");
  nodesInput.Name = "NodesInput";
  nodesInput.Size = new UDim2(0, GUI_CONSTANTS.ENHANCED.COLUMN_WIDTHS.NODES, 1, -4);
  nodesInput.Position = new UDim2(0, xOffset, 0, 2);
  nodesInput.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
  nodesInput.BorderSizePixel = 0;
  nodesInput.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
  nodesInput.Text = tostring(config.numNodes);
  nodesInput.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  nodesInput.TextScaled = true;
  nodesInput.Parent = row;
  xOffset += GUI_CONSTANTS.ENHANCED.COLUMN_WIDTHS.NODES + 5;

  const nodesCorner = new Instance("UICorner");
  nodesCorner.CornerRadius = new UDim(0, 4);
  nodesCorner.Parent = nodesInput;

  // Connections per node input
  const connectionsInput = new Instance("TextBox");
  connectionsInput.Name = "ConnectionsInput";
  connectionsInput.Size = new UDim2(0, GUI_CONSTANTS.ENHANCED.COLUMN_WIDTHS.CONNECTIONS, 1, -4);
  connectionsInput.Position = new UDim2(0, xOffset, 0, 2);
  connectionsInput.BackgroundColor3 = new Color3(0.25, 0.25, 0.25);
  connectionsInput.BorderSizePixel = 0;
  connectionsInput.Font = GUI_CONSTANTS.TYPOGRAPHY.INPUT_FONT;
  connectionsInput.Text = tostring(config.connectionsPerNode);
  connectionsInput.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  connectionsInput.TextScaled = true;
  connectionsInput.Parent = row;
  xOffset += GUI_CONSTANTS.ENHANCED.COLUMN_WIDTHS.CONNECTIONS + 5;

  const connectionsCorner = new Instance("UICorner");
  connectionsCorner.CornerRadius = new UDim(0, 4);
  connectionsCorner.Parent = connectionsInput;

  // Delete button
  const deleteButton = new Instance("TextButton");
  deleteButton.Name = "DeleteButton";
  deleteButton.Size = new UDim2(0, GUI_CONSTANTS.ENHANCED.COLUMN_WIDTHS.DELETE, 1, -4);
  deleteButton.Position = new UDim2(0, xOffset, 0, 2);
  deleteButton.BackgroundColor3 = GUI_CONSTANTS.COLORS.ERROR;
  deleteButton.BorderSizePixel = 0;
  deleteButton.Font = GUI_CONSTANTS.TYPOGRAPHY.BUTTON_FONT;
  deleteButton.Text = "[X]";
  deleteButton.TextColor3 = GUI_CONSTANTS.COLORS.TEXT;
  deleteButton.TextScaled = true;
  deleteButton.Parent = row;

  const deleteCorner = new Instance("UICorner");
  deleteCorner.CornerRadius = new UDim(0, 4);
  deleteCorner.Parent = deleteButton;

  deleteButton.MouseButton1Click.Connect(onDelete);

  // Input validation
  nodesInput.FocusLost.Connect(() => {
    const value = tonumber(nodesInput.Text);
    if (value && value > 0) {
      config.numNodes = math.floor(value);
      nodesInput.Text = tostring(config.numNodes);
      onUpdate(config);
    } else {
      nodesInput.Text = tostring(config.numNodes);
    }
  });

  connectionsInput.FocusLost.Connect(() => {
    const value = tonumber(connectionsInput.Text);
    if (value && value >= 0) {
      config.connectionsPerNode = math.floor(value);
      connectionsInput.Text = tostring(config.connectionsPerNode);
      onUpdate(config);
    } else {
      connectionsInput.Text = tostring(config.connectionsPerNode);
    }
  });

  return row;
}

function updateLayerNumber(row: Frame, newNumber: number): void {
  const layerLabel = row.FindFirstChild("LayerNumber") as TextLabel;
  if (layerLabel) {
    layerLabel.Text = tostring(newNumber);
  }
}