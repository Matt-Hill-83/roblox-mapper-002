/**
 * Type definitions for UnifiedDataRenderer and related modules
 */

import { EnhancedGeneratorConfig } from "../../../interfaces/enhancedGenerator.interface";
import { Cluster, Node, Link } from "../../../interfaces/simpleDataGenerator.interface";

/**
 * Lane bounds for calculating shadow dimensions
 */
export interface LaneBounds {
  width: number;
  depth: number;
}

/**
 * Bounds for a property value group
 */
export interface PropertyBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/**
 * Lane position information
 */
export interface LanePosition {
  z: number;
  minZ: number;
  maxZ: number;
}

/**
 * Lane dimensions calculation result
 */
export interface LaneDimensions {
  lanePositions: Map<string, LanePosition>;
}

/**
 * Platform bounds for wall creation
 */
export interface PlatformBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/**
 * Wall configuration
 */
export interface WallConfig {
  platformBounds: PlatformBounds;
  height: number;
  parent: Instance;
}

/**
 * Y-axis property group bounds
 */
export interface YPropertyBounds {
  minY: number;
  maxY: number;
}

/**
 * Shadow block configuration
 */
export interface ShadowBlockConfig {
  origin: Vector3;
  parent: Instance;
  height?: number;
  width?: number;
  depth?: number;
  buffer?: number;
}

/**
 * Platform block configuration
 */
export interface PlatformBlockConfig {
  origin: Vector3;
  parent: Instance;
  height?: number;
  size?: number;
}

/**
 * Endcap configuration
 */
export interface EndcapConfig {
  swimlaneBlock: Part;
  swimlaneName: string;
  parent: Instance;
  gap?: number;
  isZAxis?: boolean;
}

/**
 * Y-parallel shadow configuration
 */
export interface YParallelShadowConfig {
  nodes: Node[];
  yAxisProperty: string;
  parent: Folder;
  shadowWidth: number;
  shadowDepth: number;
}

/**
 * Main renderer configuration
 */
export interface RendererConfig {
  parentFolder: Folder;
  config: EnhancedGeneratorConfig;
  origin?: Vector3;
}

/**
 * Update configuration
 */
export interface UpdateConfig extends RendererConfig {
  nodesFolder: Folder;
  linksFolder: Folder;
}

/**
 * Lane manager result containing created blocks
 */
export interface LaneManagerResult {
  xParallelLanes: Map<string, Part>;
  zParallelLanes: Map<string, Part>;
  allLaneBounds: LaneBounds;
}

/**
 * Platform and shadow manager result
 */
export interface PlatformShadowResult {
  platform: Part;
  shadow: Part;
}

/**
 * Wall manager result
 */
export interface WallManagerResult {
  walls: Part[];
  wallHeight: number;
}

/**
 * Type guard functions
 */
export function isNode(obj: unknown): obj is Node {
  if (!obj || typeOf(obj) !== "table") return false;
  const data = obj as { uuid?: unknown; position?: { x?: unknown } };
  return typeIs(data.uuid, "string") && 
         data.position !== undefined &&
         typeIs(data.position.x, "number");
}

export function isLink(obj: unknown): obj is Link {
  if (!obj || typeOf(obj) !== "table") return false;
  const data = obj as { uuid?: unknown; sourceNodeUuid?: unknown; targetNodeUuid?: unknown };
  return typeIs(data.uuid, "string") && 
         typeIs(data.sourceNodeUuid, "string") && 
         typeIs(data.targetNodeUuid, "string");
}

export function isCluster(obj: unknown): obj is Cluster {
  if (!obj || typeOf(obj) !== "table") return false;
  const data = obj as { groups?: unknown; relations?: unknown };
  return typeIs(data.groups, "table") && 
         typeIs(data.relations, "table");
}