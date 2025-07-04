"use client";

import { Grid, Box } from "@mui/material";
const gridStyles = {
  border: "10px solid red",
  width: "100%",
};
import { useEffect, useState } from "react";

import ConfigPanel from "../../../components/ConfigPanel";
import TreeDisplay from "../../../components/TreeDisplay";
import HorizCollapsibleSetParent from "../../../components/HorizCollapsibleSetParent";
import HorizCollapsibleSetChild from "../../../components/HorizCollapsibleSetChild";
import GraphsDisplay from "../../../components/GraphsDisplay";

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
  }, [config]); // Empty dependency array - only run on mount

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

  const configContent = (
    <ConfigPanel
      config={config}
      result={result}
      isLoading={isLoading}
      onSubmit={handleConfigSubmit}
    />
  );

  const analysisToolsContent = (
    <TreeDisplay
      result={result}
      isLoading={isLoading}
      onConfigurationSelect={handleConfigurationSelect}
    />
  );

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
      <Grid container spacing={3} sx={{ margin: 0, padding: 0 }}>
          {/* Column 2: Collapsible Panels */}
          <Grid item xs={12} lg={12} sx={gridStyles}>
            <HorizCollapsibleSetParent>
              <HorizCollapsibleSetChild id="config-panel" title="Configuration">
                {configContent}
              </HorizCollapsibleSetChild>

              <HorizCollapsibleSetChild
                id="analysis-tools-panel"
                title="Analysis Tools"
              >
                {analysisToolsContent}
              </HorizCollapsibleSetChild>

              <GraphsDisplay result={result} />
            </HorizCollapsibleSetParent>
          </Grid>
        </Grid>
    </Box>
  );
}
