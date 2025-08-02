import axios from 'axios';
import { 
  TokenBalance, 
  PortfolioResponse, 
  AllChainsPortfolioResponse, 
  TransactionEvent, 
  TransactionHistoryResponse, 
  PortfolioError 
} from './types';
import { getTokenIcon, getTokenColor } from './utils';

/**
 * Centralized 1inch API client
 */
export class OneInchAPI {
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
   * Fetches transaction history for a wallet
   */
  async fetchTransactionHistory(
    walletAddress: string,
    chainId: number,
    limit = 20,
    page = 1
  ): Promise<TransactionHistoryResponse> {
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
          `/history/v2.0/history/${walletAddress}/events?chainId=${chainId}&limit=${limit}&page=${page}`
        );

        // Validate response
        if (!response || !response.items) {
          throw new Error('Invalid response format from 1inch History API');
        }

        // Transform and enrich the data
        const events: TransactionEvent[] = response.items.map((event: any) => {
          // Extract details from the event
          const details = event.details || {};
          
          // Determine transaction type based on event type
          let transactionType = 'transfer';
          if (event.type === 0) transactionType = 'transfer';
          else if (event.type === 1) transactionType = 'swap';
          else if (event.type === 2) transactionType = 'approve';
          else if (event.type === 3) transactionType = 'mint';
          else if (event.type === 4) transactionType = 'burn';

          // Extract token information from tokenActions if available
          const tokenActions = details.tokenActions || [];
          const firstTokenAction = tokenActions[0] || {};
          
          // Get token symbol from tokenActions or use default
          const tokenSymbol = firstTokenAction.symbol || 'ETH';
          const tokenName = firstTokenAction.name || 'Ethereum';

          return {
            id: event.id || `event_${event.timeMs}`,
            type: transactionType,
            timestamp: Math.floor(event.timeMs / 1000), // Convert to Unix timestamp
            blockNumber: details.blockNumber || 0,
            transactionHash: details.txHash || '',
            from: details.fromAddress || event.address || '',
            to: details.toAddress || '',
            value: details.value || '0',
            tokenAddress: firstTokenAction.address,
            tokenSymbol: tokenSymbol,
            tokenName: tokenName,
            gasUsed: details.gasUsed,
            gasPrice: details.gasPrice,
            status: details.status || 'success',
            chainId: chainId,
            icon: getTokenIcon(tokenSymbol, tokenName),
            color: getTokenColor(tokenSymbol, tokenName),
            direction: event.direction || 'unknown',
            rating: event.rating || 'unknown',
            // Additional details
            blockTimeSec: details.blockTimeSec,
            nonce: details.nonce,
            orderInBlock: details.orderInBlock,
            feeInSmallestNative: details.feeInSmallestNative,
            tokenActions: details.tokenActions,
          };
        });

              return {
          events,
          total: response.items?.length || events.length,
          page: page,
          limit: limit,
          hasMore: false, // 1inch history API doesn't provide pagination info in this format
        };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw {
            error: 'API_ERROR',
            message: `1inch History API error: ${error.response.status} - ${error.response.data?.message || error.message}`,
            status: error.response.status,
          } as PortfolioError;
        } else if (error.request) {
          throw {
            error: 'NETWORK_ERROR',
            message: 'Network error: Unable to reach 1inch History API',
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