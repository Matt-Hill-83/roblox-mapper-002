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
  SciChartJsNavyTheme
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
    </Box>
  );
}