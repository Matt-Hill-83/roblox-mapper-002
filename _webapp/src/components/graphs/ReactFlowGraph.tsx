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
import { GraphAdapters, ReactFlowData } from '../../lib/graphAdapters';

interface ReactFlowGraphProps {
  data: unknown;
  width?: number | string;
  height?: number | string;
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

      // Extract config from data if available
      const config = (data as any)?.config ? {
        entityTypes: (data as any).config.entityTypes || 4,
        connectorTypes: (data as any).config.connectorTypes || 3
      } : undefined;
      
      const graphData: ReactFlowData = GraphAdapters.createReactFlowData(data, config);
      
      // Debug: Check for invalid values in node positions (NaN, null, undefined)
      const invalidNodes = graphData.nodes.filter(node => 
        node.position.x == null || node.position.y == null || 
        isNaN(node.position.x) || isNaN(node.position.y)
      );
      
      if (invalidNodes.length > 0) {
        console.error('ReactFlow: Found nodes with NaN positions:', invalidNodes);
        console.error('Full node details:', invalidNodes.map(node => ({
          id: node.id,
          position: node.position,
          data: node.data
        })));
        
        // Fix invalid positions (null, NaN, undefined)
        const fixedNodes = graphData.nodes.map(node => ({
          ...node,
          position: {
            x: (node.position.x == null || isNaN(node.position.x)) ? 0 : node.position.x,
            y: (node.position.y == null || isNaN(node.position.y)) ? 0 : node.position.y
          }
        }));
        
        setNodes(fixedNodes as Node[]);
      } else {
        setNodes(graphData.nodes as Node[]);
      }
      
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

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (window.confirm(`Are you sure you want to delete node ${node.data.label}?`)) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
    }
  }, [setNodes, setEdges]);

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

  // Ensure numeric dimensions for proper rendering
  const numericWidth = typeof width === 'string' ? '100%' : Math.max(width || 400, 100);
  const numericHeight = typeof height === 'string' ? '100%' : Math.max(height || 300, 100);

  return (
    <Box sx={{ 
      width: numericWidth, 
      height: numericHeight, 
      border: '1px solid #e0e0e0', 
      borderRadius: 1,
      minWidth: 100,
      minHeight: 100
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false
        }}
        attributionPosition="bottom-left"
        style={{ width: '100%', height: '100%' }}
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