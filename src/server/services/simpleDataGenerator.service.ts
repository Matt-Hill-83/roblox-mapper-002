import { Cluster, Node, Link, Group, GeneratorConfig } from "../../shared/interfaces/simpleDataGenerator.interface";

// All constants organized in a single object
const GENERATOR_CONSTANTS = {
  // Configuration limits
  LIMITS: {
    MIN_LEVEL1_NODES: 1,
    MAX_LEVEL1_NODES: 10,
    MIN_LEVEL2_NODES: 1,
    MAX_LEVEL2_NODES: 50,
    MIN_LEVEL3_NODES: 1,
    MAX_LEVEL3_NODES: 100,
    MIN_CHILDREN_PER_NODE: 1,
    MAX_CHILDREN_PER_NODE: 5,
    MIN_NODE_TYPES: 1,
    MAX_NODE_TYPES: 10,
    MIN_LINK_TYPES: 1,
    MAX_LINK_TYPES: 10
  },
  
  // Default configuration
  DEFAULT_CONFIG: {
    numLevel1Nodes: 1,
    numLevel2Nodes: 3,
    numLevel3Nodes: 6,
    childrenPerNode: 3,
    numNodeTypes: 2,
    numLinkTypes: 3
  } as GeneratorConfig,
  
  // Color palettes
  NODE_COLORS: {
    People: [0.2, 0.4, 0.8] as [number, number, number],     // Blue
    Animals: [0.8, 0.4, 0.2] as [number, number, number],    // Orange
    // Additional colors for more node types
    Type3: [0.2, 0.8, 0.2] as [number, number, number],      // Green
    Type4: [0.8, 0.2, 0.8] as [number, number, number],      // Magenta
    Type5: [0.8, 0.8, 0.2] as [number, number, number],      // Yellow
    Type6: [0.2, 0.8, 0.8] as [number, number, number],      // Cyan
    Type7: [0.8, 0.2, 0.2] as [number, number, number],      // Red
    Type8: [0.4, 0.2, 0.6] as [number, number, number],      // Purple
    Type9: [0.6, 0.4, 0.2] as [number, number, number],      // Brown
    Type10: [0.5, 0.5, 0.5] as [number, number, number]      // Gray
  },
  
  LINK_COLORS: {
    Owns: [0.2, 0.8, 0.2] as [number, number, number],       // Green
    Wants: [0.8, 0.2, 0.8] as [number, number, number],      // Magenta
    Eats: [0.8, 0.8, 0.2] as [number, number, number],       // Yellow
    // Additional colors for more link types
    Link4: [0.2, 0.8, 0.8] as [number, number, number],      // Cyan
    Link5: [0.8, 0.2, 0.2] as [number, number, number],      // Red
    Link6: [0.4, 0.2, 0.6] as [number, number, number],      // Purple
    Link7: [0.6, 0.4, 0.2] as [number, number, number],      // Brown
    Link8: [0.5, 0.5, 0.5] as [number, number, number],      // Gray
    Link9: [0.9, 0.5, 0.1] as [number, number, number],      // Orange-Red
    Link10: [0.1, 0.5, 0.9] as [number, number, number]      // Sky Blue
  },
  
  // Name pools
  PEOPLE_NAMES: [
    "Alice", "Bob", "Charlie", "Diana", "Eve", 
    "Frank", "Grace", "Henry", "Iris", "Jack"
  ],
  
  ANIMAL_NAMES: [
    "Fifi", "Bongo", "Rex", "Luna", "Max", 
    "Bella", "Rocky", "Daisy", "Shadow", "Buddy"
  ],
  
  ANIMAL_TYPES: [
    "cat", "dog", "bird", "rabbit", "hamster",
    "fish", "turtle", "snake", "lizard", "parrot"
  ] as Array<string>,
  
  // Age range for people
  MIN_AGE: 18,
  MAX_AGE: 80,
  
  // Maximum links multiplier (relative to total nodes)
  MAX_LINKS_MULTIPLIER: 1.5
};

export class SimpleDataGeneratorService {
  private nodeCounter = 0;
  private linkCounter = 0;
  private groupCounter = 0;
  
