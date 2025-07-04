import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import { GraphAdapters } from '../../lib/graphAdapters';
import { generateEntityTypeColors } from '../../utils/colorUtils';

// Initialize 3D module
Highcharts3D(Highcharts);

interface Highcharts3DGraphProps {
  data: unknown;
  width?: number | string;
  height?: number | string;
}

export default function Highcharts3DGraph({ data, width = '100%', height = '100%' }: Highcharts3DGraphProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [options, setOptions] = useState<Highcharts.Options>({});

  useEffect(() => {
    if (!data) {
      setOptions({});
      return;
    }

    // Extract config from data
    const config = (data as any)?.config ? {
      entityTypes: (data as any).config.entityTypes || 4,
      connectorTypes: (data as any).config.connectorTypes || 3
    } : undefined;

    // Transform data to Highcharts format
    const highchartsData = GraphAdapters.createHighcharts3DData(data, config);
    
    // Generate colors
    const entityColors = config ? generateEntityTypeColors(config.entityTypes) : generateEntityTypeColors(4);

    // Create series by entity type
    const seriesByType: { [key: string]: any[] } = {};
    
    highchartsData.nodes.forEach((node: any) => {
      if (!seriesByType[node.type]) {
        seriesByType[node.type] = [];
      }
      seriesByType[node.type].push({
        x: node.x,
        y: node.y,
        z: node.z,
        name: node.label,
        id: node.id,
        color: node.color
      });
    });

    // Create series array
    const series = Object.entries(seriesByType).map(([type, data]) => ({
      name: type,
      data: data,
      type: 'scatter3d',
      marker: {
        radius: 8,
        symbol: 'circle'
      }
    }));

    // Set chart options
    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'scatter3d',
        options3d: {
          enabled: true,
          alpha: 10,
          beta: 30,
          depth: 400,
          viewDistance: 5,
          fitToPlot: false,
          frame: {
            bottom: { size: 1, color: 'rgba(0,0,0,0.05)' },
            back: { size: 1, color: 'rgba(0,0,0,0.05)' },
            side: { size: 1, color: 'rgba(0,0,0,0.05)' }
          }
        },
        backgroundColor: 'transparent',
        animation: false
      },
      title: {
        text: ''
      },
      plotOptions: {
        scatter3d: {
          width: 10,
          height: 10,
          depth: 10,
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
              fontSize: '10px'
            }
          }
        }
      },
      xAxis: {
        gridLineWidth: 1,
        title: { text: 'X' }
      },
      yAxis: {
        gridLineWidth: 1,
        title: { text: 'Y' }
      },
      zAxis: {
        gridLineWidth: 1,
        title: { text: 'Z' }
      },
      legend: {
        enabled: true
      },
      credits: {
        enabled: false
      },
      series: series as any,
      tooltip: {
        pointFormat: '<b>{point.name}</b><br/>X: {point.x}<br/>Y: {point.y}<br/>Z: {point.z}'
      }
    } as any;

    setOptions(chartOptions);
  }, [data]);

  return (
    <Box sx={{ width, height, position: 'relative' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </Box>
  );
}