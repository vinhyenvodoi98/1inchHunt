# ChartPrice Component

A React component that displays price charts for token pairs using the 1inch API.

## Features

- Real-time price data from 1inch API
- Interactive SVG chart with gradient fill
- Price change percentage display
- Loading and error states
- Responsive design
- Mock data fallback for development

## Usage

```tsx
import { ChartPrice } from '@/components/mission';

<ChartPrice
  fromToken={fromToken}
  toToken={toToken}
  period="1d"
  chainId={1}
  className="mb-4"
/>
```

## Props

- `fromToken`: Token object for the source token
- `toToken`: Token object for the destination token
- `period`: Time period for the chart (default: "1d")
- `chainId`: Blockchain network ID (default: 1 for Ethereum)
- `className`: Additional CSS classes

## Supported Periods

- `10m`: 10 minutes
- `1h`: 1 hour
- `1d`: 1 day
- `3d`: 3 days
- `7d`: 7 days
- `14d`: 14 days
- `30d`: 30 days

## Supported Tokens

- ETH, USDC, USDT, WBTC, DAI, UNI, LINK, AAVE

## Environment Setup

Add your 1inch API key to your environment variables:

```env
INCH_API_KEY=your_1inch_api_key_here
```

Get your API key from: https://portal.1inch.dev/

## API Endpoint

The component calls `/api/charts/price` which:
1. Validates token parameters
2. Maps token symbols to addresses
3. Calls 1inch API: `https://api.1inch.dev/charts/v1.0/chart/line/{token0}/{token1}/{period}/{chainId}`
4. Returns formatted price data
5. Falls back to mock data if API fails

## Chart Features

- SVG-based line chart
- Gradient background fill
- Grid lines for reference
- Responsive design
- Smooth animations with Framer Motion 