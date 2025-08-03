import * as React from 'react';
import { motion } from 'framer-motion';
import { Token } from '@/constant/tokens';

interface PriceData {
  timestamp: number;
  price: number;
}

interface ChartPriceProps {
  fromToken: Token;
  toToken: Token;
  period?: string;
  chainId?: number;
  className?: string;
  onPeriodChange?: (period: string) => void;
  onCurrentPriceChange?: (price: number | null) => void;
}

export const ChartPrice: React.FC<ChartPriceProps> = ({
  fromToken,
  toToken,
  period = '24H',
  chainId = 1, // Ethereum mainnet
  className = '',
  onPeriodChange,
  onCurrentPriceChange,
}) => {
  const [priceData, setPriceData] = React.useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = React.useState<number | null>(null);
  const [startPrice, setStartPrice] = React.useState<number | null>(null);
  const [priceChange, setPriceChange] = React.useState<number>(0);

  // Supported periods for 1inch API
  const supportedPeriods = [
    { value: '24H', label: '24H' },
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '1Y', label: '1Y' },
    { value: 'AllTime', label: 'All Time' },
  ];

  const fetchPriceData = React.useCallback(async () => {
    if (!fromToken || !toToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/charts/price?fromToken=${fromToken.address || fromToken.symbol}&toToken=${toToken.address || toToken.symbol}&period=${period}&chainId=${chainId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch price data');
      }

      const data = await response.json();
      setPriceData(data.prices || []);
      
      // Calculate current price and price change
      if (data.prices && data.prices.length > 0) {
        const latest = data.prices[data.prices.length - 1];
        const earliest = data.prices[0];
        setCurrentPrice(latest.price);
        setStartPrice(earliest.price);
        setPriceChange(((latest.price - earliest.price) / earliest.price) * 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price data');
    } finally {
      setIsLoading(false);
    }
  }, [fromToken, toToken, period, chainId]);

  // Fetch data when tokens or period change
  React.useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData]);

  // Notify parent component when current price changes
  React.useEffect(() => {
    if (onCurrentPriceChange) {
      onCurrentPriceChange(currentPrice);
    }
  }, [currentPrice, onCurrentPriceChange]);

  // Simple chart rendering using SVG
  const renderChart = () => {
    if (!priceData.length) return null;

    const width = 750;
    const height = 300;
    const padding = 30;

    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const prices = priceData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    const points = priceData.map((data, index) => {
      const x = padding + (index / (priceData.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((data.price - minPrice) / priceRange) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="w-full">
        <defs>
          <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Background area */}
        <path
          d={`M ${points.split(' ').join(' L ')} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
          fill="url(#priceGradient)"
        />
        
        {/* Price line */}
        <path
          d={`M ${points.split(' ').join(' L ')}`}
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + ratio * chartHeight}
            x2={width - padding}
            y2={padding + ratio * chartHeight}
            stroke="#374151"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Price annotations */}
        {priceData.length > 0 && (
          <>
            {/* Start price annotation */}
            <text
              x={padding - 5}
              y={padding + chartHeight - ((priceData[0].price - minPrice) / priceRange) * chartHeight - 35}
              fill="#3b82f6"
              fontSize="12"
              fontWeight="bold"
            >
              {formatPrice(priceData[0].price)}
            </text>
            
            {/* End price annotation */}
            <text
              x={width - padding + 5}
              y={padding + chartHeight - ((priceData[priceData.length - 1].price - minPrice) / priceRange) * chartHeight - 35}
              fill="#10b981"
              fontSize="12"
              fontWeight="bold"
              textAnchor="end"
            >
              {formatPrice(priceData[priceData.length - 1].price)}
            </text>
          </>
        )}
      </svg>
    );
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    if (price < 100) return price.toFixed(2);
    return price.toFixed(0);
  };

  const formatPriceChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-black/20 border border-white/10 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-white font-bold text-lg">📈 Price Chart</h4>
        <div className="flex items-center space-x-3">
          {/* Period Selector */}
          {onPeriodChange && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Period:</span>
              <select
                value={period}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="bg-black/30 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-emerald-400"
              >
                {supportedPeriods.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* Price Display */}
          <div className="flex items-center space-x-4">
            {startPrice && (
              <div className="text-center">
                <div className="text-gray-400 text-xs">Start</div>
                <div className="text-blue-400 font-mono text-sm">
                  {formatPrice(startPrice)} {toToken.symbol}
                </div>
              </div>
            )}
            {currentPrice && (
              <div className="text-center">
                <div className="text-gray-400 text-xs">Current</div>
                <div className="text-emerald-400 font-mono text-sm">
                  {formatPrice(currentPrice)} {toToken.symbol}
                </div>
              </div>
            )}
            {priceChange !== 0 && (
              <div className="text-center">
                <div className="text-gray-400 text-xs">Change</div>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  priceChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {formatPriceChange(priceChange)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full"
          />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-400 text-sm">
          <span>⚠️ {error}</span>
        </div>
      ) : priceData.length > 0 ? (
        <div className="space-y-4">
          {renderChart()}
          <div className="flex justify-between text-sm text-gray-400">
            <span>{new Date(priceData[0]?.timestamp).toLocaleDateString()}</span>
            <span>{new Date(priceData[priceData.length - 1]?.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          <span>No price data available</span>
        </div>
      )}

      <div className="mt-6 flex justify-between text-sm text-gray-400">
        <span>{fromToken.symbol}/{toToken.symbol}</span>
        <span>Chain: {chainId}</span>
      </div>
    </motion.div>
  );
}; 