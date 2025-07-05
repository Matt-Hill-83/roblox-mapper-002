// Interfaces for Simple Data Generator (R77)

export interface Node {
  uuid: string;           // e.g., "h-1234", persistent across spatial configurations
  name: string;           // Node name
  type: "People" | "Animals";  // Node type
  color: [number, number, number];  // RGB color values (0-1 range)
  position: {
    x: number;
    y: number;
    z: number;
  };
  attachmentNames: string[];  // Array of attachment point names
  
  // Type-specific properties
  properties?: {
    // For People nodes
    age?: number;
    
    // For Animals nodes
    animalType?: "cat" | "bird" | "dog";
  };
}

export interface Link {
  uuid: string;           // Link identifier
  type: "Owns" | "Wants" | "Eats";  // Link type
  sourceNodeUuid: string; // UUID of source node
  targetNodeUuid: string; // UUID of target node
  color: [number, number, number];  // RGB color values (0-1 range)
}

export interface Group {
  id: string;
  name: string;
  parentId?: string;      // For hierarchical parent-child relationships
  nodes: Node[];          // Nodes in this group
}

export interface Cluster {
  groups: Group[];        // Each group represents a hierarchical tree
  relations: Link[];      // All relationships between nodes
}

export interface GeneratorConfig {
  numGroups: number;      // Number of groups to generate
  numLevels: number;      // Number of hierarchical levels
  numBranches: number;    // Number of branches per parent
  numNodeTypes: number;   // Number of different node types to use
  numLinkTypes: number;   // Number of different link types to use
}