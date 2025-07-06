/**
 * Utility functions for rope label creation
 */

import { ROPE_LABEL_CONSTANTS } from "./constants";
import { ParsedRelation } from "./interfaces";

/**
 * Parses a relation name into its components
 * Pattern: "source_RELATION_target" -> { source, relation, target }
 */
export function parseRelationName(
  relationName: string,
  relationTypeName: string
): ParsedRelation {
  if (!relationName) {
    return {
      source: ROPE_LABEL_CONSTANTS.DEFAULTS.SOURCE_TEXT,
      relation: relationTypeName,
      target: ROPE_LABEL_CONSTANTS.DEFAULTS.TARGET_TEXT
    };
  }

  // Pattern: "source_RELATION_target" -> { source, relation, target }
  const splitPattern = `${ROPE_LABEL_CONSTANTS.PARSING.SEPARATOR}${relationTypeName}${ROPE_LABEL_CONSTANTS.PARSING.SEPARATOR}`;
  const splitIndex = relationName.find(splitPattern);

  if (splitIndex && splitIndex[0] !== undefined) {
    const beforeIndex = splitIndex[0];
    const afterIndex = beforeIndex + splitPattern.size();

    const source = relationName.sub(1, beforeIndex - 1);
    const target = relationName.sub(afterIndex);

    // Replace underscores with spaces using gsub
    const sourceFormatted = formatNodeName(source);
    const targetFormatted = formatNodeName(target);

    return {
      source: sourceFormatted,
      relation: relationTypeName,
      target: targetFormatted,
    };
  }

  // Fallback
  return {
    source: ROPE_LABEL_CONSTANTS.DEFAULTS.SOURCE_TEXT,
    relation: relationTypeName,
    target: ROPE_LABEL_CONSTANTS.DEFAULTS.TARGET_TEXT
  };
}

/**
 * Formats a node name by replacing underscores with spaces
 */
export function formatNodeName(name: string): string {
  return name.gsub("_", " ")[0];
}

/**
 * Calculates the label position between two attachments
 */
export function calculateLabelPosition(
  attachment1: Attachment,
  attachment2: Attachment
): Vector3 {
  const pos1 = attachment1.WorldPosition;
  const pos2 = attachment2.WorldPosition;
  
  // Calculate midpoint
  const midpoint = pos1.add(pos2).div(2);
  
  // Add Z offset for label visibility
  return new Vector3(
    midpoint.X,
    midpoint.Y,
    midpoint.Z + ROPE_LABEL_CONSTANTS.LABEL.Z_OFFSET
  );
}

/**
 * Validates if a relation name follows the expected format
 */
export function validateRelationFormat(relationName: string): boolean {
  const parts = relationName.split(ROPE_LABEL_CONSTANTS.PARSING.SEPARATOR);
  return parts.size() >= ROPE_LABEL_CONSTANTS.PARSING.MIN_PARTS;
}