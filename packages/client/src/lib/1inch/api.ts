import axios from 'axios';

// Types for 1inch API responses
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
  icon?: string;
  color?: string;
}

export interface PortfolioResponse {
  tokens: TokenBalance[];
  totalValue: number;
  chainId: number;
  walletAddress: string;
  chainName?: string;
}

export interface AllChainsPortfolioResponse {
  walletAddress: string;
  totalValue: number;
  chains: PortfolioResponse[];
  summary: {
    totalTokens: number;
    chainsWithTokens: number;
    highestValueChain: {
      chainId: number;
      chainName: string;
      value: number;
    };
  };
}

export interface PortfolioError {
  error: string;
  message: string;
  status?: number;
}

/**
 * Gets token icon/emoji based on symbol or name
 */
export function getTokenIcon(symbol: string, name: string): string {
  const symbolLower = symbol.toLowerCase();
  const nameLower = name.toLowerCase();

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

  if (tokenIcons[symbolLower]) {
    return tokenIcons[symbolLower];
  }

  if (tokenIcons[nameLower]) {
    return tokenIcons[nameLower];
  }

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

  return '🪙';
}

/**
 * Gets token color gradient based on symbol or name
 */
export function getTokenColor(symbol: string, name: string): string {
  const symbolLower = symbol.toLowerCase();
  const nameLower = name.toLowerCase();

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

  if (tokenColors[symbolLower]) {
    return tokenColors[symbolLower];
  }

  if (tokenColors[nameLower]) {
    return tokenColors[nameLower];
  }

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

  return 'from-gray-400 to-gray-600';
}

/**
 * Centralized 1inch API client
 */
