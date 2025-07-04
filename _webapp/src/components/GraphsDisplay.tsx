import React from "react";
import HorizCollapsibleSetChild from "./HorizCollapsibleSetChild";
import ReactFlowGraph from "./graphs/ReactFlowGraph";
import CytoscapeGraph from "./graphs/CytoscapeGraph";
import D3Graph from "./graphs/D3Graph";
import { HierarchyResult } from "../app/(pages)/hierarchy-tester/page";

interface GraphsDisplayProps {
  result: HierarchyResult | null;
}

const GraphsDisplay: React.FC<GraphsDisplayProps> = ({ result }) => {
  const reactFlowContent = (
    <ReactFlowGraph data={result} width="100%" height="100%" />
  );

  const cytoscapeContent = (
    <CytoscapeGraph data={result} width="100%" height="100%" />
  );

  const d3Content = <D3Graph data={result} width="100%" height="100%" />;

  return (
    <>
      <HorizCollapsibleSetChild
        id="react-flow-panel"
        title="React Flow"
        minWidth="400px"
      >
        {reactFlowContent}
      </HorizCollapsibleSetChild>

      <HorizCollapsibleSetChild
        id="cytoscape-panel"
        title="Cytoscape.js"
        minWidth="400px"
      >
        {cytoscapeContent}
      </HorizCollapsibleSetChild>

      <HorizCollapsibleSetChild
        id="d3-panel"
        title="D3.js"
        minWidth="400px"
      >
        {d3Content}
      </HorizCollapsibleSetChild>
    </>
  );
};

export default GraphsDisplay;