'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
  Controls,
  Background,
  MiniMap,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Typography, Chip } from '@mui/material';
import { GraphDataFactory, ReactFlowData } from '../../lib/graphAdapters';

interface ReactFlowGraphProps {
  data: unknown;
  width?: number;
  height?: number;
}

export default function ReactFlowGraph({ data, width = 400, height = 300 }: ReactFlowGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState<string | null>(null);

  // Transform data when it changes
  useEffect(() => {
    try {
      if (!data) {
        setNodes([]);
        setEdges([]);
        return;
      }

      const graphData: ReactFlowData = GraphDataFactory.createReactFlowData(data);
      setNodes(graphData.nodes as Node[]);
      setEdges(graphData.edges as Edge[]);
      setError(null);
    } catch (err) {
      console.error('Error transforming data for React Flow:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setNodes([]);
      setEdges([]);
    }
  }, [data, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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
          React Flow Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width, height, border: '1px solid #e0e0e0', borderRadius: 1 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false
        }}
        attributionPosition="bottom-left"
      >
        <Controls 
          position="top-left"
          style={{ 
            button: { 
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }
          }}
        />
        <MiniMap 
          style={{
            height: 80,
            width: 100,
            backgroundColor: '#f5f5f5'
          }}
          zoomable
          pannable
        />
        <Background 
          variant="dots" 
          gap={12} 
          size={1}
          color="#e0e0e0"
        />
        
        <Panel position="top-right">
          <Box sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            padding: 1, 
            borderRadius: 1,
            backdropFilter: 'blur(4px)'
          }}>
            <Typography variant="caption" display="block" gutterBottom>
              <strong>React Flow</strong>
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Chip 
                label={`${nodes.length} nodes`} 
                size="small" 
                variant="outlined"
                color="primary"
              />
              <Chip 
                label={`${edges.length} edges`} 
                size="small" 
                variant="outlined"
                color="secondary"
              />
            </Box>
          </Box>
        </Panel>
      </ReactFlow>
    </Box>
  );
}