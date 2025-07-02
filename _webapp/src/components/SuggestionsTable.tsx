'use client';

import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Box, Paper, Typography } from '@mui/material';
import { presetConfigurations, PresetConfiguration } from '../data/presetConfigurations';
import { TestDataConfig } from '../app/(pages)/hierarchy-tester/page';

interface SuggestionsTableProps {
  onConfigurationSelect: (config: TestDataConfig) => void;
}

export default function SuggestionsTable({ onConfigurationSelect }: SuggestionsTableProps) {
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      width: 50,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: 'pointer',
            color: 'primary.main',
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          onClick={() => handleConfigurationClick(params.row)}
        >
          {params.value}
        </Box>
      )
    },
    {
      field: 'name',
      headerName: 'Configuration',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.description}
          </Typography>
        </Box>
      )
    },
    { field: 'totalNodes', headerName: 'Nodes', width: 80 },
    { field: 'maxDepth', headerName: 'Depth', width: 80 },
    { field: 'branchingMin', headerName: 'Min Branch', width: 90 },
    { field: 'branchingMax', headerName: 'Max Branch', width: 90 },
    { field: 'crossTreeConnections', headerName: 'Cross %', width: 80 },
    { field: 'entityTypes', headerName: 'Types', width: 80 },
    { field: 'clusteringCoeff', headerName: 'Cluster %', width: 90 },
    { field: 'hubNodes', headerName: 'Hubs', width: 80 },
    { field: 'networkDensity', headerName: 'Density', width: 90 }
  ];

  const handleConfigurationClick = (config: PresetConfiguration) => {
    // Extract only the TestDataConfig properties, excluding the preset-specific ones
    const testConfig: TestDataConfig = {
      numberOfNodes: config.numberOfNodes,
      numberOfConnectedChains: config.numberOfConnectedChains,
      depthOfLongestChain: config.depthOfLongestChain,
      totalNodes: config.totalNodes,
      maxDepth: config.maxDepth,
      branchingMin: config.branchingMin,
      branchingMax: config.branchingMax,
      crossTreeConnections: config.crossTreeConnections,
      entityTypes: config.entityTypes,
      clusteringCoeff: config.clusteringCoeff,
      hubNodes: config.hubNodes,
      networkDensity: config.networkDensity
    };
    
    onConfigurationSelect(testConfig);
  };

  return (
    <Paper variant="outlined" sx={{ mb: 3 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Suggested Configurations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click any # to load that configuration
        </Typography>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={presetConfigurations}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 }
            }
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        />
      </Box>
    </Paper>
  );
}