'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import cytoscape, { Core } from 'cytoscape';
import dagre from 'cytoscape-dagre';
import cola from 'cytoscape-cola';
import { GraphAdapters, CytoscapeData } from '../../lib/graphAdapters';

// Register Cytoscape extensions
if (typeof cytoscape !== 'undefined') {
  cytoscape.use(dagre);
  cytoscape.use(cola);
}

interface CytoscapeGraphProps {
  data: unknown;
  width?: number | string;
  height?: number | string;
}

export default function CytoscapeGraph({ data, width = 400, height = 300 }: CytoscapeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Destroy existing instance
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }

      if (!data) {
        return;
      }

      // Transform data
      // Extract config from data if available
      const config = (data as any)?.config ? {
        entityTypes: (data as any).config.entityTypes || 4,
        connectorTypes: (data as any).config.connectorTypes || 3
      } : undefined;
      
      const graphData: CytoscapeData = GraphAdapters.createCytoscapeData(data, config);

      // Initialize Cytoscape
      cyRef.current = cytoscape({
        container: containerRef.current,
        elements: graphData.elements,
        style: graphData.style,
        layout: {
          name: 'preset',
          fit: true,
          padding: 20
        },
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false,
        autoungrabify: false,
        wheelSensitivity: 0.1,
        minZoom: 0.1,
        maxZoom: 3
      });

      // Add interaction handlers
      cyRef.current.on('tap', 'node', function(evt) {
        const node = evt.target;
        console.log('Clicked node:', node.data());
        
        // Highlight connected nodes
        const connectedEdges = node.connectedEdges();
        const connectedNodes = connectedEdges.connectedNodes();
        
        // Reset all styles
        cyRef.current?.elements().removeClass('highlighted faded');
        
        // Highlight selection
        node.addClass('highlighted');
        connectedNodes.addClass('highlighted');
        connectedEdges.addClass('highlighted');
        
        // Fade non-connected elements
        cyRef.current?.elements().not(node).not(connectedNodes).not(connectedEdges).addClass('faded');
      });

      cyRef.current.on('tap', function(evt) {
        if (evt.target === cyRef.current) {
          // Clicked on background - reset highlight
          cyRef.current?.elements().removeClass('highlighted faded');
        }
      });

      // Add additional styles for interaction
      cyRef.current.style()
        .selector('.highlighted')
        .style({
          'border-width': 4,
          'border-opacity': 1,
          'opacity': 1,
          'z-index': 10
        })
        .selector('.faded')
        .style({
          'opacity': 0.3
        })
        .selector('edge.highlighted')
        .style({
          'width': 4,
          'opacity': 1,
          'z-index': 10
        })
        .update();

      setError(null);

    } catch (err) {
      console.error('Error initializing Cytoscape:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }

    // Cleanup function
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [data]);

  // Handle resize
  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.resize();
      cyRef.current.fit(undefined, 20);
    }
  }, [width, height]);

  if (error) {
    return (
      <Box 
        sx={{ 
          width, 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          backgroundColor: '#fafafa'
        }}
      >
        <Typography color="error" variant="body2">
          Cytoscape Error: {error}
        </Typography>
      </Box>
    );
  }

  // Ensure numeric dimensions for proper rendering
  const numericWidth = typeof width === 'string' ? '100%' : Math.max(width || 400, 100);
  const numericHeight = typeof height === 'string' ? '100%' : Math.max(height || 300, 100);

  return (
    <Box sx={{ 
      width: numericWidth, 
      height: numericHeight, 
      position: 'relative', 
      border: '1px solid #e0e0e0', 
      borderRadius: 1,
      minWidth: 100,
      minHeight: 100
    }}>
      {/* Cytoscape container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          minWidth: '100px',
          minHeight: '100px'
        }}
      />
      
    </Box>
  );
}