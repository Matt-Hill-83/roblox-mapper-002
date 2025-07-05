import { Cluster, Node, Group } from "../../shared/interfaces/simpleDataGenerator.interface";

// Layout constants organized in a single object
const layoutConstants = {
  levelHeight: 2,       // Vertical spacing between levels (reduced to 2 units)
  nodeSpacing: 10,      // Horizontal spacing between nodes (reduced by 50%)
  groupSpacing: 25,     // Spacing between top-level groups (reduced by 50%)
  origin: { x: 20, y: 20, z: 20 },  // Origin point for the graph
  circularLayout: {
    baseRadius: 15      // Base radius for circular layout
  },
  overlapAvoidance: {
    minDistance: 10,    // Minimum distance between nodes
    iterations: 10      // Maximum iterations for overlap avoidance
  }
};

export class SimpleDataLayoutService {
  
  /**
   * Calculates positions for all nodes in the cluster
   */
  public calculateLayout(cluster: Cluster): void {
    // Find root groups (no parent)
    const rootGroups = cluster.groups.filter(g => !g.parentId);
    
    // Calculate the maximum depth of the hierarchy
    const maxDepth = this.calculateMaxDepth(cluster);
    const totalHeight = maxDepth * layoutConstants.levelHeight;
    
    // Adjust origin Y by the total height of the structure
    const adjustedOrigin = {
      x: layoutConstants.origin.x,
      y: layoutConstants.origin.y + totalHeight,
      z: layoutConstants.origin.z
    };
    
    let currentX = adjustedOrigin.x;
    
    // Layout each root group and its children
    rootGroups.forEach((rootGroup, index) => {
      const groupWidth = this.calculateGroupWidth(rootGroup, cluster);
      const groupCenterX = currentX + groupWidth / 2;
      
      // Layout this group hierarchy
      this.layoutGroupHierarchy(rootGroup, cluster, groupCenterX, 0, adjustedOrigin);
      
      currentX += groupWidth + layoutConstants.groupSpacing;
    });
  }
  
  /**
   * Calculates the maximum depth of the hierarchy
   */
  private calculateMaxDepth(cluster: Cluster): number {
    let maxDepth = 0;
    
    const calculateGroupDepth = (groupId: string, currentDepth: number): void => {
      maxDepth = math.max(maxDepth, currentDepth);
      
      // Find child groups
      const childGroups = cluster.groups.filter(g => g.parentId === groupId);
      childGroups.forEach(child => {
        calculateGroupDepth(child.id, currentDepth + 1);
      });
    };
    
    // Start from root groups
    const rootGroups = cluster.groups.filter(g => !g.parentId);
    rootGroups.forEach(root => {
      calculateGroupDepth(root.id, 0);
    });
    
    return maxDepth;
  }
  
  /**
   * Recursively calculates the total width needed for a group and its children
   */
  private calculateGroupWidth(group: Group, cluster: Cluster): number {
    const childGroups = cluster.groups.filter(g => g.parentId === group.id);
    
    if (childGroups.size() === 0) {
      // Leaf group - width based on number of nodes
      return math.max(1, group.nodes.size()) * layoutConstants.nodeSpacing;
    }
    
    // Parent group - sum of child widths
    let totalWidth = 0;
    childGroups.forEach(child => {
      totalWidth += this.calculateGroupWidth(child, cluster);
    });
    
    // Add spacing between child groups
    totalWidth += (childGroups.size() - 1) * layoutConstants.nodeSpacing;
    
    // Ensure parent is at least as wide as its nodes
    const minWidth = math.max(1, group.nodes.size()) * layoutConstants.nodeSpacing;
    
    return math.max(totalWidth, minWidth);
  }
  
  /**
   * Recursively layouts a group and all its descendants
   */
  private layoutGroupHierarchy(group: Group, cluster: Cluster, centerX: number, level: number, adjustedOrigin: { x: number; y: number; z: number }): void {
    // Layout nodes in this group
    this.layoutGroupNodes(group, centerX, level, adjustedOrigin);
    
    // Find child groups
    const childGroups = cluster.groups.filter(g => g.parentId === group.id);
    
    if (childGroups.size() === 0) return;
    
    // Calculate starting X for children
    let childX = centerX;
    const totalChildWidth = childGroups.reduce((sum, child) => {
      return sum + this.calculateGroupWidth(child, cluster);
    }, 0) + (childGroups.size() - 1) * layoutConstants.nodeSpacing;
    
    childX -= totalChildWidth / 2;
    
    // Layout each child group
    childGroups.forEach(childGroup => {
      const childWidth = this.calculateGroupWidth(childGroup, cluster);
      const childCenterX = childX + childWidth / 2;
      
      this.layoutGroupHierarchy(childGroup, cluster, childCenterX, level + 1, adjustedOrigin);
      
      childX += childWidth + layoutConstants.nodeSpacing;
    });
  }
  
  /**
   * Layouts nodes within a single group
   */
  private layoutGroupNodes(group: Group, centerX: number, level: number, adjustedOrigin: { x: number; y: number; z: number }): void {
    const nodeCount = group.nodes.size();
    if (nodeCount === 0) return;
    
    const totalWidth = (nodeCount - 1) * layoutConstants.nodeSpacing;
    let currentX = centerX - totalWidth / 2;
    const y = adjustedOrigin.y + (level * layoutConstants.levelHeight);
    
    group.nodes.forEach(node => {
      node.position = {
        x: currentX,
        y: y,
        z: adjustedOrigin.z  // Use adjusted origin Z coordinate
      };
      
      currentX += layoutConstants.nodeSpacing;
    });
  }
  
  /**
   * Applies a circular layout within each group (alternative layout)
   */
  public applyCircularLayout(cluster: Cluster): void {
    cluster.groups.forEach((group, groupIndex) => {
      const baseRadius = layoutConstants.circularLayout.baseRadius;
      const centerX = layoutConstants.origin.x + (groupIndex * (baseRadius * 3));
      const centerY = layoutConstants.origin.y;
      
      group.nodes.forEach((node, nodeIndex) => {
        const angle = (nodeIndex / group.nodes.size()) * math.pi * 2;
        const radius = baseRadius + (group.nodes.size() * 2);
        
        node.position = {
          x: centerX + math.cos(angle) * radius,
          y: centerY,
          z: layoutConstants.origin.z + math.sin(angle) * radius
        };
      });
    });
  }
  
  /**
   * Spreads nodes to avoid overlaps (post-processing step)
   */
  public avoidOverlaps(nodes: Node[], minDistance: number = layoutConstants.overlapAvoidance.minDistance): void {
    const iterations = layoutConstants.overlapAvoidance.iterations;
    
    for (let iter = 0; iter < iterations; iter++) {
      let moved = false;
      
      for (let i = 0; i < nodes.size(); i++) {
        for (let j = i + 1; j < nodes.size(); j++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
          
          const dx = node2.position.x - node1.position.x;
          const dy = node2.position.y - node1.position.y;
          const dz = node2.position.z - node1.position.z;
          
          const distance = math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < minDistance && distance > 0) {
            // Push nodes apart
            const pushDistance = (minDistance - distance) / 2;
            const pushX = (dx / distance) * pushDistance;
            const pushY = (dy / distance) * pushDistance;
            const pushZ = (dz / distance) * pushDistance;
            
            node1.position.x -= pushX;
            node1.position.y -= pushY;
            node1.position.z -= pushZ;
            
            node2.position.x += pushX;
            node2.position.y += pushY;
            node2.position.z += pushZ;
            
            moved = true;
          }
        }
      }
      
      if (!moved) break;
    }
  }
}