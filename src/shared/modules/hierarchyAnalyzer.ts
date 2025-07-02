import { allEntityData, allRelationData } from "../data";

export interface EntityNode {
  guid: string;
  name: string;
  type: string;
  children: Set<string>; // entities this one owns/contains
  parents: Set<string>; // entities that own/contain this one
  weakConnections: Set<string>; // uses/depends relationships
}

export interface ConnectionData {
  fromGuid: string;
  toGuid: string;
  type: string;
}

export interface HierarchyTree {
  rootGuid: string;
  rootName: string;
  depth: number;
  totalNodes: number;
  nodes: Map<string, EntityNode>;
  connections: ConnectionData[];
}

export interface HierarchyAnalysisResult {
  trees: HierarchyTree[];
  orphanedEntities: string[];
  cyclicGroups: string[][];
  totalEntities: number;
  connectedEntities: number;
}

// Relationship types that indicate strong hierarchy (ownership/containment)
const HIERARCHICAL_RELATIONS = [
  "relationOwns",
  "relationContains",
  "relationManages",
];

// Relationship types that indicate weaker connections
const WEAK_RELATIONS = [
  "relationUses",
  "relationDependsOn",
  "relationConsumes",
];

export function analyzeEntityHierarchy(): HierarchyAnalysisResult {
  print("🌳 Starting entity hierarchy analysis...");

  // Step 1: Build the directed graph
  const entityNodes = buildEntityGraph();

  // Step 2: Find root entities (no incoming hierarchical edges)
  const rootEntities = findRootEntities(entityNodes);

  // Step 3: Build trees from each root
  const trees = buildHierarchyTrees(entityNodes, rootEntities);

  // Step 4: Find orphaned entities and cycles
  const { orphanedEntities, cyclicGroups } = findOrphanedAndCyclicEntities(
    entityNodes,
    trees
  );

  // Step 5: Print results
  const totalEntityCount = entityNodes.size();
  const orphanedCount = orphanedEntities.size();
  const result: HierarchyAnalysisResult = {
    trees,
    orphanedEntities,
    cyclicGroups,
    totalEntities: totalEntityCount,
    connectedEntities: totalEntityCount - orphanedCount,
  };

  printHierarchyAnalysis(result);

  return result;
}

function buildEntityGraph(): Map<string, EntityNode> {
  const entityNodes = new Map<string, EntityNode>();

  // Initialize all entities
  for (const entityType of allEntityData) {
    for (const entity of entityType.data) {
      entityNodes.set(entity.guid, {
        guid: entity.guid,
        name: entity.name,
        type: entityType.name,
        children: new Set<string>(),
        parents: new Set<string>(),
        weakConnections: new Set<string>(),
      });
    }
  }

  print(`📊 Initialized ${entityNodes.size()} entities`);

  // Add relationships
  let hierarchicalEdges = 0;
  let weakEdges = 0;

  for (const relationType of allRelationData) {
    const isHierarchical = HIERARCHICAL_RELATIONS.includes(relationType.name);
    const isWeak = WEAK_RELATIONS.includes(relationType.name);

    if (!isHierarchical && !isWeak) continue;

    for (const relation of relationType.data) {
      const sourceNode = entityNodes.get(relation.source_guid);
      const targetNode = entityNodes.get(relation.target_guid);

      if (sourceNode && targetNode) {
        if (isHierarchical) {
          // Source owns/contains target
          sourceNode.children.add(relation.target_guid);
          targetNode.parents.add(relation.source_guid);
          hierarchicalEdges++;
        } else if (isWeak) {
          // Bidirectional weak connection
          sourceNode.weakConnections.add(relation.target_guid);
          targetNode.weakConnections.add(relation.source_guid);
          weakEdges++;
        }
      }
    }
  }

  print(
    `🔗 Added ${hierarchicalEdges} hierarchical edges and ${weakEdges} weak edges`
  );

  return entityNodes;
}

function findRootEntities(entityNodes: Map<string, EntityNode>): string[] {
  const roots: string[] = [];

  entityNodes.forEach((node, guid) => {
    if (node.parents.size() === 0 && node.children.size() > 0) {
      roots.push(guid);
    }
  });

  print(`🌱 Found ${roots.size()} root entities`);
  return roots;
}

