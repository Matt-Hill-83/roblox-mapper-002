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
    const names =
      type === "People"
        ? GENERATOR_CONSTANTS.PEOPLE_NAMES
        : GENERATOR_CONSTANTS.ANIMAL_NAMES;
    return names[Math.floor(Math.random() * names.length)];
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

// Function to generate draw.io XML diagram with precise positioning
function generateDrawIoDiagram(cluster) {
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

  // Layout constants
  const CANVAS_WIDTH = 1200;
  const LEVEL_HEIGHT = 200;
  const NODE_WIDTH = 120;
  const NODE_HEIGHT = 60;
  const LEVEL_BOX_PADDING = 40;
  const NODE_SPACING = 20;
  
  // Calculate level box dimensions
  const maxNodesInLevel = Math.max(
    nodesByLevel.get(1)?.length || 0,
    nodesByLevel.get(2)?.length || 0,
    nodesByLevel.get(3)?.length || 0
  );
  
  const levelBoxWidth = maxNodesInLevel * (NODE_WIDTH + NODE_SPACING) + NODE_SPACING + (LEVEL_BOX_PADDING * 2);
  const levelBoxHeight = NODE_HEIGHT + (LEVEL_BOX_PADDING * 2);
  const levelBoxX = (CANVAS_WIDTH - levelBoxWidth) / 2;
  
  // Start building XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<mxfile host="app.diagrams.net">\n';
  xml += '  <diagram name="Hierarchical Graph">\n';
  xml += '    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10">\n';
  xml += '      <root>\n';
  xml += '        <mxCell id="0"/>\n';
  xml += '        <mxCell id="1" parent="0"/>\n\n';
  
  let cellId = 2;
  const nodeIdMap = new Map();
  
  // Draw level boxes and nodes
  for (let level = 1; level <= 3; level++) {
    const levelNodes = nodesByLevel.get(level) || [];
    if (levelNodes.length === 0) continue;
    
    const levelY = 50 + (level - 1) * LEVEL_HEIGHT;
    
    // Draw level box
    xml += `        <!-- Level ${level} Box -->\n`;
    xml += `        <mxCell id="${cellId}" value="Level ${level}" style="group;rounded=1;fillColor=#f5f5f5;strokeColor=#666666;verticalAlign=top;fontSize=14;fontStyle=1;spacingTop=10;" vertex="1" parent="1">\n`;
    xml += `          <mxGeometry x="${levelBoxX}" y="${levelY}" width="${levelBoxWidth}" height="${levelBoxHeight}" as="geometry"/>\n`;
    xml += `        </mxCell>\n\n`;
    const levelGroupId = cellId++;
    
    // Calculate starting X position to center nodes within level box
    const totalNodesWidth = levelNodes.length * NODE_WIDTH + (levelNodes.length - 1) * NODE_SPACING;
    const startX = levelBoxX + (levelBoxWidth - totalNodesWidth) / 2;
    
    // Draw nodes
    levelNodes.forEach((node, index) => {
      const nodeX = startX + index * (NODE_WIDTH + NODE_SPACING);
      
      const fillColor = node.type === "People" ? "#3366cc" : "#cc6633";
      const shape = node.type === "People" ? "rounded=1" : "ellipse";
      
      xml += `        <!-- ${node.uuid}: ${node.name} (${node.type}) -->\n`;
      xml += `        <mxCell id="${cellId}" value="${node.name}\n${node.type}" style="${shape};fillColor=${fillColor};strokeColor=#000000;fontColor=#ffffff;fontSize=12;" vertex="1" parent="${levelGroupId}">\n`;
      xml += `          <mxGeometry x="${nodeX - levelBoxX}" y="${LEVEL_BOX_PADDING}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" as="geometry"/>\n`;
      xml += `        </mxCell>\n\n`;
      
      nodeIdMap.set(node.uuid, cellId);
      cellId++;
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
