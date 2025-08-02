import axios from 'axios';

// Types for 1inch Portfolio API response
export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
  balance: string;
  price: number;
  value: number;
  change24h?: number;
}

export interface PortfolioResponse {
  tokens: TokenBalance[];
  totalValue: number;
  chainId: number;
  walletAddress: string;
}

export interface PortfolioError {
  error: string;
  message: string;
  status?: number;
}

/**
 * Fetches portfolio data from 1inch API for a given wallet address and chain
 * @param walletAddress - The wallet address to fetch portfolio for
 * @param chainId - The blockchain chain ID (e.g., 1 for Ethereum, 137 for Polygon)
 * @returns Promise<PortfolioResponse> - Portfolio data including tokens and total value
 */
export async function fetchPortfolioData(
  walletAddress: string,
  chainId: number
): Promise<PortfolioResponse> {
  try {
    // Validate inputs
    if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error('Invalid wallet address format');
    }

    if (!chainId || chainId <= 0) {
      throw new Error('Invalid chain ID');
    }

    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_1INCH_API_KEY;
    if (!apiKey) {
      throw new Error('1inch API key not configured');
    }

    // Make API request
    const response = await axios.get(
      `https://api.1inch.dev/portfolio/v5.2/${chainId}/portfolio/${walletAddress}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    // Validate response
    if (!response.data || !Array.isArray(response.data.tokens)) {
      throw new Error('Invalid response format from 1inch API');
    }

    // Transform and validate the data
    const tokens: TokenBalance[] = response.data.tokens
      .filter((token: any) => {
        // Filter out tokens with zero balance or invalid data
        return token.balance && 
               parseFloat(token.balance) > 0 && 
               token.symbol && 
               token.name;
      })
      .map((token: any) => ({
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        decimals: token.decimals || 18,
        logoURI: token.logoURI,
        tags: token.tags || [],
        balance: token.balance,
        price: parseFloat(token.price) || 0,
        value: parseFloat(token.value) || 0,
        change24h: token.change24h ? parseFloat(token.change24h) : undefined,
      }))
      .sort((a: TokenBalance, b: TokenBalance) => b.value - a.value); // Sort by value descending

    // Calculate total portfolio value
    const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);

    return {
      tokens,
      totalValue,
      chainId,
      walletAddress,
    };

  } catch (error) {
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        throw {
          error: 'API_ERROR',
          message: `1inch API error: ${error.response.status} - ${error.response.data?.message || error.message}`,
          status: error.response.status,
        } as PortfolioError;
      } else if (error.request) {
        // Request was made but no response received
        throw {
          error: 'NETWORK_ERROR',
          message: 'Network error: Unable to reach 1inch API',
        } as PortfolioError;
      } else {
        // Something else happened
        throw {
          error: 'REQUEST_ERROR',
          message: `Request error: ${error.message}`,
        } as PortfolioError;
      }
    } else {
      // Non-axios error
      throw {
        error: 'VALIDATION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      } as PortfolioError;
    }
  }
}

/**
 * Gets token icon/emoji based on symbol or name
 * @param symbol - Token symbol
 * @param name - Token name
 * @returns string - Emoji or fallback icon
 */
export function getTokenIcon(symbol: string, name: string): string {
  const symbolLower = symbol.toLowerCase();
  const nameLower = name.toLowerCase();

  // Common token icons
  const tokenIcons: { [key: string]: string } = {
    'eth': '🔵',
    'ethereum': '🔵',
    'btc': '🟡',
    'bitcoin': '🟡',
    'usdc': '💙',
    'usdt': '💚',
    'dai': '🟡',
    'matic': '🟣',
    'polygon': '🟣',
    'link': '🔗',
    'chainlink': '🔗',
    'uni': '🦄',
    'uniswap': '🦄',
    'aave': '🟢',
    'comp': '🔵',
    'compound': '🔵',
    'sushi': '🍣',
    'sushiswap': '🍣',
    'crv': '🟠',
    'curve': '🟠',
    'bal': '🔵',
    'balancer': '🔵',
    'yfi': '🟡',
    'yearn': '🟡',
    'snx': '🟣',
    'synthetix': '🟣',
    'ren': '🟢',
    'renvm': '🟢',
    '1inch': '🔵',
    'wbtc': '🟡',
    'weth': '🔵',
  };

  // Check symbol first, then name
  if (tokenIcons[symbolLower]) {
    return tokenIcons[symbolLower];
  }

  if (tokenIcons[nameLower]) {
    return tokenIcons[nameLower];
  }

  // Fallback based on token type
  if (nameLower.includes('usd') || nameLower.includes('stable')) {
    return '💵';
  }
  if (nameLower.includes('wrapped') || nameLower.includes('w')) {
    return '📦';
  }
  if (nameLower.includes('governance') || nameLower.includes('gov')) {
    return '🗳️';
  }
  if (nameLower.includes('liquidity') || nameLower.includes('lp')) {
    return '💧';
  }

  // Default fallback
  return '🪙';
}

/**
 * Gets token color gradient based on symbol or name
 * @param symbol - Token symbol
 * @param name - Token name
 * @returns string - Tailwind gradient classes
 */
export function getTokenColor(symbol: string, name: string): string {
  const symbolLower = symbol.toLowerCase();
  const nameLower = name.toLowerCase();

  // Common token colors
  const tokenColors: { [key: string]: string } = {
    'eth': 'from-blue-400 to-blue-600',
    'ethereum': 'from-blue-400 to-blue-600',
    'btc': 'from-yellow-400 to-orange-500',
    'bitcoin': 'from-yellow-400 to-orange-500',
    'usdc': 'from-blue-400 to-cyan-500',
    'usdt': 'from-green-400 to-green-600',
    'dai': 'from-yellow-400 to-yellow-600',
    'matic': 'from-purple-400 to-purple-600',
    'polygon': 'from-purple-400 to-purple-600',
    'link': 'from-blue-500 to-blue-700',
    'chainlink': 'from-blue-500 to-blue-700',
    'uni': 'from-pink-400 to-purple-600',
    'uniswap': 'from-pink-400 to-purple-600',
    'aave': 'from-green-400 to-green-600',
    'comp': 'from-blue-400 to-blue-600',
    'compound': 'from-blue-400 to-blue-600',
    'sushi': 'from-pink-400 to-red-500',
    'sushiswap': 'from-pink-400 to-red-500',
    'crv': 'from-orange-400 to-orange-600',
    'curve': 'from-orange-400 to-orange-600',
    'bal': 'from-blue-400 to-blue-600',
    'balancer': 'from-blue-400 to-blue-600',
    'yfi': 'from-yellow-400 to-yellow-600',
    'yearn': 'from-yellow-400 to-yellow-600',
    'snx': 'from-purple-400 to-purple-600',
    'synthetix': 'from-purple-400 to-purple-600',
    'ren': 'from-green-400 to-green-600',
    'renvm': 'from-green-400 to-green-600',
    '1inch': 'from-blue-400 to-blue-600',
    'wbtc': 'from-yellow-400 to-orange-500',
    'weth': 'from-blue-400 to-blue-600',
  };

  // Check symbol first, then name
  if (tokenColors[symbolLower]) {
    return tokenColors[symbolLower];
  }

  if (tokenColors[nameLower]) {
    return tokenColors[nameLower];
  }

  // Fallback based on token type
  if (nameLower.includes('usd') || nameLower.includes('stable')) {
    return 'from-green-400 to-green-600';
  }
  if (nameLower.includes('wrapped') || nameLower.includes('w')) {
    return 'from-gray-400 to-gray-600';
  }
  if (nameLower.includes('governance') || nameLower.includes('gov')) {
    return 'from-purple-400 to-purple-600';
  }
  if (nameLower.includes('liquidity') || nameLower.includes('lp')) {
    return 'from-blue-400 to-cyan-500';
  }

  // Default fallback
  return 'from-gray-400 to-gray-600';
} 