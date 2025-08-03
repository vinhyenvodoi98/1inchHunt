import { NextApiRequest, NextApiResponse } from 'next';
import { 
  Sdk, 
  FetchProviderConnector, 
  MakerTraits, 
  Address 
} from "@1inch/limit-order-sdk";

interface CreateOrderRequest {
  fromToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  toToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  amount: string;
  price: string;
  expiration: string;
  address: string;
  chainId: number;
}

interface CreateOrderResponse {
  success: boolean;
  message: string;
  data?: {
    order: any;
    typedData: any;
    orderHash: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateOrderResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const {
      fromToken,
      toToken,
      amount,
      price,
      expiration,
      address,
      chainId = 1
    }: CreateOrderRequest = req.body;

    // Validate required fields
    if (!fromToken?.address || !toToken?.address || !amount || !price || !expiration || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
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

    // Initialize 1inch SDK
    const sdk = new Sdk({ 
      authKey: apiKey, 
      networkId: chainId, 
      httpConnector: new FetchProviderConnector() 
    });

    // Convert expiration string to seconds and add to current timestamp
    const getExpirationSeconds = (expirationStr: string): number => {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const hours = parseInt(expirationStr.replace(/[^0-9]/g, ''));
      const unit = expirationStr.includes('d') ? 24 : 1; // Convert days to hours
      const totalHours = hours * unit;
      const totalSeconds = totalHours * 60 * 60; // Convert hours to seconds
      return now + totalSeconds;
    };

    const expirationTimestamp = getExpirationSeconds(expiration);
    const iexpiration = BigInt(expirationTimestamp);

    console.log("iexpiration", iexpiration);

    // Create maker traits
    const makerTraits = new MakerTraits(iexpiration);

    console.log("makerTraits", makerTraits);

    // Calculate amounts in wei
    const makingAmount = BigInt(parseFloat(amount) * Math.pow(10, fromToken.decimals));
    const takingAmount = BigInt(parseFloat(amount) * parseFloat(price) * Math.pow(10, toToken.decimals));

    // Create the limit order using 1inch SDK
    const order = await sdk.createOrder({
      makerAsset: new Address(fromToken.address),
      takerAsset: new Address(toToken.address),
      makingAmount,
      takingAmount,
      maker: new Address(address),
    }, makerTraits);

    // Get typed data for EIP-712 signing
    const typedData = order.getTypedData(chainId);

    // Get order hash
    const orderHash = order.getOrderHash(chainId);

    // Return success response with order data
    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          maker: order.maker.toString(),
          receiver: order.receiver.toString(),
          makerAsset: order.makerAsset.toString(),
          takerAsset: order.takerAsset.toString(),
          makingAmount: order.makingAmount.toString(),
          takingAmount: order.takingAmount.toString(),
          salt: order.salt.toString(),
          makerTraits: order.makerTraits.toString(),
        },
        typedData,
        orderHash,
      },
    });

  } catch (error) {
    console.error('Error creating order:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 