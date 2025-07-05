/**
 * Mock data generator class for creating test hierarchical data
 */

const { GENERATOR_CONSTANTS } = require('./constants');

class MockDataGenerator {
  constructor() {
    this.nodeCounter = 0;
    this.linkCounter = 0;
  }

  generateCluster(config) {
    const cluster = {
      groups: [],
      relations: [],
    };

    // Create nodes
    const allNodes = [];
    const nodesByLevel = new Map();

    // Generate Level 1 nodes
    const level1Nodes = [];
    for (let i = 0; i < config.numLevel1Nodes; i++) {
      const node = this.createNode(1);
      level1Nodes.push(node);
      allNodes.push(node);
    }
    nodesByLevel.set(1, level1Nodes);

    // Generate Level 2 nodes
    const level2Nodes = [];
    for (let i = 0; i < config.numLevel2Nodes; i++) {
      const node = this.createNode(2);
      level2Nodes.push(node);
      allNodes.push(node);
    }
    nodesByLevel.set(2, level2Nodes);

    // Generate Level 3 nodes
    const level3Nodes = [];
    for (let i = 0; i < config.numLevel3Nodes; i++) {
      const node = this.createNode(3);
      level3Nodes.push(node);
      allNodes.push(node);
    }
    nodesByLevel.set(3, level3Nodes);

    // Create main group
    cluster.groups.push({
      id: "group-0",
      name: "Main Group",
      nodes: allNodes,
    });

    // Create hierarchical relationships
    this.createHierarchy(nodesByLevel, config.childrenPerNode, cluster);

    // Create additional relations
    this.createRelations(allNodes, config.numLinkTypes, cluster);

    return cluster;
  }

  createNode(level) {
    const types = ["People", "Animals"];
    const type = types[Math.floor(Math.random() * types.length)];
    const uuid = `h-${this.nodeCounter++}`;

    const node = {
      uuid,
      name: this.getRandomName(type),
      type,
      level, // Track which level this node belongs to
      color: type === "People" ? [0.2, 0.4, 0.8] : [0.8, 0.4, 0.2],
      position: { x: 0, y: 0, z: 0 },
      attachmentNames: [`att001-${uuid}`, `att002-${uuid}`, `att003-${uuid}`],
      properties: {},
    };

    if (type === "People") {
      node.properties.age = Math.floor(Math.random() * (80 - 18) + 18);
    } else {
      node.properties.animalType =
        GENERATOR_CONSTANTS.ANIMAL_TYPES[
          Math.floor(Math.random() * GENERATOR_CONSTANTS.ANIMAL_TYPES.length)
        ];
    }

    return node;
  }

  getRandomName(type) {
    if (type === "People") {
      const firstName = GENERATOR_CONSTANTS.PEOPLE_NAMES[
        Math.floor(Math.random() * GENERATOR_CONSTANTS.PEOPLE_NAMES.length)
      ];
      const lastName = GENERATOR_CONSTANTS.LAST_NAMES[
        Math.floor(Math.random() * GENERATOR_CONSTANTS.LAST_NAMES.length)
      ];
      return `${firstName} ${lastName}`;
    } else {
      const names = GENERATOR_CONSTANTS.ANIMAL_NAMES;
      return names[Math.floor(Math.random() * names.length)];
    }
  }

  createHierarchy(nodesByLevel, maxChildren, cluster) {
    // Connect Level 1 to Level 2
    const level1 = nodesByLevel.get(1) || [];
    const level2 = nodesByLevel.get(2) || [];
    this.connectLevels(level1, level2, maxChildren, cluster);

    // Connect Level 2 to Level 3
    const level3 = nodesByLevel.get(3) || [];
    this.connectLevels(level2, level3, maxChildren, cluster);
  }

  connectLevels(parents, children, maxChildren, cluster) {
    if (parents.length === 0 || children.length === 0) return;

    const childrenPerParent = new Map();
    parents.forEach((p) => childrenPerParent.set(p.uuid, 0));

    children.forEach((child, index) => {
      // Find parent with fewest children
      let selectedParent = parents[0];
      let minChildren = maxChildren + 1;

      parents.forEach((parent) => {
        const count = childrenPerParent.get(parent.uuid) || 0;
        if (count < maxChildren && count < minChildren) {
          selectedParent = parent;
          minChildren = count;
        }
      });

      // If all parents are full, distribute evenly
      if (minChildren >= maxChildren) {
        selectedParent = parents[index % parents.length];
      }

      // Create parent-child link
      cluster.relations.push({
        uuid: `link-${this.linkCounter++}`,
        type: "Parent-Child",
        sourceNodeUuid: selectedParent.uuid,
        targetNodeUuid: child.uuid,
        color: [0.5, 0.5, 0.5],
      });

      childrenPerParent.set(
        selectedParent.uuid,
        (childrenPerParent.get(selectedParent.uuid) || 0) + 1
      );
    });
  }

  createRelations(nodes, numLinkTypes, cluster) {
    const linkTypes = ["Owns", "Wants", "Eats", "Link4", "Link5"].slice(
      0,
      numLinkTypes
    );
    const maxLinks = Math.floor(nodes.length * 0.5); // Fewer links for clarity

    for (let i = 0; i < maxLinks; i++) {
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      const target = nodes[Math.floor(Math.random() * nodes.length)];

      if (source.uuid === target.uuid) continue;

      const linkType = linkTypes[Math.floor(Math.random() * linkTypes.length)];

      // Apply some logic constraints
      if (linkType === "Eats" && source.type !== "Animals") continue;
      if (linkType === "Owns" && target.type !== "Animals") continue;

      cluster.relations.push({
        uuid: `link-${this.linkCounter++}`,
        type: linkType,
        sourceNodeUuid: source.uuid,
        targetNodeUuid: target.uuid,
        color: [0.5, 0.5, 0.5],
      });
    }
  }
}

module.exports = MockDataGenerator;