'use client';

import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

const Highcharts3DGraph = dynamic(
  () => import('./Highcharts3DGraph'),
  { 
    ssr: false,
    loading: () => (
      <Box sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading 3D visualization...</div>
      </Box>
    )
  }
);

interface Highcharts3DGraphWrapperProps {
  data: unknown;
  width?: number | string;
  height?: number | string;
}

export default function Highcharts3DGraphWrapper(props: Highcharts3DGraphWrapperProps) {
  return <Highcharts3DGraph {...props} />;
}