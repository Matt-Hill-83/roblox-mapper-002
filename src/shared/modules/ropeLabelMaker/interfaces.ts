/**
 * Interfaces for the rope label maker module
 */

/**
 * Properties required to create a rope label
 */
export interface RopeLabelProps {
  ropeIndex: number;
  relationTypeName: string;
  sourceAttachment: Attachment;
  targetAttachment: Attachment;
  parent: Instance;
  relationName?: string;
}

/**
 * Configuration for rope label creation
 */
export interface RopeLabelConfig {
  ropeIndex: number;
  relationTypeName: string;
  sourceAttachment: Attachment;
  targetAttachment: Attachment;
  parent: Instance;
  props?: { [key: string]: any };
}

/**
 * Parsed relation data structure
 */
export interface ParsedRelation {
  source: string;
  relation: string;
  target: string;
}

/**
 * Options for customizing rope label appearance
 */
export interface RopeLabelOptions {
  textSize?: number;
  spacing?: number;
  colors?: {
    source?: Color3;
    relation?: Color3;
    target?: Color3;
  };
}