class OneInchAPI {
  private apiKey: string;
  private baseURL = 'https://api.1inch.dev';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Makes a request to the 1inch API
   */
  private async makeRequest<T>(endpoint: string, timeout = 10000): Promise<T> {
    const response = await axios.get(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
      },
      timeout,
    });

    return response.data;
  }

  /**
   * Fetches portfolio data for a specific wallet and chain
   */
  async fetchPortfolioData(
    walletAddress: string,
    chainId: number,
    chainName?: string
  ): Promise<PortfolioResponse | null> {
    try {
      // Validate inputs
      if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error('Invalid wallet address format');
      }

      if (!chainId || chainId <= 0) {
        throw new Error('Invalid chain ID');
      }

      // Make API request
      const response = await this.makeRequest<any>(
        `/portfolio/portfolio/v4/overview/erc20/current_value?addresses=${walletAddress}&chain_id=${chainId}`
      );

      // Validate response
      if (!response || !response.result) {
        return null;
      }

      // Transform and validate the data for v4 API
      const tokens: TokenBalance[] = [];
      
      // Process the result array from the response
      if (response.result && Array.isArray(response.result)) {
        for (const protocol of response.result) {
          if (protocol.protocol_name === 'native' && protocol.result && Array.isArray(protocol.result)) {
            // Check if this is the new format with value_usd
            if (protocol.result.length > 0 && 'value_usd' in protocol.result[0]) {
              // New format: just chain values
              for (const chainData of protocol.result) {
                if (chainData.chain_id === chainId && chainData.value_usd > 0) {
                  // Create a native token entry for this chain
                  tokens.push({
                    symbol: 'ETH',
                    name: 'Ethereum',
                    address: '0x0000000000000000000000000000000000000000',
                    decimals: 18,
                    logoURI: undefined,
                    tags: ['native'],
                    balance: '0', // We don't have balance in this format
                    price: 0, // We don't have price in this format
                    value: parseFloat(chainData.value_usd) || 0,
                    change24h: undefined,
                    icon: getTokenIcon('ETH', 'Ethereum'),
                    color: getTokenColor('ETH', 'Ethereum'),
                  });
                }
              }
            } else {
              // Old format: individual tokens
              for (const tokenData of protocol.result) {
                // Filter out tokens with zero balance or invalid data
                if (tokenData && 
                    tokenData.balance && 
                    parseFloat(tokenData.balance) > 0 && 
                    tokenData.symbol && 
                    tokenData.name) {
                  
                  tokens.push({
                    symbol: tokenData.symbol,
                    name: tokenData.name,
                    address: tokenData.address || '0x0000000000000000000000000000000000000000',
                    decimals: tokenData.decimals || 18,
                    logoURI: tokenData.logoURI,
                    tags: tokenData.tags || [],
                    balance: tokenData.balance,
                    price: parseFloat(tokenData.price) || 0,
                    value: parseFloat(tokenData.value) || 0,
                    change24h: tokenData.change24h ? parseFloat(tokenData.change24h) : undefined,
                    icon: getTokenIcon(tokenData.symbol, tokenData.name),
                    color: getTokenColor(tokenData.symbol, tokenData.name),
                  });
                }
              }
            }
          }
        }
      }
      
      // Sort tokens by value (highest first)
      tokens.sort((a: TokenBalance, b: TokenBalance) => b.value - a.value);

      // Calculate total portfolio value for this chain
      const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);

      return {
        tokens,
        totalValue,
        chainId,
        walletAddress,
        chainName,
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw {
            error: 'API_ERROR',
            message: `1inch API v4 error: ${error.response.status} - ${error.response.data?.message || error.message}`,
            status: error.response.status,
          } as PortfolioError;
        } else if (error.request) {
          throw {
            error: 'NETWORK_ERROR',
            message: 'Network error: Unable to reach 1inch API v4',
          } as PortfolioError;
        } else {
          throw {
            error: 'REQUEST_ERROR',
            message: `Request error: ${error.message}`,
          } as PortfolioError;
        }
      } else {
        throw {
          error: 'VALIDATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        } as PortfolioError;
      }
    }
  }

  /**
   * Fetches portfolio data for multiple chains
   */
  async fetchPortfolioDataForChains(
    walletAddress: string,
    chains: Array<{ id: number; name: string }>
  ): Promise<AllChainsPortfolioResponse> {
    // Fetch portfolio data for all chains in parallel
    const portfolioPromises = chains.map(chain => 
      this.fetchPortfolioData(walletAddress, chain.id, chain.name)
    );

    const portfolioResults = await Promise.allSettled(portfolioPromises);

    // Process results
    const chainsWithData: PortfolioResponse[] = [];
    let totalValue = 0;
    let totalTokens = 0;

    portfolioResults.forEach((result: any, index: number) => {
      if (result.status === 'fulfilled' && result.value) {
        chainsWithData.push(result.value);
        totalValue += result.value.totalValue;
        totalTokens += result.value.tokens.length;
      }
    });

    // Find the chain with the highest value
    const highestValueChain = chainsWithData.reduce((max, chain) => 
      chain.totalValue > max.totalValue ? chain : max
    , { totalValue: 0, chainId: 0, chainName: '', tokens: [], walletAddress: '' } as PortfolioResponse);

    // Create summary
    const summary = {
      totalTokens,
      chainsWithTokens: chainsWithData.length,
      highestValueChain: {
        chainId: highestValueChain.chainId,
        chainName: highestValueChain.chainName || 'Unknown',
        value: highestValueChain.totalValue,
      },
    };

    return {
      walletAddress,
      totalValue,
      chains: chainsWithData,
      summary,
    };
  }
}

/**
 * Creates a 1inch API client instance
 */
export function createOneInchAPI(apiKey: string): OneInchAPI {
  return new OneInchAPI(apiKey);
}

/**
 * Fetches portfolio data for a single chain (for backward compatibility)
 */
export async function fetchPortfolioData(
  walletAddress: string,
  chainId: number,
  chainName?: string
): Promise<PortfolioResponse | null> {
  const apiKey = process.env.INCH_API_KEY;
  if (!apiKey) {
    throw new Error('1inch API key not configured');
  }

  const api = createOneInchAPI(apiKey);
  return api.fetchPortfolioData(walletAddress, chainId, chainName);
}

/**
 * Fetches portfolio data for multiple chains
 */
export async function fetchPortfolioDataForChains(
  walletAddress: string,
  chains: Array<{ id: number; name: string }>
): Promise<AllChainsPortfolioResponse> {
  const apiKey = process.env.INCH_API_KEY;
  if (!apiKey) {
    throw new Error('1inch API key not configured');
  }

  const api = createOneInchAPI(apiKey);
  return api.fetchPortfolioDataForChains(walletAddress, chains);
} 