/**
 * Draw.io diagram generation
 */

import { Cluster, Node } from "../../../interfaces/simpleDataGenerator.interface";
import { RENDERER_CONSTANTS } from "./constants";

/**
 * Generate draw.io diagram XML for visualization
 */
export function generateDrawIoDiagram(cluster: Cluster): void {
  print("📊 Generating draw.io diagram...");
  
  const { SCALE, NODE, EDGE_COLORS, NODE_COLORS } = RENDERER_CONSTANTS.DRAWIO;
  
  // Create timestamp for filename
  const dateTable = os.date("*t");
  const timestamp = string.format("%04d-%02d-%02d_%02d-%02d-%02d", 
    dateTable.year, dateTable.month, dateTable.day, 
    dateTable.hour, dateTable.min, dateTable.sec);
  const filename = `data-generator-diagram-${timestamp}.drawio`;
  
  // Build XML content
  let xml = buildXmlHeader();
  
  // Track node IDs for connections
  const nodeIdMap = new Map<string, number>();
  let cellId = 2;
  
  // Draw nodes
  cluster.groups.forEach(group => {
    group.nodes.forEach(node => {
      const nodeXml = createNodeXml(node, cellId, NODE, NODE_COLORS, SCALE);
      xml += nodeXml;
      nodeIdMap.set(node.uuid, cellId);
      cellId++;
    });
  });
  
  // Draw connections
  cluster.relations.forEach(relation => {
    const sourceId = nodeIdMap.get(relation.sourceNodeUuid);
    const targetId = nodeIdMap.get(relation.targetNodeUuid);
    
    if (sourceId && targetId) {
      const edgeXml = createEdgeXml(relation.type, sourceId, targetId, cellId, EDGE_COLORS);
      xml += edgeXml;
      cellId++;
    }
  });
  
  xml += buildXmlFooter();
  
  // Store diagram
  storeDiagram(filename, xml, cluster);
}

/**
 * Build XML header
 */
function buildXmlHeader(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${os.date("%Y-%m-%d")}" agent="DataGeneratorRobloxRenderer" version="21.1.2">
  <diagram name="Generated Data" id="generated-data">
    <mxGraphModel dx="1434" dy="823" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2400" pageHeight="1600" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
`;
}

/**
 * Build XML footer
 */
function buildXmlFooter(): string {
  return `      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}

/**
 * Create node XML
 */
function createNodeXml(
  node: Node, 
  cellId: number, 
  nodeConfig: typeof RENDERER_CONSTANTS.DRAWIO.NODE,
  nodeColors: typeof RENDERER_CONSTANTS.DRAWIO.NODE_COLORS,
  scale: typeof RENDERER_CONSTANTS.DRAWIO.SCALE
): string {
  const nodeWithLevel = node as Node & { level?: number; typeNumber?: string };
  
  // Scale positions for draw.io
  const x = node.position.x * scale.X;
  const y = scale.Y_OFFSET - (node.position.y * scale.Y); // Invert Y
  
  // Node color
  const fillColor = nodeColors[node.type as keyof typeof nodeColors] || nodeColors.People;
  
  // Create node cell
  const nodeText = `${node.name}\\n${node.type}\\n${nodeWithLevel.typeNumber || ""}`;
  
  return `        <mxCell id="${cellId}" value="${nodeText}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${fillColor};strokeColor=#000000;fontColor=#FFFFFF;" vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}" width="${nodeConfig.WIDTH}" height="${nodeConfig.HEIGHT}" as="geometry" />
        </mxCell>
`;
}

/**
 * Create edge XML
 */
function createEdgeXml(
  linkType: string,
  sourceId: number,
  targetId: number,
  cellId: number,
  edgeColors: typeof RENDERER_CONSTANTS.DRAWIO.EDGE_COLORS
): string {
  const edgeColor = edgeColors[linkType as keyof typeof edgeColors] || 
    RENDERER_CONSTANTS.DEFAULT_DRAWIO_COLOR;
  
  return `        <mxCell id="${cellId}" value="${linkType}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=${edgeColor};strokeWidth=2;" edge="1" parent="1" source="${sourceId}" target="${targetId}">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
`;
}

/**
 * Store diagram in workspace
 */
function storeDiagram(filename: string, xml: string, cluster: Cluster): void {
  const outputPath = `output/${filename}`;
  print(`💾 Writing draw.io diagram to: ${outputPath}`);
  print(`📝 Diagram contains ${cluster.groups[0].nodes.size()} nodes and ${cluster.relations.size()} connections`);
  
  // Note: In Roblox, we can't directly write files. 
  // Store it in a StringValue in workspace for retrieval
  let drawIoStorage = game.Workspace.FindFirstChild("DrawIoDiagrams") as Folder;
  if (!drawIoStorage) {
    drawIoStorage = new Instance("Folder");
    drawIoStorage.Name = "DrawIoDiagrams";
    drawIoStorage.Parent = game.Workspace;
  }
  
  const xmlValue = new Instance("StringValue");
  xmlValue.Name = filename;
  xmlValue.Value = xml;
  xmlValue.Parent = drawIoStorage;
  
  print(`✅ Draw.io diagram stored in Workspace.DrawIoDiagrams.${filename}`);
}