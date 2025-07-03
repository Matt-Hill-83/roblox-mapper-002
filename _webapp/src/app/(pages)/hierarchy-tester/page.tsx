"use client";

import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Minimize, Maximize } from "@mui/icons-material";
import { useEffect, useState } from "react";

import TestDataConfigComponent from "../../../components/TestDataConfigComponent";
import TreeDisplay from "../../../components/TreeDisplay";
import SuggestionsTable from "../../../components/SuggestionsTable";
import MetricsBox from "../../../components/MetricsBox";
import VisualMap from "../../../components/VisualMap";

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
  const [selectedGraph, setSelectedGraph] = useState<
    "reactflow" | "cytoscape" | "d3"
  >("reactflow");

  // Panel collapse state management
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [isGraphCollapsed, setIsGraphCollapsed] = useState(false);
  const [isVisualMapCollapsed, setIsVisualMapCollapsed] = useState(false);

  const handleGraphSelect = (graph: "reactflow" | "cytoscape" | "d3") => {
    setSelectedGraph(graph);
  };

  const handleTableToggle = () => {
    setIsTableCollapsed(!isTableCollapsed);
  };

  const handleGraphToggle = () => {
    setIsGraphCollapsed(!isGraphCollapsed);
  };

  const handleVisualMapToggle = () => {
    setIsVisualMapCollapsed(!isVisualMapCollapsed);
  };

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

  const boxStyles = {
    // width: '100%',
    // minHeight: '100vh',
    margin: 0,
    // border: "10px solid red",
    padding: 0,
  };

  const col2Styles = {
    // border: "10px solid green",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    height: "100vh",
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
        // border: "10px solid blue",
      }}
    >
      <Box>
        <Grid
          container
          spacing={3}
          // sx={{ width: "100%", margin: 0 }}
          style={boxStyles}
        >
          {/* Column 1: Configuration Panel */}
          <Grid item xs={12} lg={3}>
            <Paper elevation={1} sx={{ p: 2, position: "sticky", top: 16 }}>
              <TestDataConfigComponent
                initialConfig={config}
                onSubmit={handleConfigSubmit}
                isLoading={isLoading}
              />
            </Paper>

            {/* Metrics Box */}
            <MetricsBox result={result} isLoading={isLoading} />
          </Grid>

          {/* Column 2: Main Output Area with Suggestions Table and Large Graph */}
          <Grid item xs={12} lg={6} style={col2Styles}>
            <Box
              sx={{
                width: isTableCollapsed
                  ? "50px"
                  : isGraphCollapsed || isVisualMapCollapsed
                  ? "calc(100% - 50px)"
                  : "33.33%",
                height: "100%",
                overflow: "auto",
                position: "relative",
                border: "1px solid #ddd",
              }}
            >
              <IconButton
                onClick={handleTableToggle}
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
                {isTableCollapsed ? <Maximize /> : <Minimize />}
              </IconButton>
              {!isTableCollapsed && (
                <SuggestionsTable
                  onConfigurationSelect={handleConfigurationSelect}
                />
              )}
            </Box>
            <Box
              sx={{
                width: isGraphCollapsed
                  ? "50px"
                  : isTableCollapsed || isVisualMapCollapsed
                  ? "calc(100% - 50px)"
                  : "33.33%",
                height: "100%",
                overflow: "auto",
                position: "relative",
                border: "1px solid #ddd",
              }}
            >
              <IconButton
                onClick={handleGraphToggle}
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
                {isGraphCollapsed ? <Maximize /> : <Minimize />}
              </IconButton>
              {!isGraphCollapsed && (
                <TreeDisplay
                  result={result}
                  isLoading={isLoading}
                  layoutMode="three-column"
                  selectedGraph={selectedGraph}
                  onGraphSelect={handleGraphSelect}
                />
              )}
            </Box>
            <Box
              sx={{
                width: isVisualMapCollapsed
                  ? "50px"
                  : isTableCollapsed || isGraphCollapsed
                  ? "calc(100% - 50px)"
                  : "33.33%",
                height: "100%",
                overflow: "auto",
                position: "relative",
                border: "1px solid #ddd",
              }}
            >
              <IconButton
                onClick={handleVisualMapToggle}
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
                {isVisualMapCollapsed ? <Maximize /> : <Minimize />}
              </IconButton>
              {!isVisualMapCollapsed && (
                <VisualMap positioned={result?.positioned || []} />
              )}
            </Box>
          </Grid>

          
        </Grid>
      </Box>
    </Box>
  );
}
