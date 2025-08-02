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
}

interface SwapRoute {
  id: string;
  name: string;
  output: string;
  gas: string;
  priceImpact: string;
  efficiency: number;
}

const availableTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟐', balance: 2.5, decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', icon: '💎', balance: 1250.0, decimals: 6 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿', balance: 0.15, decimals: 8 },
  { symbol: 'DAI', name: 'Dai Stablecoin', icon: '🪙', balance: 850.0, decimals: 18 },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', balance: 45.2, decimals: 18 },
  { symbol: 'LINK', name: 'Chainlink', icon: '🔗', balance: 120.5, decimals: 18 },
  { symbol: 'AAVE', name: 'Aave', icon: '🦇', balance: 8.7, decimals: 18 },
];

export default function AdvancedSwapMissionPage() {
  const router = useRouter();
  const [fromToken, setFromToken] = React.useState<Token>(availableTokens[0]);
  const [toToken, setToToken] = React.useState<Token>(availableTokens[1]);
  const [amount, setAmount] = React.useState<string>('');
  const [isSwapping, setIsSwapping] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [slippage, setSlippage] = React.useState<string>('0.5');
  const [selectedRoute, setSelectedRoute] = React.useState<string>('');
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const [swapsCompleted, setSwapsCompleted] = React.useState(0);

  // Character state for level up functionality
  const [character, setCharacter] = React.useState({
    level: 45,
    exp: 2200,
    maxExp: 2500,
    name: 'Advanced Trader',
    avatar: '🧙‍♂️',
  });

  // Mock routes data
  const [routes, setRoutes] = React.useState<SwapRoute[]>([]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handlePreview = () => {
    setShowPreview(true);
    // Simulate API call for route finding
    setTimeout(() => {
      const mockRoutes: SwapRoute[] = [
        {
          id: 'route1',
          name: 'Uniswap V3 → 1inch',
          output: (parseFloat(amount) * 1985 * 0.98).toFixed(2),
          gas: (Math.random() * 15 + 8).toFixed(2),
          priceImpact: '0.12%',
          efficiency: 95,
        },
        {
          id: 'route2',
          name: 'SushiSwap → Balancer',
          output: (parseFloat(amount) * 1985 * 0.99).toFixed(2),
          gas: (Math.random() * 20 + 12).toFixed(2),
          priceImpact: '0.08%',
          efficiency: 92,
        },
        {
          id: 'route3',
          name: 'Curve → Uniswap V2',
          output: (parseFloat(amount) * 1985 * 0.97).toFixed(2),
          gas: (Math.random() * 10 + 5).toFixed(2),
          priceImpact: '0.15%',
          efficiency: 88,
        },
      ];
      setRoutes(mockRoutes);
      setSelectedRoute(mockRoutes[0].id);
    }, 1500);
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

  const handleSwap = async () => {
    setIsSwapping(true);
    await new Promise(resolve => setTimeout(resolve, 4000));
    setIsSwapping(false);
    setShowPreview(false);
    setAmount('');
    
    setSwapsCompleted(prev => prev + 1);
    addExperience(800); // More XP for advanced swap
  };

  const handleLevelUpComplete = () => {
    setShowLevelUp(false);
  };

  return (
    <>
      <Layout>
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
          {/* Mission Background */}
          <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
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
                    <path d="M0,400 Q300,200 600,350 T1200,300" stroke="#8b5cf6" stroke-width="2" fill="none" opacity="0.3"/>
                    <path d="M0,500 Q400,250 800,400 T1200,450" stroke="#a855f7" stroke-width="1.5" fill="none" opacity="0.2"/>
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
                className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-white font-medium shadow-lg hover:border-purple-400/50 transition-all duration-300"
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
                  🚀 Advanced Swap Mission
                </h1>
                <p className="text-gray-300 text-sm text-center mt-1">
                  Master complex routing and advanced settings
                </p>
              </div>
            </motion.div>

            {/* Advanced Swap Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="w-full"
            >
              <div className="relative bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-6 shadow-2xl">
                {/* Panel Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    ⚡ ADVANCED SWAP ⚡
                  </h2>
                  <p className="text-gray-300 text-sm">Multi-route optimization</p>
                </div>

                {/* From Token Section */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-4"
                >
                  <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">
                    🔮 From
                  </label>
                  <select
                    value={fromToken.symbol}
                    onChange={(e) => setFromToken(availableTokens.find(t => t.symbol === e.target.value) || availableTokens[0])}
                    className="w-full bg-black/30 border-2 border-purple-500/50 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-purple-400 focus:outline-none transition-all duration-300"
                  >
                    {availableTokens.map((token) => (
                      <option key={token.symbol} value={token.symbol} className="bg-purple-900">
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
                  transition={{ delay: 0.6 }}
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
                      className="w-full bg-black/30 border-2 border-blue-500/50 rounded-xl px-4 py-3 text-white font-mono text-xl focus:border-blue-400 focus:outline-none transition-all duration-300"
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
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg border-2 border-white/20"
                  >
                    ⇅
                  </motion.button>
                </div>

                {/* To Token Section */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mb-6"
                >
                  <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">
                    🎯 To
                  </label>
                  <select
                    value={toToken.symbol}
                    onChange={(e) => setToToken(availableTokens.find(t => t.symbol === e.target.value) || availableTokens[1])}
                    className="w-full bg-black/30 border-2 border-green-500/50 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-green-400 focus:outline-none transition-all duration-300"
                  >
                    {availableTokens.map((token) => (
                      <option key={token.symbol} value={token.symbol} className="bg-purple-900">
                        {token.icon} {token.symbol} - {token.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-right text-xs text-gray-400">
                    Balance: {toToken.balance} {toToken.symbol}
                  </div>
                </motion.div>

                {/* Advanced Settings Toggle */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-4"
                >
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm font-medium hover:bg-black/30 transition-all duration-300"
                  >
                    {showAdvanced ? '🔽' : '🔼'} Advanced Settings
                  </button>
                </motion.div>

                {/* Advanced Settings Panel */}
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 bg-black/20 border border-white/10 rounded-xl"
                  >
                    <h4 className="text-white font-bold mb-3">⚙️ Advanced Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Slippage Tolerance (%)</label>
                        <input
                          type="number"
                          value={slippage}
                          onChange={(e) => setSlippage(e.target.value)}
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                          min="0.1"
                          max="50"
                          step="0.1"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSlippage('0.5')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-all duration-300"
                        >
                          0.5%
                        </button>
                        <button
                          onClick={() => setSlippage('1.0')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-all duration-300"
                        >
                          1.0%
                        </button>
                        <button
                          onClick={() => setSlippage('2.0')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-all duration-300"
                        >
                          2.0%
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Routes Preview */}
                {showPreview && routes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                  >
                    <h4 className="text-white font-bold mb-3">🛣️ Available Routes</h4>
                    <div className="space-y-2">
                      {routes.map((route) => (
                        <motion.div
                          key={route.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            selectedRoute === route.id
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-white/20 bg-black/20 hover:border-white/40'
                          }`}
                          onClick={() => setSelectedRoute(route.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{route.name}</span>
                            <span className="text-green-400 font-mono">{route.output} {toToken.symbol}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-300">
                            <span>Gas: ~${route.gas}</span>
                            <span>Impact: {route.priceImpact}</span>
                            <span>Efficiency: {route.efficiency}%</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-3"
                >
                  {!showPreview ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePreview}
                      disabled={!amount || parseFloat(amount) <= 0}
                      className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide"
                    >
                      🔮 Find Best Routes
                    </motion.button>
                  ) : (
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSwap}
                        disabled={isSwapping || !selectedRoute}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide"
                      >
                        {isSwapping ? (
                          <div className="flex items-center justify-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>⚡ Optimizing Routes...</span>
                          </div>
                        ) : (
                          '⚔️ Execute Advanced Swap'
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPreview(false)}
                        className="w-full py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide"
                      >
                        📝 Edit Swap
                      </motion.button>
                    </div>
                  )}
                </motion.div>

                {/* Mission Progress */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="mt-6 p-4 bg-black/20 border border-amber-300/30 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-300 text-sm font-bold">🎯 Advanced Mission Progress</span>
                    <span className="text-amber-300 text-sm">{swapsCompleted}/2 Swaps</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      animate={{ width: `${(swapsCompleted / 2) * 100}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      style={{
                        boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
                      }}
                    />
                  </div>
                  <p className="text-gray-300 text-xs mt-2">
                    Complete {2 - swapsCompleted} more advanced swaps to finish this mission and earn 800 XP!
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
                {['✨', '🌟', '💫', '⭐', '🔮', '🚀', '⚡', '🎯'][i % 8]}
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