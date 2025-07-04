"use client";

import { Grid, Box, IconButton, Accordion, AccordionSummary, AccordionDetails, Typography, Paper } from "@mui/material";
import { Minimize, Maximize, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";

import TestDataConfigComponent from "../../../components/TestDataConfigComponent";
import MetricsBox from "../../../components/MetricsBox";
import SuggestionsTable from "../../../components/SuggestionsTable";
import ReactFlowGraph from "../../../components/graphs/ReactFlowGraph";
import CytoscapeGraph from "../../../components/graphs/CytoscapeGraph";
import D3Graph from "../../../components/graphs/D3Graph";
import TreeDisplay from "../../../components/TreeDisplay";
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
        <Grid container spacing={3} sx={{ margin: 0, padding: 0 }}>
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
              <Accordion
                expanded={!isCollapsed["config-panel"]}
                onChange={() => handleToggle("config-panel")}
                sx={{ flex: getFlexValue("config-panel") }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
                    <TestDataConfigComponent
                      initialConfig={config}
                      onSubmit={handleConfigSubmit}
                      isLoading={isLoading}
                    />
                    <MetricsBox result={result} isLoading={isLoading} />
                  </Paper>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={!isCollapsed["table"]}
                onChange={() => handleToggle("table")}
                sx={{ flex: getFlexValue("table") }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Suggestions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <SuggestionsTable
                    onConfigurationSelect={handleConfigurationSelect}
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={!isCollapsed["react-flow"]}
                onChange={() => handleToggle("react-flow")}
                sx={{ flex: getFlexValue("react-flow") }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>React Flow</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ReactFlowGraph data={result} width="100%" height="100%" />
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={!isCollapsed["cytoscape"]}
                onChange={() => handleToggle("cytoscape")}
                sx={{ flex: getFlexValue("cytoscape") }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Cytoscape.js</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <CytoscapeGraph data={result} width="100%" height="100%" />
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={!isCollapsed["d3"]}
                onChange={() => handleToggle("d3")}
                sx={{ flex: getFlexValue("d3") }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>D3.js</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <D3Graph data={result} width="100%" height="100%" />
                </AccordionDetails>
              </Accordion>

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
                  {isCollapsed["tabbed-interface"] ? (
                    <Maximize />
                  ) : (
                    <Minimize />
                  )}
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
