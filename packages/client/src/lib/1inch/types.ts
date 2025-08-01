// 1inch API Response Types
export interface OneInchSwapResponse {
  fromToken: {
    symbol: string;
    name: string;
    decimals: number;
    address: string;
    logoURI: string;
  };
  toToken: {
    symbol: string;
    name: string;
    decimals: number;
    address: string;
    logoURI: string;
  };
  toAmount: string;
  fromAmount: string;
  protocols: any[];
  tx: {
    from: string;
    to: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  };
}

// Token metadata types
export interface TokenMetadata {
  symbol: string;
  name: string;
  address: string;
  logoURI: string;
  decimals: number;
}

export interface OneInchTokensResponse {
  [address: string]: {
    symbol: string;
    name: string;
    address: string;
    logoURI: string;
    decimals: number;
  };
}

// Viem-compatible transaction data
export interface SwapTransactionData {
  to: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
  gas: bigint;
  gasPrice: bigint;
}

// Swap parameters interface
export interface SwapParams {
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  fromAddress: string;
  slippage: number; // Percentage (e.g., 1 for 1%)
}

// Error types
export class SwapAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'SwapAPIError';
  }
} 