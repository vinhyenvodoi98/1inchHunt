import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

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
  'WETH': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  'MATIC': '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  'RARI': '0xfca59cd816ab1ead66534d82bc21e7515ce441cf',
};

// Reverse mapping for display names
const TOKEN_NAMES: { [key: string]: string } = {
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ETH',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC',
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT',
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'WBTC',
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'DAI',
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'UNI',
  '0x514910771af9ca656af840dff83e8264ecf986ca': 'LINK',
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': 'AAVE',
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'WETH',
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'MATIC',
  '0xfca59cd816ab1ead66534d82bc21e7515ce441cf': 'RARI',
};

interface LimitOrder {
  id: string;
  makerAsset: string;
  takerAsset: string;
  makerAmount: string;
  takerAmount: string;
  maker: string;
  salt: string;
  signature: string;
  permit: string;
  interaction: string;
  status: number;
  createdAt: number;
  updatedAt: number;
  remainingMakerAmount: string;
  remainingTakerAmount: string;
  invalidated: boolean;
  makerAssetData: string;
  takerAssetData: string;
}

interface ApiResponse {
  orders: LimitOrder[];
  total: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ orders: [], total: 0, error: 'Method not allowed' });
  }

  const { 
    address, 
    chainId = '1', 
    page = '1', 
    limit = '100', 
    statuses = '1,2,3',
    sortBy,
    takerAsset,
    makerAsset 
  } = req.query;

  if (!address) {
    return res.status(400).json({ 
      orders: [], 
      total: 0, 
      error: 'Missing address parameter' 
    });
  }

  try {
    // Call 1inch API
    const apiKey = process.env.INCH_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        orders: [], 
        total: 0, 
        error: '1inch API key not configured' 
      });
    }

    const params = new URLSearchParams({
      page: page as string,
      limit: limit as string,
      statuses: statuses as string,
      ...(sortBy && { sortBy: sortBy as string }),
      ...(takerAsset && { takerAsset: takerAsset as string }),
      ...(makerAsset && { makerAsset: makerAsset as string }),
    });

    const url = `https://api.1inch.dev/orderbook/v4.0/${chainId}/address/${address}?${params}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    const data = response.data;

    // Handle both array and object responses from 1inch API
    const ordersArray = Array.isArray(data) ? data : data.orders || [];

    // Transform 1inch data to our format
    const orders: LimitOrder[] = ordersArray.map((order: any) => ({
      id: order.orderHash,
      makerAsset: order.data.makerAsset,
      takerAsset: order.data.takerAsset,
      makerAmount: order.data.makingAmount,
      takerAmount: order.data.takingAmount,
      maker: order.data.maker,
      salt: order.data.salt,
      signature: order.signature,
      permit: order.data.permit || '',
      interaction: order.data.interaction || '',
      status: order.orderInvalidReason ? 3 : 1, // 3 if invalid, 1 if valid
      createdAt: new Date(order.createDateTime).getTime() / 1000,
      updatedAt: new Date(order.createDateTime).getTime() / 1000,
      remainingMakerAmount: order.remainingMakerAmount,
      remainingTakerAmount: order.data.takingAmount, // Use original taking amount as remaining
      invalidated: !!order.orderInvalidReason,
      makerAssetData: order.data.makerAsset,
      takerAssetData: order.data.takerAsset,
    })) || [];

    res.status(200).json({ 
      orders, 
      total: orders.length 
    });
  } catch (error) {
    
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error);
    }
    
    // Return empty result if API fails
    res.status(200).json({ 
      orders: [], 
      total: 0 
    });
  }
} 