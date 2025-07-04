'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import * as d3 from 'd3';
import { GraphAdapters, D3Data, D3Adapter } from '../../lib/graphAdapters';
import { generateEntityTypeColors, generateConnectorTypeStyles } from '../../utils/colorUtils';

interface D3GraphProps {
  data: unknown;
  width?: number | string;
  height?: number | string;
}

export default function D3Graph({ data, width = 400, height = 300 }: D3GraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [nodeCount, setNodeCount] = useState(0);
  const [linkCount, setLinkCount] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    try {
      // Clear previous content
      d3.select(svgRef.current).selectAll('*').remove();

      if (!data) {
        setNodeCount(0);
        setLinkCount(0);
        return;
      }

      // Transform data
      // Extract config from data if available
      const config = (data as any)?.config ? {
        entityTypes: (data as any).config.entityTypes || 4,
        connectorTypes: (data as any).config.connectorTypes || 3
      } : undefined;
      
      const graphData: D3Data = GraphAdapters.createD3Data(data, config);
      setNodeCount(graphData.nodes.length);
      setLinkCount(graphData.links.length);
      
      // Generate colors for use in rendering
      const entityColors = config ? generateEntityTypeColors(config.entityTypes) : generateEntityTypeColors(4);
      const connectorStyles = config ? generateConnectorTypeStyles(config.connectorTypes) : generateConnectorTypeStyles(3);

      if (graphData.nodes.length === 0) return;

      // Set up SVG
      const svg = d3.select(svgRef.current);
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      
      // Ensure SVG takes full available space
      svg.attr('width', '100%').attr('height', '100%');
      
      // Use the actual client dimensions for internal calculations
      const innerWidth = (svgRef.current?.clientWidth || 400) - margin.left - margin.right;
      const innerHeight = (svgRef.current?.clientHeight || 300) - margin.top - margin.bottom;

      // Create main group
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create zoom behavior
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom);

      // Ensure nodes have valid initial positions
      const nodesWithPositions = graphData.nodes.map((node, index) => ({
        ...node,
        x: isNaN(node.x) ? (index * 50) % innerWidth : node.x,
        y: isNaN(node.y) ? Math.floor(index / Math.ceil(innerWidth / 50)) * 50 : node.y,
        fx: null, // Allow free movement
        fy: null  // Allow free movement
      }));

      // Create simulation
      const simulation = d3.forceSimulation(nodesWithPositions)
        .force('link', d3.forceLink(graphData.links)
          .id((d: any) => d.id)
          .distance(80)
          .strength(1)
        )
        .force('charge', d3.forceManyBody()
          .strength(-300)
        )
        .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
        .force('collision', d3.forceCollide()
          .radius((d: any) => D3Adapter.getNodeRadius(d) + 5)
        );

      // Add arrow markers for links
      const defs = svg.append('defs');
      
      defs.append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#666');

      // Create links
      const link = g.selectAll('.link')
        .data(graphData.links)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke', (d: any) => D3Adapter.getLinkColor(d))
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)')
        .attr('opacity', 0.6);

      // Create node groups
      const node = g.selectAll('.node')
        .data(nodesWithPositions)
        .enter().append('g')
        .attr('class', 'node')
        .style('cursor', 'pointer');

      // Add circles for nodes
      node.append('circle')
        .attr('r', (d: any) => D3Adapter.getNodeRadius(d))
        .attr('fill', (d: any) => D3Adapter.getNodeColor(d))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

      // Add labels
      node.append('text')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .style('fill', '#fff')
        .style('pointer-events', 'none')
        .text((d: any) => d.label);

      // Add tooltips
      const tooltip = d3.select('body').append('div')
        .attr('class', 'd3-tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('z-index', 1000);

      // Add mouse events
      node
        .on('mouseover', function(event, d: any) {
          d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', D3Adapter.getNodeRadius(d) * 1.2)
            .attr('stroke-width', 3);

          tooltip
            .style('visibility', 'visible')
            .html(`
              <strong>${d.id}</strong><br/>
              Type: ${d.entityType}<br/>
              Level: ${d.level}<br/>
              Group: ${d.groupId}
            `);
        })
        .on('mousemove', function(event) {
          tooltip
            .style('top', (event.pageY + 10) + 'px')
            .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', function(event, d: any) {
          d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', D3Adapter.getNodeRadius(d))
            .attr('stroke-width', 2);

          tooltip.style('visibility', 'hidden');
        })
        .on('click', function(event, d: any) {
          // Highlight connected nodes
          const connectedNodeIds = new Set<string>();
          
          // Find connected links
          link.style('opacity', (linkData: any) => {
            if (linkData.source.id === d.id || linkData.target.id === d.id) {
              connectedNodeIds.add(linkData.source.id);
              connectedNodeIds.add(linkData.target.id);
              return 1;
            }
            return 0.1;
          });

          // Highlight connected nodes
          node.style('opacity', (nodeData: any) => {
            return connectedNodeIds.has(nodeData.id) ? 1 : 0.3;
          });
        });

      // Add double-click to reset
      svg.on('dblclick.zoom', function() {
        // Reset highlights
        link.style('opacity', 0.6);
        node.style('opacity', 1);
        
        // Reset zoom
        svg.transition().duration(750).call(
          zoom.transform,
          d3.zoomIdentity
        );
      });

      // Add drag behavior
      const drag = d3.drag<any, any>()
        .on('start', function(event, d: any) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = isNaN(d.x) ? 0 : d.x;
          d.fy = isNaN(d.y) ? 0 : d.y;
        })
        .on('drag', function(event, d: any) {
          d.fx = isNaN(event.x) ? d.fx : event.x;
          d.fy = isNaN(event.y) ? d.fy : event.y;
        })
        .on('end', function(event, d: any) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        });

      node.call(drag);

      // Update positions on tick
      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => isNaN(d.source.x) ? 0 : d.source.x)
          .attr('y1', (d: any) => isNaN(d.source.y) ? 0 : d.source.y)
          .attr('x2', (d: any) => isNaN(d.target.x) ? 0 : d.target.x)
          .attr('y2', (d: any) => isNaN(d.target.y) ? 0 : d.target.y);

        node
          .attr('transform', (d: any) => {
            const x = isNaN(d.x) ? 0 : d.x;
            const y = isNaN(d.y) ? 0 : d.y;
            return `translate(${x},${y})`;
          });
      });

      // Cleanup function
      return () => {
        simulation.stop();
        tooltip.remove();
      };

      setError(null);

    } catch (err) {
      console.error('Error initializing D3 graph:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [data, width, height]);

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
          D3 Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width, height, position: 'relative', border: '1px solid #e0e0e0', borderRadius: 1 }}>
      {/* SVG container */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ backgroundColor: '#ffffff' }}
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
          <strong>D3.js</strong>
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Chip 
            label={`${nodeCount} nodes`} 
            size="small" 
            variant="outlined"
            color="primary"
          />
          <Chip 
            label={`${linkCount} links`} 
            size="small" 
            variant="outlined"
            color="secondary"
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Drag nodes • Double-click to reset
        </Typography>
      </Box>
    </Box>
  );
}