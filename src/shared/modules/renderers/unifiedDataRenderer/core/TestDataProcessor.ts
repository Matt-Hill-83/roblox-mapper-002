/**
 * TestDataProcessor class with Import link filtering
 */

import {
  Cluster,
  Group,
  Link,
  Node,
} from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import {
  discoverNodeProperties,
  filterValidAxisProperties,
} from "../../../../utils/propertyDiscovery";
import { TEMP_HARNESS_LINKS } from "../../../../data/tempHarnessLinks";
import { TEMP_HARNESS_TEST_DATA } from "../../../../data/tempHarnessTestData";

// Default maximum number of items to use from test data
const DEFAULT_MAX_DATA_ITEMS = 1000;

export class TestDataProcessor {
  private useTestData = true;
  private propertyFilters?: { [key: string]: string[] };

  public generateClusterFromTestData(
    config?: EnhancedGeneratorConfig
  ): Cluster {
    const maxItems = config?.maxDataItems || DEFAULT_MAX_DATA_ITEMS;

    const harnessNodes: Node[] = [];
    let itemCount = 0;

    TEMP_HARNESS_TEST_DATA.forEach((file, index) => {
      if (itemCount >= maxItems) return;
      itemCount++;

      const node: Node = {
        uuid: `harness_node_${index}`,
        name: this.getFileName(file.path),
        type: file.component as any,
        color: this.getServiceColor(file.service),
        position: { x: 0, y: 0, z: 0 },
        attachmentNames: [],
        properties: {
          service: file.service,
          component: file.component,
          language: file.language,
          size: file.size,
          type: file.type,
          resourceDomain: file.resourceDomain,
          operationType: file.operationType,
          apiPattern: file.apiPattern,
          apiComplexity: file.apiComplexity,
          httpMethod: file.httpMethod,
          // path property removed - no longer needed for visualization
        },
      };
      harnessNodes.push(node);
    });

    const nodeUuids = new Set(harnessNodes.map((node) => node.uuid));
    const validHarnessLinks = TEMP_HARNESS_LINKS.filter(
      (link) =>
        nodeUuids.has(link.sourceNodeUuid) &&
        nodeUuids.has(link.targetNodeUuid) &&
        link.type === "Import"
    );

    // Import links have been filtered to only include "Import" type

    const harnessLinks: Link[] = validHarnessLinks.map((link) => ({
      uuid: link.uuid,
      type: link.type,
      sourceNodeUuid: link.sourceNodeUuid,
      targetNodeUuid: link.targetNodeUuid,
      color: link.color,
    }));

    this.collectAndPrintLinkTypes(TEMP_HARNESS_LINKS);

    // Step 2: Assign treeLevel to nodes based on Import relationships
    this.assignTreeLevels(harnessNodes, validHarnessLinks);

    // Step 3: Apply property filters if any
    const filteredNodes = this.applyPropertyFilters(harnessNodes);

    // Step 4: Filter links to only include those between remaining nodes
    const filteredNodeUuids = new Set(filteredNodes.map((node) => node.uuid));
    const filteredLinks = harnessLinks.filter(
      (link) =>
        filteredNodeUuids.has(link.sourceNodeUuid) &&
        filteredNodeUuids.has(link.targetNodeUuid)
    );

    const discoveredProps = discoverNodeProperties(filteredNodes);
    const validProps = filterValidAxisProperties(
      filteredNodes,
      discoveredProps
    );

    const mainGroup: Group = {
      id: "harness-group",
      name: "Harness Data Group",
      nodes: filteredNodes,
    };

    return {
      groups: [mainGroup],
      relations: filteredLinks,
      discoveredProperties: validProps,
    };
  }

  public setUseTestData(enabled: boolean): void {
    this.useTestData = enabled;
  }

  public isUsingTestData(): boolean {
    return this.useTestData;
  }

  private getFileName(path: string): string {
    const parts = path.split("/");
    return parts[parts.size() - 1] || path;
  }

  private getServiceColor(service: string): [number, number, number] {
    const serviceColors: { [key: string]: [number, number, number] } = {
      platform: [0.2, 0.4, 0.8],
      ci: [0.8, 0.4, 0.2],
      cd: [0.2, 0.8, 0.2],
      ce: [0.8, 0.2, 0.8],
      core: [0.8, 0.8, 0.2],
    };
    return serviceColors[service] || [0.5, 0.5, 0.5];
  }

  /**
   */
  private collectAndPrintLinkTypes(links: typeof TEMP_HARNESS_LINKS): void {
    const linkTypeCounts = new Map<string, number>();

    links.forEach((link) => {
      const currentCount = linkTypeCounts.get(link.type) || 0;
      linkTypeCounts.set(link.type, currentCount + 1);
    });

    linkTypeCounts.forEach((count, linkType) => {});
  }

