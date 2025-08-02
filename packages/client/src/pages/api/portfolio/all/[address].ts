import { NextApiRequest, NextApiResponse } from 'next';
import { fetchPortfolioDataForChains } from '@/lib/1inch/api';
import { chains } from '@/config/wagmiConfig';

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

    // Validate required parameters
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Validate wallet address format
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Use chains from wagmiConfig
    const chainsToFetch = chains.map((chain: any) => ({
      id: chain.id,
      name: chain.name,
    }));

    // Fetch portfolio data for all chains using centralized service
    const portfolioData = await fetchPortfolioDataForChains(address, chainsToFetch);

    // Return success response
    res.status(200).json({
      success: true,
      data: portfolioData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
} 