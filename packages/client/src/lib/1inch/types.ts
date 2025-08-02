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

// Types for transaction history
export interface TransactionEvent {
  id: string;
  type: string;
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
  from: string;
  to: string;
  value: string;
  tokenAddress?: string;
  tokenSymbol?: string;
  tokenName?: string;
  gasUsed?: string;
  gasPrice?: string;
  status: 'success' | 'failed' | 'pending';
  chainId: number;
  icon?: string;
  color?: string;
  direction?: string;
  rating?: string;
  // Additional transaction details
  blockTimeSec?: number;
  nonce?: number;
  orderInBlock?: number;
  feeInSmallestNative?: string;
  tokenActions?: any[];
}

export interface TransactionHistoryResponse {
  events: TransactionEvent[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
} 