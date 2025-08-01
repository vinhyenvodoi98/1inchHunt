import axios from 'axios';
import { 
  TokenMetadata, 
  OneInchTokensResponse,
  SwapAPIError 
} from './types';
import { getApiHeaders, isValidAddress, handleApiError } from './utils';

/**
 * Get token metadata from 1inch API
 * @param tokenAddress - Optional token address to filter specific token
 * @returns Token metadata or array of all tokens
 */
export async function get1inchTokens(tokenAddress?: string): Promise<TokenMetadata | TokenMetadata[]> {
  // Validate token address if provided
  if (tokenAddress && !isValidAddress(tokenAddress)) {
    throw new SwapAPIError('Invalid token address format');
  }

  try {
    const url = 'https://api.1inch.dev/token/v1.2/1';
    
    const response = await axios.get<OneInchTokensResponse>(url, {
      headers: getApiHeaders(),
      timeout: 10000 // 10 second timeout
    });

    const tokensData = response.data;

    // If specific token address requested, return just that token
    if (tokenAddress) {
      const normalizedAddress = tokenAddress.toLowerCase();
      const token = Object.values(tokensData).find(
        token => token.address.toLowerCase() === normalizedAddress
      );

      if (!token) {
        throw new SwapAPIError(`Token not found: ${tokenAddress}`);
      }

      return {
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        logoURI: token.logoURI,
        decimals: token.decimals
      };
    }

    // Return all tokens as array
    return Object.values(tokensData).map(token => ({
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      logoURI: token.logoURI,
      decimals: token.decimals
    }));

  } catch (error: unknown) {
    handleApiError(error, 'fetch tokens');
  }
}

/**
 * Search for tokens by symbol or name
 * @param query - Search query (symbol or name)
 * @param limit - Maximum number of results (default: 10)
 * @returns Array of matching tokens
 */
export async function searchTokens(query: string, limit = 10): Promise<TokenMetadata[]> {
  if (!query || query.trim().length < 2) {
    throw new SwapAPIError('Search query must be at least 2 characters long');
  }

  const allTokens = await get1inchTokens() as TokenMetadata[];
  const searchQuery = query.toLowerCase().trim();

  const matchingTokens = allTokens.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery) ||
    token.name.toLowerCase().includes(searchQuery)
  );

  // Sort by relevance (exact symbol match first, then name matches)
  matchingTokens.sort((a, b) => {
    const aSymbolExact = a.symbol.toLowerCase() === searchQuery;
    const bSymbolExact = b.symbol.toLowerCase() === searchQuery;
    
    if (aSymbolExact && !bSymbolExact) return -1;
    if (!aSymbolExact && bSymbolExact) return 1;
    
    const aSymbolStart = a.symbol.toLowerCase().startsWith(searchQuery);
    const bSymbolStart = b.symbol.toLowerCase().startsWith(searchQuery);
    
    if (aSymbolStart && !bSymbolStart) return -1;
    if (!aSymbolStart && bSymbolStart) return 1;
    
    return a.symbol.localeCompare(b.symbol);
  });

  return matchingTokens.slice(0, limit);
}

/**
 * Get token metadata by symbol
 * @param symbol - Token symbol (e.g., 'USDC', 'ETH')
 * @returns Token metadata if found
 */
export async function getTokenBySymbol(symbol: string): Promise<TokenMetadata | null> {
  if (!symbol || symbol.trim().length === 0) {
    throw new SwapAPIError('Token symbol is required');
  }

  try {
    const allTokens = await get1inchTokens() as TokenMetadata[];
    const normalizedSymbol = symbol.toUpperCase().trim();
    
    const token = allTokens.find(
      token => token.symbol.toUpperCase() === normalizedSymbol
    );

    return token || null;
  } catch (error: unknown) {
    handleApiError(error, 'get token by symbol');
  }
}

/**
 * Get multiple tokens by their addresses
 * @param addresses - Array of token addresses
 * @returns Array of token metadata
 */
export async function getTokensByAddresses(addresses: string[]): Promise<TokenMetadata[]> {
  if (!addresses || addresses.length === 0) {
    return [];
  }

  // Validate all addresses
  const invalidAddresses = addresses.filter(addr => !isValidAddress(addr));
  if (invalidAddresses.length > 0) {
    throw new SwapAPIError(`Invalid token addresses: ${invalidAddresses.join(', ')}`);
  }

  try {
    const allTokens = await get1inchTokens() as TokenMetadata[];
    const normalizedAddresses = addresses.map(addr => addr.toLowerCase());
    
    const foundTokens = allTokens.filter(token => 
      normalizedAddresses.includes(token.address.toLowerCase())
    );

    return foundTokens;
  } catch (error: unknown) {
    handleApiError(error, 'get tokens by addresses');
  }
}

// Common token addresses for Ethereum mainnet
export const COMMON_TOKENS = {
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  USDC: '0xA0b86a33E6441b04BA6Bc99C8c74fAe81c52bf3b',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  SUSHI: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2'
} as const;

/**
 * Get metadata for common tokens
 * @returns Array of common token metadata
 */
export async function getCommonTokens(): Promise<TokenMetadata[]> {
  const commonAddresses = Object.values(COMMON_TOKENS);
  return getTokensByAddresses(commonAddresses);
}
