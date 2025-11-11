// Google Sheets API integration
const SHEET_ID = '15WgSu4RsVQp3qvEhIXn086qj4mXnHLgxjkA0yACRFSg';
const API_KEY = 'AIzaSyDST8VZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8'; // Will be replaced with actual key

export interface SummaryData {
  date: string;
  totalItems: number;
  totalInvestment: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface ItemData {
  date: string;
  item: string;
  buyPrice: number;
  quantity: number;
  marketPrice: number;
  totalInvestment: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  volume24h: number;
}

const parseSheetData = (values: any[][]): any[] => {
  if (!values || values.length < 2) return [];
  
  const headers = values[0];
  const rows = values.slice(1);
  
  return rows.map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
};

export const fetchSummaryData = async (): Promise<SummaryData[]> => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Summary!A:F?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch summary data');
    }
    
    const data = await response.json();
    const parsed = parseSheetData(data.values);
    
    return parsed.map((row: any) => ({
      date: row['Date'],
      totalItems: parseInt(row['Total Items']) || 0,
      totalInvestment: parseFloat(row['Total Investment (₹)']) || 0,
      currentValue: parseFloat(row['Current Value (₹)']) || 0,
      profitLoss: parseFloat(row['Profit/Loss (₹)']) || 0,
      profitLossPercent: parseFloat(row['Profit/Loss (%)']) || 0,
    }));
  } catch (error) {
    console.error('Error fetching summary data:', error);
    // Return mock data for development
    return generateMockSummaryData();
  }
};

export const fetchItemsData = async (): Promise<ItemData[]> => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Items!A:J?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch items data');
    }
    
    const data = await response.json();
    const parsed = parseSheetData(data.values);
    
    return parsed.map((row: any) => ({
      date: row['Date'],
      item: row['Item'],
      buyPrice: parseFloat(row['Buy Price (₹)']) || 0,
      quantity: parseInt(row['Quantity']) || 0,
      marketPrice: parseFloat(row['Market Price (₹)']) || 0,
      totalInvestment: parseFloat(row['Total Investment (₹)']) || 0,
      currentValue: parseFloat(row['Current Value (₹)']) || 0,
      profitLoss: parseFloat(row['Profit/Loss (₹)']) || 0,
      profitLossPercent: parseFloat(row['Profit/Loss (%)']) || 0,
      volume24h: parseInt(row['Volume (24h)']) || 0,
    }));
  } catch (error) {
    console.error('Error fetching items data:', error);
    // Return mock data for development
    return generateMockItemsData();
  }
};

// Mock data generators for development
const generateMockSummaryData = (): SummaryData[] => {
  const data: SummaryData[] = [];
  const baseDate = new Date('2024-01-01');
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    
    const totalInvestment = 50000 + Math.random() * 20000;
    const profitLossPercent = -5 + Math.random() * 20;
    const currentValue = totalInvestment * (1 + profitLossPercent / 100);
    
    data.push({
      date: date.toISOString().split('T')[0],
      totalItems: Math.floor(8 + Math.random() * 5),
      totalInvestment,
      currentValue,
      profitLoss: currentValue - totalInvestment,
      profitLossPercent,
    });
  }
  
  return data;
};

const generateMockItemsData = (): ItemData[] => {
  const items = [
    'AK-47 | Redline (Field-Tested)',
    'AWP | Asiimov (Field-Tested)',
    'M4A4 | Howl (Minimal Wear)',
    'Desert Eagle | Blaze (Factory New)',
    'Glock-18 | Fade (Factory New)',
    'Karambit | Doppler (Factory New)',
    'Butterfly Knife | Fade (Factory New)',
    'Sport Gloves | Pandora\'s Box (Field-Tested)',
  ];
  
  const latestDate = new Date().toISOString().split('T')[0];
  
  return items.map(item => {
    const buyPrice = 1000 + Math.random() * 10000;
    const quantity = Math.floor(1 + Math.random() * 5);
    const totalInvestment = buyPrice * quantity;
    const profitLossPercent = -10 + Math.random() * 30;
    const currentValue = totalInvestment * (1 + profitLossPercent / 100);
    
    return {
      date: latestDate,
      item,
      buyPrice,
      quantity,
      marketPrice: buyPrice * (1 + profitLossPercent / 100),
      totalInvestment,
      currentValue,
      profitLoss: currentValue - totalInvestment,
      profitLossPercent,
      volume24h: Math.floor(100 + Math.random() * 1000),
    };
  });
};
