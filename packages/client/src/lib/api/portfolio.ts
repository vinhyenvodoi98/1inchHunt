import axios from 'axios';

// Types for portfolio API response
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
}

export interface PortfolioError {
  error: string;
  message: string;
  status?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorType?: string;
}

/**
 * Fetches portfolio data from our backend API
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

    // Make API request to our backend
    const response = await axios.get<ApiResponse<PortfolioResponse>>(
      `/api/portfolio/${walletAddress}?chainId=${chainId}`,
      {
        timeout: 15000, // 15 second timeout for backend processing
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