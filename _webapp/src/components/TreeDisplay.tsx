'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { HierarchyResult } from '../app/(pages)/hierarchy-tester/page';
import ReactFlowGraph from './graphs/ReactFlowGraph';
import CytoscapeGraph from './graphs/CytoscapeGraph';
import D3Graph from './graphs/D3Graph';

interface TreeDisplayProps {
  result: HierarchyResult | null;
  isLoading?: boolean;
  layoutMode?: 'default' | 'three-column' | 'sidebar-graphs';
  selectedGraph?: 'reactflow' | 'cytoscape' | 'd3';
  onGraphSelect?: (graph: 'reactflow' | 'cytoscape' | 'd3') => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tree-tabpanel-${index}`}
      aria-labelledby={`tree-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TreeDisplay({ 
  result, 
  isLoading, 
  layoutMode = 'default',
  selectedGraph = 'reactflow',
  onGraphSelect 
}: TreeDisplayProps) {
  const [tabValue, setTabValue] = useState(4); // Default to Graphs tab (index 4)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleGraphSwitch = (graph: 'reactflow' | 'cytoscape' | 'd3') => {
    if (onGraphSelect) {
      onGraphSelect(graph);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={300}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Generating hierarchy data...
        </Typography>
      </Box>
    );
  }

