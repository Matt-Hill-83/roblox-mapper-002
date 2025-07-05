/**
 * Generate Mermaid diagram from cluster data
 */

const { MERMAID_STYLES } = require('./styles');

function generateMermaidDiagram(cluster) {
  let mermaid = `\`\`\`mermaid\n${MERMAID_STYLES.graphType}\n`;
  
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
  mermaid += `    ${MERMAID_STYLES.peopleClass}\n`;
  mermaid += `    ${MERMAID_STYLES.animalsClass}\n`;
  mermaid += `    ${MERMAID_STYLES.invisibleClass}\n`;
  
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

module.exports = generateMermaidDiagram;