'use client';

import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

const SciChart3DBubble = dynamic(
  () => import('./SciChart3DBubbleSimple'),
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
        <div>Loading SciChart 3D visualization...</div>
      </Box>
    )
  }
);

interface SciChart3DBubbleWrapperProps {
  data: unknown;
  width?: number | string;
  height?: number | string;
}

export default function SciChart3DBubbleWrapper(props: SciChart3DBubbleWrapperProps) {
  return <SciChart3DBubble {...props} />;
}