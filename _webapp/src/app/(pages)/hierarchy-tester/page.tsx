"use client";

import { Grid, Paper, Box, IconButton } from "@mui/material";
import { Minimize, Maximize } from "@mui/icons-material";
import { useEffect, useState } from "react";

import TestDataConfigComponent from "../../../components/TestDataConfigComponent";
import TreeDisplay from "../../../components/TreeDisplay";
import SuggestionsTable from "../../../components/SuggestionsTable";
import MetricsBox from "../../../components/MetricsBox";
import ReactFlowGraph from "../../../components/graphs/ReactFlowGraph";
import CytoscapeGraph from "../../../components/graphs/CytoscapeGraph";
import D3Graph from "../../../components/graphs/D3Graph";
import GraphContainer from "../../../components/graphs/GraphContainer";
import CollapsibleGraphPanel from "../../../components/CollapsibleGraphPanel";
import { usePanelCollapse } from "../../../hooks/usePanelCollapse";

export interface TestDataConfig {
  // Basic parameters
  numberOfNodes: number;
  numberOfConnectedChains: number;
  depthOfLongestChain: number;

  // Advanced parameters
  totalNodes: number;
  maxDepth: number;
  branchingMin: number;
  branchingMax: number;
  crossTreeConnections: number; // percentage 0-100
  entityTypes: number;
  connectorTypes: number;
  clusteringCoeff: number; // percentage 0-100
  hubNodes: number;
  networkDensity: "sparse" | "medium" | "dense";
}

export interface HierarchyResult {
  entities: unknown[];
  groups: unknown[];
  positioned: unknown[];
  asciiMap?: string;
}

export default function HierarchyTesterPage() {
  const { isCollapsed, handleToggle, getFlexValue } = usePanelCollapse();
  import { initialConfig } from "../../../data/defaultConfigs";

export default function HierarchyTesterPage() {
  const { isCollapsed, handleToggle, getFlexValue } = usePanelCollapse();
  const [config, setConfig] = useState<TestDataConfig>(initialConfig);

  const [result, setResult] = useState<HierarchyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfigurationSelect = (newConfig: TestDataConfig) => {
    console.log("Loading preset configuration:", newConfig);
    setConfig(newConfig);
    handleConfigSubmit(newConfig);
  };

  // Generate default hierarchy on page load
  useEffect(() => {
    const generateDefaultHierarchy = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/hierarchy-test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        });

        if (!response.ok) {
          throw new Error("Failed to generate default hierarchy data");
        }

        const hierarchyResult = await response.json();
        setResult(hierarchyResult);
      } catch (error) {
        console.error("Error generating default hierarchy:", error);
        // Set empty result on error so component still renders
        setResult({
          entities: [],
          groups: [],
          positioned: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateDefaultHierarchy();
  }, []); // Empty dependency array - only run on mount

  const handleConfigSubmit = async (newConfig: TestDataConfig) => {
    setIsLoading(true);
    setConfig(newConfig);

    try {
      // Call API to generate hierarchy data
      const response = await fetch("/api/hierarchy-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newConfig),
      });

      if (!response.ok) {
        throw new Error("Failed to generate hierarchy data");
      }

      const hierarchyResult = await response.json();
      setResult(hierarchyResult);
    } catch (error) {
      console.error("Error generating hierarchy:", error);
      // For now, generate mock data if API fails
      setResult({
        entities: [],
        groups: [],
        positioned: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        position: "relative",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        left: 0,
        right: 0,
      }}
    >
      <Box>
        <Grid
          container
          spacing={3}
          sx={{ margin: 0, padding: 0 }}
        >
          {/* Column 2: Collapsible Panels */}
          <Grid item xs={12} lg={9}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                height: "100vh",
                gap: 2, // Add some gap between panels
                flexWrap: "nowrap", // Prevent wrapping
              }}
            >
              <CollapsibleGraphPanel
                title="Configuration"
                isCollapsed={isCollapsed["config-panel"]}
                onToggle={() => handleToggle("config-panel")}
                result={result}
                flex={getFlexValue("config-panel")}
                initialConfig={config}
                onSubmit={handleConfigSubmit}
                isLoading={isLoading}
              />

              <CollapsibleGraphPanel
                title="Suggestions"
                isCollapsed={isCollapsed["table"]}
                onToggle={() => handleToggle("table")}
                result={result}
                flex={getFlexValue("table")}
                onConfigurationSelect={handleConfigurationSelect}
              />

              <CollapsibleGraphPanel
                title="React Flow"
                isCollapsed={isCollapsed["react-flow"]}
                onToggle={() => handleToggle("react-flow")}
                result={result}
                flex={getFlexValue("react-flow")}
                data={result}
                width="100%"
                height="100%"
              />

              <CollapsibleGraphPanel
                title="Cytoscape.js"
                isCollapsed={isCollapsed["cytoscape"]}
                onToggle={() => handleToggle("cytoscape")}
                result={result}
                flex={getFlexValue("cytoscape")}
                data={result}
                width="100%"
                height="100%"
              />

              <CollapsibleGraphPanel
                title="D3.js"
                isCollapsed={isCollapsed["d3"]}
                onToggle={() => handleToggle("d3")}
                result={result}
                flex={getFlexValue("d3")}
                data={result}
                width="100%"
                height="100%"
              />

              {/* Tabbed Interface (TreeDisplay) */}
              <Box
                sx={{
                  flex: getFlexValue("tabbed-interface"),
                  height: "100%",
                  overflow: "auto",
                  position: "relative",
                  border: "1px solid #ddd",
                }}
              >
                <IconButton
                  onClick={() => handleToggle("tabbed-interface")}
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 1000,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  size="small"
                >
                  {isCollapsed["tabbed-interface"] ? <Maximize /> : <Minimize />}
                </IconButton>
                {!isCollapsed["tabbed-interface"] && (
                  <TreeDisplay result={result} isLoading={isLoading} />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