  /**
   * Validates the configuration parameters
   */
  public validateConfig(config: Partial<GeneratorConfig>): GeneratorConfig {
    const finalConfig = { ...GENERATOR_CONSTANTS.DEFAULT_CONFIG, ...config };
    const limits = GENERATOR_CONSTANTS.LIMITS;
    
    // Validate ranges
    if (finalConfig.numLevel1Nodes < limits.MIN_LEVEL1_NODES || finalConfig.numLevel1Nodes > limits.MAX_LEVEL1_NODES) {
      error(`numLevel1Nodes must be between ${limits.MIN_LEVEL1_NODES} and ${limits.MAX_LEVEL1_NODES}`);
    }
    
    if (finalConfig.numLevel2Nodes < limits.MIN_LEVEL2_NODES || finalConfig.numLevel2Nodes > limits.MAX_LEVEL2_NODES) {
      error(`numLevel2Nodes must be between ${limits.MIN_LEVEL2_NODES} and ${limits.MAX_LEVEL2_NODES}`);
    }
    
    if (finalConfig.numLevel3Nodes < limits.MIN_LEVEL3_NODES || finalConfig.numLevel3Nodes > limits.MAX_LEVEL3_NODES) {
      error(`numLevel3Nodes must be between ${limits.MIN_LEVEL3_NODES} and ${limits.MAX_LEVEL3_NODES}`);
    }
    
    if (finalConfig.childrenPerNode < limits.MIN_CHILDREN_PER_NODE || finalConfig.childrenPerNode > limits.MAX_CHILDREN_PER_NODE) {
      error(`childrenPerNode must be between ${limits.MIN_CHILDREN_PER_NODE} and ${limits.MAX_CHILDREN_PER_NODE}`);
    }
    
    if (finalConfig.numNodeTypes < limits.MIN_NODE_TYPES || finalConfig.numNodeTypes > limits.MAX_NODE_TYPES) {
      error(`numNodeTypes must be between ${limits.MIN_NODE_TYPES} and ${limits.MAX_NODE_TYPES}`);
    }
    
    if (finalConfig.numLinkTypes < limits.MIN_LINK_TYPES || finalConfig.numLinkTypes > limits.MAX_LINK_TYPES) {
      error(`numLinkTypes must be between ${limits.MIN_LINK_TYPES} and ${limits.MAX_LINK_TYPES}`);
    }
    
    return finalConfig;
  }
  
  /**
   * Generates a complete cluster with the specified configuration
   */
  public generateCluster(config?: Partial<GeneratorConfig>): Cluster {
    const validConfig = this.validateConfig(config || {});
    
    // Reset counters
    this.nodeCounter = 0;
    this.linkCounter = 0;
    this.groupCounter = 0;
    
    const cluster: Cluster = {
      groups: [],
      relations: []
    };
    
    // Generate a single group with level-based node distribution
    const mainGroup = this.generateSingleGroup(validConfig);
    cluster.groups.push(mainGroup);
    
    // Generate relations between nodes
    this.generateRelations(cluster, validConfig);
    
    return cluster;
  }
  
  /**
   * Generates a single group with nodes distributed across levels
   */
  private generateSingleGroup(config: GeneratorConfig): Group {
    const groupId = `group-${this.groupCounter++}`;
    const group: Group = {
      id: groupId,
      name: `Main Group`,
      nodes: []
    };
    
    const allNodes: Node[] = [];
    const nodesByLevel: Map<number, Node[]> = new Map([
      [1, []],
      [2, []],
      [3, []]
    ]);
    
    // Generate Level 1 nodes
    for (let i = 0; i < config.numLevel1Nodes; i++) {
      const node = this.generateNode(1, config.numNodeTypes);
      allNodes.push(node);
      nodesByLevel.get(1)!.push(node);
    }
    
    // Generate Level 2 nodes
    for (let i = 0; i < config.numLevel2Nodes; i++) {
      const node = this.generateNode(2, config.numNodeTypes);
      allNodes.push(node);
      nodesByLevel.get(2)!.push(node);
    }
    
    // Generate Level 3 nodes
    for (let i = 0; i < config.numLevel3Nodes; i++) {
      const node = this.generateNode(3, config.numNodeTypes);
      allNodes.push(node);
      nodesByLevel.get(3)!.push(node);
    }
    
    // Assign hierarchical parent-child relationships
    this.assignHierarchy(nodesByLevel, config.childrenPerNode);
    
    // Add all nodes to the group
    group.nodes = allNodes;
    
    return group;
  }
  
