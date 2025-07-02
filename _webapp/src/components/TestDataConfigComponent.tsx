'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import { TestDataConfig } from '../app/(pages)/hierarchy-tester/page';

interface TestDataConfigComponentProps {
  initialConfig: TestDataConfig;
  onSubmit: (config: TestDataConfig) => void;
  isLoading?: boolean;
}

export default function TestDataConfigComponent({
  initialConfig,
  onSubmit,
  isLoading = false
}: TestDataConfigComponentProps) {
  const [config, setConfig] = useState<TestDataConfig>(initialConfig);
  const [errors, setErrors] = useState<Partial<TestDataConfig>>({});

  const validateConfig = (newConfig: TestDataConfig): boolean => {
    const newErrors: Partial<TestDataConfig> = {};

    // Validate number of nodes
    if (newConfig.numberOfNodes < 1 || newConfig.numberOfNodes > 100) {
      newErrors.numberOfNodes = 1; // Using number as error flag
    }

    // Validate number of connected chains
    if (newConfig.numberOfConnectedChains < 1 || newConfig.numberOfConnectedChains > 10) {
      newErrors.numberOfConnectedChains = 1;
    }

    // Validate depth of longest chain
    if (newConfig.depthOfLongestChain < 1 || newConfig.depthOfLongestChain > 10) {
      newErrors.depthOfLongestChain = 1;
    }

    // Validate that chains can fit within total nodes
    if (newConfig.numberOfConnectedChains > newConfig.numberOfNodes) {
      newErrors.numberOfConnectedChains = 1;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TestDataConfig) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value) || 0;
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    
    // Clear error for this field if it becomes valid
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateConfig(config)) {
      onSubmit(config);
    }
  };

  const getHelperText = (field: keyof TestDataConfig): string => {
    switch (field) {
      case 'numberOfNodes':
        return errors[field] 
          ? 'Must be between 1 and 100' 
          : 'Total number of entities to generate';
      case 'numberOfConnectedChains':
        return errors[field] 
          ? 'Must be between 1 and 10, and ≤ number of nodes' 
          : 'Number of separate hierarchy trees';
      case 'depthOfLongestChain':
        return errors[field] 
          ? 'Must be between 1 and 10' 
          : 'Maximum levels in the deepest tree';
      default:
        return '';
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary">
          Configure the parameters for generating test hierarchical data
        </Typography>

        <TextField
          label="Number of Nodes"
          type="number"
          value={config.numberOfNodes}
          onChange={handleInputChange('numberOfNodes')}
          error={!!errors.numberOfNodes}
          helperText={getHelperText('numberOfNodes')}
          InputProps={{
            inputProps: { min: 1, max: 100 },
            startAdornment: <InputAdornment position="start">📊</InputAdornment>
          }}
          fullWidth
          disabled={isLoading}
        />

        <TextField
          label="Number of Connected Chains"
          type="number"
          value={config.numberOfConnectedChains}
          onChange={handleInputChange('numberOfConnectedChains')}
          error={!!errors.numberOfConnectedChains}
          helperText={getHelperText('numberOfConnectedChains')}
          InputProps={{
            inputProps: { min: 1, max: 10 },
            startAdornment: <InputAdornment position="start">🔗</InputAdornment>
          }}
          fullWidth
          disabled={isLoading}
        />

        <TextField
          label="Depth of Longest Chain"
          type="number"
          value={config.depthOfLongestChain}
          onChange={handleInputChange('depthOfLongestChain')}
          error={!!errors.depthOfLongestChain}
          helperText={getHelperText('depthOfLongestChain')}
          InputProps={{
            inputProps: { min: 1, max: 10 },
            startAdornment: <InputAdornment position="start">📏</InputAdornment>
          }}
          fullWidth
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading || Object.keys(errors).length > 0}
          startIcon={isLoading ? <CircularProgress size={20} /> : '🚀'}
          fullWidth
        >
          {isLoading ? 'Generating...' : 'Generate Hierarchy'}
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