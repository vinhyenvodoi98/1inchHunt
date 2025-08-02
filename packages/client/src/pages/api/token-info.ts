import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
}

interface ApiResponse {
  token: TokenInfo | null;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ token: null, error: 'Method not allowed' });
  }

  const { address, chainId = '1' } = req.query;

  if (!address) {
    return res.status(400).json({ 
      token: null, 
      error: 'Missing address parameter' 
    });
  }

  try {
    // Call 1inch API
    const apiKey = process.env.INCH_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        token: null, 
        error: '1inch API key not configured' 
      });
    }

    const url = `https://api.1inch.dev/token/v1.2/${chainId}/custom/${address}`;
    
    console.log('Calling 1inch token API:', url);
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    console.log('1inch token API response:', response.data);
    const data = response.data;

    // Transform 1inch data to our format
    const token: TokenInfo = {
      symbol: data.symbol || 'UNKNOWN',
      name: data.name || 'Unknown Token',
      address: address as string,
      decimals: data.decimals || 18,
      logoURI: data.logoURI,
      tags: data.tags || [],
    };

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error fetching token info:', error);
    
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    }
    
    // Return null if API fails
    res.status(200).json({ token: null });
  }
} 