  /**
   * Assigns parent-child relationships between nodes at different levels
   */
  private assignHierarchy(nodesByLevel: Map<number, Node[]>, maxChildrenPerNode: number): void {
    // Connect Level 1 to Level 2
    const level1Nodes = nodesByLevel.get(1)!;
    const level2Nodes = nodesByLevel.get(2)!;
    
    if (level1Nodes.size() > 0 && level2Nodes.size() > 0) {
      this.distributeChildren(level1Nodes, level2Nodes, maxChildrenPerNode);
    }
    
    // Connect Level 2 to Level 3
    const level3Nodes = nodesByLevel.get(3)!;
    
    if (level2Nodes.size() > 0 && level3Nodes.size() > 0) {
      this.distributeChildren(level2Nodes, level3Nodes, maxChildrenPerNode);
    }
  }
  
  /**
   * Distributes child nodes among parent nodes
   */
  private distributeChildren(parents: Node[], children: Node[], maxChildrenPerNode: number): void {
    // Create a map to track children per parent
    const childrenPerParent = new Map<string, number>();
    parents.forEach(parent => childrenPerParent.set(parent.uuid, 0));
    
    // Distribute children evenly among parents
    children.forEach((_, index) => {
      // Find parent with fewest children
      let selectedParent: Node | undefined;
      let minChildren = maxChildrenPerNode + 1;
      
      parents.forEach(parent => {
        const currentChildren = childrenPerParent.get(parent.uuid)!;
        if (currentChildren < maxChildrenPerNode && currentChildren < minChildren) {
          selectedParent = parent;
          minChildren = currentChildren;
        }
      });
      
      // If all parents are full, cycle through them
      if (!selectedParent) {
        selectedParent = parents[index % parents.size()];
      }
      
      // Update the count
      if (selectedParent) {
        childrenPerParent.set(selectedParent.uuid, (childrenPerParent.get(selectedParent.uuid) || 0) + 1);
      }
    });
  }
  
  /**
   * Generates a single node with random properties
   */
  private generateNode(_level: number, maxNodeTypes: number): Node {
    const nodeTypes = this.getAvailableNodeTypes(maxNodeTypes);
    const nodeType = nodeTypes[math.random(0, nodeTypes.size() - 1)];
    const uuid = `h-${this.nodeCounter++}`;
    
    const node: Node = {
      uuid: uuid,
      name: this.getRandomName(nodeType),
      type: nodeType,
      color: this.getNodeColor(nodeType),
      position: {
        x: 0,  // Will be calculated by layout algorithm
        y: 0,  // Will be calculated by layout algorithm
        z: 0   // Will be calculated by layout algorithm
      },
      attachmentNames: [
        `att001-${uuid}`,
        `att002-${uuid}`,
        `att003-${uuid}`,
        `att004-${uuid}`,
        `att005-${uuid}`,
        `att006-${uuid}`
      ],
      properties: {}
    };
    
    // Add type-specific properties
    if (nodeType === "People") {
      node.properties!.age = math.random(GENERATOR_CONSTANTS.MIN_AGE, GENERATOR_CONSTANTS.MAX_AGE);
    } else if (nodeType === "Animals") {
      const animalTypes = GENERATOR_CONSTANTS.ANIMAL_TYPES;
      node.properties!.animalType = animalTypes[math.random(0, animalTypes.size() - 1)];
    }
    
    return node;
  }
  
  /**
   * Gets available node types based on configuration
   */
  private getAvailableNodeTypes(maxTypes: number): Array<"People" | "Animals"> {
    const allTypes: Array<"People" | "Animals"> = ["People", "Animals"];
    // For now, we only have 2 types defined, so return based on the limit
    if (maxTypes >= 2) {
      return allTypes;
    } else {
      return [allTypes[0]]; // Just People if only 1 type
    }
  }
  
  /**
   * Gets the color for a node type
   */
  private getNodeColor(nodeType: string): [number, number, number] {
    const colors = GENERATOR_CONSTANTS.NODE_COLORS;
    return colors[nodeType as keyof typeof colors] || colors.Type3;
  }
  
  /**
   * Gets the color for a link type
   */
  private getLinkColor(linkType: string): [number, number, number] {
    const colors = GENERATOR_CONSTANTS.LINK_COLORS;
    return colors[linkType as keyof typeof colors] || colors.Link4;
  }
  
  /**
   * Gets a random name based on node type
   */
  private getRandomName(nodeType: "People" | "Animals"): string {
    if (nodeType === "People") {
      const names = GENERATOR_CONSTANTS.PEOPLE_NAMES;
      return names[math.random(0, names.size() - 1)];
    } else {
      const names = GENERATOR_CONSTANTS.ANIMAL_NAMES;
      return names[math.random(0, names.size() - 1)];
    }
  }
  
