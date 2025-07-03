/**
 * Graph Data Transformation Layer
 * Provides adapters to transform hierarchical data into formats required by different graph libraries
 */

import { generateEntityTypeColors, generateConnectorTypeStyles, getEntityTypeColor, getConnectorTypeStyle, ConnectorStyle } from '../utils/colorUtils';

// Configuration for graph visualization
export interface GraphConfig {
  entityTypes: number;
  connectorTypes: number;
}

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
  static transform(data: HierarchyData, config?: GraphConfig): ReactFlowData {
    // Generate color palette for entity types
    const entityColors = config ? generateEntityTypeColors(config.entityTypes) : generateEntityTypeColors(4);
    const connectorStyles = config ? generateConnectorTypeStyles(config.connectorTypes) : generateConnectorTypeStyles(3);
    // First pass: create nodes with initial positions
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
        backgroundColor: this.getNodeColor(entity.type, entity.level, entityColors),
        color: '#ffffff',
        border: `2px solid ${this.getBorderColor(entity.groupId)}`,
        borderRadius: entity.type === 'Parent' ? '50%' : '8px',
        width: 60,
        height: 60,
        fontSize: '12px',
        fontWeight: 'bold'
      }
    }));

    // Second pass: ensure 2px minimum spacing between all nodes
    const adjustedNodes = this.ensureMinimumSpacing(nodes, 2);

    const edges: ReactFlowEdge[] = data.connections.map((conn, index) => {
      // Map connection type to style index
      const typeIndex = this.getConnectorTypeIndex(conn.type);
      const connectorStyle = getConnectorTypeStyle(typeIndex, connectorStyles);
      
      return {
        id: `edge-${index}`,
        source: conn.fromId,
        target: conn.toId,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: connectorStyle.color,
          strokeWidth: connectorStyle.strokeWidth,
          strokeDasharray: connectorStyle.strokeDasharray,
          opacity: connectorStyle.opacity
        }
      };
    });

    return { nodes: adjustedNodes, edges };
  }

  private static ensureMinimumSpacing(nodes: ReactFlowNode[], minSpacing: number): ReactFlowNode[] {
    const nodeSize = 60; // Node width/height from style
    const requiredDistance = nodeSize + minSpacing;
    const adjustedNodes = [...nodes]; // Create a copy to avoid mutation
    
    // Multiple passes to handle cascading adjustments
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < adjustedNodes.length; i++) {
        for (let j = i + 1; j < adjustedNodes.length; j++) {
          const nodeA = adjustedNodes[i];
          const nodeB = adjustedNodes[j];
          
          const dx = nodeB.position.x - nodeA.position.x;
          const dy = nodeB.position.y - nodeA.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < requiredDistance && distance > 0) {
            // Calculate how much to move each node
            const overlap = requiredDistance - distance;
            const moveDistance = overlap / 2;
            
            // Calculate unit vector for separation direction
            const unitX = dx / distance;
            const unitY = dy / distance;
            
            // Move nodes apart
            nodeA.position.x -= unitX * moveDistance;
            nodeA.position.y -= unitY * moveDistance;
            nodeB.position.x += unitX * moveDistance;
            nodeB.position.y += unitY * moveDistance;
          }
        }
      }
    }
    
    return adjustedNodes;
  }

  private static getNodeColor(type: string, level: number, entityColors: string[]): string {
    // Map entity type to color index (for now, use simple hash of type name)
    const typeIndex = this.getEntityTypeIndex(type);
    const baseColor = getEntityTypeColor(typeIndex, entityColors);
    
    // Slightly adjust brightness based on level for visual hierarchy
    if (level === 0) {
      return baseColor; // Root nodes use full color
    } else {
      // Child nodes use a lighter version
      return this.adjustColorBrightness(baseColor, 20);
    }
  }

  private static getEntityTypeIndex(type: string): number {
    // Simple hash function to map entity type names to indices
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      const char = type.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 10; // Limit to reasonable range
  }

  private static getConnectorTypeIndex(type: string): number {
    // Simple hash function to map connector type names to indices
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      const char = type.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 8; // Limit to reasonable range for connectors
  }

  private static adjustColorBrightness(color: string, percent: number): string {
    // Simple brightness adjustment for hex colors
    if (color.startsWith('#')) {
      const num = parseInt(color.slice(1), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    return color; // Return original if not hex
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
  static transform(data: HierarchyData, config?: GraphConfig): CytoscapeData {
    // Generate color palette for entity types
    const entityColors = config ? generateEntityTypeColors(config.entityTypes) : generateEntityTypeColors(4);
    const connectorStyles = config ? generateConnectorTypeStyles(config.connectorTypes) : generateConnectorTypeStyles(3);
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
    const edgeElements: CytoscapeElement[] = data.connections.map((conn, index) => {
      // Map connection type to style index
      const typeIndex = this.getConnectorTypeIndex(conn.type);
      const connectorStyle = getConnectorTypeStyle(typeIndex, connectorStyles);
      
      return {
        data: {
          id: `edge-${index}`,
          source: conn.fromId,
          target: conn.toId,
          connectorType: conn.type,
          color: connectorStyle.color,
          width: connectorStyle.strokeWidth,
          dashPattern: connectorStyle.strokeDasharray,
          opacity: connectorStyle.opacity
        },
        classes: `hierarchy-edge connector-${typeIndex}`
      };
    });

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
          'width': 'data(width)',
          'line-color': 'data(color)',
          'target-arrow-color': 'data(color)',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'opacity': 'data(opacity)'
        }
      },
      // Connector type specific styles
      {
        selector: '.connector-0',
        style: {
          'line-style': 'solid'
        }
      },
      {
        selector: '.connector-1',
        style: {
          'line-style': 'dashed'
        }
      },
      {
        selector: '.connector-2',
        style: {
          'line-style': 'dotted'
        }
      },
      {
        selector: '.connector-3',
        style: {
          'line-style': 'solid',
          'width': 3
        }
      },
      {
        selector: '.connector-4',
        style: {
          'line-style': 'dashed',
          'line-dash-pattern': [12, 6]
        }
      },
      {
        selector: '.connector-5',
        style: {
          'line-style': 'solid'
        }
      },
      {
        selector: '.connector-6',
        style: {
          'line-style': 'dashed'
        }
      },
      {
        selector: '.connector-7',
        style: {
          'line-style': 'dotted'
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

  private static getConnectorTypeIndex(type: string): number {
    // Simple hash function to map connector type names to indices
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      const char = type.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 8; // Limit to reasonable range for connectors
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
  static transform(data: HierarchyData, config?: GraphConfig): D3Data {
    // Generate color palette for entity types
    const entityColors = config ? generateEntityTypeColors(config.entityTypes) : generateEntityTypeColors(4);
    const connectorStyles = config ? generateConnectorTypeStyles(config.connectorTypes) : generateConnectorTypeStyles(3);
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

  static getNodeColor(node: D3Node, entityColors: string[]): string {
    // Map entity type to color index (for now, use simple hash of type name)
    const typeIndex = this.getEntityTypeIndex(node.entityType);
    const baseColor = getEntityTypeColor(typeIndex, entityColors);
    
    // Slightly adjust brightness based on level for visual hierarchy
    if (node.level === 0) {
      return baseColor; // Root nodes use full color
    } else {
      // Child nodes use a lighter version
      return this.adjustColorBrightness(baseColor, 20);
    }
  }

  private static getEntityTypeIndex(type: string): number {
    // Simple hash function to map entity type names to indices
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      const char = type.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 10; // Limit to reasonable range
  }

  private static adjustColorBrightness(color: string, percent: number): string {
    // Simple brightness adjustment for hex colors
    if (color.startsWith('#')) {
      const num = parseInt(color.slice(1), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    return color; // Return original if not hex
  }

  static getNodeRadius(node: D3Node): number {
    return node.entityType === 'Parent' ? (node.level === 0 ? 20 : 15) : 12;
  }

  static getLinkColor(link: D3Link, connectorStyles: ConnectorStyle[]): string {
    // Map connection type to style index
    const typeIndex = this.getConnectorTypeIndex(link.type);
    const connectorStyle = getConnectorTypeStyle(typeIndex, connectorStyles);
    return connectorStyle.color;
  }

  private static getConnectorTypeIndex(type: string): number {
    // Simple hash function to map connector type names to indices
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      const char = type.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 8; // Limit to reasonable range for connectors
  }
}

// ========================================
// Data Extractor (from API response format)
// ========================================

export class HierarchyDataExtractor {
  static extractFromApiResponse(apiResponse: unknown): HierarchyData {
    const response = apiResponse as {
      positioned: HierarchyEntity[];
      connections?: Array<{ fromId: string; toId: string; type: string }>;
      groups: Array<{ entities: Array<{ id: string; parentId?: string }> }>;
    };

    if (!response.positioned) {
      throw new Error('Invalid API response: missing positioned entities');
    }

    const entities = response.positioned;
    
    // Use API-provided connections if available, otherwise extract from parent-child relationships
    let connections: HierarchyConnection[] = [];
    
    if (response.connections && Array.isArray(response.connections)) {
      // Use the typed connections from the API
      connections = response.connections.map(conn => ({
        fromId: conn.fromId,
        toId: conn.toId,
        type: conn.type
      }));
    } else {
      // Fallback: extract connections from parent-child relationships
      entities.forEach(entity => {
        if (entity.parentId) {
          connections.push({
            fromId: entity.parentId,
            toId: entity.entityId,
            type: 'parent-child'
          });
        }
      });
    }

    return { entities, connections };
  }
}

// ========================================
// Main Graph Data Factory
// ========================================

export class GraphDataFactory {
  static createReactFlowData(apiResponse: unknown, config?: GraphConfig): ReactFlowData {
    const hierarchyData = HierarchyDataExtractor.extractFromApiResponse(apiResponse);
    return ReactFlowAdapter.transform(hierarchyData, config);
  }

  static createCytoscapeData(apiResponse: unknown, config?: GraphConfig): CytoscapeData {
    const hierarchyData = HierarchyDataExtractor.extractFromApiResponse(apiResponse);
    return CytoscapeAdapter.transform(hierarchyData, config);
  }

  static createD3Data(apiResponse: unknown, config?: GraphConfig): D3Data {
    const hierarchyData = HierarchyDataExtractor.extractFromApiResponse(apiResponse);
    return D3Adapter.transform(hierarchyData, config);
  }
}