/**
 * Type definitions and utility functions for fuel price data analytics.
 * This module provides interfaces for data structures and pure functions
 * for calculating averages and comparisons across cities and time periods.
 */

/**
 * Represents a single fuel price record from the CSV data.
 * Each record contains information about fuel price at a specific date,
 * city, and fuel type.
 */
export interface FuelPriceRecord {
  /** Country code (typically 'India') */
  country: string;
  /** Year extracted from the date */
  year: string;
  /** Month name */
  month: string;
  /** Full date in YYYY-MM-DD format */
  date: string;
  /** Type of fuel - either Petrol or Diesel */
  product: 'Petrol' | 'Diesel';
  /** Metro city where the price was recorded */
  city: 'Delhi' | 'Mumbai' | 'Chennai' | 'Kolkata';
  /** Retail selling price in INR per litre */
  price: number;
}

/**
 * Aggregated monthly average price data for all four metro cities.
 * Used for rendering the line chart showing price trends over time.
 */
export interface MonthlyAverageData {
  /** Month in YYYY-MM format for chronological sorting */
  month: string;
  /** Average price in Delhi for the month */
  delhi: number;
  /** Average price in Mumbai for the month */
  mumbai: number;
  /** Average price in Chennai for the month */
  chennai: number;
  /** Average price in Kolkata for the month */
  kolkata: number;
}

/**
 * Yearly average prices comparing Petrol vs Diesel.
 * Used for rendering the yearly trend comparison chart.
 */
export interface YearlyAverageData {
  /** Year in YYYY format */
  year: string;
  /** Average petrol price across all cities for the year */
  petrolAvg: number;
  /** Average diesel price across all cities for the year */
  dieselAvg: number;
}

/**
 * City-wise comparison data for a specific year.
 * Used for rendering the bar chart comparing prices across cities.
 */
export interface CityComparisonData {
  /** Name of the metro city */
  city: string;
  /** Average petrol price for the city in the selected year */
  petrol: number;
  /** Average diesel price for the city in the selected year */
  diesel: number;
}

/**
 * Monthly RSP data for a single city/fuel/year combination.
 * Used for the monthly bar chart display.
 */
export interface MonthlyRSPData {
  /** Month name (e.g., 'Jan', 'Feb') */
  month: string;
  /** Month number for sorting (1-12) */
  monthNum: number;
  /** Average RSP for the month */
  avgPrice: number;
}

/**
 * Statistics for a city/fuel/year combination.
 * Used for displaying stat cards.
 */
export interface YearlyStats {
  /** Yearly average price */
  yearlyAverage: number;
  /** Highest monthly average price */
  highestPrice: number;
  /** Month with highest price */
  highestMonth: string;
  /** Lowest monthly average price */
  lowestPrice: number;
  /** Month with lowest price */
  lowestMonth: string;
  /** Price range (highest - lowest) */
  priceRange: number;
  /** Number of months with data */
  monthCount: number;
}

/**
 * Parses a date string into a JavaScript Date object.
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns JavaScript Date object
 */
export const parseDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

/**
 * Helper function to calculate the arithmetic mean of an array.
 * Returns 0 for empty arrays to handle edge cases gracefully.
 * Rounds result to 2 decimal places for currency display.
 * 
 * @param arr - Array of numbers to average
 * @returns Average value rounded to 2 decimal places
 */
const calculateAverage = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return Number((sum / arr.length).toFixed(2));
};

/**
 * Extracts the year portion from a date string.
 * Uses substring for O(1) time complexity instead of creating Date objects.
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Year as a 4-character string (e.g., '2024')
 */
export const getYear = (dateStr: string): string => {
  return dateStr.substring(0, 4);
};

/**
 * Extracts year and month from a date string.
 * Used for grouping data by month in aggregation functions.
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Year-month string in YYYY-MM format
 */
export const getYearMonth = (dateStr: string): string => {
  return dateStr.substring(0, 7);
};

/**
 * Calculates monthly average prices for a specific fuel type across all cities.
 * Uses a Map for O(1) lookups and single-pass aggregation for efficiency.
 * 
 * Time Complexity: O(n) where n is the number of records
 * Space Complexity: O(m) where m is the number of unique months
 * 
 * @param data - Array of fuel price records
 * @param product - Fuel type to filter ('Petrol' or 'Diesel')
 * @returns Array of monthly averages sorted chronologically
 */
