export interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  decimals: number;
  price: number;
  address?: string;
}

// Shared available tokens for all mission pages
export const availableTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟐', balance: 2.5, decimals: 18, price: 0, address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' },
  { symbol: 'USDC', name: 'USD Coin', icon: '💎', balance: 5000, decimals: 6, price: 0, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿', balance: 0.1, decimals: 8, price: 0, address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' },
  { symbol: 'DAI', name: 'Dai Stablecoin', icon: '🪙', balance: 1000, decimals: 18, price: 0, address: '0x6b175474e89094c44da98b954eedeac495271d0f' },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', balance: 50, decimals: 18, price: 0, address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984' },
  { symbol: 'LINK', name: 'Chainlink', icon: '🔗', balance: 100, decimals: 18, price: 0, address: '0x514910771af9ca656af840dff83e8264ecf986ca' },
  { symbol: 'AAVE', name: 'Aave', icon: '🦇', balance: 25, decimals: 18, price: 0, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' },
  { symbol: '1INCH', name: '1inch', icon: '⚡', balance: 1000, decimals: 18, price: 0, address: '0x111111111117dc0aa78b770fa6a738034120c302' },
];

// Helper function to get tokens for specific pages (some pages might not need all tokens)
export const getTokensForPage = (page: 'swap' | 'limit-order' | 'advanced-swap'): Token[] => {
  switch (page) {
    case 'swap':
      // Swap page uses all tokens
      return availableTokens;
    case 'limit-order':
      // Limit order page uses all tokens
      return availableTokens;
    case 'advanced-swap':
      // Advanced swap page uses all tokens
      return availableTokens;
    default:
      return availableTokens;
  }
};

// Helper function to get default token selections
export const getDefaultTokens = (page: 'swap' | 'limit-order' | 'advanced-swap'): { from: Token; to: Token } => {
  const tokens = getTokensForPage(page);
  return {
    from: tokens[7], // 1INCH
    to: tokens[1],   // USDC
  };
}; 