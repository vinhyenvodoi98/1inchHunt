import * as React from 'react';
import { motion } from 'framer-motion';

interface GasPriceData {
  chainId: number;
  timestamp: number;
  gasPrices: {
    slow: { price: number; maxFeePerGas: number; maxPriorityFeePerGas: number };
    standard: { price: number; maxFeePerGas: number; maxPriorityFeePerGas: number };
    fast: { price: number; maxFeePerGas: number; maxPriorityFeePerGas: number };
    instant: { price: number; maxFeePerGas: number; maxPriorityFeePerGas: number };
  };
  baseFee: number;
  priorityFee: number;
}

interface GasPriceProps {
  className?: string;
  chainId?: string;
  compact?: boolean;
}

export const GasPrice: React.FC<GasPriceProps> = ({
  className = '',
  chainId = '1',
  compact = false,
}) => {
  const [gasData, setGasData] = React.useState<GasPriceData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Format gas price to readable format
  const formatGasPrice = (price: number): string => {
    if (price < 1000) {
      return `${price} Gwei`;
    } else if (price < 1000000) {
      return `${(price / 1000).toFixed(1)} K Gwei`;
    } else {
      return `${(price / 1000000).toFixed(1)} M Gwei`;
    }
  };

  // Get color based on gas price speed
  const getSpeedColor = (speed: 'slow' | 'standard' | 'fast' | 'instant') => {
    switch (speed) {
      case 'slow':
        return 'text-green-400';
      case 'standard':
        return 'text-yellow-400';
      case 'fast':
        return 'text-orange-400';
      case 'instant':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Get background color for speed indicator
  const getSpeedBgColor = (speed: 'slow' | 'standard' | 'fast' | 'instant') => {
    switch (speed) {
      case 'slow':
        return 'bg-green-500/20 border-green-400/30';
      case 'standard':
        return 'bg-yellow-500/20 border-yellow-400/30';
      case 'fast':
        return 'bg-orange-500/20 border-orange-400/30';
      case 'instant':
        return 'bg-red-500/20 border-red-400/30';
      default:
        return 'bg-gray-500/20 border-gray-400/30';
    }
  };

  // Fetch gas price data
  const fetchGasPrice = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/gas-price?chainId=${chainId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setGasData(data);
    } catch (err) {
      console.error('Error fetching gas price:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch gas price');
    } finally {
      setLoading(false);
    }
  }, [chainId]);

  // Fetch data on mount and refresh every 30 seconds
  React.useEffect(() => {
    fetchGasPrice();
    
    const interval = setInterval(fetchGasPrice, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchGasPrice]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 ${className}`}
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-300 text-sm">Loading gas prices...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-sm border border-red-600/30 rounded-xl p-4 ${className}`}
      >
        <div className="flex items-center justify-center space-x-2">
          <span className="text-red-400">⚠️</span>
          <span className="text-red-300 text-sm">Gas price unavailable</span>
        </div>
      </motion.div>
    );
  }

  if (!gasData) {
    return null;
  }

  if (compact) {
    // Compact version - show only standard gas price
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-600/30 rounded-xl p-3 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-blue-400">⛽</span>
            <span className="text-gray-300 text-sm">Gas Price</span>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold text-sm">
              {formatGasPrice(gasData.gasPrices.standard.price)}
            </div>
            <div className="text-gray-400 text-xs">Standard</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Full version - show all gas price options
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">⛽</span>
          <div>
            <h3 className="text-white font-bold">Gas Prices</h3>
            <p className="text-gray-400 text-xs">Ethereum Network</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchGasPrice}
          className="text-gray-400 hover:text-white transition-colors"
          title="Refresh gas prices"
        >
          🔄
        </motion.button>
      </div>

      {/* Gas price options */}
      <div className="space-y-3">
        {(['slow', 'standard', 'fast', 'instant'] as const).map((speed) => (
          <motion.div
            key={speed}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (['slow', 'standard', 'fast', 'instant'].indexOf(speed)) }}
            className={`flex items-center justify-between p-3 rounded-lg border ${getSpeedBgColor(speed)}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getSpeedColor(speed).replace('text-', 'bg-')}`}></div>
              <div>
                <div className={`font-medium capitalize ${getSpeedColor(speed)}`}>
                  {speed}
                </div>
                <div className="text-gray-400 text-xs">
                  {speed === 'slow' && 'Low priority'}
                  {speed === 'standard' && 'Normal speed'}
                  {speed === 'fast' && 'High priority'}
                  {speed === 'instant' && 'Maximum speed'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">
                {formatGasPrice(gasData.gasPrices[speed].price)}
              </div>
              <div className="text-gray-400 text-xs">
                Max: {formatGasPrice(gasData.gasPrices[speed].maxFeePerGas)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Network info */}
      <div className="mt-4 pt-4 border-t border-gray-600/30">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Base Fee: {formatGasPrice(gasData.baseFee)}</span>
          <span>Priority Fee: {formatGasPrice(gasData.priorityFee)}</span>
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">
          Updated {new Date(gasData.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}; 