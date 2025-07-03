'use client';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { presetConfigurations, PresetConfiguration } from '../data/presetConfigurations';
import { TestDataConfig } from '../app/(pages)/hierarchy-tester/page';
import { useState, useEffect } from 'react';

interface SuggestionsTableProps {
  onConfigurationSelect: (config: TestDataConfig) => void;
}

interface ExtendedPresetConfiguration extends PresetConfiguration {
  is_favorite: boolean;
}

export default function SuggestionsTable({ onConfigurationSelect }: SuggestionsTableProps) {
  const [configurations, setConfigurations] = useState<ExtendedPresetConfiguration[]>([]);
  const [loading, setLoading] = useState(true);

  // Load configurations from database and merge with presets
  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      const response = await fetch('/api/graph-configs');
      const result = await response.json();
      
      if (result.success) {
        // Parse database configs
        const dbConfigs: ExtendedPresetConfiguration[] = result.data.map((config: any) => ({
          id: parseInt(config.uuid.split('-').pop() || '0'),
          uuid: config.uuid,
          name: config.name,
          description: config.description,
          is_favorite: config.is_favorite,
          is_system: config.is_system,
          ...JSON.parse(config.config_data)
        }));
        
        // Merge with preset configurations
        const presetUuids = new Set(dbConfigs.map((c) => c.uuid));
        const presetsToAdd = presetConfigurations.filter(p => !presetUuids.has(p.uuid));
        
        // Add missing presets to database
        for (const preset of presetsToAdd) {
          await fetch('/api/graph-configs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'save',
              uuid: preset.uuid,
              name: preset.name,
              description: preset.description,
              config: preset,
              is_system: true,
              is_favorite: false
            })
          });
        }
        
        // Reload to get the complete list
        const updatedResponse = await fetch('/api/graph-configs');
        const updatedResult = await updatedResponse.json();
        
        if (updatedResult.success) {
          const allConfigs: ExtendedPresetConfiguration[] = updatedResult.data.map((config: any) => ({
            id: parseInt(config.uuid.split('-').pop() || '0'),
            uuid: config.uuid,
            name: config.name,
            description: config.description,
            is_favorite: config.is_favorite,
            is_system: config.is_system,
            ...JSON.parse(config.config_data)
          }));
          
          setConfigurations(allConfigs);
        }
      }
    } catch (error) {
      console.error('Error loading configurations:', error);
      // Fallback to preset configurations
      setConfigurations(presetConfigurations.map(p => ({ ...p, is_favorite: false })));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (uuid: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const response = await fetch('/api/graph-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_favorite',
          uuid
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setConfigurations(prev => 
          prev.map(config => 
            config.uuid === uuid 
              ? { ...config, is_favorite: result.data.is_favorite }
              : config
          )
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'is_favorite',
      headerName: '⭐',
      width: 60,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => handleToggleFavorite(params.row.uuid, e)}
          sx={{ color: params.value ? 'gold' : 'lightgray' }}
        >
          {params.value ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      )
    },
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
      headerName: 'Title',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 180,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">
          {params.value}
        </Typography>
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

  const handleConfigurationClick = (config: ExtendedPresetConfiguration) => {
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
      networkDensity: config.networkDensity,
      connectorTypes: config.connectorTypes
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
          ⭐ Click star to favorite • # Click number to load configuration
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={configurations}
          columns={columns}
          density="compact"
          loading={loading}
          getRowId={(row) => row.uuid}
          initialState={{
            sorting: {
              sortModel: [{ field: 'is_favorite', sort: 'desc' }]
            }
          }}
          disableRowSelectionOnClick
          autoHeight
          hideFooterPagination
          hideFooter
          sx={{
            border: 0,
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover'
            },
            '& .MuiDataGrid-row[data-rowselected="true"]': {
              backgroundColor: 'primary.light',
              opacity: 0.1
            }
          }}
        />
      </Box>
    </Paper>
  );
}