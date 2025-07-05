/**
 * Style definitions for draw.io diagrams
 */

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
    base: "edgeStyle=straight;",
    strokeColor: "#000000",
    strokeWidth: "4"
  },
  relationEdge: {
    base: "edgeStyle=straight;",
    strokeColor: "#666666",
    strokeWidth: "2",
    dashed: "1"
  },
  // Colors for specific link types
  linkTypeColors: {
    "Owns": "#00aa00",      // Green
    "Wants": "#ff6600",     // Orange
    "Eats": "#aa0000",      // Red
    "Link4": "#0066cc",     // Blue
    "Link5": "#9900cc"      // Purple
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
    // Use specific color for link type if available
    const color = DRAW_IO_STYLES.linkTypeColors[linkType] || style.strokeColor;
    return `${style.base}strokeColor=${color};strokeWidth=${style.strokeWidth};dashed=${style.dashed};`;
  }
}

module.exports = {
  DRAW_IO_STYLES,
  getNodeStyle,
  getEdgeStyle
};