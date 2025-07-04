"use client";

import { Paper } from "@mui/material";
import TestDataConfigComponent from "./TestDataConfigComponent";
import MetricsBox from "./MetricsBox";
import { TestDataConfig, HierarchyResult } from "../app/(pages)/hierarchy-tester/page";

interface ConfigPanelProps {
  config: TestDataConfig;
  result: HierarchyResult | null;
  isLoading: boolean;
  onSubmit: (config: TestDataConfig) => void;
}

export default function ConfigPanel({
  config,
  result,
  isLoading,
  onSubmit,
}: ConfigPanelProps) {
  return (
    <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
      <TestDataConfigComponent
        initialConfig={config}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
      <MetricsBox result={result} isLoading={isLoading} />
    </Paper>
  );
}