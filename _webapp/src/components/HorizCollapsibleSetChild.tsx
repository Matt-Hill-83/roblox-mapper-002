import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Minimize, Maximize } from '@mui/icons-material';

interface HorizCollapsibleSetChildProps {
  id: string;
  title: string;
  isCollapsed?: boolean; // Made optional
  onToggle?: (id: string) => void; // Made optional
  minWidth?: string | number; // Add minWidth prop
  maxWidth?: string | number; // Add maxWidth prop
  children: React.ReactNode;
}

export default function HorizCollapsibleSetChild({
  id,
  title,
  isCollapsed,
  onToggle,
  minWidth,
  maxWidth,
  children,
}: HorizCollapsibleSetChildProps) {
  return (
    <Box
      sx={{
        flex: isCollapsed ? '0 0 50px' : '1 1 0',
        height: '100%',
        overflow: 'hidden', // Hide content when collapsed
        position: 'relative',
        border: '1px solid #ddd',
        transition: 'flex 0.3s ease-in-out',
        minWidth: isCollapsed ? '50px' : (minWidth || '200px'), // Use custom minWidth or default
        maxWidth: maxWidth || 'none', // Use custom maxWidth if provided
      }}
    >
      <IconButton
        onClick={() => onToggle(id)}
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 1000,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          '&:hover': { backgroundColor: '#f5f5f5' },
        }}
        size="small"
      >
        {isCollapsed ? <Maximize /> : <Minimize />}
      </IconButton>
      {!isCollapsed && (
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          {children}
        </Box>
      )}
      {isCollapsed && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            p: 1,
          }}
        >
          <Typography variant="subtitle1">{title}</Typography>
        </Box>
      )}
    </Box>
  );
}
