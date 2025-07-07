import { Players } from "@rbxts/services";
import { Node } from "../../../shared/interfaces/simpleDataGenerator.interface";

export class NodePropertiesInspectorService {
  private static instance: NodePropertiesInspectorService;
  private gui?: ScreenGui;
  private panel?: Frame;
  private currentNode?: Node;
  private clickConnection?: RBXScriptConnection;

  private constructor() {}

  public static getInstance(): NodePropertiesInspectorService {
    if (!NodePropertiesInspectorService.instance) {
      NodePropertiesInspectorService.instance = new NodePropertiesInspectorService();
    }
    return NodePropertiesInspectorService.instance;
  }

  public initialize(): void {
    const player = Players.LocalPlayer;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

    // Create the GUI
    this.gui = new Instance("ScreenGui");
    this.gui.Name = "NodePropertiesInspector";
    this.gui.ResetOnSpawn = false;
    this.gui.Parent = playerGui;

    // Create the panel
    this.createPanel();

    // Set up click detection
    this.setupClickDetection();
  }

  private createPanel(): void {
    if (!this.gui) return;

    // Create main panel frame
    this.panel = new Instance("Frame");
    this.panel.Name = "PropertiesPanel";
    this.panel.Size = new UDim2(0, 300, 0, 400);
    this.panel.Position = new UDim2(1, -310, 0, 10); // Upper right corner
    this.panel.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
    this.panel.BorderSizePixel = 0;
    this.panel.Visible = false;
    this.panel.Parent = this.gui;

    // Add corner radius
    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 8);
    corner.Parent = this.panel;

    // Add title bar
    const titleBar = new Instance("Frame");
    titleBar.Name = "TitleBar";
    titleBar.Size = new UDim2(1, 0, 0, 40);
    titleBar.Position = new UDim2(0, 0, 0, 0);
    titleBar.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
    titleBar.BorderSizePixel = 0;
    titleBar.Parent = this.panel;

    const titleCorner = new Instance("UICorner");
    titleCorner.CornerRadius = new UDim(0, 8);
    titleCorner.Parent = titleBar;

    // Fix bottom corners of title bar
    const titleFix = new Instance("Frame");
    titleFix.Size = new UDim2(1, 0, 0, 8);
    titleFix.Position = new UDim2(0, 0, 1, -8);
    titleFix.BackgroundColor3 = new Color3(0.1, 0.1, 0.1);
    titleFix.BorderSizePixel = 0;
    titleFix.Parent = titleBar;

    // Add title text
    const titleText = new Instance("TextLabel");
    titleText.Name = "Title";
    titleText.Size = new UDim2(1, -50, 1, 0);
    titleText.Position = new UDim2(0, 10, 0, 0);
    titleText.BackgroundTransparency = 1;
    titleText.Text = "Node Properties";
    titleText.TextColor3 = new Color3(1, 1, 1);
    titleText.TextScaled = true;
    titleText.Font = Enum.Font.SourceSansBold;
    titleText.TextXAlignment = Enum.TextXAlignment.Left;
    titleText.Parent = titleBar;

    // Add close button
    const closeButton = new Instance("TextButton");
    closeButton.Name = "CloseButton";
    closeButton.Size = new UDim2(0, 30, 0, 30);
    closeButton.Position = new UDim2(1, -35, 0.5, -15);
    closeButton.BackgroundColor3 = new Color3(0.8, 0.2, 0.2);
    closeButton.Text = "X";
    closeButton.TextColor3 = new Color3(1, 1, 1);
    closeButton.TextScaled = true;
    closeButton.Font = Enum.Font.SourceSansBold;
    closeButton.Parent = titleBar;

    const closeCorner = new Instance("UICorner");
    closeCorner.CornerRadius = new UDim(0, 4);
    closeCorner.Parent = closeButton;

    closeButton.MouseButton1Click.Connect(() => {
      this.hide();
    });

    // Create scrolling frame for properties
    const scrollFrame = new Instance("ScrollingFrame");
    scrollFrame.Name = "PropertiesScroll";
    scrollFrame.Size = new UDim2(1, -20, 1, -60);
    scrollFrame.Position = new UDim2(0, 10, 0, 50);
    scrollFrame.BackgroundTransparency = 1;
    scrollFrame.BorderSizePixel = 0;
    scrollFrame.ScrollBarThickness = 6;
    scrollFrame.CanvasSize = new UDim2(0, 0, 0, 0);
    scrollFrame.Parent = this.panel;

    // Create list layout
    const listLayout = new Instance("UIListLayout");
    listLayout.SortOrder = Enum.SortOrder.LayoutOrder;
    listLayout.Padding = new UDim(0, 5);
    listLayout.Parent = scrollFrame;

