/**
 * LineChart Component
 * 
 * Renders a multi-series line chart showing monthly fuel price trends
 * across four metro cities. Features include:
 * - Data zoom slider for exploring historical data
 * - Smooth curves with gradient area fills
 * - Interactive tooltips showing prices in INR/L
 * - Export to image functionality
 * 
 * Uses Apache ECharts via echarts-for-react wrapper.
 */

import ReactECharts from 'echarts-for-react';
import { MonthlyAverageData } from '../types';
import { useMemo } from 'react';

/** Props interface for LineChart component */
interface LineChartProps {
  /** Array of monthly average price data for all cities */
  data: MonthlyAverageData[];
  /** Chart title displayed at the top */
  title: string;
  /** Current fuel type selection (for styling) */
  fuelType: 'Petrol' | 'Diesel';
}

/** City-specific color scheme for visual distinction */
const colors = {
  delhi: '#FF6B6B',     // Coral red
  mumbai: '#4ECDC4',    // Teal
  chennai: '#45B7D1',   // Sky blue
  kolkata: '#96C93D',   // Lime green
};

export const LineChart: React.FC<LineChartProps> = ({ data, title, fuelType }) => {
  const option = useMemo(() => ({
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: '#E0E0E0',
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#777',
      textStyle: {
        color: '#fff',
      },
      formatter: (params: Array<{seriesName: string; value: number; axisValue: string}>) => {
        let tooltip = `<strong>${params[0].axisValue}</strong><br/>`;
        params.forEach((param) => {
          tooltip += `${param.seriesName}: ₹${param.value.toFixed(2)}/L<br/>`;
        });
        return tooltip;
      },
    },
    legend: {
      data: ['Delhi', 'Mumbai', 'Chennai', 'Kolkata'],
      top: 30,
      textStyle: {
        color: '#B0B0B0',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: { title: 'Save' },
        dataZoom: { title: { zoom: 'Zoom', back: 'Reset' } },
        restore: { title: 'Restore' },
      },
      iconStyle: {
        borderColor: '#B0B0B0',
      },
    },
    dataZoom: [
      {
        type: 'slider',
        start: 80,
        end: 100,
        bottom: 10,
        textStyle: {
          color: '#B0B0B0',
        },
      },
      {
        type: 'inside',
        start: 80,
        end: 100,
      },
    ],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((d) => d.month),
      axisLabel: {
        color: '#B0B0B0',
        rotate: 45,
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          color: '#555',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'Price (₹/L)',
      nameTextStyle: {
        color: '#B0B0B0',
      },
      axisLabel: {
        color: '#B0B0B0',
        formatter: '₹{value}',
      },
      axisLine: {
        lineStyle: {
          color: '#555',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#333',
        },
      },
    },
    series: [
      {
        name: 'Delhi',
        type: 'line',
        smooth: true,
        data: data.map((d) => d.delhi),
        lineStyle: { color: colors.delhi, width: 2 },
        itemStyle: { color: colors.delhi },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${colors.delhi}40` },
              { offset: 1, color: `${colors.delhi}05` },
            ],
          },
        },
      },
      {
        name: 'Mumbai',
        type: 'line',
        smooth: true,
        data: data.map((d) => d.mumbai),
        lineStyle: { color: colors.mumbai, width: 2 },
        itemStyle: { color: colors.mumbai },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${colors.mumbai}40` },
              { offset: 1, color: `${colors.mumbai}05` },
            ],
          },
        },
      },
      {
        name: 'Chennai',
        type: 'line',
        smooth: true,
        data: data.map((d) => d.chennai),
        lineStyle: { color: colors.chennai, width: 2 },
        itemStyle: { color: colors.chennai },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${colors.chennai}40` },
              { offset: 1, color: `${colors.chennai}05` },
            ],
          },
        },
      },
      {
        name: 'Kolkata',
        type: 'line',
        smooth: true,
        data: data.map((d) => d.kolkata),
        lineStyle: { color: colors.kolkata, width: 2 },
        itemStyle: { color: colors.kolkata },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${colors.kolkata}40` },
              { offset: 1, color: `${colors.kolkata}05` },
            ],
          },
        },
      },
    ],
  }), [data, title, fuelType]);

  return (
    <ReactECharts
      option={option}
      style={{ height: '450px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default LineChart;
