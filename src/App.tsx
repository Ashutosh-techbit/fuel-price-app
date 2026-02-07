/**
 * Fuel Price Analysis Dashboard - Main Application Component
 * 
 * This dashboard provides interactive visualizations of fuel prices
 * across India's major metro cities (Delhi, Mumbai, Chennai, Kolkata).
 * 
 * Features:
 * - Filter by Metro City, Fuel Type, and Year
 * - Summary statistics cards (Yearly Average, Highest/Lowest Month, Price Range)
 * - Monthly average RSP bar chart
 * - Dark/Light theme toggle
 * 
 * Data Source: NITI Aayog / PPAC (Petroleum Planning & Analysis Cell)
 */

import { useMemo, useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Grid,
  Select,
  Group,
  Card,
  Badge,
  Center,
  Stack,
  Alert,
  Box,
  ThemeIcon,
} from '@mantine/core';
import { useLoadData } from './useLoadData';
import {
  getAvailableYears,
  calculateMonthlyRSP,
  calculateYearlyStats,
} from './types';
import MonthlyBarChart from './components/MonthlyBarChart';
import './App.css';

/** Metro cities available in the dataset */
const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata'] as const;

/** Fuel types available */
const FUEL_TYPES = ['Petrol', 'Diesel'] as const;

/**
 * Main App component that orchestrates the dashboard layout
 * and manages filter states.
 */
