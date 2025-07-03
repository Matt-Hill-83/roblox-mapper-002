'use client';

import { useState, ReactNode } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

interface GraphPanelProps {
  title: string;
  children: ReactNode;
  initialWidth?: string | number;
  initialHeight?: string | number;
}

export default function GraphPanel({ title, children, initialWidth = '100%', initialHeight = '100%' }: GraphPanelProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const panelWidth = isMaximized ? '100%' : '50%'; // R55.3: 50% width when not maximized
  const panelHeight = '100%'; // R55.1: fills container's height

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: panelHeight,
        width: panelWidth,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease-in-out',
        position: 'relative', // For positioning the button
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
          {title} Visualization
        </Typography>
        <IconButton onClick={toggleMaximize} size="small">
          {isMaximized ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, width: '100%', height: '100%' }}>
        {children}
      </Box>
    </Paper>
  );
}