export const calculateMonthlyAverages = (
  data: FuelPriceRecord[],
  product: 'Petrol' | 'Diesel'
): MonthlyAverageData[] => {
  // Filter data by product type first to reduce iterations
  const filteredData = data.filter((d) => d.product === product);
  
  // Use Map for O(1) lookups when grouping by month
  const monthlyMap = new Map<string, { delhi: number[]; mumbai: number[]; chennai: number[]; kolkata: number[] }>();
  
  filteredData.forEach((record) => {
    const yearMonth = getYearMonth(record.date);
    
    if (!monthlyMap.has(yearMonth)) {
      monthlyMap.set(yearMonth, { delhi: [], mumbai: [], chennai: [], kolkata: [] });
    }
    
    const monthData = monthlyMap.get(yearMonth)!;
    
    switch (record.city) {
      case 'Delhi':
        monthData.delhi.push(record.price);
        break;
      case 'Mumbai':
        monthData.mumbai.push(record.price);
        break;
      case 'Chennai':
        monthData.chennai.push(record.price);
        break;
      case 'Kolkata':
        monthData.kolkata.push(record.price);
        break;
    }
  });
  
  const result: MonthlyAverageData[] = [];
  
  const sortedMonths = Array.from(monthlyMap.keys()).sort();
  
  sortedMonths.forEach((month) => {
    const monthData = monthlyMap.get(month)!;
    
    result.push({
      month,
      delhi: calculateAverage(monthData.delhi),
      mumbai: calculateAverage(monthData.mumbai),
      chennai: calculateAverage(monthData.chennai),
      kolkata: calculateAverage(monthData.kolkata),
    });
  });
  
  return result;
};

/**
 * Calculates yearly average prices for both Petrol and Diesel.
 * Aggregates all city data to provide a national yearly average.
 * 
 * Time Complexity: O(n) - single pass through data
 * Space Complexity: O(y) where y is the number of unique years
 * 
 * @param data - Array of fuel price records
 * @returns Array of yearly averages sorted chronologically
 */
export const calculateYearlyAverages = (data: FuelPriceRecord[]): YearlyAverageData[] => {
  // Map for efficient year-based grouping
  const yearlyMap = new Map<string, { petrol: number[]; diesel: number[] }>();
  
  data.forEach((record) => {
    const year = getYear(record.date);
    
    if (!yearlyMap.has(year)) {
      yearlyMap.set(year, { petrol: [], diesel: [] });
    }
    
    const yearData = yearlyMap.get(year)!;
    
    if (record.product === 'Petrol') {
      yearData.petrol.push(record.price);
    } else {
      yearData.diesel.push(record.price);
    }
  });
  
  const result: YearlyAverageData[] = [];
  
  const sortedYears = Array.from(yearlyMap.keys()).sort();
  
  sortedYears.forEach((year) => {
    const yearData = yearlyMap.get(year)!;
    
    result.push({
      year,
      petrolAvg: calculateAverage(yearData.petrol),
      dieselAvg: calculateAverage(yearData.diesel),
    });
  });
  
  return result;
};

/**
 * Calculates city-wise price comparison for a specific year.
 * Returns average Petrol and Diesel prices for each metro city.
 * 
 * Time Complexity: O(n) where n is records for the selected year
 * Space Complexity: O(1) - fixed number of cities
 * 
 * @param data - Array of fuel price records
 * @param year - Year to filter data (e.g., '2024')
 * @returns Array of city comparison data
 */
export const calculateCityComparison = (
  data: FuelPriceRecord[],
  year: string
): CityComparisonData[] => {
  // Fixed list of metro cities for consistent output ordering
  const cities: ('Delhi' | 'Mumbai' | 'Chennai' | 'Kolkata')[] = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata'];
  
  return cities.map((city) => {
    const cityData = data.filter(
      (d) => d.city === city && d.date.startsWith(year)
    );
    
    const petrolPrices = cityData.filter((d) => d.product === 'Petrol').map((d) => d.price);
    const dieselPrices = cityData.filter((d) => d.product === 'Diesel').map((d) => d.price);
    
    return {
      city,
      petrol: calculateAverage(petrolPrices),
      diesel: calculateAverage(dieselPrices),
    };
  });
};

