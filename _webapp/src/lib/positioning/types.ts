/**
 * Types and interfaces for entity positioning
 */

export interface SimpleEntity {
  id: string;
  type: string;
  parentId?: string;
  children: string[];
  connections: string[];
  weight?: number;
  isHub?: boolean;
}

export interface ConnectedGroup {
  id: string;
  rootEntityId: string;
  entities: SimpleEntity[];
  metrics: {
    totalEntities: number;
    depth: number;
    typeCounts: Record<string, number>;
    rootId: string;
  };
}

export interface EntityPosition {
  entityId: string;
  type: string;
  parentId?: string;
  x: number;
  y: number;
  z: number;
  level: number;
  groupId: string;
}