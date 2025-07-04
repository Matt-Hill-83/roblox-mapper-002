/**
 * Graph Data Transformation Layer
 * Provides adapters to transform hierarchical data into formats required by different graph libraries
 */

import {
  generateEntityTypeColors,
  generateConnectorTypeStyles,
  getEntityTypeColor,
  getConnectorTypeStyle,
  ConnectorStyle,
} from "../utils/colorUtils";
import colorTokens from "../config/colorTokens";

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
// Cytoscape Adapter
// ========================================

export interface CytoscapeElement {
  data: Record<string, unknown>;
  position: { x: number; y: number };
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
    const connectorStyles = config
      ? generateConnectorTypeStyles(config.connectorTypes)
      : generateConnectorTypeStyles(3);

    const nodeElements: CytoscapeElement[] = data.entities.map((entity) => ({
      data: {
        id: entity.entityId,
        label: entity.entityId.replace("entity_", ""),
        entityType: entity.type,
        level: entity.level,
        groupId: entity.groupId,
      },
      position: {
        x:
          typeof entity.x === "number" && !isNaN(entity.x) ? entity.x * 1.5 : 0,
        y:
          typeof entity.y === "number" && !isNaN(entity.y)
            ? entity.y * -1.5
            : 0,
      },
      classes: `type-${entity.type.toLowerCase()} level-${entity.level} ${
        entity.groupId
      }`,
    }));

    const edgeElements: CytoscapeElement[] = data.connections.map((conn, i) => {
      const idx = this.getConnectorTypeIndex(conn.type);
      const colorIndex =
        idx % colorTokens.pages.hiTester.graphs.edgeColors.types.length;
      return {
        data: {
          id: `e-${i}`,
          source: conn.fromId,
          target: conn.toId,
        },
        classes: `connector-${colorIndex}`,
      };
    });

    // Get unique entity types
    const entityTypes = Array.from(
      new Set(data.entities.map((e) => e.type))
    ).sort();

    const style = [
      {
        selector: "node",
        style: {
          label: "data(label)",
          "background-color": colorTokens.colors.gray005,
          "border-width": 2,
          "border-color": colorTokens.colors.gray008,
          width: 40,
          height: 40,
          "text-valign": "center",
          "text-halign": "center",
          "font-size": 12,
        },
      },
    ];

    // Entity type-based coloring
    entityTypes.forEach((type, index) => {
      const colorIndex =
        index % colorTokens.pages.hiTester.graphs.nodeColors.levels.length;
      const color =
        colorTokens.pages.hiTester.graphs.nodeColors.levels[colorIndex];
      style.push({
        selector: `.type-${type.toLowerCase()}`,
        style: {
          "background-color": color,
          "border-color": color,
        },
      });
    });

    // Edge styles using colorTokens types array
    colorTokens.pages.hiTester.graphs.edgeColors.types.forEach((color, i) => {
      style.push({
        selector: `.connector-${i}`,
        style: {
          "line-color": color,
          "target-arrow-color": color,
          "target-arrow-shape": "triangle",
          width: 2,
          opacity: 0.8,
          "curve-style": "bezier",
        },
      });
    });

    return {
      elements: [...nodeElements, ...edgeElements],
      style,
      layout: { name: "preset", fit: true, padding: 20 },
    };
  }

  private static getConnectorTypeIndex(type: string): number {
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      const char = type.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash) % 8;
  }
}

// ========================================
// React Flow Adapter
// ========================================

export interface ReactFlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    entityType: string;
    level: number;
    parentIds: string[];
    [key: string]: unknown;
  };
  style: Record<string, unknown>;
}

export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
  style: Record<string, unknown>;
}

export interface ReactFlowData {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
}

