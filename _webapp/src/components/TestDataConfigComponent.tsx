"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import { TestDataConfig } from "../app/(pages)/hierarchy-tester/page";
import { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";

interface TestDataConfigComponentProps {
  initialConfig: TestDataConfig;
  onSubmit: (config: TestDataConfig) => void;
  isLoading?: boolean;
}

export default function TestDataConfigComponent({
  initialConfig,
  onSubmit,
  isLoading = false,
}: TestDataConfigComponentProps) {
  const [config, setConfig] = useState<TestDataConfig>(initialConfig);
  const [errors, setErrors] = useState<Partial<TestDataConfig>>({});

  // Sync internal state with prop changes (e.g., when clicking suggestions table)
  useEffect(() => {
    setConfig(initialConfig);
    setErrors({}); // Clear any validation errors when config changes externally
  }, [initialConfig]);

  const validateConfig = (newConfig: TestDataConfig): boolean => {
    const newErrors: Partial<TestDataConfig> = {};

    // Validate total nodes
    if (newConfig.totalNodes < 1 || newConfig.totalNodes > 1000) {
      newErrors.totalNodes = 1;
    }

    // Validate max depth
    if (newConfig.maxDepth < 1 || newConfig.maxDepth > 15) {
      newErrors.maxDepth = 1;
    }

    // Validate branching factors
    if (newConfig.branchingMin < 1 || newConfig.branchingMin > 20) {
      newErrors.branchingMin = 1;
    }
    if (
      newConfig.branchingMax < 1 ||
      newConfig.branchingMax > 20 ||
      newConfig.branchingMax < newConfig.branchingMin
    ) {
      newErrors.branchingMax = 1;
    }

    // Validate entity types
    if (newConfig.entityTypes < 2 || newConfig.entityTypes > 10) {
      newErrors.entityTypes = 1;
    }

    // Validate connector types
    if (newConfig.connectorTypes < 1 || newConfig.connectorTypes > 8) {
      newErrors.connectorTypes = 1;
    }

    // Validate hub nodes
    if (newConfig.hubNodes < 0 || newConfig.hubNodes > 10) {
      newErrors.hubNodes = 1;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof TestDataConfig) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "networkDensity"
          ? event.target.value
          : parseInt(event.target.value) || 0;
      const newConfig = { ...config, [field]: value };
      setConfig(newConfig);

      // Clear error for this field if it becomes valid
      if (errors[field]) {
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
      }
    };

  const handleSliderChange =
    (field: keyof TestDataConfig) =>
    (event: Event, value: number | number[]) => {
      const newConfig = { ...config, [field]: value as number };
      setConfig(newConfig);
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateConfig(config)) {
      onSubmit(config);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Stack spacing={2}>
        <Typography variant="h6" gutterBottom>
          Graph Configuration
        </Typography>

        {/* Core Parameters */}
        <Box>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Core Parameters
          </Typography>

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <TextField
                label="Total Nodes"
                type="number"
                size="small"
                value={config.totalNodes}
                onChange={handleInputChange("totalNodes")}
                error={!!errors.totalNodes}
                helperText={errors.totalNodes ? "Must be 1-1000" : ""}
                slotProps={{ htmlInput: { min: 1, max: 1000 } }}
                fullWidth
                disabled={isLoading}
              />
              <Tooltip title="Total number of nodes to generate in the graph (1-1000). Larger values create more complex visualizations but may impact performance.">
                <IconButton size="small" sx={{ mt: 1 }}>
                  <InfoIcon fontSize="small" color="action" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <TextField
                label="Max Depth"
                type="number"
                size="small"
                value={config.maxDepth}
                onChange={handleInputChange("maxDepth")}
                error={!!errors.maxDepth}
                helperText={errors.maxDepth ? "Must be 1-15" : ""}
                slotProps={{ htmlInput: { min: 1, max: 15 } }}
                fullWidth
                disabled={isLoading}
              />
              <Tooltip title="Maximum depth of the hierarchical tree (1-15). Higher values create deeper, more vertical structures.">
                <IconButton size="small" sx={{ mt: 1 }}>
                  <InfoIcon fontSize="small" color="action" />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Network Structure */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Network Structure</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TextField
                  label="Branching Min"
                  type="number"
                  size="small"
                  value={config.branchingMin}
                  onChange={handleInputChange("branchingMin")}
                  error={!!errors.branchingMin}
                  slotProps={{ htmlInput: { min: 1, max: 20 } }}
                  fullWidth
                  disabled={isLoading}
                />
                <Tooltip title="Minimum number of child nodes each parent can have (1-20). Controls the narrowest branching in your hierarchy.">
                  <IconButton size="small" sx={{ mt: 1 }}>
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TextField
                  label="Branching Max"
                  type="number"
                  size="small"
                  value={config.branchingMax}
                  onChange={handleInputChange("branchingMax")}
                  error={!!errors.branchingMax}
                  slotProps={{ htmlInput: { min: 1, max: 20 } }}
                  fullWidth
                  disabled={isLoading}
                />
                <Tooltip title="Maximum number of child nodes each parent can have (1-20). Controls the widest branching in your hierarchy.">
                  <IconButton size="small" sx={{ mt: 1 }}>
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="caption">
                    Cross-Tree Connections: {config.crossTreeConnections}%
                  </Typography>
                  <Tooltip title="Percentage of additional connections between different hierarchy trees (0-100%). Higher values create more interconnected networks.">
                    <InfoIcon fontSize="small" color="action" />
                  </Tooltip>
                </Box>
                <Slider
                  value={config.crossTreeConnections}
                  onChange={handleSliderChange("crossTreeConnections")}
                  min={0}
                  max={100}
                  step={5}
                  size="small"
                  disabled={isLoading}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="caption">
                    Clustering Coefficient: {config.clusteringCoeff}%
                  </Typography>
                  <Tooltip title="How tightly clustered the nodes are (0-100%). Higher values create more dense local connections and groups.">
                    <InfoIcon fontSize="small" color="action" />
                  </Tooltip>
                </Box>
                <Slider
                  value={config.clusteringCoeff}
                  onChange={handleSliderChange("clusteringCoeff")}
                  min={0}
                  max={100}
                  step={10}
                  size="small"
                  disabled={isLoading}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Network Density</InputLabel>
                  <Select
                    value={config.networkDensity}
                    label="Network Density"
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        networkDensity: e.target.value as
                          | "sparse"
                          | "medium"
                          | "dense",
                      })
                    }
                    disabled={isLoading}
                  >
                    <MenuItem value="sparse">Sparse</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="dense">Dense</MenuItem>
                  </Select>
                </FormControl>
                <Tooltip title="Overall density of connections in the network. Sparse = few connections, Medium = moderate connections, Dense = many connections.">
                  <IconButton size="small" sx={{ mt: 1 }}>
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Advanced Features */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Advanced Features</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TextField
                  label="Entity Types"
                  type="number"
                  size="small"
                  value={config.entityTypes}
                  onChange={handleInputChange("entityTypes")}
                  error={!!errors.entityTypes}
                  helperText={errors.entityTypes ? "Must be 2-10" : ""}
                  slotProps={{ htmlInput: { min: 2, max: 10 } }}
                  fullWidth
                  disabled={isLoading}
                />
                <Tooltip title="Number of different entity types to generate (2-10). More types create visual variety with different colors and shapes.">
                  <IconButton size="small" sx={{ mt: 1 }}>
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TextField
                  label="Connector Types"
                  type="number"
                  size="small"
                  value={config.connectorTypes}
                  onChange={handleInputChange("connectorTypes")}
                  error={!!errors.connectorTypes}
                  helperText={errors.connectorTypes ? "Must be 1-8" : ""}
                  slotProps={{ htmlInput: { min: 1, max: 8 } }}
                  fullWidth
                  disabled={isLoading}
                />
                <Tooltip title="Number of different connector types to generate (1-8). More types create visual variety with different line styles and colors.">
                  <IconButton size="small" sx={{ mt: 1 }}>
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TextField
                  label="Hub Nodes"
                  type="number"
                  size="small"
                  value={config.hubNodes}
                  onChange={handleInputChange("hubNodes")}
                  error={!!errors.hubNodes}
                  helperText={errors.hubNodes ? "Must be 0-10" : ""}
                  slotProps={{ htmlInput: { min: 0, max: 10 } }}
                  fullWidth
                  disabled={isLoading}
                />
                <Tooltip title="Number of highly-connected hub nodes (0-10). Hub nodes have many connections and act as central points in the network.">
                  <IconButton size="small" sx={{ mt: 1 }}>
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Button
          type="submit"
          variant="contained"
          size="medium"
          disabled={isLoading || Object.keys(errors).length > 0}
          startIcon={isLoading ? <CircularProgress size={20} /> : "🚀"}
          fullWidth
        >
          {isLoading ? "Generating..." : "Generate Graph"}
        </Button>

        {Object.keys(errors).length > 0 && (
          <FormHelperText error>
            Please fix the validation errors above
          </FormHelperText>
        )}
      </Stack>
    </Box>
  );
}
