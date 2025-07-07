// Interfaces for Simple Data Generator (R77)

export interface Node {
  uuid: string;           // e.g., "h-1234", persistent across spatial configurations
  name: string;           // Node name
  type: string;  // Node type (now supports "man", "woman", "child", etc.)
  color: [number, number, number];  // RGB color values (0-1 range)
  position: {
    x: number;
    y: number;
    z: number;
  };
  attachmentNames: string[];  // Array of attachment point names
  
  // Type-specific properties
  properties?: {
    // For People nodes (man, woman, child)
    age?: number;
    petType?: string;
    petColor?: string;
    
    // For Animals nodes
    animalType?: string;  // Now supports 10 different animal types
  };
}

export interface Link {
  uuid: string;           // Link identifier
  type: string;           // Link type (now supports up to 10 types)
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
  numLevel1Nodes: number;   // Number of root/top-level nodes
  numLevel2Nodes: number;   // Number of second-level nodes
  numLevel3Nodes: number;   // Number of third-level nodes
  childrenPerNode: number;  // Maximum children per parent node
  numNodeTypes: number;     // Number of different node types to use
  numLinkTypes: number;     // Number of different link types to use
}