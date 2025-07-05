import { Cluster, Node, Link, Group, GeneratorConfig } from "../../shared/interfaces/simpleDataGenerator.interface";

export class SimpleDataGeneratorService {
  
  // Default configuration
  private defaultConfig: GeneratorConfig = {
    numGroups: 3,
    numLevels: 3,
    numBranches: 2,
    numNodeTypes: 2,
    numLinkTypes: 3
  };
  
  // Color palettes for different types
  private nodeColors = {
    People: [0.2, 0.4, 0.8] as [number, number, number],     // Blue
    Animals: [0.8, 0.4, 0.2] as [number, number, number]     // Orange
  };
  
  private linkColors = {
    Owns: [0.2, 0.8, 0.2] as [number, number, number],       // Green
    Wants: [0.8, 0.2, 0.8] as [number, number, number],      // Magenta
    Eats: [0.8, 0.8, 0.2] as [number, number, number]        // Yellow
  };
  
  // Name options for randomization
  private peopleNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"];
  private animalNames = ["Fifi", "Bongo", "Rex", "Luna", "Max", "Bella", "Rocky", "Daisy"];
  private animalTypes: Array<"cat" | "bird" | "dog"> = ["cat", "bird", "dog"];
  
  private nodeCounter = 0;
  private linkCounter = 0;
  private groupCounter = 0;
  
  /**
   * Validates the configuration parameters
   */
  public validateConfig(config: Partial<GeneratorConfig>): GeneratorConfig {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    // Validate ranges
    if (finalConfig.numGroups < 1 || finalConfig.numGroups > 10) {
      error("numGroups must be between 1 and 10");
    }
    
    if (finalConfig.numLevels < 1 || finalConfig.numLevels > 5) {
      error("numLevels must be between 1 and 5");
    }
    
    if (finalConfig.numBranches < 1 || finalConfig.numBranches > 5) {
      error("numBranches must be between 1 and 5");
    }
    
    if (finalConfig.numNodeTypes < 1 || finalConfig.numNodeTypes > 2) {
      error("numNodeTypes must be between 1 and 2 (People, Animals)");
    }
    
    if (finalConfig.numLinkTypes < 1 || finalConfig.numLinkTypes > 3) {
      error("numLinkTypes must be between 1 and 3 (Owns, Wants, Eats)");
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
    
    // Generate groups with hierarchical structure
    for (let i = 0; i < validConfig.numGroups; i++) {
      const rootGroup = this.generateGroup(undefined, validConfig, 0);
      cluster.groups.push(rootGroup);
      
      // Generate child groups recursively
      this.generateChildGroups(rootGroup, cluster.groups, validConfig, 1);
    }
    
    // Generate relations between nodes
    this.generateRelations(cluster, validConfig);
    
    return cluster;
  }
  
  /**
   * Generates a single group with nodes
   */
  private generateGroup(parentId: string | undefined, config: GeneratorConfig, level: number): Group {
    const groupId = `group-${this.groupCounter++}`;
    const group: Group = {
      id: groupId,
      name: `Group ${groupId}`,
      parentId: parentId,
      nodes: []
    };
    
    // Determine number of nodes for this group (fewer at deeper levels)
    const nodeCount = math.max(1, math.floor(4 / (level + 1)));
    
    // Generate nodes for this group
    for (let i = 0; i < nodeCount; i++) {
      const node = this.generateNode(level);
      group.nodes.push(node);
    }
    
    return group;
  }
  
  /**
   * Recursively generates child groups
   */
  private generateChildGroups(parent: Group, allGroups: Group[], config: GeneratorConfig, currentLevel: number): void {
    if (currentLevel >= config.numLevels) return;
    
    for (let i = 0; i < config.numBranches; i++) {
      const childGroup = this.generateGroup(parent.id, config, currentLevel);
      allGroups.push(childGroup);
      
      // Recursively generate more children
      this.generateChildGroups(childGroup, allGroups, config, currentLevel + 1);
    }
  }
  
  /**
   * Generates a single node with random properties
   */
  private generateNode(level: number): Node {
    const nodeTypes: Array<"People" | "Animals"> = ["People", "Animals"];
    const nodeType = nodeTypes[math.random(0, nodeTypes.size() - 1)];
    const uuid = `h-${this.nodeCounter++}`;
    
    const node: Node = {
      uuid: uuid,
      name: this.getRandomName(nodeType),
      type: nodeType,
      color: this.nodeColors[nodeType],
      position: {
        x: 0,  // Will be calculated by layout algorithm
        y: level * 10,  // Basic vertical spacing by level
        z: 0
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
      node.properties!.age = math.random(18, 80);
    } else {
      node.properties!.animalType = this.animalTypes[math.random(0, this.animalTypes.size() - 1)];
    }
    
    return node;
  }
  
  /**
   * Gets a random name based on node type
   */
  private getRandomName(nodeType: "People" | "Animals"): string {
    if (nodeType === "People") {
      return this.peopleNames[math.random(0, this.peopleNames.size() - 1)];
    } else {
      return this.animalNames[math.random(0, this.animalNames.size() - 1)];
    }
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
    
    const linkTypes: Array<"Owns" | "Wants" | "Eats"> = ["Owns", "Wants", "Eats"];
    const maxLinks = math.min(allNodes.size() * 2, 20); // Limit total links
    
    for (let i = 0; i < maxLinks; i++) {
      const sourceIndex = math.random(0, allNodes.size() - 1);
      let targetIndex = math.random(0, allNodes.size() - 1);
      
      // Ensure source and target are different
      while (targetIndex === sourceIndex) {
        targetIndex = math.random(0, allNodes.size() - 1);
      }
      
      const linkType = linkTypes[math.random(0, math.min(linkTypes.size() - 1, config.numLinkTypes - 1))];
      
      // Apply some logic constraints
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
        color: this.linkColors[linkType]
      };
      
      cluster.relations.push(link);
    }
  }
  
  /**
   * Prints a summary of the generated cluster
   */
  public printClusterSummary(cluster: Cluster): void {
    print(`\n🌐 Cluster Summary:`);
    print(`  - Groups: ${cluster.groups.size()}`);
    
    let totalNodes = 0;
    let peopleCount = 0;
    let animalsCount = 0;
    
    cluster.groups.forEach(group => {
      totalNodes += group.nodes.size();
      group.nodes.forEach(node => {
        if (node.type === "People") {
          peopleCount++;
        } else {
          animalsCount++;
        }
      });
    });
    
    print(`  - Total Nodes: ${totalNodes}`);
    print(`    - People: ${peopleCount}`);
    print(`    - Animals: ${animalsCount}`);
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