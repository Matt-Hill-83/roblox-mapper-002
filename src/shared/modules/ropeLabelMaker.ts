import { createLabelGroup } from "./labelGroupMaker";

function parseRelationName(
  relationName: string,
  relationTypeName: string
): { source: string; relation: string; target: string } {
  if (!relationName) {
    return { source: "source", relation: relationTypeName, target: "target" };
  }

  // Pattern: "source_RELATION_target" -> { source, relation, target }
  const splitPattern = `_${relationTypeName}_`;
  const splitIndex = relationName.find(splitPattern);

  if (splitIndex && splitIndex[0] !== undefined) {
    const beforeIndex = splitIndex[0];
    const afterIndex = beforeIndex + splitPattern.size();

    const source = relationName.sub(1, beforeIndex - 1);
    const target = relationName.sub(afterIndex);

    // Replace underscores with spaces using gsub
    const sourceFormatted = source.gsub("_", " ")[0];
    const targetFormatted = target.gsub("_", " ")[0];

    return {
      source: sourceFormatted,
      relation: relationTypeName,
      target: targetFormatted,
    };
  }

  // Fallback
  return { source: "source", relation: relationTypeName, target: "target" };
}

interface RopeLabelConfig {
  ropeIndex: number;
  relationTypeName: string;
  sourceAttachment: Attachment;
  targetAttachment: Attachment;
  parent: Instance;
  props?: { [key: string]: any };
}

export function createRopeLabel({
  ropeIndex,
  relationTypeName,
  sourceAttachment,
  targetAttachment,
  parent,
  props = {},
}: RopeLabelConfig): Model {
  // Parse the relation name into components
  const relationName = (props.relationName as string) || "";
  const parsedRelation = parseRelationName(relationName, relationTypeName);

  // Use the new labelGroupMaker to create 3 separate blocks
  const labelGroup = createLabelGroup({
    ropeIndex,
    sourceText: parsedRelation.source,
    relationText: parsedRelation.relation,
    targetText: parsedRelation.target,
    sourceAttachment,
    targetAttachment,
    parent,
    props,
  });

  return labelGroup;
}
