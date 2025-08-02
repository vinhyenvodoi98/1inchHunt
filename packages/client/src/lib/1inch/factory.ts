import { OneInchAPI } from './client';
import { 
  PortfolioResponse, 
  AllChainsPortfolioResponse, 
  TransactionHistoryResponse 
} from './types';

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

/**
 * Fetches transaction history for a wallet
 */
export async function fetchTransactionHistory(
  walletAddress: string,
  chainId: number,
  limit = 20,
  page = 1
): Promise<TransactionHistoryResponse> {
  const apiKey = process.env.INCH_API_KEY;
  if (!apiKey) {
    throw new Error('1inch API key not configured');
  }

  const api = createOneInchAPI(apiKey);
  return api.fetchTransactionHistory(walletAddress, chainId, limit, page);
} 