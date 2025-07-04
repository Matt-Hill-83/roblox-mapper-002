import React, { useState } from "react";
import HorizCollapsibleSetChild from "./HorizCollapsibleSetChild";
import ReactFlowGraph from "./graphs/ReactFlowGraph";
import CytoscapeGraph from "./graphs/CytoscapeGraph";
import D3Graph from "./graphs/D3Graph";
import SciChart3DBubbleWrapper from "./graphs/SciChart3DBubbleWrapper";
import { HierarchyResult } from "../app/(pages)/hierarchy-tester/page";

interface GraphsDisplayProps {
  result: HierarchyResult | null;
}

const GraphsDisplay: React.FC<GraphsDisplayProps> = ({ result }) => {
  const [collapsedPanels, setCollapsedPanels] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setCollapsedPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  const reactFlowContent = (
    <ReactFlowGraph data={result} width="100%" height="100%" />
  );

  const cytoscapeContent = (
    <CytoscapeGraph data={result} width="100%" height="100%" />
  );

  const d3Content = <D3Graph data={result} width="100%" height="100%" />;

  const sciChart3DContent = (
    <SciChart3DBubbleWrapper data={result} width="100%" height="100%" />
  );

  return (
    <>
      <HorizCollapsibleSetChild
        id="react-flow-panel"
        title="React Flow"
        minWidth="400px"
        isCollapsed={collapsedPanels.has("react-flow-panel")}
        onToggle={handleToggle}
      >
        {reactFlowContent}
      </HorizCollapsibleSetChild>

      <HorizCollapsibleSetChild
        id="cytoscape-panel"
        title="Cytoscape.js"
        minWidth="400px"
        isCollapsed={collapsedPanels.has("cytoscape-panel")}
        onToggle={handleToggle}
      >
        {cytoscapeContent}
      </HorizCollapsibleSetChild>

      <HorizCollapsibleSetChild
        id="d3-panel"
        title="D3.js"
        minWidth="400px"
        isCollapsed={collapsedPanels.has("d3-panel")}
        onToggle={handleToggle}
      >
        {d3Content}
      </HorizCollapsibleSetChild>

      <HorizCollapsibleSetChild
        id="scichart-3d-panel"
        title="SciChart 3D"
        minWidth="400px"
        isCollapsed={collapsedPanels.has("scichart-3d-panel")}
        onToggle={handleToggle}
      >
        {sciChart3DContent}
      </HorizCollapsibleSetChild>
    </>
  );
};

export default GraphsDisplay;