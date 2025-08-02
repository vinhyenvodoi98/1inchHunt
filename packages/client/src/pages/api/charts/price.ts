import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface PriceData {
  timestamp: number;
  price: number;
}

interface ApiResponse {
  prices: PriceData[];
  error?: string;
}

// Token address mapping for common tokens
const TOKEN_ADDRESSES: { [key: string]: string } = {
  'ETH': '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  'USDC': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  'USDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
  'WBTC': '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  'DAI': '0x6b175474e89094c44da98b954eedeac495271d0f',
  'UNI': '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  'LINK': '0x514910771af9ca656af840dff83e8264ecf986ca',
  'AAVE': '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ prices: [], error: 'Method not allowed' });
  }

  const { fromToken, toToken, period = '1d', chainId = '1' } = req.query;

  if (!fromToken || !toToken) {
    return res.status(400).json({ prices: [], error: 'Missing token parameters' });
  }

  try {
    // Get token addresses
    const fromTokenAddress = TOKEN_ADDRESSES[fromToken as string];
    const toTokenAddress = TOKEN_ADDRESSES[toToken as string];

    if (!fromTokenAddress || !toTokenAddress) {
      return res.status(400).json({ 
        prices: [], 
        error: `Unsupported token pair: ${fromToken}/${toToken}` 
      });
    }

    // Call 1inch API
    const apiKey = process.env.INCH_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        prices: [],
        error: '1inch API key not configured' 
      });
    }

    const url = `https://api.1inch.dev/charts/v1.0/chart/line/${fromTokenAddress}/${toTokenAddress}/${period}/${chainId}`;
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    const data = response.data;

    // Transform 1inch data to our format
    const prices: PriceData[] = data.data?.map((point: any) => ({
      timestamp: point.time * 1000, // Convert seconds to milliseconds
      price: parseFloat(point.value),
    })) || [];

    res.status(200).json({ prices });
  } catch (error) {
    console.error('Error fetching price data:', error);
    
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    }
    
    // Return empty result if API fails
    res.status(200).json({ prices: [] });
  }
}

function getPeriodMs(period: string): number {
  const periods: { [key: string]: number } = {
    '24H': 24 * 60 * 60 * 1000,
    '1W': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000,
    '1Y': 365 * 24 * 60 * 60 * 1000,
    'AllTime': 365 * 24 * 60 * 60 * 1000, // Default to 1 year for AllTime
  };
  
  return periods[period] || periods['24H'];
} 