  /**
   * Gets available link types based on configuration
   */
  private getAvailableLinkTypes(maxTypes: number): string[] {
    const allTypes = ["Owns", "Wants", "Eats", "Link4", "Link5", "Link6", "Link7", "Link8", "Link9", "Link10"];
    const result: string[] = [];
    for (let i = 0; i < math.min(maxTypes, allTypes.size()); i++) {
      result.push(allTypes[i]);
    }
    return result;
  }
  
  /**
   * Generates relations between nodes in the cluster
   */
  private generateRelations(cluster: Cluster, config: GeneratorConfig): void {
    const allNodes: Node[] = [];
    cluster.groups.forEach(group => {
      group.nodes.forEach(node => {
        allNodes.push(node);
      });
    });
    
    if (allNodes.size() < 2) return;
    
    const linkTypes = this.getAvailableLinkTypes(config.numLinkTypes);
    const maxLinks = math.min(
      math.floor(allNodes.size() * GENERATOR_CONSTANTS.MAX_LINKS_MULTIPLIER), 
      allNodes.size() * (allNodes.size() - 1) / 2 // Maximum possible unique links
    );
    
    // Track existing links to avoid duplicates
    const existingLinks = new Set<string>();
    
    for (let i = 0; i < maxLinks; i++) {
      const sourceIndex = math.random(0, allNodes.size() - 1);
      let targetIndex = math.random(0, allNodes.size() - 1);
      
      // Ensure source and target are different
      while (targetIndex === sourceIndex) {
        targetIndex = math.random(0, allNodes.size() - 1);
      }
      
      // Create a unique key for this link
      const linkKey = `${allNodes[sourceIndex].uuid}-${allNodes[targetIndex].uuid}`;
      
      // Skip if this link already exists
      if (existingLinks.has(linkKey)) {
        continue;
      }
      
      const linkType = linkTypes[math.random(0, linkTypes.size() - 1)];
      
      // Apply some logic constraints for the first 3 link types
      if (linkType === "Eats" && allNodes[sourceIndex].type !== "Animals") {
        continue; // Only animals can eat
      }
      
      if (linkType === "Owns" && allNodes[targetIndex].type !== "Animals") {
        continue; // Can only own animals
      }
      
      const link: Link = {
        uuid: `link-${this.linkCounter++}`,
        type: linkType,
        sourceNodeUuid: allNodes[sourceIndex].uuid,
        targetNodeUuid: allNodes[targetIndex].uuid,
        color: this.getLinkColor(linkType)
      };
      
      cluster.relations.push(link);
      existingLinks.add(linkKey);
    }
  }
  
  /**
   * Prints a summary of the generated cluster
   */
  public printClusterSummary(cluster: Cluster): void {
    print(`\n🌐 Cluster Summary:`);
    print(`  - Groups: ${cluster.groups.size()}`);
    
    let totalNodes = 0;
    const nodeTypeCounts = new Map<string, number>();
    const levelCounts = new Map<number, number>([
      [1, 0],
      [2, 0],
      [3, 0]
    ]);
    
    cluster.groups.forEach(group => {
      totalNodes += group.nodes.size();
      group.nodes.forEach((node, index) => {
        // Count by type
        nodeTypeCounts.set(node.type, (nodeTypeCounts.get(node.type) || 0) + 1);
        
        // Infer level based on position in array (temporary until proper hierarchy tracking)
        // This is a simplified assumption and should be replaced with proper level tracking
        const level = index < 10 ? 1 : index < 60 ? 2 : 3;
        levelCounts.set(level, (levelCounts.get(level) || 0) + 1);
      });
    });
    
    print(`  - Total Nodes: ${totalNodes}`);
    print(`    By Type:`);
    nodeTypeCounts.forEach((count, type) => {
      print(`      - ${type}: ${count}`);
    });
    
    print(`    By Level (approximate):`);
    levelCounts.forEach((count, level) => {
      print(`      - Level ${level}: ${count}`);
    });
    
    print(`  - Relations: ${cluster.relations.size()}`);
    
    const linkCounts = new Map<string, number>();
    cluster.relations.forEach(link => {
      linkCounts.set(link.type, (linkCounts.get(link.type) || 0) + 1);
    });
    
    linkCounts.forEach((count, linkType) => {
      print(`    - ${linkType}: ${count}`);
    });
  }
}