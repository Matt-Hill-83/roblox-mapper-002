'use client';

import { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid 
} from '@mui/material';
import TestDataConfigComponent from '../../../components/TestDataConfigComponent';
import TreeDisplay from '../../../components/TreeDisplay';

export interface TestDataConfig {
  numberOfNodes: number;
  numberOfConnectedChains: number;
  depthOfLongestChain: number;
}

export interface HierarchyResult {
  entities: unknown[];
  groups: unknown[];
  positioned: unknown[];
  asciiMap?: string;
}

export default function HierarchyTesterPage() {
  const [config, setConfig] = useState<TestDataConfig>({
    numberOfNodes: 10,
    numberOfConnectedChains: 2,
    depthOfLongestChain: 3
  });
  
  const [result, setResult] = useState<HierarchyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfigSubmit = async (newConfig: TestDataConfig) => {
    setIsLoading(true);
    setConfig(newConfig);
    
    try {
      // Call API to generate hierarchy data
      const response = await fetch('/api/hierarchy-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate hierarchy data');
      }
      
      const hierarchyResult = await response.json();
      setResult(hierarchyResult);
    } catch (error) {
      console.error('Error generating hierarchy:', error);
      // For now, generate mock data if API fails
      setResult({
        entities: [],
        groups: [],
        positioned: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Hierarchical Data Tester
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Configure test parameters and visualize hierarchical graph structures
      </Typography>

      <Grid container spacing={4}>
        {/* Configuration Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Test Configuration
            </Typography>
            <TestDataConfigComponent 
              initialConfig={config}
              onSubmit={handleConfigSubmit}
              isLoading={isLoading}
            />
          </Paper>
        </Grid>

        {/* Results Panel */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, minHeight: 400 }}>
            <Typography variant="h5" gutterBottom>
              Hierarchy Visualization
            </Typography>
            <TreeDisplay 
              result={result}
              isLoading={isLoading}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}