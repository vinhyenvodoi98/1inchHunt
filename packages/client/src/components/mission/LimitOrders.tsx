import * as React from 'react';
import { motion } from 'framer-motion';
import { TokenDisplay } from './TokenDisplay';

interface LimitOrder {
  id: string;
  makerAsset: string;
  takerAsset: string;
  makerAmount: string;
  takerAmount: string;
  maker: string;
  salt: string;
  signature: string;
  permit: string;
  interaction: string;
  status: number; // 1 - Valid, 2 - Temporarily invalid, 3 - Invalid
  createdAt: number;
  updatedAt: number;
  remainingMakerAmount: string;
  remainingTakerAmount: string;
  invalidated: boolean;
  makerAssetData: string;
  takerAssetData: string;
}

interface LimitOrdersProps {
  address: string;
  chainId?: number;
  page?: number;
  limit?: number;
  statuses?: string;
  sortBy?: string;
  takerAsset?: string;
  makerAsset?: string;
  className?: string;
  onOrderClick?: (order: LimitOrder) => void;
}

export const LimitOrders: React.FC<LimitOrdersProps> = ({
  address,
  chainId = 1,
  page = 1,
  limit = 100,
  statuses = '1,2,3',
  sortBy,
  takerAsset,
  makerAsset,
  className = '',
  onOrderClick,
}) => {
  const [orders, setOrders] = React.useState<LimitOrder[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [totalOrders, setTotalOrders] = React.useState(0);

  const fetchOrders = React.useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        statuses,
        ...(sortBy && { sortBy }),
        ...(takerAsset && { takerAsset }),
        ...(makerAsset && { makerAsset }),
      });

      const response = await fetch(`/api/limit-orders?address=${address}&chainId=${chainId}&${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch limit orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setTotalOrders(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch limit orders');
    } finally {
      setIsLoading(false);
    }
  }, [address, chainId, page, limit, statuses, sortBy, takerAsset, makerAsset]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return { text: 'Valid', color: 'text-green-400', bg: 'bg-green-500/20' };
      case 2: return { text: 'Temporarily Invalid', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
      case 3: return { text: 'Invalid', color: 'text-red-400', bg: 'bg-red-500/20' };
      default: return { text: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    }
  };

  const formatAmount = (amount: string, decimals = 18) => {
    const num = parseFloat(amount) / Math.pow(10, decimals);
    if (num < 0.01) return num.toFixed(6);
    if (num < 1) return num.toFixed(4);
    if (num < 100) return num.toFixed(2);
    return num.toFixed(0);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

    // Keep the getTokenName function for backward compatibility
  const getTokenName = (address: string) => {
    // Common token addresses mapping
    const tokenNames: { [key: string]: string } = {
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ETH',
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC',
      '0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT',
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'WBTC',
      '0x6b175474e89094c44da98b954eedeac495271d0f': 'DAI',
      '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'UNI',
      '0x514910771af9ca656af840dff83e8264ecf986ca': 'LINK',
      '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': 'AAVE',
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'WETH',
      '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'MATIC',
      '0xfca59cd816ab1ead66534d82bc21e7515ce441cf': 'RARI',
    };
    
    return tokenNames[address.toLowerCase()] || shortenAddress(address);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br from-black/30 to-black/20 border border-white/10 rounded-xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-white font-bold text-xl mb-1">📋 Your Limit Orders</h4>
          <p className="text-gray-400 text-sm">Manage and track your trading orders</p>
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-lg">
            {totalOrders > 0 ? orders.length : 0}
          </div>
          <div className="text-gray-400 text-xs">
            {totalOrders > 0 ? `of ${totalOrders} orders` : 'No orders yet'}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-40">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mb-3"
          />
          <p className="text-gray-400 text-sm">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-40 text-red-400">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-sm text-center">{error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {orders.map((order, index) => {
            const status = getStatusText(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOrderClick?.(order)}
                className={`bg-gradient-to-br from-black/40 to-black/20 border border-white/10 rounded-xl p-4 cursor-pointer transition-all hover:border-emerald-400/40 hover:shadow-lg ${
                  onOrderClick ? 'hover:bg-black/50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-gray-400 text-xs">Order #{index + 1}</span>
                    <span className="text-white font-mono text-xs opacity-60">{shortenAddress(order.id)}</span>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.color} ${status.bg}`}>
                    {status.text}
                  </span>
                </div>

                {/* Trade Summary */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="text-center">
                        <div className="text-emerald-400 font-bold text-lg">
                          {formatAmount(order.makerAmount)}
                        </div>
                        <TokenDisplay
                          address={order.makerAsset}
                          chainId={1}
                          showLogo={true}
                          showName={false}
                          size="sm"
                          className="justify-center"
                        />
                      </div>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl text-gray-400"
                      >
                        →
                      </motion.div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold text-lg">
                          {formatAmount(order.takerAmount)}
                        </div>
                        <TokenDisplay
                          address={order.takerAsset}
                          chainId={1}
                          showLogo={true}
                          showName={false}
                          size="sm"
                          className="justify-center"
                        />
                      </div>
                    </div>
                    <div className="text-center text-xs text-gray-400 bg-black/20 rounded-lg px-3 py-1 inline-block">
                      Rate: 1 {getTokenName(order.makerAsset)} = {formatAmount((parseFloat(order.takerAmount) / parseFloat(order.makerAmount)).toString())} {getTokenName(order.takerAsset)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-2 font-medium">MAKING</div>
                    <TokenDisplay
                      address={order.makerAsset}
                      chainId={1}
                      showLogo={true}
                      showName={true}
                      size="sm"
                      className="mb-2"
                    />
                    <div className="text-emerald-400 text-lg font-bold">
                      {formatAmount(order.makerAmount)}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {shortenAddress(order.makerAsset)}
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-2 font-medium">TAKING</div>
                    <TokenDisplay
                      address={order.takerAsset}
                      chainId={1}
                      showLogo={true}
                      showName={true}
                      size="sm"
                      className="mb-2"
                    />
                    <div className="text-blue-400 text-lg font-bold">
                      {formatAmount(order.takerAmount)}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {shortenAddress(order.takerAsset)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Maker:</span>
                    <span className="text-white font-mono">{shortenAddress(order.maker)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-lg font-medium mb-2">No Orders Yet</p>
          <p className="text-sm text-center opacity-75">
            You haven't created any limit orders yet.<br />
            Start trading to see your orders here!
          </p>
        </div>
      )}
    </motion.div>
  );
}; 