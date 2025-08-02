import { NextApiRequest, NextApiResponse } from 'next';
import { fetchTransactionHistory } from '@/lib/1inch/factory';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address } = req.query;
    const chainId = parseInt(req.query.chainId as string);
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;

    // Validate required parameters
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    if (!chainId || isNaN(chainId)) {
      return res.status(400).json({ error: 'Valid chain ID is required' });
    }

    // Validate optional parameters
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'Limit must be between 1 and 100' });
    }

    if (page < 1) {
      return res.status(400).json({ error: 'Page must be greater than 0' });
    }

    // Fetch transaction history using centralized service
    const historyData = await fetchTransactionHistory(address, chainId, limit, page);

    // Return success response
    res.status(200).json({
      success: true,
      data: historyData,
    });

  } catch (error) {
    const portfolioError = error as any;
    
    res.status(500).json({
      success: false,
      error: portfolioError.message || 'Internal server error',
      errorType: portfolioError.error || 'UNKNOWN_ERROR',
    });
  }
} 