    // Update canvas size when layout changes
    listLayout.GetPropertyChangedSignal("AbsoluteContentSize").Connect(() => {
      scrollFrame.CanvasSize = new UDim2(0, 0, 0, listLayout.AbsoluteContentSize.Y);
    });
  }

  private setupClickDetection(): void {
    const player = Players.LocalPlayer;
    const mouse = player.GetMouse();

    mouse.Button1Down.Connect(() => {
      const target = mouse.Target;
      if (!target) return;

      // Check if the target is part of a hexagon
      const model = target.FindFirstAncestorOfClass("Model");
      if (!model) return;

      // Check if it's a hexagon model (has guid attribute)
      const guid = model.GetAttribute("guid") as string | undefined;
      if (!guid) return;

      // Find the node data
      const node = this.findNodeByGuid(guid);
      if (node) {
        this.showNodeProperties(node);
      }
    });
  }

  private findNodeByGuid(guid: string): Node | undefined {
    // This will need to be connected to the actual node data
    // For now, we'll store nodes in the model as attributes
    const workspace = game.GetService("Workspace");
    const graphMaker = workspace.FindFirstChild("GraphMaker", true);
    if (!graphMaker) return;

    const nodesFolder = graphMaker.FindFirstChild("Nodes", true);
    if (!nodesFolder) return;

    // Look for the model with matching guid
    for (const child of nodesFolder.GetChildren()) {
      if (child.IsA("Model") && child.GetAttribute("guid") === guid) {
        // Reconstruct node data from attributes
        const node: Node = {
          uuid: guid,
          name: child.GetAttribute("nodeName") as string || "",
          type: child.GetAttribute("nodeType") as string || "",
          color: [0, 0, 0], // We don't need color for display
          position: { x: 0, y: 0, z: 0 }, // We don't need position for display
          attachmentNames: [],
          properties: {}
        };

        // Get all properties
        const age = child.GetAttribute("age") as number | undefined;
        if (age !== undefined) node.properties!.age = age;

        const petType = child.GetAttribute("petType") as string | undefined;
        if (petType) node.properties!.petType = petType;

        const petColor = child.GetAttribute("petColor") as string | undefined;
        if (petColor) node.properties!.petColor = petColor;

        const firstName = child.GetAttribute("firstName") as string | undefined;
        if (firstName) node.properties!.firstName = firstName;

        const lastName = child.GetAttribute("lastName") as string | undefined;
        if (lastName) node.properties!.lastName = lastName;
        
        const countryOfBirth = child.GetAttribute("countryOfBirth") as string | undefined;
        if (countryOfBirth) node.properties!.countryOfBirth = countryOfBirth;
        
        const countryOfResidence = child.GetAttribute("countryOfResidence") as string | undefined;
        if (countryOfResidence) node.properties!.countryOfResidence = countryOfResidence;

        return node;
      }
    }

    return undefined;
  }

  private showNodeProperties(node: Node): void {
    this.currentNode = node;
    this.updatePropertiesDisplay();
    this.show();
  }

  private updatePropertiesDisplay(): void {
    if (!this.panel || !this.currentNode) return;

    const scrollFrame = this.panel.FindFirstChild("PropertiesScroll") as ScrollingFrame;
    if (!scrollFrame) return;

    // Clear existing properties
    for (const child of scrollFrame.GetChildren()) {
      if (child.IsA("Frame")) {
        child.Destroy();
      }
    }

    // Add node basic properties
    this.addPropertyRow(scrollFrame, "UUID", this.currentNode.uuid, 1);
    this.addPropertyRow(scrollFrame, "Name", this.currentNode.name, 2);
    this.addPropertyRow(scrollFrame, "Type", this.currentNode.type, 3);

    // Add dynamic properties
    let order = 4;
    if (this.currentNode.properties) {
      for (const [key, value] of pairs(this.currentNode.properties)) {
        this.addPropertyRow(scrollFrame, key as string, tostring(value), order);
        order++;
      }
    }
  }

  private addPropertyRow(parent: ScrollingFrame, key: string, value: string, order: number): void {
    const row = new Instance("Frame");
    row.Name = `Property_${key}`;
    row.Size = new UDim2(1, 0, 0, 30);
    row.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
    row.BorderSizePixel = 0;
    row.LayoutOrder = order;
    row.Parent = parent;

    const rowCorner = new Instance("UICorner");
    rowCorner.CornerRadius = new UDim(0, 4);
    rowCorner.Parent = row;

    // Key label
    const keyLabel = new Instance("TextLabel");
    keyLabel.Size = new UDim2(0.4, -5, 1, 0);
    keyLabel.Position = new UDim2(0, 5, 0, 0);
    keyLabel.BackgroundTransparency = 1;
    keyLabel.Text = key + ":";
    keyLabel.TextColor3 = new Color3(0.7, 0.7, 0.7);
    keyLabel.TextScaled = true;
    keyLabel.Font = Enum.Font.SourceSans;
    keyLabel.TextXAlignment = Enum.TextXAlignment.Left;
    keyLabel.Parent = row;

    // Value label
    const valueLabel = new Instance("TextLabel");
    valueLabel.Size = new UDim2(0.6, -5, 1, 0);
    valueLabel.Position = new UDim2(0.4, 0, 0, 0);
    valueLabel.BackgroundTransparency = 1;
    valueLabel.Text = value;
    valueLabel.TextColor3 = new Color3(1, 1, 1);
    valueLabel.TextScaled = true;
    valueLabel.Font = Enum.Font.SourceSans;
    valueLabel.TextXAlignment = Enum.TextXAlignment.Left;
    valueLabel.Parent = row;
  }

  private show(): void {
    if (this.panel) {
      this.panel.Visible = true;
    }
  }

  private hide(): void {
    if (this.panel) {
      this.panel.Visible = false;
    }
  }

  public cleanup(): void {
    if (this.clickConnection) {
      this.clickConnection.Disconnect();
    }
    if (this.gui) {
      this.gui.Destroy();
    }
  }
}