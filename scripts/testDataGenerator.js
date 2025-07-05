#!/usr/bin/env node

/**
 * Test script for the Simple Data Generator
 * Outputs a Mermaid diagram visualization to a markdown file
 */

const fs = require("fs");
const path = require("path");

// Test configuration object
const TEST_CONFIG = {
  numLevel1Nodes: 1, // 2 root nodes
  numLevel2Nodes: 6, // 6 second-level nodes
  numLevel3Nodes: 12, // 12 third-level nodes
  childrenPerNode: 3, // Max 3 children per parent
  numNodeTypes: 2, // People and Animals
  numLinkTypes: 3, // Owns, Wants, Eats
};

// Draw.io scaling constants for better visualization
const drawIoScaling = {
  NODE_WIDTH_SCALE: 5,    // Make nodes 5x wider
  NODE_HEIGHT_SCALE: 2,   // Make nodes 2x taller
  LEVEL_SPACING_SCALE: 2  // Double the vertical spacing between levels
};

// Constants
const GENERATOR_CONSTANTS = {
  PEOPLE_NAMES: [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
    "Iris",
    "Jack",
  ],
  LAST_NAMES: [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ],
  ANIMAL_NAMES: [
    "Fifi",
    "Bongo",
    "Rex",
    "Luna",
    "Max",
    "Bella",
    "Rocky",
    "Daisy",
    "Shadow",
    "Buddy",
  ],
  ANIMAL_TYPES: [
    "cat",
    "dog",
    "bird",
    "rabbit",
    "hamster",
    "fish",
    "turtle",
    "snake",
    "lizard",
    "parrot",
  ],
};

// Simple mock generator for testing
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

