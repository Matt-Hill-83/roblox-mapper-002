/**
 * Graph Data Transformation Layer
 * Provides adapters to transform hierarchical data into formats required by different graph libraries
 */

// Base interfaces for our hierarchical data
export interface HierarchyEntity {
  entityId: string;
  type: string;
  parentId?: string;
  x: number;
  y: number;
  level: number;
  groupId: string;
}

export interface HierarchyConnection {
  fromId: string;
  toId: string;
  type: string;
}

export interface HierarchyData {
  entities: HierarchyEntity[];
  connections: HierarchyConnection[];
}

// ========================================
// React Flow Adapter
// ========================================

export interface ReactFlowNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: {
    label: string;
    entityType: string;
    level: number;
    groupId: string;
  };
  style?: Record<string, unknown>;
}

export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  style?: Record<string, unknown>;
  animated?: boolean;
}

export interface ReactFlowData {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
}

export class ReactFlowAdapter {
  static transform(data: HierarchyData): ReactFlowData {
    const nodes: ReactFlowNode[] = data.entities.map(entity => ({
      id: entity.entityId,
      type: 'default',
      position: { 
        x: entity.x * 2, // Scale for better spacing in React Flow
        y: entity.y * -2 // Invert Y and scale
      },
      data: {
        label: entity.entityId.replace('entity_', ''),
        entityType: entity.type,
        level: entity.level,
        groupId: entity.groupId
      },
      style: {
        backgroundColor: this.getNodeColor(entity.type, entity.level),
        color: '#ffffff',
        border: `2px solid ${this.getBorderColor(entity.groupId)}`,
        borderRadius: entity.type === 'Parent' ? '50%' : '8px',
        width: 60,
        height: 60,
        fontSize: '12px',
        fontWeight: 'bold'
      }
    }));

    const edges: ReactFlowEdge[] = data.connections.map((conn, index) => ({
      id: `edge-${index}`,
      source: conn.fromId,
      target: conn.toId,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: '#666',
        strokeWidth: 2
      }
    }));

    return { nodes, edges };
  }

  private static getNodeColor(type: string, level: number): string {
    if (type === 'Parent') {
      return level === 0 ? '#1976d2' : '#42a5f5';
    }
    return level === 1 ? '#66bb6a' : '#a5d6a7';
  }

  private static getBorderColor(groupId: string): string {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5'];
    const index = parseInt(groupId.replace('group_', '')) - 1;
    return colors[index % colors.length];
  }
}

// ========================================
// Cytoscape.js Adapter
// ========================================

export interface CytoscapeElement {
  data: {
    id: string;
    label?: string;
    parent?: string;
    source?: string;
    target?: string;
    entityType?: string;
    level?: number;
    groupId?: string;
  };
  position?: { x: number; y: number };
  classes?: string;
}

export interface CytoscapeData {
  elements: CytoscapeElement[];
  style: Array<{
    selector: string;
    style: Record<string, unknown>;
  }>;
  layout: {
    name: string;
    [key: string]: unknown;
  };
}

export class CytoscapeAdapter {
  static transform(data: HierarchyData): CytoscapeData {
    // Create nodes
    const nodeElements: CytoscapeElement[] = data.entities.map(entity => ({
      data: {
        id: entity.entityId,
        label: entity.entityId.replace('entity_', ''),
        entityType: entity.type,
        level: entity.level,
        groupId: entity.groupId
      },
      position: { 
        x: entity.x * 1.5, // Scale for Cytoscape spacing
        y: entity.y * -1.5 // Invert Y and scale
      },
      classes: `${entity.type.toLowerCase()} level-${entity.level} ${entity.groupId}`
    }));

    // Create edges
    const edgeElements: CytoscapeElement[] = data.connections.map((conn, index) => ({
      data: {
        id: `edge-${index}`,
        source: conn.fromId,
        target: conn.toId
      },
      classes: 'hierarchy-edge'
    }));

    const elements = [...nodeElements, ...edgeElements];

    const style = [
      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'text-valign': 'center',
          'text-halign': 'center',
          'width': 40,
          'height': 40,
          'font-size': 10,
          'font-weight': 'bold',
          'color': '#ffffff'
        }
      },
      {
        selector: '.parent',
        style: {
          'background-color': '#1976d2',
          'shape': 'ellipse'
        }
      },
      {
        selector: '.child',
        style: {
          'background-color': '#66bb6a',
          'shape': 'rectangle'
        }
      },
      {
        selector: '.level-0',
        style: {
          'width': 50,
          'height': 50,
          'border-width': 3,
          'border-color': '#0d47a1'
        }
      },
      {
        selector: '.hierarchy-edge',
        style: {
          'width': 2,
          'line-color': '#666',
          'target-arrow-color': '#666',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      },
      {
        selector: '.group_1',
        style: {
          'border-color': '#f44336'
        }
      },
      {
        selector: '.group_2',
        style: {
          'border-color': '#e91e63'
        }
      },
      {
        selector: '.group_3',
        style: {
          'border-color': '#9c27b0'
        }
      }
    ];

