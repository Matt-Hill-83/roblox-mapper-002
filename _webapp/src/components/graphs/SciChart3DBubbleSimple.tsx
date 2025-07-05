'use client';

import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { GraphAdapters } from '../../lib/graphAdapters';
import { SciChartReact } from 'scichart-react';
import {
  SciChart3DSurface,
  NumericAxis3D,
  Vector3,
  ScatterRenderableSeries3D,
  XyzDataSeries3D,
  SpherePointMarker3D,
  MouseWheelZoomModifier3D,
  OrbitModifier3D,
  ResetCamera3DModifier,
  NumberRange,
  parseColorToUIntArgb,
  SciChartJsNavyTheme,
  PointLineRenderableSeries3D
} from 'scichart';

// Load WASM files from CDN
SciChart3DSurface.loadWasmFromCDN();

interface SciChart3DBubbleSimpleProps {
  data: unknown;
  width?: number | string;
  height?: number | string;
}

export default function SciChart3DBubbleSimple({ data, width = '100%', height = '100%' }: SciChart3DBubbleSimpleProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!data) return;

    // Extract config from data
    const config = (data as any)?.config ? {
      entityTypes: (data as any).config.entityTypes || 4,
      connectorTypes: (data as any).config.connectorTypes || 3
    } : undefined;

    // Transform data
    const graphData = GraphAdapters.createHighcharts3DData(data, config);
    setChartData(graphData);
  }, [data]);

  const initChart = async (rootElement: string | HTMLDivElement) => {
    if (!chartData) return;

    try {
      const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme()
      });

      // Calculate data ranges for better axis scaling
      const xMin = Math.min(...chartData.nodes.map((n: any) => n.x));
      const xMax = Math.max(...chartData.nodes.map((n: any) => n.x));
      const yMin = Math.min(...chartData.nodes.map((n: any) => n.y));
      const yMax = Math.max(...chartData.nodes.map((n: any) => n.y));
      const zMin = Math.min(...chartData.nodes.map((n: any) => n.z));
      const zMax = Math.max(...chartData.nodes.map((n: any) => n.z));
      
      // Add padding to ranges
      const xPadding = (xMax - xMin) * 0.1 || 10;
      const yPadding = (yMax - yMin) * 0.1 || 10;
      const zPadding = (zMax - zMin) * 0.1 || 5;

      // Create X, Y, Z axes with fitted ranges
      sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X Axis",
        visibleRange: new NumberRange(xMin - xPadding, xMax + xPadding)
      });
      
      sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis", 
        visibleRange: new NumberRange(yMin - yPadding, yMax + yPadding)
      });
      
      sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z Axis",
        visibleRange: new NumberRange(zMin - zPadding, zMax + zPadding)
      });

      // Add interactivity modifiers
      sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(),
        new OrbitModifier3D(),
        new ResetCamera3DModifier()
      );

      // Create data series
      const xValues: number[] = [];
      const yValues: number[] = [];
      const zValues: number[] = [];
      const metadata: any[] = [];

      chartData.nodes.forEach((node: any) => {
        xValues.push(node.x);
        yValues.push(node.y);
        zValues.push(node.z);
        
        // Create metadata for each point
        metadata.push({
          vertexColor: parseColorToUIntArgb(node.color),
          pointScale: 1 + Math.random() * 0.5,  // Scale factor for bubble size
          label: node.label,
          type: node.type
        });
      });

      // Create the data series
      const dataSeries = new XyzDataSeries3D(wasmContext, {
        xValues,
        yValues,
        zValues,
        metadata,
        dataSeriesName: "3D Bubbles"
      });

      // Create the scatter series with sphere markers
      const scatterSeries = new ScatterRenderableSeries3D(wasmContext, {
        dataSeries,
        pointMarker: new SpherePointMarker3D(wasmContext, {
          size: 10,
          fill: "#4682B4",
          opacity: 0.8
        }),
        opacity: 0.8
      });

      sciChart3DSurface.renderableSeries.add(scatterSeries);

      // Add edge rendering
      if (chartData.links && chartData.links.length > 0) {
        // Create a map of node positions for quick lookup
        const nodePositions = new Map<string, { x: number; y: number; z: number }>();
        chartData.nodes.forEach((node: any) => {
          nodePositions.set(node.id, { x: node.x, y: node.y, z: node.z });
        });

        // Create edge colors based on connection type
        const edgeColors = new Map<string, string>([
          ['parentChild', '#4CAF50'],
          ['uses', '#2196F3'],
          ['owns', '#FF9800'],
          ['maintains', '#9C27B0'],
          ['implements', '#F44336'],
          ['extends', '#00BCD4'],
          ['depends_on', '#FFEB3B'],
          ['configures', '#795548'],
          ['monitors', '#607D8B'],
          ['delegates_to', '#E91E63'],
          ['inherits_from', '#3F51B5']
        ]);

        // Group edges by type for different colors
        const edgesByType = new Map<string, any[]>();
        chartData.links.forEach((link: any) => {
          const fromPos = nodePositions.get(link.from);
          const toPos = nodePositions.get(link.to);
          
          if (fromPos && toPos) {
            const type = link.type || 'default';
            if (!edgesByType.has(type)) {
              edgesByType.set(type, []);
            }
            edgesByType.get(type)!.push({ from: fromPos, to: toPos });
          }
        });

        // Create a line series for each edge type
        edgesByType.forEach((edges, type) => {
          // For PointLineRenderableSeries3D with individual line segments
          // we need to create separate series for each edge when isLineStrip is false
          edges.forEach((edge, index) => {
            const xValues = [edge.from.x, edge.to.x];
            const yValues = [edge.from.y, edge.to.y];
            const zValues = [edge.from.z, edge.to.z];

            const edgeDataSeries = new XyzDataSeries3D(wasmContext, {
              xValues,
              yValues,
              zValues,
              dataSeriesName: `Edge-${type}-${index}`
            });

            const edgeColor = edgeColors.get(type) || '#666666';
            const lineSeries = new PointLineRenderableSeries3D(wasmContext, {
              dataSeries: edgeDataSeries,
              stroke: edgeColor,
              strokeThickness: 1.5,
              opacity: 0.6,
              isLineStrip: true  // Connect the two points
            });

            sciChart3DSurface.renderableSeries.add(lineSeries);
          });
        });
      }

      // Configure camera
      sciChart3DSurface.camera.position = new Vector3(200, 200, 200);
      sciChart3DSurface.camera.target = new Vector3(0, 0, 0);
      
      // Return with the expected property name
      return { sciChartSurface: sciChart3DSurface };
    } catch (error) {
      console.error("Error initializing SciChart 3D:", error);
      throw error;
    }
  };

  if (!chartData) {
    return (
      <Box sx={{ width, height, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading chart data...</div>
      </Box>
    );
  }

  return (
    <Box sx={{ width, height, position: 'relative' }}>
      <SciChartReact
        style={{ width: '100%', height: '100%' }}
        initChart={initChart}
      />
      {/* Edge type legend */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: 1,
          borderRadius: 1,
          fontSize: '0.75rem',
          maxHeight: '200px',
          overflowY: 'auto'
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Edge Types:</div>
        <div style={{ color: '#4CAF50' }}>● Parent-Child</div>
        <div style={{ color: '#2196F3' }}>● Uses</div>
        <div style={{ color: '#FF9800' }}>● Owns</div>
        <div style={{ color: '#9C27B0' }}>● Maintains</div>
        <div style={{ color: '#F44336' }}>● Implements</div>
        <div style={{ color: '#00BCD4' }}>● Extends</div>
      </Box>
    </Box>
  );
}