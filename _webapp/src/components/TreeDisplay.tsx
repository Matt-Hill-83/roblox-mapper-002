"use client";

import { useState } from "react";
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
} from "@mui/material";
import { HierarchyResult, TestDataConfig } from "../app/(pages)/hierarchy-tester/page";
import VisualMap from "./VisualMap";
import SuggestionsTable from "./SuggestionsTable";

interface TreeDisplayProps {
  result: HierarchyResult | null;
  isLoading?: boolean;
  onConfigurationSelect?: (config: TestDataConfig) => void;
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
  onConfigurationSelect,
}: TreeDisplayProps) {
  const [tabValue, setTabValue] = useState(0); // Default to Suggestions tab (index 0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight={300}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Generating hierarchy data...
        </Typography>
      </Box>
    );
  }

  if (!result) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight={300}
      >
        <Alert severity="info" sx={{ width: "100%" }}>
          Configure test parameters and click &quot;Generate Hierarchy&quot; to see
          results
        </Alert>
      </Box>
    );
  }

  const { groups, positioned } = result;

  

  // Default layout mode - original tabbed interface
  return (
    <Box>
      {/* Tabbed Content */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Suggestions" />
          <Tab label="Entity Table" />
          <Tab label="Group Details" />
          <Tab label="ASCII Output" />
          <Tab label="Visual Map" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {onConfigurationSelect ? (
          <SuggestionsTable onConfigurationSelect={onConfigurationSelect} />
        ) : (
          <Alert severity="info">Configuration selection not available</Alert>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <EntityTable positioned={positioned as Entity[]} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <GroupDetails groups={groups as Group[]} />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <ASCIIOutput asciiMap={result.asciiMap} />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <VisualMap positioned={positioned} />
      </TabPanel>
    </Box>
  );
}

interface Entity {
  entityId: string;
  type: string;
  parentId?: string;
  groupId: string;
  x: number;
  y: number;
  level: number;
}

function EntityTable({ positioned }: { positioned: Entity[] }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
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
                  color={entity.type === "Parent" ? "primary" : "default"}
                />
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color={entity.parentId ? "text.primary" : "text.secondary"}
                >
                  {entity.parentId || "ROOT"}
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

interface Group {
  id: string;
  entities?: unknown[];
  rootEntityId: string;
  metrics?: {
    depth: number;
    typeCounts: Record<string, number>;
  };
}

function GroupDetails({ groups }: { groups: Group[] }) {
  return (
    <Stack spacing={2}>
      {groups.map((group, index) => (
        <Card key={group.id || index} variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {group.id}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Entities: <strong>{group.entities?.length || 0}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Root Entity: <strong>{group.rootEntityId}</strong>
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
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
              </Box>
            </Box>
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
      <Paper variant="outlined" sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
        <Typography
          component="pre"
          sx={{
            fontFamily: "monospace",
            fontSize: "12px",
            lineHeight: 1.2,
            whiteSpace: "pre",
            overflow: "auto",
          }}
        >
          {asciiMap}
        </Typography>
      </Paper>
    </Box>
  );
}


