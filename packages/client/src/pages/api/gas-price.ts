import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { chainId = '1' } = req.query;

    // Check if API key is available
    const apiKey = process.env.INCH_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: '1inch API key not configured' });
    }

    // Fetch gas price from 1inch API
    const response = await axios.get(`https://api.1inch.dev/gas-price/v1.4/${chainId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    const gasData = response.data;

    // Transform the data to a more usable format
    const transformedData = {
      chainId: parseInt(chainId as string),
      timestamp: Date.now(),
      gasPrices: {
        slow: {
          price: parseInt(gasData.low?.maxFeePerGas || '0'),
          maxFeePerGas: parseInt(gasData.low?.maxFeePerGas || '0'),
          maxPriorityFeePerGas: parseInt(gasData.low?.maxPriorityFeePerGas || '0'),
        },
        standard: {
          price: parseInt(gasData.medium?.maxFeePerGas || '0'),
          maxFeePerGas: parseInt(gasData.medium?.maxFeePerGas || '0'),
          maxPriorityFeePerGas: parseInt(gasData.medium?.maxPriorityFeePerGas || '0'),
        },
        fast: {
          price: parseInt(gasData.high?.maxFeePerGas || '0'),
          maxFeePerGas: parseInt(gasData.high?.maxFeePerGas || '0'),
          maxPriorityFeePerGas: parseInt(gasData.high?.maxPriorityFeePerGas || '0'),
        },
        instant: {
          price: parseInt(gasData.instant?.maxFeePerGas || '0'),
          maxFeePerGas: parseInt(gasData.instant?.maxFeePerGas || '0'),
          maxPriorityFeePerGas: parseInt(gasData.instant?.maxPriorityFeePerGas || '0'),
        },
      },
      baseFee: parseInt(gasData.baseFee || '0'),
      priorityFee: parseInt(gasData.low?.maxPriorityFeePerGas || '0'),
    };

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('Error fetching gas price:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    res.status(500).json({ 
      error: 'Failed to fetch gas price',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 