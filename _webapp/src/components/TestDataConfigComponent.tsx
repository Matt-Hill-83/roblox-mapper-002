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
import { TestDataConfig } from "../app/(pages)/hierarchy-tester/page";
import { useState } from "react";

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

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Total Nodes"
                type="number"
                size="small"
                value={config.totalNodes}
                onChange={handleInputChange("totalNodes")}
                error={!!errors.totalNodes}
                helperText={errors.totalNodes ? "Must be 1-1000" : ""}
                InputProps={{ inputProps: { min: 1, max: 1000 } }}
                fullWidth
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Depth"
                type="number"
                size="small"
                value={config.maxDepth}
                onChange={handleInputChange("maxDepth")}
                error={!!errors.maxDepth}
                helperText={errors.maxDepth ? "Must be 1-15" : ""}
                InputProps={{ inputProps: { min: 1, max: 15 } }}
                fullWidth
                disabled={isLoading}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Network Structure */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Network Structure</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Branching Min"
                    type="number"
                    size="small"
                    value={config.branchingMin}
                    onChange={handleInputChange("branchingMin")}
                    error={!!errors.branchingMin}
                    InputProps={{ inputProps: { min: 1, max: 20 } }}
                    fullWidth
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Branching Max"
                    type="number"
                    size="small"
                    value={config.branchingMax}
                    onChange={handleInputChange("branchingMax")}
                    error={!!errors.branchingMax}
                    InputProps={{ inputProps: { min: 1, max: 20 } }}
                    fullWidth
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>

              <Box>
                <Typography variant="caption" gutterBottom>
                  Cross-Tree Connections: {config.crossTreeConnections}%
                </Typography>
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
                <Typography variant="caption" gutterBottom>
                  Clustering Coefficient: {config.clusteringCoeff}%
                </Typography>
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
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Entity Types"
                    type="number"
                    size="small"
                    value={config.entityTypes}
                    onChange={handleInputChange("entityTypes")}
                    error={!!errors.entityTypes}
                    helperText={errors.entityTypes ? "Must be 2-10" : ""}
                    InputProps={{ inputProps: { min: 2, max: 10 } }}
                    fullWidth
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Hub Nodes"
                    type="number"
                    size="small"
                    value={config.hubNodes}
                    onChange={handleInputChange("hubNodes")}
                    error={!!errors.hubNodes}
                    helperText={errors.hubNodes ? "Must be 0-10" : ""}
                    InputProps={{ inputProps: { min: 0, max: 10 } }}
                    fullWidth
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>
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
