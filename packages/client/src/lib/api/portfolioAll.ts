import axios from 'axios';
import { 
  TokenBalance, 
  PortfolioResponse, 
  AllChainsPortfolioResponse, 
  PortfolioError 
} from '@/lib/1inch/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorType?: string;
}

/**
 * Fetches portfolio data from our backend API for all configured chains
 * @param walletAddress - The wallet address to fetch portfolio for
 * @returns Promise<AllChainsPortfolioResponse> - Portfolio data across all chains
 */
export async function fetchAllChainsPortfolioData(
  walletAddress: string
): Promise<AllChainsPortfolioResponse> {
  try {
    // Validate inputs
    if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error('Invalid wallet address format');
    }

    // Make API request to our backend
    const response = await axios.get<ApiResponse<AllChainsPortfolioResponse>>(
      `/api/portfolio/all/${walletAddress}`,
      {
        timeout: 30000, // 30 second timeout for multiple chain requests
      }
    );

    // Check if the response indicates success
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch portfolio data');
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