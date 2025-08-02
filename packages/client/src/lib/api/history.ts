import axios from 'axios';
import { 
  TransactionEvent, 
  TransactionHistoryResponse, 
  PortfolioError 
} from '@/lib/1inch/api';

// Re-export types for frontend use
export type { TransactionEvent, TransactionHistoryResponse, PortfolioError };

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorType?: string;
}

/**
 * Fetches transaction history from our backend API
 * @param walletAddress - The wallet address to fetch history for
 * @param chainId - The blockchain chain ID (e.g., 1 for Ethereum, 137 for Polygon)
 * @param limit - Number of transactions to fetch (default: 20, max: 100)
 * @param page - Page number for pagination (default: 1)
 * @returns Promise<TransactionHistoryResponse> - Transaction history data
 */
export async function fetchTransactionHistory(
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

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    // Make API request to our backend
    const response = await axios.get<ApiResponse<TransactionHistoryResponse>>(
      `/api/history/${walletAddress}?chainId=${chainId}&limit=${limit}&page=${page}`,
      {
        timeout: 15000, // 15 second timeout
      }
    );

    // Check if the response indicates success
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch transaction history');
    }

    return response.data.data;

  } catch (error) {
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data as ApiResponse<any>;
        throw {
          error: 'API_ERROR',
          message: errorData.error || `Backend API error: ${error.response.status}`,
          status: error.response.status,
        } as PortfolioError;
      } else if (error.request) {
        // Request was made but no response received
        throw {
          error: 'NETWORK_ERROR',
          message: 'Network error: Unable to reach backend API',
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