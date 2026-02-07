/**
 * MonthlyBarChart Component
 * 
 * Renders a vertical bar chart showing monthly average RSP (Retail Selling Price)
 * for a specific city, fuel type, and year. Features include:
 * - Gradient-filled bars with rounded tops
 * - Value labels above each bar
 * - Horizontal average line with dashed styling
 * - Interactive tooltips
 * - Light/Dark theme support
 * 
 * Uses Apache ECharts via echarts-for-react wrapper.
 */

import ReactECharts from 'echarts-for-react';
import { MonthlyRSPData } from '../types';
import { useMemo } from 'react';

/** Props interface for MonthlyBarChart component */
interface MonthlyBarChartProps {
  /** Array of monthly RSP data */
  data: MonthlyRSPData[];
  /** Yearly average for the reference line */
  yearlyAverage: number;
  /** Selected fuel type for styling */
  fuelType: 'Petrol' | 'Diesel';
  /** Dark mode flag for theme-aware styling */
  darkMode?: boolean;
}

/**
 * MonthlyBarChart displays monthly fuel prices as a bar chart
 * with a horizontal average line for reference.
 */
export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ 
  data, 
  yearlyAverage,
  fuelType,
  darkMode = false
}) => {
  // Color based on fuel type
  const barColor = fuelType === 'Petrol' ? '#FF6B6B' : '#22B8CF';
  
  // Theme-aware colors
  const theme = useMemo(() => ({
    textColor: darkMode ? '#ced4da' : '#666',
    textSecondary: darkMode ? '#909296' : '#999',
    axisLineColor: darkMode ? '#373A40' : '#e0e0e0',
    splitLineColor: darkMode ? '#2c2e33' : '#f0f0f0',
    tooltipBg: darkMode ? '#25262b' : '#fff',
    tooltipBorder: darkMode ? '#373A40' : '#e0e0e0',
    tooltipText: darkMode ? '#f1f3f5' : '#333',
  }), [darkMode]);
  
  const option = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      borderWidth: 1,
      textStyle: {
        color: theme.tooltipText,
      },
      formatter: (params: Array<{name: string; value: number; seriesType: string}>) => {
        const barData = params.find(p => p.seriesType === 'bar');
        if (!barData) return '';
        return `<strong>${barData.name}</strong><br/>Avg RSP: <span style="color: ${barColor}; font-weight: bold;">₹${barData.value.toFixed(2)}</span> /litre`;
      },
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '5%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.month),
      axisLabel: {
        color: theme.textColor,
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: theme.axisLineColor,
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: '₹ / Litre',
      nameTextStyle: {
        color: theme.textSecondary,
        fontSize: 12,
        padding: [0, 0, 0, -30],
      },
      min: 0,
      axisLabel: {
        color: theme.textSecondary,
        formatter: '₹{value}',
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: theme.splitLineColor,
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: 'RSP',
        type: 'bar',
        barWidth: '50%',
        data: data.map((d) => d.avgPrice),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: barColor },
              { offset: 1, color: fuelType === 'Petrol' ? '#FFB4B4' : '#96F2FC' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        label: {
          show: true,
          position: 'top',
          color: theme.textColor,
          fontSize: 11,
          formatter: '₹{c}',
        },
      },
      // Average line
      {
        name: 'Avg',
        type: 'line',
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: theme.textSecondary,
            type: 'dashed',
            width: 1,
          },
          label: {
            show: true,
            position: 'end',
            formatter: 'Avg',
            color: theme.textSecondary,
            fontSize: 11,
          },
          data: [
            {
              yAxis: yearlyAverage,
            },
          ],
        },
      },
    ],
  }), [data, yearlyAverage, barColor, fuelType, theme]);

  return (
    <ReactECharts
      option={option}
      style={{ height: '350px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default MonthlyBarChart;
