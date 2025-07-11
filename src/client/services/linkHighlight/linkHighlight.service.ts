import { BaseService } from "../../../shared/services/base/BaseService";
import { LINK_HIGHLIGHT_COLORS } from "../../../shared/modules/renderers/constants/robloxColors";

interface LinkInfo {
  link: Part;
  originalColor: Color3;
  sourceNodeUuid: string;
  targetNodeUuid: string;
}

export class LinkHighlightService extends BaseService {
  private selectedNodes: string[] = [];
  private links: Map<Part, LinkInfo> = new Map();
  private nodeToLinks: Map<string, Part[]> = new Map();

  constructor() {
    super("LinkHighlightService");
  }

  /**
   * Register all links in the scene
   */
  public registerLinks(linksFolder: Folder): void {
    this.links.clear();
    this.nodeToLinks.clear();

    // Find all rod parts (our cylinder connectors)
    linksFolder.GetDescendants().forEach((desc) => {
      if (desc.IsA("Part") && desc.Name.match("^rod[0-9]+")) {
        const link = desc as Part;
        
        // Extract source and target node UUIDs from the name
        // Format: rod001-import-nodeuuid1-to-nodeuuid2
        const nameParts = link.Name.split("-");
        
        if (nameParts.size() >= 5) {
          const sourceNodeUuid = nameParts[2];
          const targetNodeUuid = nameParts[4];
          
          // Store link info
          const linkInfo: LinkInfo = {
            link,
            originalColor: link.Color,
            sourceNodeUuid,
            targetNodeUuid,
          };
          this.links.set(link, linkInfo);
          
          // Map nodes to their links
          if (!this.nodeToLinks.has(sourceNodeUuid)) {
            this.nodeToLinks.set(sourceNodeUuid, []);
          }
          if (!this.nodeToLinks.has(targetNodeUuid)) {
            this.nodeToLinks.set(targetNodeUuid, []);
          }
          
          this.nodeToLinks.get(sourceNodeUuid)!.push(link);
          this.nodeToLinks.get(targetNodeUuid)!.push(link);
        }
      }
    });
  }

  /**
   * Handle node click - highlights connected links
   */
  public onNodeClicked(nodeUuid: string): void {
    // If clicking a third node, reset and start fresh
    if (this.selectedNodes.size() >= 2 && !this.selectedNodes.includes(nodeUuid)) {
      this.resetAllLinks();
      this.selectedNodes = [];
    }
    
    // Add or update selected nodes
    if (!this.selectedNodes.includes(nodeUuid)) {
      this.selectedNodes.push(nodeUuid);
      if (this.selectedNodes.size() > 2) {
        this.selectedNodes.shift(); // Remove oldest selection
      }
    }
    
    // Update link colors based on selection
    this.updateLinkColors();
  }

  /**
   * Update colors of all links based on current selection
   */
  private updateLinkColors(): void {
    // First, reset all links to original colors
    this.resetAllLinks();
    
    if (this.selectedNodes.size() === 0) return;
    
    const firstNodeLinks = this.nodeToLinks.get(this.selectedNodes[0]) || [];
    const secondNodeLinks = this.selectedNodes[1] ? 
      (this.nodeToLinks.get(this.selectedNodes[1]) || []) : [];
    
    // Find common links
    const commonLinks = new Set<Part>();
    if (secondNodeLinks.size() > 0) {
      firstNodeLinks.forEach((link) => {
        if (secondNodeLinks.includes(link)) {
          commonLinks.add(link);
        }
      });
    }
    
    // Color first node's links
    firstNodeLinks.forEach((link) => {
      if (!commonLinks.has(link)) {
        link.Color = LINK_HIGHLIGHT_COLORS[0];
      }
    });
    
    // Color second node's links
    secondNodeLinks.forEach((link) => {
      if (!commonLinks.has(link)) {
        link.Color = LINK_HIGHLIGHT_COLORS[1];
      }
    });
    
    // Color common links with blended color
    commonLinks.forEach((link) => {
      link.Color = LINK_HIGHLIGHT_COLORS[2];
    });
  }

  /**
   * Reset all links to their original colors
   */
  private resetAllLinks(): void {
    this.links.forEach((info, link) => {
      link.Color = info.originalColor;
    });
  }

  /**
   * Clear all selections and reset colors
   */
  public clearSelection(): void {
    this.selectedNodes = [];
    this.resetAllLinks();
  }

  /**
   * Get currently selected nodes
   */
  public getSelectedNodes(): string[] {
    return [...this.selectedNodes];
  }
}