// Function to generate Mermaid diagram
function generateMermaidDiagram(cluster) {
  let mermaid = "```mermaid\ngraph TB\n"; // Use graph TB for clear top-bottom layout
  
  // Group nodes by level
  const nodesByLevel = new Map();
  cluster.groups.forEach((group) => {
    group.nodes.forEach((node) => {
      const level = node.level || 1;
      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, []);
      }
      nodesByLevel.get(level).push(node);
    });
  });
  
  const level1Nodes = nodesByLevel.get(1) || [];
  const level2Nodes = nodesByLevel.get(2) || [];
  const level3Nodes = nodesByLevel.get(3) || [];
  
  // Add invisible anchors to force alignment
  mermaid += "    %% Level anchors for alignment\n";
  mermaid += "    A1[\" \"]:::invisible\n";
  mermaid += "    A2[\" \"]:::invisible\n";
  mermaid += "    A3[\" \"]:::invisible\n";
  mermaid += "    A1 --> A2\n";
  mermaid += "    A2 --> A3\n\n";
  
  // Add nodes at each level with rank constraints
  if (level1Nodes.length > 0) {
    mermaid += "    %% Level 1 nodes\n";
    level1Nodes.forEach((node) => {
      const label = `${node.name}<br/>${node.type}`;
      const shape = node.type === "People" ? `[${label}]` : `(${label})`;
      mermaid += `    ${node.uuid}${shape}\n`;
    });
    
    // Force all level 1 nodes to same rank
    if (level1Nodes.length > 1) {
      for (let i = 1; i < level1Nodes.length; i++) {
        mermaid += `    ${level1Nodes[0].uuid} -..- ${level1Nodes[i].uuid}\n`;
      }
    }
    
    // Connect to anchor
    mermaid += `    A1 -..- ${level1Nodes[0].uuid}\n`;
    mermaid += "\n";
  }
  
  if (level2Nodes.length > 0) {
    mermaid += "    %% Level 2 nodes\n";
    level2Nodes.forEach((node) => {
      const label = `${node.name}<br/>${node.type}`;
      const shape = node.type === "People" ? `[${label}]` : `(${label})`;
      mermaid += `    ${node.uuid}${shape}\n`;
    });
    
    // Force all level 2 nodes to same rank
    if (level2Nodes.length > 1) {
      for (let i = 1; i < level2Nodes.length; i++) {
        mermaid += `    ${level2Nodes[0].uuid} -..- ${level2Nodes[i].uuid}\n`;
      }
    }
    
    // Connect to anchor
    mermaid += `    A2 -..- ${level2Nodes[0].uuid}\n`;
    mermaid += "\n";
  }
  
  if (level3Nodes.length > 0) {
    mermaid += "    %% Level 3 nodes\n";
    level3Nodes.forEach((node) => {
      const label = `${node.name}<br/>${node.type}`;
      const shape = node.type === "People" ? `[${label}]` : `(${label})`;
      mermaid += `    ${node.uuid}${shape}\n`;
    });
    
    // Force all level 3 nodes to same rank
    if (level3Nodes.length > 1) {
      for (let i = 1; i < level3Nodes.length; i++) {
        mermaid += `    ${level3Nodes[0].uuid} -..- ${level3Nodes[i].uuid}\n`;
      }
    }
    
    // Connect to anchor
    mermaid += `    A3 -..- ${level3Nodes[0].uuid}\n`;
    mermaid += "\n";
  }
  
  // Add actual relations
  mermaid += "    %% Relationships\n";
  cluster.relations.forEach((link) => {
    const arrow = link.type === "Parent-Child" ? "-->" : "==>";
    const label = link.type !== "Parent-Child" ? `|${link.type}|` : "";
    mermaid += `    ${link.sourceNodeUuid} ${arrow}${label} ${link.targetNodeUuid}\n`;
  });
  
  // Add styling
  mermaid += "\n    %% Styling\n";
  mermaid += "    classDef people fill:#3366cc,stroke:#1a3d7a,stroke-width:2px,color:#fff\n";
  mermaid += "    classDef animals fill:#cc6633,stroke:#7a3d1a,stroke-width:2px,color:#fff\n";
  mermaid += "    classDef invisible fill:transparent,stroke:transparent\n";
  
  // Apply styles to nodes
  cluster.groups.forEach((group) => {
    const peopleNodes = group.nodes
      .filter((n) => n.type === "People")
      .map((n) => n.uuid)
      .join(",");
    const animalNodes = group.nodes
      .filter((n) => n.type === "Animals")
      .map((n) => n.uuid)
      .join(",");
    
    if (peopleNodes) mermaid += `    class ${peopleNodes} people\n`;
    if (animalNodes) mermaid += `    class ${animalNodes} animals\n`;
  });
  
  mermaid += "    class A1,A2,A3 invisible\n";
  
  // Count how many invisible links we need to hide
  let linkCount = 2; // A1->A2 and A2->A3
  let invisibleLinks = [0, 1]; // These two are always there
  
  // Level 1 alignment links
  if (level1Nodes.length > 1) {
    for (let i = 1; i < level1Nodes.length; i++) {
      invisibleLinks.push(linkCount++);
    }
  }
  if (level1Nodes.length > 0) {
    invisibleLinks.push(linkCount++); // A1 to first node
  }
  
  // Level 2 alignment links
  if (level2Nodes.length > 1) {
    for (let i = 1; i < level2Nodes.length; i++) {
      invisibleLinks.push(linkCount++);
    }
  }
  if (level2Nodes.length > 0) {
    invisibleLinks.push(linkCount++); // A2 to first node
  }
  
  // Level 3 alignment links
  if (level3Nodes.length > 1) {
    for (let i = 1; i < level3Nodes.length; i++) {
      invisibleLinks.push(linkCount++);
    }
  }
  if (level3Nodes.length > 0) {
    invisibleLinks.push(linkCount++); // A3 to first node
  }
  
  // Hide all invisible links
  if (invisibleLinks.length > 0) {
    mermaid += `    linkStyle ${invisibleLinks.join(",")} stroke:transparent,fill:transparent\n`;
  }
  
  mermaid += "```";
  
  return mermaid;
}

