import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

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