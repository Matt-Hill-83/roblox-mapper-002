'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import cytoscape, { Core } from 'cytoscape';
import dagre from 'cytoscape-dagre';
import cola from 'cytoscape-cola';
import { GraphDataFactory, CytoscapeData } from '../../lib/graphAdapters';

// Register Cytoscape extensions
if (typeof cytoscape !== 'undefined') {
  cytoscape.use(dagre);
  cytoscape.use(cola);
}

interface CytoscapeGraphProps {
  data: unknown;
  width?: number;
  height?: number;
}

export default function CytoscapeGraph({ data, width = 400, height = 300 }: CytoscapeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Destroy existing instance
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }

      if (!data) {
        setNodeCount(0);
        setEdgeCount(0);
        return;
      }

      // Transform data
      const graphData: CytoscapeData = GraphDataFactory.createCytoscapeData(data);
      
      // Count nodes and edges
      const nodes = graphData.elements.filter(el => !el.data.source);
      const edges = graphData.elements.filter(el => el.data.source);
      setNodeCount(nodes.length);
      setEdgeCount(edges.length);

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

  return (
    <Box sx={{ width, height, position: 'relative', border: '1px solid #e0e0e0', borderRadius: 1 }}>
      {/* Cytoscape container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff'
        }}
      />
      
      {/* Info panel */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 1,
          borderRadius: 1,
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography variant="caption" display="block" gutterBottom>
          <strong>Cytoscape.js</strong>
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Chip 
            label={`${nodeCount} nodes`} 
            size="small" 
            variant="outlined"
            color="primary"
          />
          <Chip 
            label={`${edgeCount} edges`} 
            size="small" 
            variant="outlined"
            color="secondary"
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Click nodes to highlight
        </Typography>
      </Box>
    </Box>
  );
}