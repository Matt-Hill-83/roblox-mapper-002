'use client';

import { Box, Paper, Typography, Chip, Stack, Divider } from '@mui/material';

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

export default function MetricsBox({ result, isLoading = false }: MetricsBoxProps) {
  // Extract metrics from the result
  const totalEntities = result?.positioned?.length || 0;
  const connectedGroups = result?.groups?.length || 0;
  const entityTypes = result?.positioned ? 
    new Set(result.positioned.map((entity) => entity.type)).size : 0;

  if (isLoading) {
    return (
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Graph Metrics
        </Typography>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">Loading...</Typography>
          </Box>
        </Stack>
      </Paper>
    );
  }

  if (!result || !result.positioned) {
    return (
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Graph Metrics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generate a graph to see metrics
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Graph Metrics
      </Typography>
      
      <Stack spacing={2}>
        {/* Total Entities */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total Entities
          </Typography>
          <Chip 
            label={totalEntities} 
            size="small" 
            color="primary"
            variant="outlined"
          />
        </Box>

        <Divider />

        {/* Connected Groups */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Connected Groups
          </Typography>
          <Chip 
            label={connectedGroups} 
            size="small" 
            color="secondary"
            variant="outlined"
          />
        </Box>

        <Divider />

        {/* Entity Types */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Entity Types
          </Typography>
          <Chip 
            label={entityTypes} 
            size="small" 
            color="success"
            variant="outlined"
          />
        </Box>

        {/* Additional Metrics */}
        {result.positioned && result.positioned.length > 0 && (
          <>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Max Depth
              </Typography>
              <Chip 
                label={Math.max(...result.positioned.map((e) => e.level || 0))} 
                size="small" 
                color="info"
                variant="outlined"
              />
            </Box>
          </>
        )}

        {/* Graph Density Indicator */}
        <Divider />
        <Box sx={{ pt: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Visualization Ready
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {totalEntities > 0 && (
              <Chip 
                label="✓ Entities" 
                size="small" 
                color="success"
                variant="filled"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
            {connectedGroups > 0 && (
              <Chip 
                label="✓ Groups" 
                size="small" 
                color="success"
                variant="filled"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
            {entityTypes > 1 && (
              <Chip 
                label="✓ Types" 
                size="small" 
                color="success"
                variant="filled"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}