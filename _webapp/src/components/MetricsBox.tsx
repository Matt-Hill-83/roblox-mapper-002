"use client";

import { Box, Paper, Typography, Chip, Stack, Divider } from "@mui/material";

interface HierarchyEntity {
  entityId: string;
  type: string;
  level: number;
}

interface HierarchyResult {
  positioned?: HierarchyEntity[];
  groups?: Array<{ entities: HierarchyEntity[] }>;
}

interface MetricsBoxProps {
  result: HierarchyResult | null;
  isLoading?: boolean;
}

export default function MetricsBox({
  result,
  isLoading = false,
}: MetricsBoxProps) {
  // Extract metrics from the result
  const totalEntities = result?.positioned?.length || 0;
  const connectedGroups = result?.groups?.length || 0;
  const entityTypes = result?.positioned
    ? new Set(result.positioned.map((entity) => entity.type)).size
    : 0;

  if (isLoading) {
    return (
      <Paper variant="outlined" sx={{ p: 1, mt: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Graph Metrics
        </Typography>
        <Stack spacing={1}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        </Stack>
      </Paper>
    );
  }

  if (!result || !result.positioned) {
    return (
      <Paper variant="outlined" sx={{ p: 1, mt: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Graph Metrics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generate a graph to see metrics
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 1, mt: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        Graph Metrics
      </Typography>

      <Stack spacing={1}>
        {/* Total Entities */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Total Entities
          </Typography>
          <Chip
            label={totalEntities}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ height: "auto", fontSize: "0.75rem" }}
          />
        </Box>

        <Divider />

        {/* Connected Groups */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Connected Groups
          </Typography>
          <Chip
            label={connectedGroups}
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ height: "auto", fontSize: "0.75rem" }}
          />
        </Box>

        <Divider />

        {/* Entity Types */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Entity Types
          </Typography>
          <Chip
            label={entityTypes}
            size="small"
            color="info"
            variant="outlined"
            sx={{ height: "auto", fontSize: "0.75rem" }}
          />
        </Box>
      </Stack>
    </Paper>
  );
}