// Function to generate draw.io XML diagram with swim lane organization
function generateDrawIoDiagram(cluster) {
  // Constants for swim lane layout
  const UNIT_SIZE = 20; // Base unit in pixels
  const NODE_WIDTH_UNITS = 1; // Nodes are 1 unit wide
  const COLUMN_WIDTH_UNITS = 2; // Columns are 2 units wide
  const TYPE_GROUP_SPACING_UNITS = 3; // Space between type groups
  const LEVEL_SPACING_UNITS = 2; // Space between levels vertically (same as column width)
  const CANVAS_PADDING_UNITS = 2; // Padding on sides
  
  // Convert units to pixels with scaling
  const NODE_WIDTH = NODE_WIDTH_UNITS * UNIT_SIZE * drawIoScaling.NODE_WIDTH_SCALE;
  const NODE_HEIGHT = 3 * UNIT_SIZE * drawIoScaling.NODE_HEIGHT_SCALE; // Make nodes taller for multi-line text
  const COLUMN_WIDTH = COLUMN_WIDTH_UNITS * UNIT_SIZE;
  const TYPE_GROUP_SPACING = TYPE_GROUP_SPACING_UNITS * UNIT_SIZE;
  const LEVEL_SPACING = LEVEL_SPACING_UNITS * UNIT_SIZE * drawIoScaling.LEVEL_SPACING_SCALE;
  const CANVAS_PADDING = CANVAS_PADDING_UNITS * UNIT_SIZE;
  
  // Group nodes by level and type
  const nodesByLevel = new Map();
  const typeCounters = new Map(); // Global counters for each type
  
  cluster.groups.forEach((group) => {
    group.nodes.forEach((node) => {
      const level = node.level || 1;
      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, new Map());
      }
      
      const levelMap = nodesByLevel.get(level);
      if (!levelMap.has(node.type)) {
        levelMap.set(node.type, []);
      }
      levelMap.get(node.type).push(node);
    });
  });
  
  // Calculate max nodes per type across all levels
  const typeMaxCounts = new Map();
  const allTypes = new Set();
  
  for (const [level, typeMap] of nodesByLevel) {
    for (const [type, nodes] of typeMap) {
      allTypes.add(type);
      const currentMax = typeMaxCounts.get(type) || 0;
      typeMaxCounts.set(type, Math.max(currentMax, nodes.length));
    }
  }
  
  // Sort types by max count (descending) and create column layout
  const sortedTypes = Array.from(allTypes).sort((a, b) => {
    return typeMaxCounts.get(b) - typeMaxCounts.get(a);
  });
  
  // Calculate column positions for each type
  const typeColumnInfo = new Map();
  let currentX = CANVAS_PADDING;
  
  sortedTypes.forEach((type, index) => {
    const maxCount = typeMaxCounts.get(type);
    const swimLaneWidth = maxCount * COLUMN_WIDTH;
    
    typeColumnInfo.set(type, {
      startX: currentX,
      width: swimLaneWidth,
      maxCount: maxCount
    });
    
    currentX += swimLaneWidth + (index < sortedTypes.length - 1 ? TYPE_GROUP_SPACING : 0);
  });
  
  const totalWidth = currentX + CANVAS_PADDING;
  
  // Sort nodes alphabetically within each type and assign numbers
  for (const [level, typeMap] of nodesByLevel) {
    for (const [type, nodes] of typeMap) {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      
      // Assign type numbers
      nodes.forEach(node => {
        if (!typeCounters.has(type)) {
          typeCounters.set(type, 1);
        }
        const typeNum = typeCounters.get(type);
        node.typeNumber = `${type.toLowerCase()}${String(typeNum).padStart(2, '0')}`;
        typeCounters.set(type, typeNum + 1);
      });
    }
  }
  
  // Start building XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<mxfile host="app.diagrams.net">\n';
  xml += '  <diagram name="Hierarchical Graph with Swim Lanes">\n';
  xml += `    <mxGraphModel dx="${totalWidth}" dy="800" grid="1" gridSize="${UNIT_SIZE}">\n`;
  xml += '      <root>\n';
  xml += '        <mxCell id="0"/>\n';
  xml += '        <mxCell id="1" parent="0"/>\n\n';
  
  let cellId = 2;
  const nodeIdMap = new Map();
  
  // Draw swim lane headers
  xml += '        <!-- Swim Lane Headers -->\n';
  sortedTypes.forEach(type => {
    const info = typeColumnInfo.get(type);
    xml += `        <mxCell id="${cellId}" value="${type} (${typeMaxCounts.get(type)})" style="rounded=0;fillColor=#e8e8e8;strokeColor=#666666;fontSize=14;fontStyle=1;verticalAlign=top;" vertex="1" parent="1">\n`;
    xml += `          <mxGeometry x="${info.startX}" y="0" width="${info.width}" height="30" as="geometry"/>\n`;
    xml += `        </mxCell>\n`;
    cellId++;
  });
  xml += '\n';
  
  // Draw level boxes and nodes
  for (let level = 1; level <= 3; level++) {
    const levelMap = nodesByLevel.get(level);
    if (!levelMap || levelMap.size === 0) continue;
    
    const levelY = 50 + (level - 1) * LEVEL_SPACING;
    
    // Draw level background
    xml += `        <!-- Level ${level} Background -->\n`;
    xml += `        <mxCell id="${cellId}" value="Level ${level}" style="rounded=1;fillColor=#f9f9f9;strokeColor=#999999;verticalAlign=top;fontSize=12;fontStyle=1;spacingTop=5;opacity=50;" vertex="1" parent="1">\n`;
    xml += `          <mxGeometry x="0" y="${levelY - 20}" width="${totalWidth}" height="${NODE_HEIGHT + 40}" as="geometry"/>\n`;
    xml += `        </mxCell>\n\n`;
    cellId++;
    
    // Draw nodes for each type in this level
    sortedTypes.forEach(type => {
      const nodes = levelMap.get(type) || [];
      const typeInfo = typeColumnInfo.get(type);
      
      nodes.forEach((node, index) => {
        const nodeX = typeInfo.startX + index * COLUMN_WIDTH;
        const nodeY = levelY;
        
        // Calculate coordinates for the node
        const coordX = Math.floor(nodeX / UNIT_SIZE);
        const coordY = 0; // Depth into page
        const coordZ = Math.floor(levelY / UNIT_SIZE);
        
        node.coordinates = { x: coordX, y: coordY, z: coordZ };
        
        const fillColor = node.type === "People" ? "#3366cc" : "#cc6633";
        const shape = node.type === "People" ? "rounded=1" : "ellipse";
        
        const label = `${node.name}\n${coordX},${coordY},${coordZ}\n${node.typeNumber}`;
        
        xml += `        <!-- ${node.uuid}: ${node.name} -->\n`;
        xml += `        <mxCell id="${cellId}" value="${label}" style="${shape};fillColor=${fillColor};strokeColor=#000000;fontColor=#ffffff;fontSize=10;verticalAlign=middle;spacing=2;" vertex="1" parent="1">\n`;
        xml += `          <mxGeometry x="${nodeX}" y="${nodeY}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" as="geometry"/>\n`;
        xml += `        </mxCell>\n\n`;
        
        nodeIdMap.set(node.uuid, cellId);
        cellId++;
      });
    });
  }
  
  // Draw connections
  xml += `        <!-- Connections -->\n`;
  cluster.relations.forEach((link) => {
    const sourceId = nodeIdMap.get(link.sourceNodeUuid);
    const targetId = nodeIdMap.get(link.targetNodeUuid);
    
    if (!sourceId || !targetId) return;
    
    let style = "edgeStyle=orthogonalEdgeStyle;rounded=1;";
    if (link.type === "Parent-Child") {
      style += "strokeColor=#000000;strokeWidth=2;";
    } else {
      style += "strokeColor=#666666;strokeWidth=1;dashed=1;";
    }
    
    xml += `        <mxCell id="${cellId}" value="${link.type !== 'Parent-Child' ? link.type : ''}" style="${style}" edge="1" parent="1" source="${sourceId}" target="${targetId}">\n`;
    xml += `          <mxGeometry relative="1" as="geometry"/>\n`;
    xml += `        </mxCell>\n\n`;
    cellId++;
  });
  
  xml += '      </root>\n';
  xml += '    </mxGraphModel>\n';
  xml += '  </diagram>\n';
  xml += '</mxfile>\n';
  
  return xml;
}

