/**
 * YearlyTrendChart Component
 * 
 * Renders a dual-series area chart showing yearly average prices
 * for Petrol and Diesel over time. Features include:
 * - Smooth curves with gradient area fills
 * - Data point markers for each year
 * - Value labels showing exact prices
 * - Toggle between line and bar view
 * - Export to image functionality
 * 
 * Uses Apache ECharts via echarts-for-react wrapper.
 */

import ReactECharts from 'echarts-for-react';
import { YearlyAverageData } from '../types';
import { useMemo } from 'react';

/** Props interface for YearlyTrendChart component */
interface YearlyTrendChartProps {
  /** Array of yearly average price data */
  data: YearlyAverageData[];
  /** Chart title displayed at the top */
  title: string;
}

export const YearlyTrendChart: React.FC<YearlyTrendChartProps> = ({ data, title }) => {
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
      data: ['Petrol', 'Diesel'],
      top: 30,
      textStyle: {
        color: '#B0B0B0',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      top: '15%',
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
      data: data.map((d) => d.year),
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
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: data.map((d) => d.petrolAvg),
        lineStyle: {
          color: '#FF6B6B',
          width: 3,
        },
        itemStyle: {
          color: '#FF6B6B',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
              { offset: 1, color: 'rgba(255, 107, 107, 0.05)' },
            ],
          },
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
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: data.map((d) => d.dieselAvg),
        lineStyle: {
          color: '#4ECDC4',
          width: 3,
        },
        itemStyle: {
          color: '#4ECDC4',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(78, 205, 196, 0.3)' },
              { offset: 1, color: 'rgba(78, 205, 196, 0.05)' },
            ],
          },
        },
        label: {
          show: true,
          position: 'bottom',
          color: '#4ECDC4',
          fontSize: 10,
          formatter: '₹{c}',
        },
      },
    ],
  }), [data, title]);

  return (
    <ReactECharts
      option={option}
      style={{ height: '400px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default YearlyTrendChart;
