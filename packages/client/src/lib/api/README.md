# Backend API Integration

This directory contains the frontend API client that communicates with our backend API endpoints.

## Architecture

### Frontend → Backend → 1inch API

Instead of calling the 1inch API directly from the frontend, we now use a backend API that:

1. **Frontend** calls our **Backend API**
2. **Backend API** calls **1inch API** with the API key
3. **Backend API** processes and enriches the data
4. **Frontend** receives processed data with icons and colors

## Benefits

### 🔒 **Security**
- API keys are stored securely on the backend
- No exposure of sensitive credentials to the client
- Better rate limiting and request validation

### 🚀 **Performance**
- Backend can cache responses
- Reduced client-side processing
- Better error handling and retry logic

### 🎨 **Enhanced Data**
- Backend adds token icons and colors
- Consistent data formatting
- Additional metadata processing

## API Endpoints

### Portfolio Data
```
GET /api/portfolio/{walletAddress}?chainId={chainId}
```

**Parameters:**
- `walletAddress` (path): Ethereum wallet address (0x...)
- `chainId` (query): Blockchain chain ID (1 for Ethereum, 137 for Polygon, etc.)

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": [
      {
        "symbol": "ETH",
        "name": "Ethereum",
        "address": "0x...",
        "balance": "2.45",
        "price": 2000.00,
        "value": 4900.00,
        "change24h": 2.3,
        "icon": "🔵",
        "color": "from-blue-400 to-blue-600"
      }
    ],
    "totalValue": 4900.00,
    "chainId": 1,
    "walletAddress": "0x..."
  }
}
```

## Environment Variables

### Backend (.env.local)
```env
# 1inch API Key (server-side only)
INCH_API_KEY=your_1inch_api_key_here
```

### Frontend (.env.local)
```env
# WalletConnect (client-side)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here
```

## Usage

### Frontend Component
```typescript
import { fetchPortfolioData } from '@/lib/api/portfolio';

// Fetch portfolio data
const portfolioData = await fetchPortfolioData(
  '0x1234...5678', // wallet address
  1 // chain ID (Ethereum)
);

console.log(portfolioData.tokens); // Array of token balances with icons/colors
console.log(portfolioData.totalValue); // Total portfolio value
```

### Error Handling
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

## File Structure

```
lib/api/
├── README.md           # This documentation
├── index.ts           # Main exports
└── portfolio.ts       # Portfolio API client
```

## Backend Implementation

The backend API is implemented in:
```
pages/api/portfolio/[address].ts
```

This endpoint:
- Validates input parameters
- Calls 1inch API v4
- Processes and enriches the response
- Returns formatted data with icons and colors
- Handles errors gracefully

## Error Types

- **`API_ERROR`** - Backend API error
- **`NETWORK_ERROR`** - Unable to reach backend
- **`REQUEST_ERROR`** - Request configuration error
- **`VALIDATION_ERROR`** - Invalid input parameters

## Security Considerations

1. **API Key Protection**: 1inch API key is only stored on the backend
2. **Input Validation**: All parameters are validated server-side
3. **Rate Limiting**: Can be implemented on the backend
4. **Error Sanitization**: Sensitive error details are filtered out

## Migration from Direct API

If migrating from direct 1inch API calls:

1. **Update imports**:
   ```typescript
   // Old
   import { fetchPortfolioData } from '@/lib/1inch/portfolio';
   
   // New
   import { fetchPortfolioData } from '@/lib/api/portfolio';
   ```

2. **Remove client-side API key**: No longer needed
3. **Update environment variables**: Move API key to backend
4. **Test functionality**: Verify all features work as expected

The API interface remains the same, so existing components should work without changes! 