"use client";

import { Container, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import TestDataConfigComponent from "../../../components/TestDataConfigComponent";
import TreeDisplay from "../../../components/TreeDisplay";
import SuggestionsTable from "../../../components/SuggestionsTable";
import MetricsBox from "../../../components/MetricsBox";

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
    clusteringCoeff: 30, // 30%
    hubNodes: 2,
    networkDensity: "medium",
  });

  const [result, setResult] = useState<HierarchyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState<'reactflow' | 'cytoscape' | 'd3'>('reactflow');

  const handleGraphSelect = (graph: 'reactflow' | 'cytoscape' | 'd3') => {
    setSelectedGraph(graph);
  };

  const handleConfigurationSelect = (newConfig: TestDataConfig) => {
    console.log('Loading preset configuration:', newConfig);
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
    <Container 
      maxWidth={false} 
      sx={{ 
        py: 4, 
        px: 2,
        width: '100vw', 
        maxWidth: '100vw',
        margin: 0
      }}
    >
      <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>
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
          <MetricsBox 
            result={result}
            isLoading={isLoading}
          />
        </Grid>

        {/* Column 2: Main Output Area with Suggestions Table and Large Graph */}
        <Grid item xs={12} lg={6}>
          <SuggestionsTable onConfigurationSelect={handleConfigurationSelect} />
          <TreeDisplay 
            result={result} 
            isLoading={isLoading} 
            layoutMode="three-column"
            selectedGraph={selectedGraph}
            onGraphSelect={handleGraphSelect}
          />
        </Grid>

        {/* Column 3: Three Small Graphs Stacked */}
        <Grid item xs={12} lg={3}>
          <TreeDisplay 
            result={result} 
            isLoading={isLoading} 
            layoutMode="sidebar-graphs"
            selectedGraph={selectedGraph}
            onGraphSelect={handleGraphSelect}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