class ReactFlowAdapter {
  static transform(data: HierarchyData, config?: GraphConfig): ReactFlowData {
    // Debug: Check input data for invalid coordinate values
    const entitiesWithInvalidCoords = data.entities.filter(
      (e) => e.x == null || e.y == null || isNaN(e.x) || isNaN(e.y)
    );
    if (entitiesWithInvalidCoords.length > 0) {
      console.error(
        "ReactFlowAdapter: Input entities with invalid coordinates:",
        entitiesWithInvalidCoords
      );
    }

    // Generate palettes
    const entityColors = config
      ? generateEntityTypeColors(config.entityTypes)
      : generateEntityTypeColors(4);
    const connectorStyles = config
      ? generateConnectorTypeStyles(config.connectorTypes)
      : generateConnectorTypeStyles(3);

    // ⬛ T67–T70: horizontal “swimlanes” by entity type
    const types = Array.from(new Set(data.entities.map((e) => e.type))).sort();
    const typeIndexMap = new Map<string, number>(types.map((t, i) => [t, i]));
    // Spread across 600px total width (adjust as needed)
    const laneGap = types.length > 0 ? 600 / types.length : 100;

    // First pass: create nodes with initial positions
    const nodes: ReactFlowNode[] = data.entities.map((entity, index) => {
      // Use entity type-based colors from colorTokens levels array
      const typeIndex = typeIndexMap.get(entity.type) ?? 0;
      const colorIndex =
        typeIndex % colorTokens.pages.hiTester.graphs.nodeColors.levels.length;
      const nodeColor =
        colorTokens.pages.hiTester.graphs.nodeColors.levels[colorIndex];

      return {
        id: entity.entityId,
        type: "default",
        position: {
          x: (() => {
            // Use entity's actual X coordinate if available, otherwise use type-based lane
            if (
              typeof entity.x === "number" &&
              entity.x != null &&
              !isNaN(entity.x)
            ) {
              return entity.x;
            }
            const typeIndex = typeIndexMap.get(entity.type) ?? 0;
            const calculatedX = typeIndex * laneGap;
            return isNaN(calculatedX) ? 0 : calculatedX;
          })(), // Prefer actual coordinates, fallback to type-based lanes
          y:
            typeof entity.y === "number" && entity.y != null && !isNaN(entity.y)
              ? entity.y * -2
              : 0, // Invert Y for React Flow
        },
        data: {
          label: `${index + 1}`,
          entityType: entity.type,
          level: entity.level,
          parentIds: entity.parentId ? [entity.parentId] : [],
        },
        style: {
          backgroundColor: nodeColor,
          color: "#ffffff",
          border: `2px solid ${nodeColor}`,
          borderRadius: entity.type === "Parent" ? "50%" : "8px",
          width: 60,
          height: 60,
          fontSize: "24px",
          fontWeight: "bold",
        },
      };
    });

    // 🔹 New step: reorder nodes horizontally to minimise crossings
    const decrossedNodes = this.minimiseCrossings(nodes);

    // Ensure minimum spacing between all nodes
    const adjustedNodes = this.ensureMinimumSpacing(decrossedNodes, 2);

    // Edges
    const edges: ReactFlowEdge[] = data.connections.map((conn, index) => {
      const typeIndex = this.getConnectorTypeIndex(conn.type);
      const colorIndex =
        typeIndex % colorTokens.pages.hiTester.graphs.edgeColors.types.length;
      const edgeColor =
        colorTokens.pages.hiTester.graphs.edgeColors.types[colorIndex];

      return {
        id: `edge-${index}`,
        source: conn.fromId,
        target: conn.toId,
        type: "smoothstep",
        animated: false,
        style: {
          stroke: edgeColor,
          strokeWidth: 2,
          opacity: 0.8,
        },
      };
    });

    return { nodes: adjustedNodes, edges };
  }

  /**
   * Simple barycentric decrossing:
   *   – group nodes by level
   *   – sort each level by the average X-position of its parent nodes
   *   – lay them out with uniform gaps
   */
  private static minimiseCrossings(nodes: ReactFlowNode[]): ReactFlowNode[] {
    const idToNode: Record<string, ReactFlowNode> = Object.fromEntries(
      nodes.map((n) => [n.id, n])
    );
    const levels: Record<number, ReactFlowNode[]> = {};
    nodes.forEach((n) => {
      const lvl = (n.data as any).level ?? 0;
      (levels[lvl] ||= []).push(n);
    });

    Object.entries(levels)
      .filter(([lvl]) => Number(lvl) > 0)
      .forEach(([, levelNodes]) => {
        levelNodes.sort((a, b) => avgParentX(a) - avgParentX(b));

        const gap = 120;
        const startX = -((levelNodes.length - 1) * gap) / 2;
        levelNodes.forEach((n, i) => {
          n.position.x = startX + i * gap;
        });
      });

    return nodes;

    function avgParentX(node: ReactFlowNode): number {
      const parents: string[] = (node.data as any).parentIds;
      if (!parents || parents.length === 0) return node.position.x;
      const sum = parents.reduce(
        (acc, pid) => acc + (idToNode[pid]?.position.x ?? 0),
        0
      );
      return sum / parents.length;
    }
  }

  /** Keeps nodes at least `minSpacing` pixels apart */
  private static ensureMinimumSpacing(
    nodes: ReactFlowNode[],
    minSpacing: number
  ): ReactFlowNode[] {
    const nodeSize = 60;
    const distanceNeeded = nodeSize + minSpacing;
    const result = [...nodes];

    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
          const A = result[i];
          const B = result[j];
          const dx = B.position.x - A.position.x;
          const dy = B.position.y - A.position.y;
          const dist = Math.hypot(dx, dy);
          if (dist < distanceNeeded) {
            const overlap = distanceNeeded - dist;
            const ux = dx / dist;
            const uy = dy / dist;
            A.position.x -= (ux * overlap) / 2;
            A.position.y -= (uy * overlap) / 2;
            B.position.x += (ux * overlap) / 2;
            B.position.y += (uy * overlap) / 2;
          }
        }
      }
    }

    return result;
  }

  private static getBorderColor(groupId: string): string {
    const palette = [
      "#f44336",
      "#2196f3",
      "#4caf50",
      "#ff9800",
      "#9c27b0",
      "#009688",
    ];
    const idx =
      Math.abs(
        groupId.split("").reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0)
      ) % palette.length;
    return palette[idx];
  }

  private static getConnectorTypeIndex(type: string): number {
    let hash = 0;
    for (const c of type) {
      hash = (hash << 5) - hash + c.charCodeAt(0);
      hash |= 0;
    }
    return Math.abs(hash) % 10;
  }
}

