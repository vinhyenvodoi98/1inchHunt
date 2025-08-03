import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface SubmitOrderRequest {
  order: {
    makerAsset: string;
    takerAsset: string;
    makingAmount: string;
    takingAmount: string;
    maker: string;
    receiver: string;
    salt: string;
    makerTraits: {
      value: {
        value: string;
      };
    };
  };
  signature: string;
  orderHash: string;
  chainId: number;
}

interface SubmitOrderResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmitOrderResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { order: orderData, signature, orderHash, chainId = 1 }: SubmitOrderRequest = req.body;

    // Validate required fields
    if (!orderData || !signature || !orderHash) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: order, signature, or orderHash',
      });
    }

    // Get API key from environment
    const apiKey = process.env.INCH_API_KEY;
    if (!apiKey) {
      console.error('INCH_API_KEY not found in environment variables');
      return res.status(500).json({
        success: false,
        message: 'API key not configured',
      });
    }

    // Prepare the request body for 1inch API
    const body = {
      orderHash: orderHash,
      signature: signature,
      data: {
        makerAsset: orderData.makerAsset,
        takerAsset: orderData.takerAsset,
        maker: orderData.maker,
        receiver: orderData.receiver,
        makingAmount: orderData.makingAmount,
        takingAmount: orderData.takingAmount,
        salt: orderData.salt,
        extension: "0x",
        makerTraits: orderData.makerTraits.value.value,
      },
    };

    // Make HTTP call to 1inch API
    try {
      const url = `https://api.1inch.dev/orderbook/v4.0/${chainId}`;
      
      const config = {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {},
        paramsSerializer: {
          indexes: null,
        },
      };
      console.log("Making request to 1inch API")
      const response = await axios.post(url, body, config);
      
      console.log("Order submitted successfully:", response.data);

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Order submitted successfully to 1inch',
        data: {
          result: response.data,
          timestamp: new Date().toISOString(),
        },
      });

    } catch (apiError) {
      console.error("Failed to submit order to 1inch API:", apiError);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to submit order to 1inch',
        error: apiError instanceof Error ? apiError.message : 'Unknown API error',
      });
    }

  } catch (error) {
    console.error('Error in order submission handler:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 