/**
 * Extracts all unique years from the dataset.
 * Uses Set for O(1) deduplication.
 * 
 * @param data - Array of fuel price records
 * @returns Sorted array of unique years
 */
export const getAvailableYears = (data: FuelPriceRecord[]): string[] => {
  const years = new Set<string>();
  data.forEach((record) => {
    years.add(getYear(record.date));
  });
  return Array.from(years).sort();
};

/**
 * Retrieves the most recent fuel prices for all cities.
 * Sorts data by date descending and filters for the latest date.
 * 
 * Note: Creates a new sorted array to avoid mutating original data.
 * 
 * @param data - Array of fuel price records
 * @returns Array of records from the most recent date
 */
export const getLatestPrices = (data: FuelPriceRecord[]): FuelPriceRecord[] => {
  // Create a copy before sorting to preserve original data immutability
  const sortedData = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const latestDate = sortedData[0]?.date;
  
  // Filter all records from the latest date (includes all cities and fuel types)
  return sortedData.filter((d) => d.date === latestDate);
};

/** Month names mapping for display */
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Calculates monthly average RSP for a specific city, fuel type, and year.
 * Groups data by month and calculates average price for each month.
 * 
 * Time Complexity: O(n)
 * 
 * @param data - Array of fuel price records
 * @param city - Metro city to filter
 * @param fuelType - Fuel type ('Petrol' or 'Diesel')
 * @param year - Year to filter
 * @returns Array of monthly RSP data sorted by month
 */
export const calculateMonthlyRSP = (
  data: FuelPriceRecord[],
  city: 'Delhi' | 'Mumbai' | 'Chennai' | 'Kolkata',
  fuelType: 'Petrol' | 'Diesel',
  year: string
): MonthlyRSPData[] => {
  // Filter data for specific city, fuel type, and year
  const filteredData = data.filter(
    (d) => d.city === city && d.product === fuelType && d.date.startsWith(year)
  );
  
  // Group prices by month
  const monthlyMap = new Map<number, number[]>();
  
  filteredData.forEach((record) => {
    const monthNum = new Date(record.date).getMonth() + 1; // 1-12
    if (!monthlyMap.has(monthNum)) {
      monthlyMap.set(monthNum, []);
    }
    monthlyMap.get(monthNum)!.push(record.price);
  });
  
  // Convert to array and calculate averages
  const result: MonthlyRSPData[] = [];
  
  monthlyMap.forEach((prices, monthNum) => {
    result.push({
      month: MONTH_NAMES[monthNum - 1],
      monthNum,
      avgPrice: calculateAverage(prices),
    });
  });
  
  // Sort by month number
  return result.sort((a, b) => a.monthNum - b.monthNum);
};

/**
 * Calculates yearly statistics for a specific city, fuel type, and year.
 * Includes yearly average, highest/lowest months, and price range.
 * 
 * @param monthlyData - Array of monthly RSP data
 * @returns YearlyStats object with all statistics
 */
export const calculateYearlyStats = (monthlyData: MonthlyRSPData[]): YearlyStats => {
  if (monthlyData.length === 0) {
    return {
      yearlyAverage: 0,
      highestPrice: 0,
      highestMonth: '-',
      lowestPrice: 0,
      lowestMonth: '-',
      priceRange: 0,
      monthCount: 0,
    };
  }
  
  const prices = monthlyData.map((d) => d.avgPrice);
  const yearlyAverage = calculateAverage(prices);
  
  // Find highest and lowest
  let highestPrice = monthlyData[0].avgPrice;
  let highestMonth = monthlyData[0].month;
  let lowestPrice = monthlyData[0].avgPrice;
  let lowestMonth = monthlyData[0].month;
  
  monthlyData.forEach((d) => {
    if (d.avgPrice > highestPrice) {
      highestPrice = d.avgPrice;
      highestMonth = d.month;
    }
    if (d.avgPrice < lowestPrice) {
      lowestPrice = d.avgPrice;
      lowestMonth = d.month;
    }
  });
  
  return {
    yearlyAverage,
    highestPrice,
    highestMonth,
    lowestPrice,
    lowestMonth,
    priceRange: Number((highestPrice - lowestPrice).toFixed(2)),
    monthCount: monthlyData.length,
  };
};
