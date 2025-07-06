/**
 * Main rope label creation module
 */

import { createLabelGroup } from "../labelGroupMaker";
import { RopeLabelProps } from "./interfaces";
import { parseRelationName } from "./utilities";

/**
 * Creates a rope label with source, relation, and target text blocks
 */
export function createRopeLabel(props: RopeLabelProps): Model {
  const {
    ropeIndex,
    relationTypeName,
    sourceAttachment,
    targetAttachment,
    parent,
    relationName = ""
  } = props;

  // Parse the relation name into components
  const parsedRelation = parseRelationName(relationName, relationTypeName);

  // Use the labelGroupMaker to create 3 separate blocks
  const labelGroup = createLabelGroup({
    ropeIndex,
    sourceText: parsedRelation.source,
    relationText: parsedRelation.relation,
    targetText: parsedRelation.target,
    sourceAttachment,
    targetAttachment,
    parent,
    props: {
      relationName: relationName,
    },
  });

  return labelGroup;
}