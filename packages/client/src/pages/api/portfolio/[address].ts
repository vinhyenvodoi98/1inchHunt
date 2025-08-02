import { NextApiRequest, NextApiResponse } from 'next';
import { fetchPortfolioData } from '@/lib/1inch/api';

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

    // Validate required parameters
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    if (!chainId || isNaN(chainId)) {
      return res.status(400).json({ error: 'Valid chain ID is required' });
    }

    // Fetch portfolio data using centralized service
    const portfolioData = await fetchPortfolioData(address, chainId);

    if (!portfolioData) {
      return res.status(404).json({ 
        success: false,
        error: 'No portfolio data found for this wallet and chain' 
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      data: portfolioData,
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