// ========================================
// D3.js Adapter
// ========================================

export interface D3Node {
  id: string;
  label: string;
  type: string;
  entityType: string;
  level: number;
  groupId: string;
  parentId?: string;
  x?: number;
  y?: number;
  // Additional properties for D3 simulation
  fx?: number;
  fy?: number;
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
    const nodes: D3Node[] = data.entities.map((e) => ({
      id: e.entityId,
      label: e.entityId.replace("entity_", ""),
      type: e.type,
      entityType: e.type, // D3Graph expects entityType property
      level: e.level,
      groupId: e.groupId,
      parentId: e.parentId,
      x: e.x,
      y: e.y,
    }));

    const links: D3Link[] = data.connections.map((c) => ({
      source: c.fromId,
      target: c.toId,
      type: c.type,
    }));

    return { nodes, links };
  }

  // Helper methods for D3Graph component
  static getNodeRadius(node: D3Node): number {
    // Root nodes (level 0) are larger
    if (node.level === 0) return 15;
    // Hub nodes or nodes with many connections could be larger
    return 10;
  }

  static getNodeColor(node: D3Node): string {
    // Use entity type-based colors from colorTokens levels array
    // Create a hash of the entity type to get a consistent index
    let hash = 0;
    for (let i = 0; i < node.type.length; i++) {
      const char = node.type.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const colorIndex =
      Math.abs(hash) %
      colorTokens.pages.hiTester.graphs.nodeColors.levels.length;
    return colorTokens.pages.hiTester.graphs.nodeColors.levels[colorIndex];
  }

  static getLinkColor(link: D3Link): string {
    // Use edge colors from colorTokens types array
    const typeIndex = Math.abs(
      link.type.split("").reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0)
    );
    const colorIndex =
      typeIndex % colorTokens.pages.hiTester.graphs.edgeColors.types.length;
    return colorTokens.pages.hiTester.graphs.edgeColors.types[colorIndex];
  }
}

// ========================================
// HierarchyDataExtractor
// ========================================

export class HierarchyDataExtractor {
  static extractFromApiResponse(resp: unknown): HierarchyData {
    // Handle the actual API response structure from /api/hierarchy-test
    const response = resp as {
      entities?: unknown[];
      connections?: unknown[];
      positioned?: unknown[];
    };

    if (!response || !response.entities || !response.connections) {
      console.warn("Invalid API response structure, returning empty data");
      return { entities: [], connections: [] };
    }

    // Transform entities from API format to HierarchyEntity format
    // Use positioned entities if available (they have x, y coordinates)
    const sourceEntities = response.positioned || response.entities;

    const entities: HierarchyEntity[] = sourceEntities.map(
      (entity: unknown) => {
        const e = entity as {
          entityId?: string;
          id?: string;
          type?: string;
          parentId?: string;
          x?: number;
          y?: number;
          level?: number;
          groupId?: string;
        };

        const result = {
          entityId: e.entityId || e.id || "",
          type: e.type || "Unknown",
          parentId: e.parentId,
          x: typeof e.x === "number" && e.x != null && !isNaN(e.x) ? e.x : 0,
          y: typeof e.y === "number" && e.y != null && !isNaN(e.y) ? e.y : 0,
          level: typeof e.level === "number" && !isNaN(e.level) ? e.level : 0,
          groupId: e.groupId || "default",
        };

        // Debug logging for NaN values
        if (isNaN(result.x) || isNaN(result.y)) {
          console.warn("NaN detected in entity:", {
            original: { x: e.x, y: e.y, level: e.level },
            result: { x: result.x, y: result.y, level: result.level },
            entityId: result.entityId,
          });
        }

        return result;
      }
    );

    // Transform connections from API format to HierarchyConnection format
    const connections: HierarchyConnection[] = response.connections.map(
      (conn: unknown) => {
        const c = conn as {
          fromId?: string;
          toId?: string;
          type?: string;
        };

        return {
          fromId: c.fromId || "",
          toId: c.toId || "",
          type: c.type || "unknown",
        };
      }
    );

    return { entities, connections };
  }
}

// ========================================
// Exported factory
// ========================================

export class GraphAdapters {
  static createReactFlowData(
    apiResponse: unknown,
    config?: GraphConfig
  ): ReactFlowData {
    const hierarchyData =
      HierarchyDataExtractor.extractFromApiResponse(apiResponse);
    return ReactFlowAdapter.transform(hierarchyData, config);
  }

  static createCytoscapeData(
    apiResponse: unknown,
    config?: GraphConfig
  ): CytoscapeData {
    const hierarchyData =
      HierarchyDataExtractor.extractFromApiResponse(apiResponse);
    return CytoscapeAdapter.transform(hierarchyData, config);
  }

  static createD3Data(apiResponse: unknown): D3Data {
    const hierarchyData =
      HierarchyDataExtractor.extractFromApiResponse(apiResponse);
    return D3Adapter.transform(hierarchyData);
  }
}
