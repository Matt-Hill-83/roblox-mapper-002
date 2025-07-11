import { BaseService } from "../../shared/services/base/BaseService";
import { LinkHighlightService } from "./linkHighlight/linkHighlight.service";

export class NodeClickHandlerService extends BaseService {
  private linkHighlightService: LinkHighlightService;
  private clickDetectors: Map<ClickDetector, string> = new Map();

  constructor(linkHighlightService: LinkHighlightService) {
    super("NodeClickHandlerService");
    this.linkHighlightService = linkHighlightService;
  }

  /**
   * Add click detection to all nodes in the graph
   */
  public setupNodeClickHandlers(nodesFolder: Folder): void {
    // Clear existing click detectors
    this.clearClickDetectors();

    // Find all hexagon models
    nodesFolder.GetDescendants().forEach((desc) => {
      if (desc.IsA("Model") && desc.Name.match("^hex[0-9]+")) {
        const hexModel = desc as Model;
        
        // Get the node UUID from the model
        const nodeUuid = hexModel.GetAttribute("guid") as string | undefined;
        if (!nodeUuid) {
          warn(`[NodeClickHandlerService] Hexagon ${hexModel.Name} missing guid attribute`);
          return;
        }

        // Find all parts in the hexagon to add click detectors
        hexModel.GetDescendants().forEach((child) => {
          if (child.IsA("Part")) {
            const part = child as Part;
            
            // Create click detector
            const clickDetector = new Instance("ClickDetector");
            clickDetector.MaxActivationDistance = 1000; // Increased distance
            clickDetector.Parent = part;
            
            // Store the mapping
            this.clickDetectors.set(clickDetector, nodeUuid);
            
            // Connect click event
            const connection = clickDetector.MouseClick.Connect((player) => {
              this.onNodeClicked(nodeUuid, hexModel);
            });
            
            // Track connection for cleanup
            this.addConnection(connection);
          }
        });
      }
    });
  }

  /**
   * Handle node click
   */
  private onNodeClicked(nodeUuid: string, hexModel: Model): void {
    // Update link highlighting
    this.linkHighlightService.onNodeClicked(nodeUuid);
    
    // Add visual feedback to the selected node
    this.updateNodeVisualFeedback(hexModel);
  }

  /**
   * Update visual feedback for selected nodes
   */
  private updateNodeVisualFeedback(clickedModel: Model): void {
    const selectedNodes = this.linkHighlightService.getSelectedNodes();
    
    // Reset all node visuals first
    const nodesFolder = clickedModel.Parent?.Parent as Folder | undefined;
    if (nodesFolder) {
      nodesFolder.GetDescendants().forEach((desc) => {
        if (desc.IsA("Model") && desc.Name.match("^hex[0-9]+")) {
          this.removeNodeHighlight(desc as Model);
        }
      });
    }
    
    // Highlight selected nodes
    selectedNodes.forEach((nodeUuid) => {
      const hexModel = this.findHexModelByUuid(nodeUuid, nodesFolder!);
      if (hexModel) {
        this.addNodeHighlight(hexModel);
      }
    });
  }

  /**
   * Add highlight effect to a node
   */
  private addNodeHighlight(hexModel: Model): void {
    // Find all parts in the hexagon
    hexModel.GetDescendants().forEach((desc) => {
      if (desc.IsA("Part") && desc.Name.match("^bar[0-9]+")) {
        const part = desc as Part;
        
        // Create selection box for visual feedback
        let selectionBox = part.FindFirstChildOfClass("SelectionBox");
        if (!selectionBox) {
          selectionBox = new Instance("SelectionBox");
          selectionBox.Adornee = part;
          selectionBox.Color3 = new Color3(1, 1, 1);
          selectionBox.LineThickness = 0.1;
          selectionBox.Transparency = 0;
          selectionBox.Parent = part;
        }
      }
    });
  }

  /**
   * Remove highlight effect from a node
   */
  private removeNodeHighlight(hexModel: Model): void {
    hexModel.GetDescendants().forEach((desc) => {
      if (desc.IsA("SelectionBox")) {
        desc.Destroy();
      }
    });
  }

  /**
   * Find hex model by UUID
   */
  private findHexModelByUuid(nodeUuid: string, nodesFolder: Folder): Model | undefined {
    for (const desc of nodesFolder.GetDescendants()) {
      if (desc.IsA("Model") && desc.GetAttribute("guid") === nodeUuid) {
        return desc as Model;
      }
    }
    return undefined;
  }

  /**
   * Clear all click detectors
   */
  private clearClickDetectors(): void {
    this.clickDetectors.forEach((uuid, detector) => {
      detector.Destroy();
    });
    this.clickDetectors.clear();
  }

  /**
   * Custom cleanup
   */
  protected onDestroy(): void {
    this.clearClickDetectors();
  }
}