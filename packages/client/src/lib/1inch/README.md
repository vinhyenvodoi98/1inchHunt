# 1inch API Library

A well-organized TypeScript library for integrating with the 1inch Swap API, split into modular files for better maintainability and developer experience.

## 📁 File Structure

```
lib/1inch/
├── index.ts          # Main export file
├── types.ts          # Type definitions and interfaces
├── utils.ts          # Common utility functions
├── swap.ts           # Swap-related functions
├── tokens.ts         # Token-related functions
└── README.md         # This documentation
```

## 🚀 Quick Start

### Installation

```bash
npm install axios
```

### Environment Setup

```env
NEXT_PUBLIC_1INCH_API_KEY=your_1inch_api_key_here
```

### Basic Usage

```typescript
import { get1inchSwap, get1inchTokens, COMMON_TOKENS } from '@/lib/1inch';

// Get swap transaction data
const swapData = await get1inchSwap({
  fromTokenAddress: COMMON_TOKENS.ETH,
  toTokenAddress: COMMON_TOKENS.USDC,
  amount: '100000000000000000', // 0.1 ETH
  fromAddress: userAddress,
  slippage: 1
});

// Get token metadata
const tokens = await get1inchTokens();
```

## 📚 API Reference

### 🔄 Swap Functions (`swap.ts`)

#### `get1inchSwap(params: SwapParams)`
Get swap transaction data from 1inch API.

```typescript
const txData = await get1inchSwap({
  fromTokenAddress: '0x...',
  toTokenAddress: '0x...',
  amount: '1000000',
  fromAddress: '0x...',
  slippage: 1
});
```

#### `get1inchAllowance(tokenAddress: string, ownerAddress: string)`
Check current token allowance for 1inch router.

#### `get1inchApproval(tokenAddress: string, amount?: string)`
Get approval transaction data for 1inch router.

### 🪙 Token Functions (`tokens.ts`)

#### `get1inchTokens(tokenAddress?: string)`
Get all tokens or specific token metadata.

```typescript
// Get all tokens
const allTokens = await get1inchTokens();

// Get specific token
const usdcToken = await get1inchTokens(COMMON_TOKENS.USDC);
```

#### `searchTokens(query: string, limit?: number)`
Search tokens by symbol or name.

```typescript
const results = await searchTokens('USD', 5);
```

#### `getTokenBySymbol(symbol: string)`
Find token by symbol.

```typescript
const usdc = await getTokenBySymbol('USDC');
```

#### `getTokensByAddresses(addresses: string[])`
Get multiple tokens by their addresses.

#### `getCommonTokens()`
Get metadata for commonly used tokens.

### 🛠️ Utility Functions (`utils.ts`)

#### `isValidAddress(address: string)`
Validate Ethereum address format.

#### `validateSwapParams(...)`
Validate swap parameters before API call.

#### `handleApiError(error: any, context: string)`
Centralized error handling for API calls.

### 📝 Types (`types.ts`)

#### Core Interfaces
- `SwapParams` - Swap function parameters
- `SwapTransactionData` - viem-compatible transaction data
- `TokenMetadata` - Token information structure
- `SwapAPIError` - Custom error class

## 🎯 Usage Examples

### Complete Swap Flow

```typescript
import { 
  get1inchSwap, 
  get1inchAllowance, 
  get1inchApproval,
  COMMON_TOKENS,
  SwapAPIError 
} from '@/lib/1inch';
import { sendTransaction } from '@wagmi/core';

async function performCompleteSwap() {
  try {
    // 1. Check allowance (for ERC20 tokens)
    const allowance = await get1inchAllowance(
      COMMON_TOKENS.USDC, 
      userAddress
    );
    
    // 2. Approve if needed
    if (BigInt(allowance) < BigInt(swapAmount)) {
      const approvalTx = await get1inchApproval(COMMON_TOKENS.USDC);
      await sendTransaction(approvalTx);
    }
    
    // 3. Perform swap
    const swapTx = await get1inchSwap({
      fromTokenAddress: COMMON_TOKENS.USDC,
      toTokenAddress: COMMON_TOKENS.ETH,
      amount: swapAmount,
      fromAddress: userAddress,
      slippage: 1
    });
    
    const hash = await sendTransaction(swapTx);
    console.log('Swap successful:', hash);
    
  } catch (error) {
    if (error instanceof SwapAPIError) {
      console.error('1inch API Error:', error.message);
      console.error('Status:', error.statusCode);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
```

### Token Search Interface

```typescript
import { searchTokens, getTokenBySymbol } from '@/lib/1inch';

// Search component
async function handleTokenSearch(query: string) {
  try {
    const results = await searchTokens(query, 10);
    return results.map(token => ({
      label: `${token.symbol} - ${token.name}`,
      value: token.address,
      logo: token.logoURI
    }));
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}
```

## 🔧 Advanced Configuration

### Custom Network Support

To use with other networks, update the API endpoints in each function:

```typescript
// For Polygon
const url = 'https://api.1inch.dev/swap/v5.2/137/swap';

// For BSC  
const url = 'https://api.1inch.dev/swap/v5.2/56/swap';
```

### Error Handling

The library provides comprehensive error handling with specific error types:

```typescript
try {
  await get1inchSwap(params);
} catch (error) {
  if (error instanceof SwapAPIError) {
    switch (error.statusCode) {
      case 400:
        // Handle bad request
        break;
      case 401:
        // Handle unauthorized
        break;
      case 429:
        // Handle rate limit
        break;
      default:
        // Handle other API errors
        break;
    }
  }
}
```

## 🎁 Common Tokens

The library includes predefined addresses for common tokens:

```typescript
import { COMMON_TOKENS } from '@/lib/1inch';

// Available tokens:
COMMON_TOKENS.ETH    // Native ETH
COMMON_TOKENS.WETH   // Wrapped ETH
COMMON_TOKENS.USDC   // USD Coin
COMMON_TOKENS.USDT   // Tether USD
COMMON_TOKENS.DAI    // Dai Stablecoin
COMMON_TOKENS.WBTC   // Wrapped Bitcoin
COMMON_TOKENS.UNI    // Uniswap
COMMON_TOKENS.LINK   // Chainlink
COMMON_TOKENS.AAVE   // Aave
COMMON_TOKENS.SUSHI  // SushiSwap
```

## 🚦 Rate Limits & Best Practices

- API calls include 10-second timeouts
- Proper error handling for rate limits (HTTP 429)
- Input validation before API calls
- Centralized error handling across all functions

## 🔗 Migration from Old Structure

If migrating from the old `utils/swapApi.ts`:

```typescript
// Old import
import { get1inchSwap } from '@/utils/swapApi';

// New import
import { get1inchSwap } from '@/lib/1inch';
```

All function signatures remain the same for backward compatibility. 