function buildHierarchyTrees(
  entityNodes: Map<string, EntityNode>,
  rootEntities: string[]
): HierarchyTree[] {
  const trees: HierarchyTree[] = [];

  for (const rootGuid of rootEntities) {
    const rootNode = entityNodes.get(rootGuid);
    if (!rootNode) continue;

    const treeNodes = new Map<string, EntityNode>();
    const connections: ConnectionData[] = [];
    const visited = new Set<string>();
    let maxDepth = 0;

    // DFS to build tree
    function dfsTree(guid: string, depth: number): void {
      if (visited.has(guid)) return;
      visited.add(guid);

      const node = entityNodes.get(guid);
      if (!node) return;

      treeNodes.set(guid, node);
      maxDepth = math.max(maxDepth, depth);

      // Add connections for each child
      node.children.forEach((childGuid) => {
        connections.push({
          fromGuid: guid,
          toGuid: childGuid,
          type: "hierarchical"
        });
        dfsTree(childGuid, depth + 1);
      });

      // Add weak connections within the tree
      node.weakConnections.forEach((targetGuid) => {
        if (treeNodes.has(targetGuid)) {
          connections.push({
            fromGuid: guid,
            toGuid: targetGuid,
            type: "weak"
          });
        }
      });
    }

    dfsTree(rootGuid, 0);

    trees.push({
      rootGuid,
      rootName: rootNode.name,
      depth: maxDepth,
      totalNodes: treeNodes.size(),
      nodes: treeNodes,
      connections
    });
  }

  // Sort trees by size (largest first) using Roblox-TS compatible sort
  trees.sort((a, b) => {
    return b.totalNodes > a.totalNodes;
  });

  return trees;
}

function findOrphanedAndCyclicEntities(
  entityNodes: Map<string, EntityNode>,
  trees: HierarchyTree[]
): { orphanedEntities: string[]; cyclicGroups: string[][] } {
  const entitiesInTrees = new Set<string>();

  // Mark all entities that are in trees
  for (const tree of trees) {
    tree.nodes.forEach((_, guid) => {
      entitiesInTrees.add(guid);
    });
  }

  // Find orphaned entities (not in any tree but have connections)
  const orphanedEntities: string[] = [];
  entityNodes.forEach((node, guid) => {
    if (
      !entitiesInTrees.has(guid) &&
      (node.children.size() > 0 ||
        node.parents.size() > 0 ||
        node.weakConnections.size() > 0)
    ) {
      orphanedEntities.push(guid);
    }
  });

  // For now, we'll do a simple cycle detection later
  const cyclicGroups: string[][] = [];

  return { orphanedEntities, cyclicGroups };
}

function printHierarchyAnalysis(result: HierarchyAnalysisResult): void {
  print("🌳 =============== HIERARCHY ANALYSIS RESULTS ===============");
  print(`📊 Total entities: ${result.totalEntities}`);
  print(`🔗 Connected entities: ${result.connectedEntities}`);
  print(`🌱 Hierarchy trees found: ${result.trees.size()}`);
  print(`🏝️ Orphaned entities: ${result.orphanedEntities.size()}`);
  print(`🔄 Cyclic groups: ${result.cyclicGroups.size()}`);
  print("");

  // Print each tree
  result.trees.forEach((tree, index) => {
    print(`🌳 Tree ${index + 1}: ${tree.rootName}`);
    print(`   Root GUID: ${tree.rootGuid}`);
    print(`   Depth: ${tree.depth} levels`);
    print(`   Nodes: ${tree.totalNodes} entities`);
    print(`   Connections: ${tree.connections.size()} (${
      tree.connections.filter(c => c.type === "hierarchical").size()
    } hierarchical, ${
      tree.connections.filter(c => c.type === "weak").size()
    } weak)`);
  });

  print("");

  if (result.orphanedEntities.size() > 0) {
    print("🏝️ Orphaned entities:");
    result.orphanedEntities.forEach((guid) => {
      const node = result.trees[0]?.nodes.get(guid);
      if (node) {
        print(`   ${node.name} (${node.type})`);
      }
    });
    print("");
  }

  print("🌳 ======================================================");
}