  /**
   * Assign treeLevel property to nodes based on Import link relationships
   * For Import links: source imports from target, so target is parent, source is child
   */
  private assignTreeLevels(
    nodes: Node[],
    importLinks: typeof TEMP_HARNESS_LINKS
  ): void {
    // Create a map for quick node lookup
    const nodeMap = new Map<string, Node>();
    nodes.forEach((node) => {
      nodeMap.set(node.uuid, node);
      // Initialize all nodes with treeLevel -1 (unassigned) in properties
      if (!node.properties) {
        node.properties = {};
      }
      (node.properties as { treeLevel: number }).treeLevel = -1;
    });

    // Build parent-child relationships from Import links
    // For Import: sourceNodeUuid imports from targetNodeUuid
    // So targetNodeUuid is the parent, sourceNodeUuid is the child
    const children = new Map<string, Set<string>>(); // parent -> children
    const parents = new Map<string, Set<string>>(); // child -> parents

    importLinks.forEach((link) => {
      const parentUuid = link.targetNodeUuid; // The file being imported (parent)
      const childUuid = link.sourceNodeUuid; // The file doing the importing (child)

      // Add to children map
      if (!children.has(parentUuid)) {
        children.set(parentUuid, new Set<string>());
      }
      children.get(parentUuid)!.add(childUuid);

      // Add to parents map
      if (!parents.has(childUuid)) {
        parents.set(childUuid, new Set<string>());
      }
      parents.get(childUuid)!.add(parentUuid);
    });

    // Find root nodes (nodes with no parents)
    const rootNodes: string[] = [];
    nodes.forEach((node) => {
      if (!parents.has(node.uuid)) {
        rootNodes.push(node.uuid);
      }
    });

    // Assign treeLevel = 0 to root nodes
    rootNodes.forEach((rootUuid) => {
      const rootNode = nodeMap.get(rootUuid);
      if (rootNode && rootNode.properties) {
        (rootNode.properties as { treeLevel: number }).treeLevel = 0;
      }
    });

    // Use breadth-first search to assign tree levels
    const queue: string[] = [...rootNodes];
    const processed = new Set<string>();

    while (queue.size() > 0) {
      const currentUuid = queue.shift()!;
      if (processed.has(currentUuid)) continue;
      processed.add(currentUuid);

      const currentNode = nodeMap.get(currentUuid);
      if (!currentNode || !currentNode.properties) continue;

      const currentLevel = (currentNode.properties as { treeLevel: number })
        .treeLevel;

      // Process all children of current node
      const nodeChildren = children.get(currentUuid);
      if (nodeChildren) {
        nodeChildren.forEach((childUuid) => {
          const childNode = nodeMap.get(childUuid);
          if (!childNode || !childNode.properties) return;

          const proposedLevel = currentLevel + 1;
          const currentChildLevel = (
            childNode.properties as { treeLevel: number }
          ).treeLevel;

          // If child has multiple parents, use the highest tree level
          if (currentChildLevel === -1 || proposedLevel > currentChildLevel) {
            (childNode.properties as { treeLevel: number }).treeLevel =
              proposedLevel;
          }

          // Add child to queue for processing
          if (!processed.has(childUuid)) {
            queue.push(childUuid);
          }
        });
      }
    }

    // Handle any remaining unprocessed nodes (cycles or disconnected components)
    nodes.forEach((node) => {
      if (
        node.properties &&
        (node.properties as { treeLevel: number }).treeLevel === -1
      ) {
        (node.properties as { treeLevel: number }).treeLevel = 0; // Treat as root
      }
    });

    // Print statistics
    const levelCounts = new Map<number, number>();
    nodes.forEach((node) => {
      if (node.properties) {
        const level = (node.properties as { treeLevel: number }).treeLevel;
        levelCounts.set(level, (levelCounts.get(level) || 0) + 1);
      }
    });

    const sortedLevels: number[] = [];
    levelCounts.forEach((_, level) => sortedLevels.push(level));
    sortedLevels.sort((a, b) => a < b);

    sortedLevels.forEach((level) => {});
  }

  /**
   * Apply property filters to nodes
   */
  private applyPropertyFilters(nodes: Node[]): Node[] {
    const filters = this.propertyFilters;
    if (!filters) {
      return nodes;
    }

    // Check if filters is empty
    let hasFilters = false;
    for (const [_, __] of pairs(filters)) {
      hasFilters = true;
      break;
    }

    if (!hasFilters) {
      return nodes;
    }

    const filteredNodes = nodes.filter((node) => {
      // Check each filter
      for (const [propName, filteredValues] of pairs(filters)) {
        if (typeIs(propName, "string") && node.properties) {
          const props = node.properties as { [key: string]: unknown };
          const propValue = props[propName];
          if (propValue !== undefined) {
            const nodeValue = tostring(propValue);
            // If this value is in the filter list, exclude the node
            if ((filteredValues as string[]).includes(nodeValue)) {
              return false;
            }
          }
        }
      }
      return true;
    });

    return filteredNodes;
  }

  /**
   * Set property filters
   */
  public setPropertyFilters(filters?: { [key: string]: string[] }): void {
    this.propertyFilters = filters;
  }
}