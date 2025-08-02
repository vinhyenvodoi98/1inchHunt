# 1inch API Integration

This directory contains the integration with the 1inch Portfolio API for fetching real-time token balances and portfolio data.

## Setup

### 1. Get 1inch API Key

1. Visit [1inch Developer Portal](https://portal.1inch.dev/)
2. Sign up for a free account
3. Create a new API key
4. Copy your API key

### 2. Configure Environment Variables

Create a `.env.local` file in the `packages/client` directory:

```env
# 1inch API Configuration
NEXT_PUBLIC_1INCH_API_KEY=your_1inch_api_key_here

# WalletConnect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here
```

### 3. Install Dependencies

Make sure axios is installed:

```bash
npm install axios
# or
pnpm add axios
```

## API Integration

### Portfolio Service (`portfolio.ts`)

The main service file contains:

- **`fetchPortfolioData()`** - Fetches portfolio data from 1inch API
- **`getTokenIcon()`** - Maps token symbols to emoji icons
- **`getTokenColor()`** - Maps token symbols to Tailwind gradient classes
- **TypeScript interfaces** for type safety

### API Endpoint

```
GET https://api.1inch.dev/portfolio/v5.2/{chain_id}/portfolio/{wallet_address}
```

### Supported Chains

The API supports multiple chains including:
- Ethereum (1)
- Polygon (137)
- BSC (56)
- Arbitrum (42161)
- Optimism (10)
- And many more...

## Usage

### Basic Usage

```typescript
import { fetchPortfolioData } from '@/lib/1inch/portfolio';

// Fetch portfolio data
const portfolioData = await fetchPortfolioData(
  '0x1234...5678', // wallet address
  1 // chain ID (Ethereum)
);

console.log(portfolioData.tokens); // Array of token balances
console.log(portfolioData.totalValue); // Total portfolio value
```

### Error Handling

The service includes comprehensive error handling:

```typescript
try {
  const portfolioData = await fetchPortfolioData(address, chainId);
  // Handle success
} catch (error) {
  const portfolioError = error as PortfolioError;
  console.error(portfolioError.message);
  // Handle error
}
```

### Error Types

- **`API_ERROR`** - Server responded with error status
- **`NETWORK_ERROR`** - Unable to reach 1inch API
- **`REQUEST_ERROR`** - Request configuration error
- **`VALIDATION_ERROR`** - Invalid input parameters

## Data Structure

### TokenBalance Interface

```typescript
interface TokenBalance {
  symbol: string;        // Token symbol (e.g., "ETH")
  name: string;          // Token name (e.g., "Ethereum")
  address: string;       // Token contract address
  decimals: number;      // Token decimals
  logoURI?: string;      // Token logo URL
  tags?: string[];       // Token tags
  balance: string;       // Raw balance amount
  price: number;         // Current token price in USD
  value: number;         // Total value in USD
  change24h?: number;    // 24h price change percentage
}
```

### PortfolioResponse Interface

```typescript
interface PortfolioResponse {
  tokens: TokenBalance[];    // Array of token balances
  totalValue: number;        // Total portfolio value in USD
  chainId: number;          // Blockchain chain ID
  walletAddress: string;    // Wallet address
}
```

## Features

### Token Icons

The service automatically maps common tokens to emoji icons:

- ETH → 🔵
- BTC → 🟡
- USDC → 💙
- MATIC → 🟣
- LINK → 🔗
- UNI → 🦄
- And many more...

### Token Colors

Each token gets a unique gradient color based on its symbol:

- ETH → `from-blue-400 to-blue-600`
- BTC → `from-yellow-400 to-orange-500`
- USDC → `from-blue-400 to-cyan-500`
- And many more...

### Data Filtering

The service automatically:
- Filters out tokens with zero balance
- Sorts tokens by value (highest first)
- Validates response data
- Handles missing or invalid data gracefully

## Rate Limits

The 1inch API has rate limits:
- Free tier: 100 requests per minute
- Paid tiers: Higher limits available

## Security

- API key is stored in environment variables
- No sensitive data is logged
- Input validation prevents injection attacks
- Timeout protection (10 seconds)

## Troubleshooting

### Common Issues

1. **"1inch API key not configured"**
   - Make sure `NEXT_PUBLIC_1INCH_API_KEY` is set in `.env.local`

2. **"Invalid wallet address format"**
   - Ensure wallet address is a valid Ethereum address (0x...)

3. **"Network error: Unable to reach 1inch API"**
   - Check your internet connection
   - Verify the API endpoint is accessible

4. **"API error: 401 - Unauthorized"**
   - Check if your API key is valid
   - Ensure you have sufficient credits/quota

### Debug Mode

Enable debug logging by adding to your environment:

```env
NEXT_PUBLIC_DEBUG=1
```

This will log API requests and responses to the console.

## File Structure

```
1inch/
├── README.md           # This documentation
├── portfolio.ts        # Portfolio API service
├── swap.ts            # Swap API service (existing)
├── tokens.ts          # Token metadata service (existing)
├── types.ts           # Shared types (existing)
└── utils.ts           # Utility functions (existing)
``` 