    const layout = {
      name: 'preset', // Use preset positions
      fit: true,
      padding: 20
    };

    return { elements, style, layout };
  }
}

// ========================================
// D3.js Adapter
// ========================================

export interface D3Node {
  id: string;
  label: string;
  entityType: string;
  level: number;
  groupId: string;
  x: number;
  y: number;
  fx?: number; // Fixed position
  fy?: number; // Fixed position
}

export interface D3Link {
  source: string;
  target: string;
  type: string;
}

export interface D3Data {
  nodes: D3Node[];
  links: D3Link[];
}

export class D3Adapter {
  static transform(data: HierarchyData): D3Data {
    const nodes: D3Node[] = data.entities.map(entity => ({
      id: entity.entityId,
      label: entity.entityId.replace('entity_', ''),
      entityType: entity.type,
      level: entity.level,
      groupId: entity.groupId,
      x: entity.x,
      y: entity.y * -1, // Invert Y for D3
      fx: entity.x, // Fix positions initially
      fy: entity.y * -1
    }));

    const links: D3Link[] = data.connections.map(conn => ({
      source: conn.fromId,
      target: conn.toId,
      type: conn.type
    }));

    return { nodes, links };
  }

  static getNodeColor(node: D3Node): string {
    if (node.entityType === 'Parent') {
      return node.level === 0 ? '#1976d2' : '#42a5f5';
    }
    return node.level === 1 ? '#66bb6a' : '#a5d6a7';
  }

  static getNodeRadius(node: D3Node): number {
    return node.entityType === 'Parent' ? (node.level === 0 ? 20 : 15) : 12;
  }

  static getLinkColor(link: D3Link): string {
    return '#666';
  }
}

// ========================================
// Data Extractor (from API response format)
// ========================================

export class HierarchyDataExtractor {
  static extractFromApiResponse(apiResponse: unknown): HierarchyData {
    const response = apiResponse as {
      positioned: HierarchyEntity[];
      groups: Array<{ entities: Array<{ id: string; parentId?: string }> }>;
    };

    if (!response.positioned) {
      throw new Error('Invalid API response: missing positioned entities');
    }

    const entities = response.positioned;
    
    // Extract connections from parent-child relationships
    const connections: HierarchyConnection[] = [];
    entities.forEach(entity => {
      if (entity.parentId) {
        connections.push({
          fromId: entity.parentId,
          toId: entity.entityId,
          type: 'parent-child'
        });
      }
    });

    return { entities, connections };
  }
}

// ========================================
// Main Graph Data Factory
// ========================================

export class GraphDataFactory {
  static createReactFlowData(apiResponse: unknown): ReactFlowData {
    const hierarchyData = HierarchyDataExtractor.extractFromApiResponse(apiResponse);
    return ReactFlowAdapter.transform(hierarchyData);
  }

  static createCytoscapeData(apiResponse: unknown): CytoscapeData {
    const hierarchyData = HierarchyDataExtractor.extractFromApiResponse(apiResponse);
    return CytoscapeAdapter.transform(hierarchyData);
  }

  static createD3Data(apiResponse: unknown): D3Data {
    const hierarchyData = HierarchyDataExtractor.extractFromApiResponse(apiResponse);
    return D3Adapter.transform(hierarchyData);
  }
}