// Function to generate summary statistics
function generateSummary(cluster, config) {
  let summary = "## Summary Statistics\n\n";

  summary += "### Configuration\n";
  summary += `- Level 1 Nodes: ${config.numLevel1Nodes}\n`;
  summary += `- Level 2 Nodes: ${config.numLevel2Nodes}\n`;
  summary += `- Level 3 Nodes: ${config.numLevel3Nodes}\n`;
  summary += `- Max Children per Node: ${config.childrenPerNode}\n`;
  summary += `- Node Types: ${config.numNodeTypes}\n`;
  summary += `- Link Types: ${config.numLinkTypes}\n\n`;

  summary += "### Generated Data\n";
  summary += `- Total Groups: ${cluster.groups.length}\n`;
  summary += `- Total Nodes: ${cluster.groups.reduce(
    (sum, g) => sum + g.nodes.length,
    0
  )}\n`;

  // Count by type
  const nodesByType = new Map();
  cluster.groups.forEach((group) => {
    group.nodes.forEach((node) => {
      nodesByType.set(node.type, (nodesByType.get(node.type) || 0) + 1);
    });
  });

  summary += "- Nodes by Type:\n";
  nodesByType.forEach((count, type) => {
    summary += `  - ${type}: ${count}\n`;
  });

  summary += `- Total Relations: ${cluster.relations.length}\n`;

  // Count by link type
  const linksByType = new Map();
  cluster.relations.forEach((link) => {
    linksByType.set(link.type, (linksByType.get(link.type) || 0) + 1);
  });

  summary += "- Relations by Type:\n";
  linksByType.forEach((count, type) => {
    summary += `  - ${type}: ${count}\n`;
  });

  return summary;
}

