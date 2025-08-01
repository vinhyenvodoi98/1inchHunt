import { SwapAPIError } from './types';

/**
 * Get 1inch API key from environment variables
 * @throws SwapAPIError if API key is not set
 */
export function getApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_1INCH_API_KEY;
  if (!apiKey) {
    throw new SwapAPIError('1INCH_API_KEY environment variable is not set');
  }
  return apiKey;
}

/**
 * Validate Ethereum address format
 * @param address - Address to validate
 * @returns True if valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get common request headers for 1inch API
 * @returns Headers object with authorization and content type
 */
export function getApiHeaders(): Record<string, string> {
  const apiKey = getApiKey();
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
}

/**
 * Validate swap parameters
 * @param fromTokenAddress - Source token address
 * @param toTokenAddress - Destination token address
 * @param fromAddress - User wallet address
 * @param amount - Amount to swap
 * @param slippage - Slippage tolerance
 * @throws SwapAPIError if any parameter is invalid
 */
export function validateSwapParams(
  fromTokenAddress: string,
  toTokenAddress: string,
  fromAddress: string,
  amount: string,
  slippage: number
): void {
  if (!isValidAddress(fromTokenAddress)) {
    throw new SwapAPIError('Invalid fromTokenAddress format');
  }
  if (!isValidAddress(toTokenAddress)) {
    throw new SwapAPIError('Invalid toTokenAddress format');
  }
  if (!isValidAddress(fromAddress)) {
    throw new SwapAPIError('Invalid fromAddress format');
  }

  // Validate amount
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    throw new SwapAPIError('Invalid amount: must be a positive number');
  }

  // Validate slippage
  if (slippage < 0 || slippage > 50) {
    throw new SwapAPIError('Invalid slippage: must be between 0 and 50');
  }
}

/**
 * Handle axios errors and convert to SwapAPIError
 * @param error - Axios error or unknown error
 * @param context - Context string for error message
 * @throws SwapAPIError with appropriate message and status code
 */
export function handleApiError(error: any, context: string): never {
  if (error?.isAxiosError) {
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.description || 
                        error.response?.data?.message || 
                        error.message;

    // Handle specific API error codes
    switch (statusCode) {
      case 400:
        throw new SwapAPIError(`Bad Request: ${errorMessage}`, statusCode, error.response?.data);
      case 401:
        throw new SwapAPIError('Unauthorized: Invalid API key', statusCode);
      case 404:
        throw new SwapAPIError('Not found', statusCode);
      case 429:
        throw new SwapAPIError('Rate limit exceeded. Please try again later.', statusCode);
      case 500:
        throw new SwapAPIError('1inch API server error. Please try again later.', statusCode);
      default:
        throw new SwapAPIError(
          `1inch API error (${context}): ${errorMessage}`,
          statusCode,
          error.response?.data
        );
    }
  }

  // Re-throw SwapAPIError instances
  if (error instanceof SwapAPIError) {
    throw error;
  }

  // Handle other errors
  throw new SwapAPIError(
    `Unexpected error (${context}): ${error instanceof Error ? error.message : 'Unknown error'}`
  );
}