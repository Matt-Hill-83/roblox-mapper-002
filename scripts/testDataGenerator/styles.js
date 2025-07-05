/**
 * Style definitions for diagrams
 */

// Mermaid diagram styles
const MERMAID_STYLES = {
  peopleClass: "classDef people fill:#3366cc,stroke:#1a3d7a,stroke-width:2px,color:#fff",
  animalsClass: "classDef animals fill:#cc6633,stroke:#7a3d1a,stroke-width:2px,color:#fff",
  invisibleClass: "classDef invisible fill:transparent,stroke:transparent",
  graphType: "graph TB" // Top-bottom layout
};

// Draw.io styles
const DRAW_IO_STYLES = {
  swimLaneHeader: {
    base: "rounded=0;fillColor=#e8e8e8;strokeColor=#666666;fontSize=14;fontStyle=1;verticalAlign=top;"
  },
  levelBackground: {
    base: "rounded=1;fillColor=#f9f9f9;strokeColor=#999999;verticalAlign=top;fontSize=12;fontStyle=1;spacingTop=5;opacity=50;"
  },
  peopleNode: {
    shape: "rounded=1",
    fillColor: "#3366cc",
    strokeColor: "#000000",
    fontColor: "#ffffff",
    fontSize: "10",
    verticalAlign: "middle",
    spacing: "2"
  },
  animalsNode: {
    shape: "ellipse",
    fillColor: "#cc6633",
    strokeColor: "#000000",
    fontColor: "#ffffff",
    fontSize: "10",
    verticalAlign: "middle",
    spacing: "2"
  },
  parentChildEdge: {
    base: "edgeStyle=orthogonalEdgeStyle;rounded=1;",
    strokeColor: "#000000",
    strokeWidth: "2"
  },
  relationEdge: {
    base: "edgeStyle=orthogonalEdgeStyle;rounded=1;",
    strokeColor: "#666666",
    strokeWidth: "1",
    dashed: "1"
  }
};

// Helper function to format Draw.io node style
function getNodeStyle(type) {
  const style = type === "People" ? DRAW_IO_STYLES.peopleNode : DRAW_IO_STYLES.animalsNode;
  return `${style.shape};fillColor=${style.fillColor};strokeColor=${style.strokeColor};fontColor=${style.fontColor};fontSize=${style.fontSize};verticalAlign=${style.verticalAlign};spacing=${style.spacing};`;
}

// Helper function to format Draw.io edge style
function getEdgeStyle(linkType) {
  if (linkType === "Parent-Child") {
    const style = DRAW_IO_STYLES.parentChildEdge;
    return `${style.base}strokeColor=${style.strokeColor};strokeWidth=${style.strokeWidth};`;
  } else {
    const style = DRAW_IO_STYLES.relationEdge;
    return `${style.base}strokeColor=${style.strokeColor};strokeWidth=${style.strokeWidth};dashed=${style.dashed};`;
  }
}

module.exports = {
  MERMAID_STYLES,
  DRAW_IO_STYLES,
  getNodeStyle,
  getEdgeStyle
};