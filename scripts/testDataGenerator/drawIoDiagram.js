/**
 * Generate draw.io XML diagram with swim lane organization
 */

const { DRAW_IO_SCALING, LAYOUT_CONSTANTS } = require('./constants');
const { DRAW_IO_STYLES, getNodeStyle, getEdgeStyle } = require('./styles');

function generateDrawIoDiagram(cluster) {
  // Convert units to pixels with scaling
  const NODE_WIDTH = LAYOUT_CONSTANTS.NODE_WIDTH_UNITS * LAYOUT_CONSTANTS.UNIT_SIZE * DRAW_IO_SCALING.NODE_WIDTH_SCALE;
  const NODE_HEIGHT = 3 * LAYOUT_CONSTANTS.UNIT_SIZE * DRAW_IO_SCALING.NODE_HEIGHT_SCALE;
  const COLUMN_WIDTH = LAYOUT_CONSTANTS.COLUMN_WIDTH_UNITS * LAYOUT_CONSTANTS.UNIT_SIZE;
  const TYPE_GROUP_SPACING = LAYOUT_CONSTANTS.TYPE_GROUP_SPACING_UNITS * LAYOUT_CONSTANTS.UNIT_SIZE;
  const LEVEL_SPACING = LAYOUT_CONSTANTS.LEVEL_SPACING_UNITS * LAYOUT_CONSTANTS.UNIT_SIZE * DRAW_IO_SCALING.LEVEL_SPACING_SCALE;
  const CANVAS_PADDING = LAYOUT_CONSTANTS.CANVAS_PADDING_UNITS * LAYOUT_CONSTANTS.UNIT_SIZE;
  
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
  
  // Build XML structure
  const xmlData = {
    totalWidth,
    sortedTypes,
    typeColumnInfo,
    typeMaxCounts,
    nodesByLevel,
    NODE_WIDTH,
    NODE_HEIGHT,
    COLUMN_WIDTH,
    LEVEL_SPACING,
    UNIT_SIZE: LAYOUT_CONSTANTS.UNIT_SIZE
  };
  
  return buildXml(xmlData, cluster);
}

function buildXml(data, cluster) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<mxfile host="app.diagrams.net">\n';
  xml += '  <diagram name="Hierarchical Graph with Swim Lanes">\n';
  xml += `    <mxGraphModel dx="${data.totalWidth}" dy="800" grid="1" gridSize="${data.UNIT_SIZE}">\n`;
  xml += '      <root>\n';
  xml += '        <mxCell id="0"/>\n';
  xml += '        <mxCell id="1" parent="0"/>\n\n';
  
  let cellId = 2;
  const nodeIdMap = new Map();
  
  // Draw swim lane headers
  xml += '        <!-- Swim Lane Headers -->\n';
  data.sortedTypes.forEach(type => {
    const info = data.typeColumnInfo.get(type);
    xml += `        <mxCell id="${cellId}" value="${type} (${data.typeMaxCounts.get(type)})" style="${DRAW_IO_STYLES.swimLaneHeader.base}" vertex="1" parent="1">\n`;
    xml += `          <mxGeometry x="${info.startX}" y="0" width="${info.width}" height="30" as="geometry"/>\n`;
    xml += `        </mxCell>\n`;
    cellId++;
  });
  xml += '\n';
  
  // Draw level boxes and nodes
  for (let level = 1; level <= 3; level++) {
    const levelMap = data.nodesByLevel.get(level);
    if (!levelMap || levelMap.size === 0) continue;
    
    const levelY = 50 + (level - 1) * data.LEVEL_SPACING;
    
    // Draw level background
    xml += `        <!-- Level ${level} Background -->\n`;
    xml += `        <mxCell id="${cellId}" value="Level ${level}" style="${DRAW_IO_STYLES.levelBackground.base}" vertex="1" parent="1">\n`;
    xml += `          <mxGeometry x="0" y="${levelY - 20}" width="${data.totalWidth}" height="${data.NODE_HEIGHT + 40}" as="geometry"/>\n`;
    xml += `        </mxCell>\n\n`;
    cellId++;
    
    // Draw nodes for each type in this level
    data.sortedTypes.forEach(type => {
      const nodes = levelMap.get(type) || [];
      const typeInfo = data.typeColumnInfo.get(type);
      
      nodes.forEach((node, index) => {
        const nodeX = typeInfo.startX + index * data.COLUMN_WIDTH;
        const nodeY = levelY;
        
        // Use the actual position from the node (already calculated)
        const coordX = node.position.x / 10;  // Convert from Roblox scale back to grid units
        const coordY = node.position.z / 10;  // z becomes y in 2D
        const coordZ = (200 - node.position.y) / 10;  // Invert Y for draw.io (top is 0)
        
        const label = `${node.name}\n${coordX},${coordY},${coordZ}\n${node.typeNumber}`;
        const style = getNodeStyle(node.type);
        
        xml += `        <!-- ${node.uuid}: ${node.name} -->\n`;
        xml += `        <mxCell id="${cellId}" value="${label}" style="${style}" vertex="1" parent="1">\n`;
        xml += `          <mxGeometry x="${nodeX}" y="${nodeY}" width="${data.NODE_WIDTH}" height="${data.NODE_HEIGHT}" as="geometry"/>\n`;
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
    
    const style = getEdgeStyle(link.type);
    
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

module.exports = generateDrawIoDiagram;