/**
 * Custom React hook for loading and parsing fuel price data from CSV.
 * 
 * This hook handles:
 * - Fetching CSV data from the public folder
 * - Parsing CSV using PapaParse library
 * - Transforming raw data into typed FuelPriceRecord objects
 * - Filtering out invalid/incomplete records
 * - Managing loading and error states
 */

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { FuelPriceRecord } from './types';

/** CSV file path relative to the public folder */
const CSV_PATH = '/data.csv';

/**
 * Hook to load and parse fuel price data.
 * Automatically fetches data on component mount.
 * 
 * @returns Object containing:
 *   - data: Array of validated FuelPriceRecord objects
 *   - loading: Boolean indicating if data is being fetched
 *   - error: Error message string if fetch/parse failed, null otherwise
 */
export const useLoadData = () => {
  const [data, setData] = useState<FuelPriceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Async function to fetch and parse CSV data.
     * Uses PapaParse for robust CSV parsing with header row support.
     */
    const loadData = async () => {
      try {
        const response = await fetch(CSV_PATH);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,           // First row contains column headers
          skipEmptyLines: true,   // Ignore blank lines in CSV
          complete: (results) => {
            // Map raw CSV rows to typed FuelPriceRecord objects
            const parsedData: FuelPriceRecord[] = (results.data as Record<string, string>[]).map((row) => ({
              country: row['Country'] || '',
              year: row['Year'] || '',
              month: row['Month'] || '',
              date: row['Calendar Day'] || '',
              // Handle both 'Products ' (with trailing space) and 'Products' column names
              product: (row['Products '] || row['Products'] || '').trim() as 'Petrol' | 'Diesel',
              city: row['Metro Cities'] as 'Delhi' | 'Mumbai' | 'Chennai' | 'Kolkata',
              // Parse the long column name for retail selling price
              price: parseFloat(row['Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1'] || '0'),
            }));
            
            // Filter out records with missing or invalid data
            const validData = parsedData.filter(
              (d) => 
                d.date &&           // Must have a date
                d.product &&        // Must have a product type
                d.city &&           // Must have a city
                !isNaN(d.price) &&  // Price must be a valid number
                d.price > 0         // Price must be positive
            );
            
            setData(validData);
            setLoading(false);
          },
          error: (err: Error) => {
            setError(err.message);
            setLoading(false);
          },
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array - only run once on mount

  return { data, loading, error };
};