  if (!result) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={300}>
        <Alert severity="info" sx={{ width: '100%' }}>
          Configure test parameters and click "Generate Hierarchy" to see results
        </Alert>
      </Box>
    );
  }

  const { entities, groups, positioned } = result;

  // Calculate summary statistics
  const totalEntities = entities.length;
  const totalGroups = groups.length;
  const entityTypes = entities.reduce((acc: Record<string, number>, entity: any) => {
    acc[entity.type] = (acc[entity.type] || 0) + 1;
    return acc;
  }, {});

  // Three-column layout mode - main content area
  if (layoutMode === 'three-column') {
    return (
      <Box>


        {/* Large Graph */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <LargeGraphDisplay result={result} selectedGraph={selectedGraph} />
        </Paper>
      </Box>
    );
  }

  // Sidebar graphs mode - small graphs stacked
  if (layoutMode === 'sidebar-graphs') {
    return (
      <Box>
        <Stack spacing={2}>
          <SmallGraphCard 
            result={result} 
            graphType="reactflow" 
            isActive={selectedGraph === 'reactflow'}
            onClick={() => handleGraphSwitch('reactflow')}
          />
          <SmallGraphCard 
            result={result} 
            graphType="cytoscape" 
            isActive={selectedGraph === 'cytoscape'}
            onClick={() => handleGraphSwitch('cytoscape')}
          />
          <SmallGraphCard 
            result={result} 
            graphType="d3" 
            isActive={selectedGraph === 'd3'}
            onClick={() => handleGraphSwitch('d3')}
          />
        </Stack>
      </Box>
    );
  }

  // Default layout mode - original tabbed interface
  return (
    <Box>


      {/* Tabbed Content */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Visual Map" />
          <Tab label="Entity Table" />
          <Tab label="Group Details" />
          <Tab label="ASCII Output" />
          <Tab label="Graphs" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <VisualMap positioned={positioned} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <EntityTable positioned={positioned} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <GroupDetails groups={groups} />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <ASCIIOutput asciiMap={result.asciiMap} />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <GraphsPanel result={result} />
      </TabPanel>
    </Box>
  );
}

function VisualMap({ positioned }: { positioned: unknown[] }) {
  if (!positioned || positioned.length === 0) {
    return <Alert severity="warning">No positioned entities to display</Alert>;
  }

  // Create a simple 2D visualization using CSS positioning
  const bounds = positioned.reduce(
    (acc, entity) => ({
      minX: Math.min(acc.minX, entity.x),
      maxX: Math.max(acc.maxX, entity.x),
      minY: Math.min(acc.minY, entity.y),
      maxY: Math.max(acc.maxY, entity.y),
    }),
    { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  );

  const width = Math.max(bounds.maxX - bounds.minX, 400);
  const height = Math.max(bounds.maxY - bounds.minY, 300);
  const scale = Math.min(600 / width, 400 / height);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        2D Visual Representation
      </Typography>
      <Paper 
        variant="outlined" 
        sx={{ 
          position: 'relative', 
          width: width * scale + 100, 
          height: height * scale + 100,
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}
      >
        {positioned.map((entity) => {
          const x = (entity.x - bounds.minX) * scale + 50;
          const y = (bounds.maxY - entity.y) * scale + 50; // Flip Y axis
          
          return (
            <Box
              key={entity.entityId}
              sx={{
                position: 'absolute',
                left: x - 15,
                top: y - 15,
                width: 30,
                height: 30,
                borderRadius: entity.type === 'Parent' ? '50%' : '4px',
                backgroundColor: entity.level === 0 ? '#1976d2' : entity.level === 1 ? '#42a5f5' : '#90caf9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.2)',
                  zIndex: 10,
                }
              }}
              title={`${entity.entityId} (${entity.type}) - Level ${entity.level}`}
            >
              {entity.entityId.replace('entity_', '')}
            </Box>
          );
        })}
      </Paper>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        🔵 Root Entities • 🔷 Level 1 • 🔸 Level 2+
      </Typography>
    </Box>
  );
}

function EntityTable({ positioned }: { positioned: any[] }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Entity ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Parent</TableCell>
            <TableCell>Group</TableCell>
            <TableCell align="right">X Position</TableCell>
            <TableCell align="right">Y Position</TableCell>
            <TableCell align="center">Level</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positioned.map((entity) => (
            <TableRow key={entity.entityId} hover>
              <TableCell component="th" scope="row">
                <Typography variant="body2" fontFamily="monospace">
                  {entity.entityId}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={entity.type} 
                  size="small" 
                  color={entity.type === 'Parent' ? 'primary' : 'default'}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" color={entity.parentId ? 'text.primary' : 'text.secondary'}>
                  {entity.parentId || 'ROOT'}
                </Typography>
              </TableCell>
              <TableCell>{entity.groupId}</TableCell>
              <TableCell align="right">{Math.round(entity.x)}</TableCell>
              <TableCell align="right">{Math.round(entity.y)}</TableCell>
              <TableCell align="center">
                <Chip label={entity.level} size="small" variant="outlined" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function GroupDetails({ groups }: { groups: any[] }) {
  return (
    <Stack spacing={2}>
      {groups.map((group, index) => (
        <Card key={group.id || index} variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {group.id}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Entities: <strong>{group.entities?.length || 0}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Root Entity: <strong>{group.rootEntityId}</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                {group.metrics && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Depth: <strong>{group.metrics.depth}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type Counts: {JSON.stringify(group.metrics.typeCounts)}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function ASCIIOutput({ asciiMap }: { asciiMap?: string }) {
  if (!asciiMap) {
    return <Alert severity="info">ASCII map not available</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        ASCII Representation
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
        <Typography 
          component="pre" 
          sx={{ 
            fontFamily: 'monospace', 
            fontSize: '12px', 
            lineHeight: 1.2,
            whiteSpace: 'pre',
            overflow: 'auto'
          }}
        >
          {asciiMap}
        </Typography>
      </Paper>
    </Box>
  );
}

function GraphsPanel({ result }: { result: HierarchyResult | null }) {
  if (!result) {
    return <Alert severity="info">No data available for graph visualization</Alert>;
  }

  // Calculate responsive dimensions
  const graphWidth = 380;
  const graphHeight = 280;

  const col2Styles = {
    border: "10px solid green",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={col2Styles}>
            <CardContent sx={{ p: 1 }}>
              <ReactFlowGraph 
                data={result} 
                width={graphWidth} 
                height={graphHeight} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={col2Styles}>
            <CardContent sx={{ p: 1 }}>
              <CytoscapeGraph 
                data={result} 
                width={graphWidth} 
                height={graphHeight} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={col2Styles}>
            <CardContent sx={{ p: 1 }}>
              <D3Graph 
                data={result} 
                width={graphWidth} 
                height={graphHeight} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function LargeGraphDisplay({ 
  result, 
  selectedGraph 
}: { 
  result: HierarchyResult | null; 
  selectedGraph: 'reactflow' | 'cytoscape' | 'd3';
}) {
  if (!result) {
    return <Alert severity="info">No data available for graph visualization</Alert>;
  }

  // Large graph dimensions - expanded for wider layout
  const graphWidth = "100%";
  const graphHeight = 500;

  const renderGraph = () => {
    switch (selectedGraph) {
      case 'reactflow':
        return <ReactFlowGraph data={result} width={graphWidth} height={graphHeight} />;
      case 'cytoscape':
        return <CytoscapeGraph data={result} width={graphWidth} height={graphHeight} />;
      case 'd3':
        return <D3Graph data={result} width={graphWidth} height={graphHeight} />;
      default:
        return <ReactFlowGraph data={result} width={graphWidth} height={graphHeight} />;
    }
  };


  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
        {selectedGraph === 'reactflow' ? 'React Flow' : selectedGraph === 'cytoscape' ? 'Cytoscape.js' : 'D3.js'} Visualization
      </Typography>
      {renderGraph()}
    </Box>
  );
}

function SmallGraphCard({ 
  result, 
  graphType, 
  isActive, 
  onClick 
}: { 
  result: HierarchyResult | null; 
  graphType: 'reactflow' | 'cytoscape' | 'd3';
  isActive: boolean;
  onClick: () => void;
}) {
  if (!result) {
    return null;
  }

  // Small graph dimensions
  const graphWidth = 200;
  const graphHeight = 150;

  const renderGraph = () => {
    switch (graphType) {
      case 'reactflow':
        return <ReactFlowGraph data={result} width={graphWidth} height={graphHeight} />;
      case 'cytoscape':
        return <CytoscapeGraph data={result} width={graphWidth} height={graphHeight} />;
      case 'd3':
        return <D3Graph data={result} width={graphWidth} height={graphHeight} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (graphType) {
      case 'reactflow':
        return 'React Flow';
      case 'cytoscape':
        return 'Cytoscape.js';
      case 'd3':
        return 'D3.js';
      default:
        return graphType;
    }
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        cursor: 'pointer',
        border: isActive ? '2px solid #1976d2' : '1px solid #e0e0e0',
        '&:hover': {
          borderColor: '#1976d2',
          boxShadow: 2
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 1 }}>
        <Typography variant="subtitle2" gutterBottom align="center">
          {getTitle()}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {renderGraph()}
        </Box>
      </CardContent>
    </Card>
  );
}