function App() {
  // Load fuel price data using custom hook
  const { data, loading, error } = useLoadData();
  
  // Theme state - check localStorage for saved preference
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fuel-dashboard-theme');
    return saved === 'dark';
  });
  
  // Filter states
  const [selectedCity, setSelectedCity] = useState<'Delhi' | 'Mumbai' | 'Chennai' | 'Kolkata'>('Delhi');
  const [selectedFuelType, setSelectedFuelType] = useState<'Petrol' | 'Diesel'>('Diesel');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('fuel-dashboard-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  /**
   * Toggle between dark and light themes
   */
  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  // Extract unique years from data for year selector dropdown
  const availableYears = useMemo(() => {
    if (data.length === 0) return [];
    return getAvailableYears(data);
  }, [data]);

  // Auto-select year 2022 if available, otherwise the latest year
  useMemo(() => {
    if (availableYears.length > 0 && !selectedYear) {
      if (availableYears.includes('2022')) {
        setSelectedYear('2022');
      } else {
        setSelectedYear(availableYears[availableYears.length - 1]);
      }
    }
  }, [availableYears, selectedYear]);

  // Calculate monthly RSP data for selected filters
  const monthlyRSPData = useMemo(() => {
    if (data.length === 0 || !selectedYear) return [];
    return calculateMonthlyRSP(data, selectedCity, selectedFuelType, selectedYear);
  }, [data, selectedCity, selectedFuelType, selectedYear]);

  // Calculate yearly statistics from monthly data
  const yearlyStats = useMemo(() => {
    return calculateYearlyStats(monthlyRSPData);
  }, [monthlyRSPData]);

  if (loading) {
    return (
      <Center h="100vh" style={{ backgroundColor: 'var(--loader-bg)' }}>
        <Stack align="center" gap="xl">
          {/* Fuel Pump Loading Animation */}
          <Box className="fuel-pump-loader">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Pump Body */}
              <rect x="25" y="25" width="40" height="55" rx="4" fill="#E8590C"/>
              {/* Screen */}
              <rect x="30" y="30" width="30" height="22" rx="2" fill="#22B8CF"/>
              <path d="M30 30 L60 52" stroke="#B2F2FC" strokeWidth="2"/>
              {/* Lower Panel */}
              <rect x="25" y="56" width="40" height="24" fill="#FFB347"/>
              {/* Oil Drop */}
              <path d="M45 63 C45 63 40 70 40 74 C40 77 42 79 45 79 C48 79 50 77 50 74 C50 70 45 63 45 63Z" fill="#1C3A52"/>
              {/* Base */}
              <rect x="20" y="80" width="50" height="5" rx="1" fill="#FFB347"/>
              {/* Nozzle Hose */}
              <path d="M25 40 Q10 40 10 55 Q10 70 20 75" stroke="#1C3A52" strokeWidth="4" fill="none" strokeLinecap="round"/>
              {/* Nozzle */}
              <rect x="5" y="32" width="12" height="8" rx="2" fill="#E8590C" transform="rotate(-20 11 36)"/>
              <rect x="2" y="28" width="6" height="12" rx="1" fill="#E8590C" transform="rotate(-20 5 34)"/>
              {/* Animated fuel drop */}
              <g className="fuel-drop">
                <path d="M8 50 C8 50 5 55 5 58 C5 60 6.5 61 8 61 C9.5 61 11 60 11 58 C11 55 8 50 8 50Z" fill="#22B8CF">
                  <animate attributeName="opacity" values="0;1;1;0" dur="1.5s" repeatCount="indefinite"/>
                  <animateTransform attributeName="transform" type="translate" values="0,0;0,15;0,25" dur="1.5s" repeatCount="indefinite"/>
                </path>
              </g>
            </svg>
          </Box>
          <Text style={{ color: 'var(--text-dimmed)' }} size="lg" fw={500}>Loading fuel price data...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Error Loading Data">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box className="app-wrapper">
      {/* Header */}
      <Paper className="app-header" shadow="sm" radius={0}>
        <Container size="xl">
          <Group justify="space-between" py="md">
            <Group gap="md">
              <ThemeIcon size={48} radius="md" className="header-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Fuel Pump Icon */}
                  <rect x="4" y="4" width="10" height="14" rx="1" fill="white"/>
                  <rect x="5.5" y="5.5" width="7" height="5" rx="0.5" fill="#FF7F50"/>
                  <path d="M9 12.5 C9 12.5 7.5 14 7.5 15 C7.5 15.8 8.2 16.5 9 16.5 C9.8 16.5 10.5 15.8 10.5 15 C10.5 14 9 12.5 9 12.5Z" fill="#1C3A52"/>
                  <rect x="3" y="18" width="12" height="2" rx="0.5" fill="white"/>
                  <path d="M14 7 Q17 7 17 10 Q17 15 15 17" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <rect x="17" y="4" width="3" height="2" rx="0.5" fill="white"/>
                </svg>
              </ThemeIcon>
              <div>
                <Title order={2} className="header-title">Fuel Price Analysis</Title>
                <Text size="sm" c="dimmed">Retail Selling Price → Petrol & Diesel in Metro Cities</Text>
              </div>
            </Group>
            <Group gap="md">
              <Badge 
                size="lg" 
                variant="outline" 
                color="gray"
                leftSection={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                }
              >
                NITI Aayog / PPAC
              </Badge>
              {/* Theme Toggle Button */}
              <button 
                className="theme-toggle" 
                onClick={toggleTheme}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                  </svg>
                )}
              </button>
            </Group>
          </Group>
        </Container>
      </Paper>

      <Container size="xl" py="xl" className="main-content">
        {/* Filters Section */}
        <Paper shadow="xs" radius="md" p="xl" mb="xl" className="filters-section">
          <Group gap="xs" mb="lg">
            <ThemeIcon size={28} radius="md" color="blue" variant="light">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </ThemeIcon>
            <div>
              <Text fw={600}>Filters</Text>
              <Text size="xs" c="dimmed">Choose a city, fuel type, and year to visualize</Text>
            </div>
          </Group>
          
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
              <Select
                label={
                  <Group gap={4}>
                    <svg width="12" height="12" viewBox="0 0 24 24" className="filter-label-icon">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <Text size="sm">Metro City</Text>
                  </Group>
                }
                placeholder="Select city"
                data={CITIES.map((city) => ({ value: city, label: city }))}
                value={selectedCity}
                onChange={(value) => setSelectedCity(value as typeof selectedCity)}
                classNames={{ input: 'filter-input' }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
              <Select
                label={
                  <Group gap={4}>
                    <svg width="12" height="12" viewBox="0 0 24 24" className="filter-label-icon">
                      <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z"/>
                    </svg>
                    <Text size="sm">Fuel Type</Text>
                  </Group>
                }
                placeholder="Select fuel"
                data={FUEL_TYPES.map((fuel) => ({ value: fuel, label: fuel }))}
                value={selectedFuelType}
                onChange={(value) => setSelectedFuelType(value as typeof selectedFuelType)}
                classNames={{ input: 'filter-input' }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
              <Select
                label={
                  <Group gap={4}>
                    <svg width="12" height="12" viewBox="0 0 24 24" className="filter-label-icon">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                    </svg>
                    <Text size="sm">Year</Text>
                  </Group>
                }
                placeholder="Select year"
                data={availableYears.map((year) => ({ value: year, label: year }))}
                value={selectedYear}
                onChange={setSelectedYear}
                classNames={{ input: 'filter-input' }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Group justify="flex-end" h="100%" pb={4}>
                <Text size="sm" c="dimmed">Showing:</Text>
                <Badge variant="light" color="gray">{selectedCity}</Badge>
                <Badge variant="filled" color={selectedFuelType === 'Petrol' ? 'red' : 'cyan'}>
                  {selectedFuelType}
                </Badge>
                <Badge variant="light" color="gray">{selectedYear}</Badge>
              </Group>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid mb="xl">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="xs" padding="lg" radius="md" className="stat-card">
              <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed" fw={600} tt="uppercase">Yearly Average</Text>
                <ThemeIcon size={28} radius="md" color="blue" variant="light">
                  <Text size="sm" fw={700}>₹</Text>
                </ThemeIcon>
              </Group>
              <Text size="xl" fw={700} className="stat-value">
                ₹{yearlyStats.yearlyAverage.toFixed(2)}
              </Text>
              <Text size="xs" c="dimmed">across {yearlyStats.monthCount} months</Text>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="xs" padding="lg" radius="md" className="stat-card">
              <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed" fw={600} tt="uppercase">Highest Month</Text>
                <ThemeIcon size={28} radius="md" color="red" variant="light">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                </ThemeIcon>
              </Group>
              <Text size="xl" fw={700} className="stat-value stat-high">
                ₹{yearlyStats.highestPrice.toFixed(2)}
              </Text>
              <Text size="xs" c="dimmed">in {yearlyStats.highestMonth}</Text>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="xs" padding="lg" radius="md" className="stat-card">
              <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed" fw={600} tt="uppercase">Lowest Month</Text>
                <ThemeIcon size={28} radius="md" color="teal" variant="light">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
                  </svg>
                </ThemeIcon>
              </Group>
              <Text size="xl" fw={700} className="stat-value stat-low">
                ₹{yearlyStats.lowestPrice.toFixed(2)}
              </Text>
              <Text size="xs" c="dimmed">in {yearlyStats.lowestMonth}</Text>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="xs" padding="lg" radius="md" className="stat-card">
              <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed" fw={600} tt="uppercase">Price Range</Text>
                <ThemeIcon size={28} radius="md" color="violet" variant="light">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                  </svg>
                </ThemeIcon>
              </Group>
              <Text size="xl" fw={700} className="stat-value stat-range">
                ₹{yearlyStats.priceRange.toFixed(0)}
              </Text>
              <Text size="xs" c="dimmed">max - min spread</Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Monthly Bar Chart */}
        <Paper shadow="xs" radius="md" p="xl" className="chart-section">
          <Group justify="space-between" mb="md">
            <Group gap="xs">
              <ThemeIcon size={28} radius="md" color="blue" variant="light">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
              </ThemeIcon>
              <div>
                <Text fw={600}>Monthly Average RSP</Text>
                <Text size="xs" c="dimmed">
                  {selectedFuelType} prices in {selectedCity}, {selectedYear}
                </Text>
              </div>
            </Group>
            <Group gap="md">
              <Text size="sm" c="dimmed">Avg: ₹{yearlyStats.yearlyAverage.toFixed(2)}/L</Text>
              <Badge color={selectedFuelType === 'Petrol' ? 'red' : 'cyan'} variant="light">
                {selectedFuelType}
              </Badge>
            </Group>
          </Group>
          
          <MonthlyBarChart 
            data={monthlyRSPData} 
            yearlyAverage={yearlyStats.yearlyAverage}
            fuelType={selectedFuelType}
            darkMode={darkMode}
          />
        </Paper>

        {/* Footer */}
        <Paper mt="xl" p="md" radius="md" className="footer" ta="center">
          <Text c="dimmed" size="sm">
            Data Source: NITI Aayog / PPAC (Petroleum Planning & Analysis Cell), Government of India
          </Text>
          <Text c="dimmed" size="xs" mt="xs">
            Built with React, TypeScript, Mantine UI, and Apache ECharts
          </Text>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
