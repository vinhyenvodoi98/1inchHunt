# 1inch API Integration

This directory contains the centralized 1inch API integration for the HashHunt application.

## 🏗️ **Architecture**

### **Centralized API Service**
All 1inch API calls are now centralized in `lib/1inch/api.ts`:

```
Frontend Components → Backend API Routes → Centralized 1inch Service → 1inch API
```

### **Benefits**
- **🔒 Security**: API keys stored securely on backend
- **🔄 Consistency**: Single source of truth for API calls
- **🛠️ Maintainability**: Easy to update API endpoints and logic
- **📊 Data Enrichment**: Centralized token icon and color mapping
- **⚡ Performance**: Optimized request handling and caching

## 📁 **File Structure**

```
lib/1inch/
├── api.ts              # Centralized 1inch API service
├── README.md           # This documentation
├── swap.ts             # Swap functionality (future)
├── tokens.ts           # Token utilities (future)
├── types.ts            # Shared types (future)
└── utils.ts            # Utility functions (future)
```

## 🚀 **API Endpoints**

### **Portfolio Data**
- **Single Chain**: `GET /api/portfolio/{address}?chainId={chainId}`
- **All Chains**: `GET /api/portfolio/all/{address}`

### **Supported Chains**
All chains defined in `wagmiConfig.ts`:
1. **🔵 Ethereum** (Mainnet)
2. **🟣 Polygon**
3. **🔴 Optimism**
4. **🔵 Arbitrum**
5. **🔵 Base**
6. **🟡 BNB Chain**
7. **🔴 Avalanche**
8. **🟢 Gnosis**

## 🔧 **Core Components**

### **1. OneInchAPI Class**
```typescript
class OneInchAPI {
  private apiKey: string;
  private baseURL = 'https://api.1inch.dev';

  // Methods:
  - fetchPortfolioData(walletAddress, chainId, chainName?)
  - fetchPortfolioDataForChains(walletAddress, chains)
  - makeRequest<T>(endpoint, timeout)
}
```

### **2. Utility Functions**
```typescript
// Token icon mapping
getTokenIcon(symbol: string, name: string): string

// Token color mapping
getTokenColor(symbol: string, name: string): string

// API client creation
createOneInchAPI(apiKey: string): OneInchAPI

// Backward compatibility functions
fetchPortfolioData(walletAddress, chainId, chainName?)
fetchPortfolioDataForChains(walletAddress, chains)
```

## 📊 **Data Types**

### **TokenBalance**
```typescript
interface TokenBalance {
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
  icon?: string;        // Enriched by service
  color?: string;       // Enriched by service
}
```

### **PortfolioResponse**
```typescript
interface PortfolioResponse {
  tokens: TokenBalance[];
  totalValue: number;
  chainId: number;
  walletAddress: string;
  chainName?: string;
}
```

### **AllChainsPortfolioResponse**
```typescript
interface AllChainsPortfolioResponse {
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
```

## 🎨 **Token Enrichment**

### **Icon Mapping**
The service automatically maps token symbols to emoji icons:
- `ETH` → 🔵
- `USDC` → 💙
- `MATIC` → 🟣
- `LINK` → 🔗
- And many more...

### **Color Mapping**
Token colors are mapped to Tailwind CSS gradients:
- `ETH` → `from-blue-400 to-blue-600`
- `USDC` → `from-blue-400 to-cyan-500`
- `MATIC` → `from-purple-400 to-purple-600`

## 🔄 **Usage Examples**

### **Backend API Routes**
```typescript
// Single chain
import { fetchPortfolioData } from '@/lib/1inch/api';
const data = await fetchPortfolioData(address, chainId);

// All chains
import { fetchPortfolioDataForChains } from '@/lib/1inch/api';
const data = await fetchPortfolioDataForChains(address, chains);
```

### **Frontend Components**
```typescript
// Using the backend API
import { fetchAllChainsPortfolioData } from '@/lib/api/portfolioAll';
const portfolioData = await fetchAllChainsPortfolioData(walletAddress);
```

## 🛡️ **Error Handling**

### **Error Types**
- **`API_ERROR`** - 1inch API error
- **`NETWORK_ERROR`** - Network connectivity issue
- **`REQUEST_ERROR`** - Request configuration error
- **`VALIDATION_ERROR`** - Input validation error

### **Error Response**
```typescript
interface PortfolioError {
  error: string;
  message: string;
  status?: number;
}
```

## 🔧 **Configuration**

### **Environment Variables**
```env
# Backend (.env.local)
INCH_API_KEY=your_1inch_api_key_here
```

### **API Endpoints**
- **Base URL**: `https://api.1inch.dev`
- **Portfolio Endpoint**: `/portfolio/portfolio/v4/overview/erc20/current_value`
- **Timeout**: 10 seconds (configurable)

## 🚀 **Performance Features**

### **Parallel Processing**
- Multiple chain requests made simultaneously
- `Promise.allSettled()` for graceful failure handling
- Individual chain failures don't break entire request

### **Caching Strategy**
- Backend can implement response caching
- Frontend can cache processed data
- Configurable cache invalidation

## 🔮 **Future Enhancements**

### **Planned Features**
- **Swap Integration**: Token swapping via 1inch
- **Token Lists**: Curated token lists
- **Price Feeds**: Real-time price updates
- **Analytics**: Portfolio analytics and insights
- **Notifications**: Price alerts and updates

### **API Extensions**
- **Rate Limiting**: Smart rate limiting
- **Retry Logic**: Exponential backoff
- **WebSocket**: Real-time updates
- **Batch Requests**: Optimized bulk operations

## 🧪 **Testing**

### **Unit Tests**
```bash
# Test the centralized API service
npm test lib/1inch/api.test.ts
```

### **Integration Tests**
```bash
# Test API endpoints
npm test pages/api/portfolio/
```

## 📈 **Monitoring**

### **Logging**
- Request/response logging
- Error tracking
- Performance metrics
- Rate limit monitoring

### **Metrics**
- API response times
- Success/failure rates
- Token enrichment statistics
- Chain-specific metrics

## 🔗 **Related Files**

- **Backend Routes**: `pages/api/portfolio/`
- **Frontend Services**: `lib/api/portfolioAll.ts`
- **Components**: `components/profile/InventoryTab.tsx`
- **Configuration**: `config/wagmiConfig.ts`

---

This centralized approach ensures consistent, maintainable, and secure 1inch API integration across the entire HashHunt application. 