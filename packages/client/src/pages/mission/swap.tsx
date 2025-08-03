import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import Layout from '@/components/layout/Layout';
import LevelUpAnimation from '@/components/LevelUpAnimation';
import { MissionProgress, GasPrice } from '@/components/mission';
import { GameStorage, UserCharacter } from '@/utils/localStorage';

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  decimals: number;
}

const availableTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟐', balance: 2.5, decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', icon: '💎', balance: 1250.0, decimals: 6 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿', balance: 0.15, decimals: 8 },
  { symbol: 'DAI', name: 'Dai Stablecoin', icon: '🪙', balance: 850.0, decimals: 18 },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', balance: 45.2, decimals: 18 },
];

export default function SwapMissionPage() {
  const router = useRouter();
  const [fromToken, setFromToken] = React.useState<Token>(availableTokens[0]);
  const [toToken, setToToken] = React.useState<Token>(availableTokens[1]);
  const [amount, setAmount] = React.useState<string>('');
  const [isSwapping, setIsSwapping] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [gasEstimate, setGasEstimate] = React.useState<string>('~$12.50');
  const [expectedOutput, setExpectedOutput] = React.useState<string>('2,485.32');
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const [swapsCompleted, setSwapsCompleted] = React.useState(() => {
    const progress = GameStorage.getMissionProgress();
    return progress.swap.completed;
  });

  // Character state for level up functionality
  const [character, setCharacter] = React.useState<UserCharacter>(() => {
    const savedCharacter = GameStorage.getCharacter();
    return savedCharacter || {
      level: 0,
      exp: 0,
      maxExp: 500,
      name: 'New Adventurer',
      avatar: '👤',
    };
  });

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handlePreview = () => {
    setShowPreview(true);
    // Simulate API call for gas estimation
    setTimeout(() => {
      const randomGas = (Math.random() * 20 + 5).toFixed(2);
      const randomOutput = (parseFloat(amount) * 1985 * (0.95 + Math.random() * 0.1)).toFixed(2);
      setGasEstimate(`~$${randomGas}`);
      setExpectedOutput(randomOutput);
    }, 1000);
  };

  const addExperience = (amount: number) => {
    setCharacter(prev => {
      const newExp = prev.exp + amount;
      const level = Math.floor(newExp / 500);
      
      const newCharacter = {
        ...prev,
        level,
        exp: newExp,
        maxExp: 500,
      };
      
      // Save character data to localStorage
      GameStorage.saveCharacter(newCharacter);
      
      return newCharacter;
    });
  };

  const handleSwap = async () => {
    setIsSwapping(true);
    // Simulate swap transaction
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSwapping(false);
    setShowPreview(false);
    setAmount('');
    
    // Complete swap and add experience
    setSwapsCompleted(prev => {
      const newCount = prev + 1;
      // Save mission progress to localStorage
      const progress = GameStorage.getMissionProgress();
      progress.swap.completed = newCount;
      GameStorage.saveMissionProgress(progress);
      return newCount;
    });
    addExperience(500); // Add 500 EXP for completing a swap
  };

  const handleLevelUpComplete = () => {
    setShowLevelUp(false);
  };

  return (
    <>
      <Layout>
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
          {/* Mission Background */}
          <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
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

          {/* Main Content Container - Centered */}
          <div className="relative z-20 w-full max-w-md mx-4 flex flex-col items-center space-y-6">
            {/* Enhanced Back Button */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="self-start mb-2"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.6), 0 8px 25px rgba(0, 0, 0, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/map')}
                className="group relative overflow-hidden px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-white font-medium shadow-lg hover:border-purple-400/50 transition-all duration-300 transform-gpu"
                style={{
                  boxShadow: '0 0 15px rgba(139, 92, 246, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)',
                }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-blue-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ borderRadius: 'inherit' }}
                />
                
                {/* Content */}
                <div className="relative flex items-center space-x-2">
                  <motion.span 
                    className="text-sm"
                    animate={{ rotate: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🏠
                  </motion.span>
                  <span className="text-sm">Back to Map</span>
                  
                  {/* Hover arrow animation */}
                  <motion.span
                    className="text-xs opacity-0 group-hover:opacity-100"
                    animate={{ x: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    ←
                  </motion.span>
                </div>
                
                {/* Subtle glow effect */}
                <motion.div
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                  style={{ borderRadius: 'inherit' }}
                />
              </motion.button>
            </motion.div>

            {/* Mission Title - Centered */}
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full"
            >
              <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3 transform-gpu">
                <h1 className="text-2xl font-bold text-white text-center">
                  🔄 Basic Swap Mission
                </h1>
                <p className="text-gray-300 text-sm text-center mt-1">
                  Master the fundamentals of token swapping
                </p>
              </div>
            </motion.div>

            {/* Mission Progress */}
            <MissionProgress
              completed={swapsCompleted}
              total={3}
              title="🔄 Swap Progress"
            />

            {/* Floating Swap Panel - Centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="w-full"
            >
              <div 
                className="relative bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden transform-gpu"
                style={{
                  boxShadow: '0 0 40px rgba(168, 85, 247, 0.3), 0 0 80px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
                  willChange: 'transform',
                }}
              >
                {/* Optimized Magical Sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-amber-400 rounded-full transform-gpu"
                      animate={{
                        x: [0, Math.random() * 80 - 40],
                        y: [0, Math.random() * 80 - 40],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: 'easeInOut',
                      }}
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        willChange: 'transform, opacity',
                      }}
                    />
                  ))}
                </div>

                {/* Panel Header */}
                <div className="text-center mb-6">
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-white mb-2 transform-gpu"
                    style={{
                      fontFamily: 'monospace',
                      textShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                    }}
                  >
                    ⚡ BASIC SWAP ⚡
                  </motion.h2>
                  <p className="text-gray-300 text-sm">Simple token exchange</p>
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
                  <div className="relative">
                    <select
                      value={fromToken.symbol}
                      onChange={(e) => setFromToken(availableTokens.find(t => t.symbol === e.target.value) || availableTokens[0])}
                      className="w-full bg-black/30 border-2 border-purple-500/50 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-purple-400 focus:outline-none transition-all duration-300 transform-gpu"
                      style={{
                        boxShadow: 'inset 0 0 10px rgba(147, 51, 234, 0.2)',
                      }}
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
                      className="w-full bg-black/30 border-2 border-blue-500/50 rounded-xl px-4 py-3 text-white font-mono text-xl focus:border-blue-400 focus:outline-none transition-all duration-300 transform-gpu"
                      style={{
                        boxShadow: 'inset 0 0 10px rgba(59, 130, 246, 0.2)',
                      }}
                    />
                    <button
                      onClick={() => setAmount(fromToken.balance.toString())}
                      className="absolute right-2 top-2 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-all duration-300 transform-gpu"
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
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg border-2 border-white/20 transform-gpu"
                    style={{
                      boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
                      willChange: 'transform',
                    }}
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
                  <div className="relative">
                    <select
                      value={toToken.symbol}
                      onChange={(e) => setToToken(availableTokens.find(t => t.symbol === e.target.value) || availableTokens[1])}
                      className="w-full bg-black/30 border-2 border-green-500/50 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-green-400 focus:outline-none transition-all duration-300 transform-gpu"
                      style={{
                        boxShadow: 'inset 0 0 10px rgba(34, 197, 94, 0.2)',
                      }}
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
                  </div>
                </motion.div>

                {/* Preview Section */}
                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 bg-black/20 border border-white/10 rounded-xl transform-gpu"
                  >
                    <h4 className="text-white font-bold mb-3 flex items-center">
                      🔍 Swap Preview
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Expected Output:</span>
                        <span className="text-green-400 font-mono">{expectedOutput} {toToken.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Gas Fee:</span>
                        <span className="text-yellow-400 font-mono">{gasEstimate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Slippage:</span>
                        <span className="text-blue-400 font-mono">0.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Route:</span>
                        <span className="text-purple-400 font-mono">Uniswap V3</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Gas Price Component */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mb-6"
                >
                  <GasPrice compact={true} />
                </motion.div>

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
                      disabled={!amount || parseFloat(amount) <= 0}
                      className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide transform-gpu"
                      style={{
                        fontFamily: 'monospace',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                        willChange: 'transform',
                      }}
                    >
                      🔮 Preview Swap
                    </motion.button>
                  ) : (
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSwap}
                        disabled={isSwapping}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide transform-gpu"
                        style={{
                          fontFamily: 'monospace',
                          boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
                          textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                          willChange: 'transform',
                        }}
                      >
                        {isSwapping ? (
                          <div className="flex items-center justify-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full transform-gpu"
                              style={{ willChange: 'transform' }}
                            />
                            <span>⚡ Casting Spell...</span>
                          </div>
                        ) : (
                          '⚔️ Execute Swap'
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPreview(false)}
                        className="w-full py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide transform-gpu"
                        style={{
                          fontFamily: 'monospace',
                          willChange: 'transform',
                        }}
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
                  transition={{ delay: 0.9 }}
                  className="mt-6 p-4 bg-black/20 border border-amber-300/30 rounded-xl transform-gpu"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-300 text-sm font-bold">🎯 Mission Progress</span>
                    <span className="text-amber-300 text-sm">{swapsCompleted}/3 Swaps</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      animate={{ width: `${(swapsCompleted / 3) * 100}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transform-gpu"
                      style={{
                        boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
                        willChange: 'transform',
                      }}
                    />
                  </div>
                  <p className="text-gray-300 text-xs mt-2">
                    Complete {3 - swapsCompleted} more swaps to finish this mission and earn 500 XP!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Optimized Floating Magical Elements - Centered around content */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl opacity-20 transform-gpu"
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
                  willChange: 'transform, opacity',
                }}
              >
                {['✨', '🌟', '💫', '⭐', '🔮'][i % 5]}
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