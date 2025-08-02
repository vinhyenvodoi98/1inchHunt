import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import Layout from '@/components/layout/Layout';
import LevelUpAnimation from '@/components/LevelUpAnimation';

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  decimals: number;
  price: number;
}

interface LimitOrder {
  id: string;
  fromToken: Token;
  toToken: Token;
  amount: string;
  price: string;
  type: 'buy' | 'sell';
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: Date;
}

const availableTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟐', balance: 2.5, decimals: 18, price: 3200 },
  { symbol: 'USDC', name: 'USD Coin', icon: '💎', balance: 1250.0, decimals: 6, price: 1 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿', balance: 0.15, decimals: 8, price: 65000 },
  { symbol: 'DAI', name: 'Dai Stablecoin', icon: '🪙', balance: 850.0, decimals: 18, price: 1 },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', balance: 45.2, decimals: 18, price: 12.5 },
  { symbol: 'LINK', name: 'Chainlink', icon: '🔗', balance: 120.5, decimals: 18, price: 18.2 },
];

export default function LimitOrderMissionPage() {
  const router = useRouter();
  const [fromToken, setFromToken] = React.useState<Token>(availableTokens[0]);
  const [toToken, setToToken] = React.useState<Token>(availableTokens[1]);
  const [amount, setAmount] = React.useState<string>('');
  const [price, setPrice] = React.useState<string>('');
  const [orderType, setOrderType] = React.useState<'buy' | 'sell'>('buy');
  const [isCreating, setIsCreating] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const [ordersCompleted, setOrdersCompleted] = React.useState(0);
  const [activeOrders, setActiveOrders] = React.useState<LimitOrder[]>([]);

  // Character state for level up functionality
  const [character, setCharacter] = React.useState({
    level: 48,
    exp: 2400,
    maxExp: 2800,
    name: 'Limit Order Master',
    avatar: '🧙‍♂️',
  });

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handlePreview = () => {
    setShowPreview(true);
    // Simulate price calculation
    setTimeout(() => {
      const currentPrice = fromToken.price / toToken.price;
      const limitPrice = parseFloat(price) || currentPrice;
      const totalValue = parseFloat(amount) * limitPrice;
      // Additional preview logic here
    }, 1000);
  };

  const addExperience = (amount: number) => {
    setCharacter(prev => {
      const newExp = prev.exp + amount;
      if (newExp >= prev.maxExp) {
        setTimeout(() => setShowLevelUp(true), 1000);
        return {
          ...prev,
          level: prev.level + 1,
          exp: newExp - prev.maxExp,
          maxExp: Math.floor(prev.maxExp * 1.2),
        };
      }
      return { ...prev, exp: newExp };
    });
  };

  const handleCreateOrder = async () => {
    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsCreating(false);
    setShowPreview(false);
    setAmount('');
    setPrice('');
    
    // Create new order
    const newOrder: LimitOrder = {
      id: `order_${Date.now()}`,
      fromToken,
      toToken,
      amount,
      price,
      type: orderType,
      status: 'pending',
      createdAt: new Date(),
    };
    
    setActiveOrders(prev => [...prev, newOrder]);
    setOrdersCompleted(prev => prev + 1);
    addExperience(1000); // More XP for limit orders
  };

  const handleCancelOrder = (orderId: string) => {
    setActiveOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as const }
          : order
      )
    );
  };

  const handleLevelUpComplete = () => {
    setShowLevelUp(false);
  };

  const getCurrentPrice = () => {
    return (fromToken.price / toToken.price).toFixed(4);
  };

  const getOrderValue = () => {
    if (!amount || !price) return '0';
    return (parseFloat(amount) * parseFloat(price)).toFixed(2);
  };

  return (
    <>
      <Layout>
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
          {/* Mission Background */}
          <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
                    <defs>
                      <pattern id="stars" patternUnits="userSpaceOnUse" width="100" height="100">
                        <circle cx="20" cy="20" r="1" fill="#fbbf24" opacity="0.8"/>
                        <circle cx="80" cy="40" r="0.5" fill="#f59e0b" opacity="0.6"/>
                        <circle cx="50" cy="70" r="1.5" fill="#fcd34d" opacity="0.9"/>
                        <circle cx="10" cy="90" r="0.8" fill="#f59e0b" opacity="0.7"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#stars)"/>
                    <path d="M0,400 Q300,200 600,350 T1200,300" stroke="#10b981" stroke-width="2" fill="none" opacity="0.3"/>
                    <path d="M0,500 Q400,250 800,400 T1200,450" stroke="#14b8a6" stroke-width="1.5" fill="none" opacity="0.2"/>
                  </svg>
                `)}`,
              }}
            />
          </div>

          {/* Main Content Container */}
          <div className="relative z-20 w-full max-w-lg mx-4 flex flex-col items-center space-y-6">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="self-start mb-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/map')}
                className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-white font-medium shadow-lg hover:border-emerald-400/50 transition-all duration-300"
              >
                🏠 Back to Map
              </motion.button>
            </motion.div>

            {/* Mission Title */}
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full"
            >
              <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3">
                <h1 className="text-2xl font-bold text-white text-center">
                  📊 Limit Order Mission
                </h1>
                <p className="text-gray-300 text-sm text-center mt-1">
                  Master the art of strategic trading with limit orders
                </p>
              </div>
            </motion.div>

            {/* Limit Order Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="w-full"
            >
              <div className="relative bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-cyan-900/90 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-6 shadow-2xl">
                {/* Panel Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    ⚡ LIMIT ORDER ⚡
                  </h2>
                  <p className="text-gray-300 text-sm">Set your price, set your strategy</p>
                </div>

                {/* Order Type Selection */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">
                    📈 Order Type
                  </label>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOrderType('buy')}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${
                        orderType === 'buy'
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-black/30 text-gray-300 border border-white/20 hover:bg-black/50'
                      }`}
                    >
                      🟢 BUY
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOrderType('sell')}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${
                        orderType === 'sell'
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'bg-black/30 text-gray-300 border border-white/20 hover:bg-black/50'
                      }`}
                    >
                      🔴 SELL
                    </motion.button>
                  </div>
                </motion.div>

                {/* From Token Section */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4"
                >
                  <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">
                    🔮 {orderType === 'buy' ? 'Pay With' : 'Sell'}
                  </label>
                  <select
                    value={fromToken.symbol}
                    onChange={(e) => setFromToken(availableTokens.find(t => t.symbol === e.target.value) || availableTokens[0])}
                    className="w-full bg-black/30 border-2 border-emerald-500/50 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-emerald-400 focus:outline-none transition-all duration-300"
                  >
                    {availableTokens.map((token) => (
                      <option key={token.symbol} value={token.symbol} className="bg-emerald-900">
                        {token.icon} {token.symbol} - {token.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-right text-xs text-gray-400">
                    Balance: {fromToken.balance} {fromToken.symbol}
                  </div>
                </motion.div>

                {/* Amount Input */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-4"
                >
                  <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">
                    💰 Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-black/30 border-2 border-teal-500/50 rounded-xl px-4 py-3 text-white font-mono text-xl focus:border-teal-400 focus:outline-none transition-all duration-300"
                    />
                    <button
                      onClick={() => setAmount(fromToken.balance.toString())}
                      className="absolute right-2 top-2 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-all duration-300"
                    >
                      MAX
                    </button>
                  </div>
                </motion.div>

                {/* Swap Direction Button */}
                <div className="flex justify-center mb-4">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSwapTokens}
                    className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg border-2 border-white/20"
                  >
                    ⇅
                  </motion.button>
                </div>

                {/* To Token Section */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-4"
                >
                  <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">
                    🎯 {orderType === 'buy' ? 'Buy' : 'Receive'}
                  </label>
                  <select
                    value={toToken.symbol}
                    onChange={(e) => setToToken(availableTokens.find(t => t.symbol === e.target.value) || availableTokens[1])}
                    className="w-full bg-black/30 border-2 border-cyan-500/50 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-cyan-400 focus:outline-none transition-all duration-300"
                  >
                    {availableTokens.map((token) => (
                      <option key={token.symbol} value={token.symbol} className="bg-emerald-900">
                        {token.icon} {token.symbol} - {token.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-right text-xs text-gray-400">
                    Balance: {toToken.balance} {toToken.symbol}
                  </div>
                </motion.div>

                {/* Price Input */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mb-6"
                >
                  <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">
                    💵 Limit Price ({toToken.symbol}/{fromToken.symbol})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={getCurrentPrice()}
                      className="w-full bg-black/30 border-2 border-cyan-500/50 rounded-xl px-4 py-3 text-white font-mono text-xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                    />
                    <button
                      onClick={() => setPrice(getCurrentPrice())}
                      className="absolute right-2 top-2 px-3 py-1 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-lg transition-all duration-300"
                    >
                      MARKET
                    </button>
                  </div>
                  <div className="mt-2 text-right text-xs text-gray-400">
                    Current Price: {getCurrentPrice()} {toToken.symbol}/{fromToken.symbol}
                  </div>
                </motion.div>

                {/* Order Preview */}
                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 bg-black/20 border border-white/10 rounded-xl"
                  >
                    <h4 className="text-white font-bold mb-3 flex items-center">
                      🔍 Order Preview
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Order Type:</span>
                        <span className={`font-mono ${orderType === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                          {orderType.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Amount:</span>
                        <span className="text-white font-mono">{amount} {fromToken.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Price:</span>
                        <span className="text-cyan-400 font-mono">{price} {toToken.symbol}/{fromToken.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Value:</span>
                        <span className="text-emerald-400 font-mono">{getOrderValue()} {toToken.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Status:</span>
                        <span className="text-yellow-400 font-mono">PENDING</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-3"
                >
                  {!showPreview ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePreview}
                      disabled={!amount || !price || parseFloat(amount) <= 0 || parseFloat(price) <= 0}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide"
                    >
                      🔮 Preview Order
                    </motion.button>
                  ) : (
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateOrder}
                        disabled={isCreating}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide"
                      >
                        {isCreating ? (
                          <div className="flex items-center justify-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>⚡ Creating Order...</span>
                          </div>
                        ) : (
                          '⚔️ Place Limit Order'
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPreview(false)}
                        className="w-full py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide"
                      >
                        📝 Edit Order
                      </motion.button>
                    </div>
                  )}
                </motion.div>

                {/* Active Orders */}
                {activeOrders.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-6"
                  >
                    <h4 className="text-white font-bold mb-3">📋 Active Orders</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {activeOrders.map((order) => (
                        <div
                          key={order.id}
                          className="p-3 bg-black/20 border border-white/10 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold ${order.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                              {order.type.toUpperCase()}
                            </span>
                            <span className={`text-xs ${
                              order.status === 'pending' ? 'text-yellow-400' :
                              order.status === 'filled' ? 'text-green-400' :
                              'text-red-400'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 mb-2">
                            {order.amount} {order.fromToken.symbol} @ {order.price} {order.toToken.symbol}/{order.fromToken.symbol}
                          </div>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="w-full py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded transition-all duration-300"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Mission Progress */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="mt-6 p-4 bg-black/20 border border-amber-300/30 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-300 text-sm font-bold">🎯 Limit Order Mission Progress</span>
                    <span className="text-amber-300 text-sm">{ordersCompleted}/2 Orders</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      animate={{ width: `${(ordersCompleted / 2) * 100}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      style={{
                        boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
                      }}
                    />
                  </div>
                  <p className="text-gray-300 text-xs mt-2">
                    Complete {2 - ordersCompleted} more limit orders to finish this mission and earn 1000 XP!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl opacity-20"
                animate={{
                  y: [0, -60],
                  x: [0, Math.random() * 40 - 20],
                  opacity: [0.2, 0.05],
                  rotate: [0, 180],
                  scale: [0.8, 1.2],
                }}
                transition={{
                  duration: 6 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: 'easeOut',
                }}
                style={{
                  left: `${40 + Math.random() * 20}%`,
                  top: `${70 + Math.random() * 20}%`,
                }}
              >
                {['✨', '🌟', '💫', '⭐', '🔮', '📊', '📈', '🎯'][i % 8]}
              </motion.div>
            ))}
          </div>
        </div>
      </Layout>

      {/* Level Up Animation Overlay */}
      <LevelUpAnimation
        isVisible={showLevelUp}
        oldLevel={character.level - 1}
        newLevel={character.level}
        onComplete={handleLevelUpComplete}
        character={{
          name: character.name,
          avatar: character.avatar,
        }}
      />
    </>
  );
} 