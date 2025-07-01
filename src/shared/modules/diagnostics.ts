// Diagnostic utilities for debugging the connector system
import { allEntityData, allRelationData } from "../data";

export function listAllHexagons(): void {
  print("🔍 Listing all hexagon models in workspace...");
  
  // Find all models that look like hexagons
  const hexagons = game.Workspace.GetDescendants().filter((desc: Instance) => 
    desc.IsA("Model") && 
    (desc.Name.sub(1, 1) === "h" || desc.Name.find("hex") !== undefined)
  );
  
  print(`Found ${hexagons.size()} hexagon models:`);
  for (const hexagon of hexagons) {
    const guid = hexagon.GetAttribute("guid");
    print(`  - ${hexagon.Name} (GUID: ${guid || "none"})`);
  }
}

export function listAllModelsWithGuids(): void {
  print("🔍 Listing all models with GUID attributes...");
  
  const modelsWithGuids = game.Workspace.GetDescendants().filter((desc: Instance) => 
    desc.IsA("Model") && 
    desc.GetAttribute("guid") !== undefined
  );
  
  print(`Found ${modelsWithGuids.size()} models with GUIDs:`);
  for (const model of modelsWithGuids) {
    const guid = model.GetAttribute("guid");
    print(`  - ${model.Name} (GUID: ${guid})`);
  }
}

export function checkAttachments(): void {
  print("🔍 Checking attachments in hexagon models...");
  
  const hexagons = game.Workspace.GetDescendants().filter((desc: Instance) => 
    desc.IsA("Model") && 
    (desc.Name.sub(1, 1) === "h" || desc.Name.find("hex") !== undefined)
  );
  
  for (const hexagon of hexagons) {
    const attachments = hexagon.GetDescendants().filter((desc: Instance) => 
      desc.IsA("Attachment")
    );
    
    print(`${hexagon.Name} has ${attachments.size()} attachments:`);
    for (const attachment of attachments) {
      print(`  - ${attachment.Name}`);
    }
  }
}

export function checkGuidMatches(): void {
  print("🔍 Checking GUID matches between entity data and relation data...");
  
  // Get all unique GUIDs from entity data
  const entityGuids = new Set<string>();
  for (const entityType of allEntityData) {
    for (const entity of entityType.data) {
      if (entity.guid) {
        entityGuids.add(entity.guid);
      }
    }
  }
  
  print(`Found ${entityGuids.size()} unique entity GUIDs`);
  
  // Check the first few relation types for GUID matches
  const testRelationTypes = ["relationSecures", "relationDependsOn", "relationUses", "relationContains"];
  
  for (const relationType of testRelationTypes) {
    const relationInfo = allRelationData.find((rel) => rel.name === relationType);
    if (!relationInfo) continue;
    
    let foundMatches = 0;
    let missingSource = 0;
    let missingTarget = 0;
    
    for (const relation of relationInfo.data) {
      const hasSource = entityGuids.has(relation.source_guid);
      const hasTarget = entityGuids.has(relation.target_guid);
      
      if (hasSource && hasTarget) {
        foundMatches++;
      } else {
        if (!hasSource) missingSource++;
        if (!hasTarget) missingTarget++;
      }
    }
    
    print(`${relationType}: ${foundMatches} matches, ${missingSource} missing source, ${missingTarget} missing target out of ${relationInfo.data.size()} total`);
  }
}