// Main execution
function main() {
  console.log("Testing Data Generator with configuration:", TEST_CONFIG);

  // Create generator and generate data
  const generator = new MockDataGenerator();
  const cluster = generator.generateCluster(TEST_CONFIG);

  // Generate markdown content
  let markdown = "# Data Generator Test Output\n\n";
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;

  // Add summary
  markdown += generateSummary(cluster, TEST_CONFIG);
  markdown += "\n";

  // Add diagrams
  markdown += "## Hierarchical Graph Visualization\n\n";
  markdown += "### Mermaid Diagram\n\n";
  markdown += generateMermaidDiagram(cluster);
  markdown += "\n\n";

  // Add node details
  markdown += "## Node Details\n\n";
  cluster.groups.forEach((group) => {
    markdown += `### ${group.name}\n\n`;
    markdown += "| UUID | Name | Type | Properties |\n";
    markdown += "|------|------|------|------------|\n";

    group.nodes.forEach((node) => {
      const props = node.properties ? JSON.stringify(node.properties) : "{}";
      markdown += `| ${node.uuid} | ${node.name} | ${node.type} | ${props} |\n`;
    });
    markdown += "\n";
  });

  // Write to file
  const outputDir = path.join(__dirname, "..", "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputFile = path.join(
    outputDir,
    `data-generator-test-${timestamp}.md`
  );

  fs.writeFileSync(outputFile, markdown);
  console.log(`Output written to: ${outputFile}`);
  
  // Generate draw.io file
  const drawioXml = generateDrawIoDiagram(cluster);
  const drawioFile = path.join(
    outputDir,
    `data-generator-diagram-${timestamp}.drawio`
  );
  fs.writeFileSync(drawioFile, drawioXml);
  console.log(`Draw.io diagram written to: ${drawioFile}`);

  // Also log summary to console
  console.log("\nGeneration Summary:");
  console.log(
    `- Total Nodes: ${cluster.groups.reduce(
      (sum, g) => sum + g.nodes.length,
      0
    )}`
  );
  console.log(`- Total Relations: ${cluster.relations.length}`);
}

// Run the test
main();
