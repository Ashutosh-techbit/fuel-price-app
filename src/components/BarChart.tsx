/**
 * BarChart Component
 * 
 * Renders a grouped bar chart comparing Petrol and Diesel prices
 * across metro cities for a selected year. Features include:
 * - Grouped bars showing both fuel types side by side
 * - Gradient fills with rounded corners
 * - Value labels displayed on top of each bar
 * - Toggle between bar and line view
 * - Export to image functionality
 * 
 * Uses Apache ECharts via echarts-for-react wrapper.
 */

import ReactECharts from 'echarts-for-react';
import { CityComparisonData } from '../types';
import { useMemo } from 'react';

/** Props interface for BarChart component */
interface BarChartProps {
  /** Array of city comparison data with petrol/diesel prices */
  data: CityComparisonData[];
  /** Chart title displayed at the top */
  title: string;
  /** Selected year displayed as subtitle */
  year: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title, year }) => {
  const option = useMemo(() => ({
    title: {
      text: title,
      subtext: `Year: ${year}`,
      left: 'center',
      textStyle: {
        color: '#E0E0E0',
        fontSize: 18,
        fontWeight: 'bold',
      },
      subtextStyle: {
        color: '#999',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#777',
      textStyle: {
        color: '#fff',
      },
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: Array<{seriesName: string; value: number; name: string}>) => {
        let tooltip = `<strong>${params[0].name}</strong><br/>`;
        params.forEach((param) => {
          tooltip += `${param.seriesName}: ₹${param.value.toFixed(2)}/L<br/>`;
        });
        return tooltip;
      },
    },
    legend: {
      data: ['Petrol', 'Diesel'],
      top: 50,
      textStyle: {
        color: '#B0B0B0',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      top: '20%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: { title: 'Save' },
        magicType: {
          type: ['line', 'bar'],
          title: { line: 'Line', bar: 'Bar' },
        },
      },
      iconStyle: {
        borderColor: '#B0B0B0',
      },
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.city),
      axisLabel: {
        color: '#B0B0B0',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#555',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'Avg. Price (₹/L)',
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
        name: 'Petrol',
        type: 'bar',
        barWidth: '35%',
        data: data.map((d) => d.petrol),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#FF6B6B' },
              { offset: 1, color: '#FF8E8E' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        label: {
          show: true,
          position: 'top',
          color: '#FF6B6B',
          fontSize: 10,
          formatter: '₹{c}',
        },
      },
      {
        name: 'Diesel',
        type: 'bar',
        barWidth: '35%',
        data: data.map((d) => d.diesel),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#4ECDC4' },
              { offset: 1, color: '#6EE7DE' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        label: {
          show: true,
          position: 'top',
          color: '#4ECDC4',
          fontSize: 10,
          formatter: '₹{c}',
        },
      },
    ],
  }), [data, title, year]);

  return (
    <ReactECharts
      option={option}
      style={{ height: '400px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default BarChart;
