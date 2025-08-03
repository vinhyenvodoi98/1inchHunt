import { NextApiRequest, NextApiResponse } from 'next';
import { Sdk, FetchProviderConnector, LimitOrder, Address } from "@1inch/limit-order-sdk";

interface SubmitOrderRequest {
  order: {
    makerAsset: string;
    takerAsset: string;
    makingAmount: string;
    takingAmount: string;
    maker: string;
    receiver: string;
    salt: string;
    makerTraits: string;
  };
  signature: string;
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
    const { order: orderData, signature, chainId = 1 }: SubmitOrderRequest = req.body;

    // Validate required fields
    if (!orderData || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: order or signature',
      });
    }

    // Get API key from environment
    const authKey = process.env.INCH_API_KEY;
    if (!authKey) {
      console.error('INCH_API_KEY not found in environment variables');
      return res.status(500).json({
        success: false,
        message: 'API key not configured',
      });
    }

    console.log('Submitting order:', {
      chainId,
      maker: orderData.maker,
      makerAsset: orderData.makerAsset,
      takerAsset: orderData.takerAsset,
    });

    // Initialize SDK with same setup as create endpoint
    const sdk = new Sdk({
      authKey,
      networkId: chainId,
      httpConnector: new FetchProviderConnector()
    });


    // Submit order using SDK
    try {
      const result = await sdk.submitOrder(orderData, signature);
      console.log("Order submitted successfully:", result);

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Order submitted successfully to 1inch',
        data: {
          result,
          timestamp: new Date().toISOString(),
        },
      });

    } catch (sdkError) {
      console.error("Failed to submit order:", sdkError);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to submit order to 1inch',
        error: sdkError instanceof Error ? sdkError.message : 'Unknown SDK error',
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