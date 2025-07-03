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
  const [config, setConfig] = useState<TestDataConfig>({
    // Basic parameters (legacy)
    numberOfNodes: 15,
    numberOfConnectedChains: 3,
    depthOfLongestChain: 3,

    // Advanced parameters
    totalNodes: 50,
    maxDepth: 4,
    branchingMin: 2,
    branchingMax: 5,
    crossTreeConnections: 15, // 15%
    entityTypes: 4,
    connectorTypes: 3,
    clusteringCoeff: 30, // 30%
    hubNodes: 2,
    networkDensity: "medium",
  });

  const [result, setResult] = useState<HierarchyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Panel collapse state management
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [isReactFlowCollapsed, setIsReactFlowCollapsed] = useState(false);
  const [isCytoscapeCollapsed, setIsCytoscapeCollapsed] = useState(false);
  const [isD3Collapsed, setIsD3Collapsed] = useState(false);
  const [isTabbedInterfaceCollapsed, setIsTabbedInterfaceCollapsed] =
    useState(false);
  const [isConfigPanelCollapsed, setIsConfigPanelCollapsed] = useState(false);

  const handleTableToggle = () => setIsTableCollapsed(!isTableCollapsed);
  const handleReactFlowToggle = () =>
    setIsReactFlowCollapsed(!isReactFlowCollapsed);
  const handleCytoscapeToggle = () =>
    setIsCytoscapeCollapsed(!isCytoscapeCollapsed);
  const handleD3Toggle = () => setIsD3Collapsed(!isD3Collapsed);
  const handleTabbedInterfaceToggle = () =>
    setIsTabbedInterfaceCollapsed(!isTabbedInterfaceCollapsed);
  const handleConfigPanelToggle = () =>
    setIsConfigPanelCollapsed(!isConfigPanelCollapsed);

  // Calculate flex values for each panel
  const getFlexValue = (isCollapsed: boolean) =>
    isCollapsed ? "0 0 50px" : "1";

  const tableFlex = getFlexValue(isTableCollapsed);
  const reactFlowFlex = getFlexValue(isReactFlowCollapsed);
  const cytoscapeFlex = getFlexValue(isCytoscapeCollapsed);
  const d3Flex = getFlexValue(isD3Collapsed);
  const tabbedInterfaceFlex = getFlexValue(isTabbedInterfaceCollapsed);
  const configPanelFlex = getFlexValue(isConfigPanelCollapsed);

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
                isCollapsed={isConfigPanelCollapsed}
                onToggle={handleConfigPanelToggle}
                result={result}
                flex={configPanelFlex}
                initialConfig={config}
                onSubmit={handleConfigSubmit}
                isLoading={isLoading}
              />

              <CollapsibleGraphPanel
                title="Suggestions"
                isCollapsed={isTableCollapsed}
                onToggle={handleTableToggle}
                result={result}
                flex={tableFlex}
                onConfigurationSelect={handleConfigurationSelect}
              />

              <CollapsibleGraphPanel
                title="React Flow"
                isCollapsed={isReactFlowCollapsed}
                onToggle={handleReactFlowToggle}
                result={result}
                flex={reactFlowFlex}
                data={result}
                width="100%"
                height="100%"
              />

              <CollapsibleGraphPanel
                title="Cytoscape.js"
                isCollapsed={isCytoscapeCollapsed}
                onToggle={handleCytoscapeToggle}
                result={result}
                flex={cytoscapeFlex}
                data={result}
                width="100%"
                height="100%"
              />

              <CollapsibleGraphPanel
                title="D3.js"
                isCollapsed={isD3Collapsed}
                onToggle={handleD3Toggle}
                result={result}
                flex={d3Flex}
                data={result}
                width="100%"
                height="100%"
              />

              {/* Tabbed Interface (TreeDisplay) */}
              <Box
                sx={{
                  flex: tabbedInterfaceFlex,
                  height: "100%",
                  overflow: "auto",
                  position: "relative",
                  border: "1px solid #ddd",
                }}
              >
                <IconButton
                  onClick={handleTabbedInterfaceToggle}
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
                  {isTabbedInterfaceCollapsed ? <Maximize /> : <Minimize />}
                </IconButton>
                {!isTabbedInterfaceCollapsed && (
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
