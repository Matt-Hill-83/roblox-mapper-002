import { Paper } from "@mui/material";
import GraphContainer from "./graphs/GraphContainer";
import TestDataConfigComponent from "./TestDataConfigComponent";
import MetricsBox from "./MetricsBox";
import SuggestionsTable from "./SuggestionsTable";
import ReactFlowGraph from "./graphs/ReactFlowGraph";
import CytoscapeGraph from "./graphs/CytoscapeGraph";
import D3Graph from "./graphs/D3Graph";
import { TestDataConfig, HierarchyResult } from "../app/(pages)/hierarchy-tester/page";

interface CollapsibleGraphPanelProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  result: HierarchyResult | null;
  flex: string;
  children?: React.ReactNode;
  // Specific props for components rendered inside
  initialConfig?: TestDataConfig;
  onSubmit?: (config: TestDataConfig) => void;
  isLoading?: boolean;
  onConfigurationSelect?: (config: TestDataConfig) => void;
  data?: HierarchyResult | null;
  width?: string;
  height?: string;
}

export default function CollapsibleGraphPanel({
  title,
  isCollapsed,
  onToggle,
  result,
  flex,
  children,
  initialConfig,
  onSubmit,
  isLoading,
  onConfigurationSelect,
  data,
  width,
  height,
}: CollapsibleGraphPanelProps) {
  const renderContent = () => {
    switch (title) {
      case "Configuration":
        return (
          <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
            <TestDataConfigComponent
              initialConfig={initialConfig!}
              onSubmit={onSubmit!}
              isLoading={isLoading!}
            />
            <MetricsBox result={result} isLoading={isLoading!} />
          </Paper>
        );
      case "Suggestions":
        return (
          <SuggestionsTable
            onConfigurationSelect={onConfigurationSelect!}
          />
        );
      case "React Flow":
        return <ReactFlowGraph data={data} width={width!} height={height!} />;
      case "Cytoscape.js":
        return <CytoscapeGraph data={data} width={width!} height={height!} />;
      case "D3.js":
        return <D3Graph data={data} width={width!} height={height!} />;
      default:
        return children;
    }
  };

  return (
    <GraphContainer
      title={title}
      isCollapsed={isCollapsed}
      onToggle={onToggle}
      result={result}
      flex={flex}
    >
      {renderContent()}
    </GraphContainer>
  );
}
