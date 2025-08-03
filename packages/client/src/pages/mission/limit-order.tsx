import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import Layout from '@/components/layout/Layout';
import LevelUpAnimation from '@/components/LevelUpAnimation';
import {
  TokenSelector,
  AmountInput,
  ExpirationSelector,
  WalletConnection,
  OrderPreview,
  ActiveOrders,
  ChartPrice,
  LimitOrders,
  MissionProgress,
  type Token,
  type LimitOrder,
} from '@/components/mission';

const availableTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟐', balance: 2.5, decimals: 18, price: 3200 },
  { symbol: 'USDC', name: 'USD Coin', icon: '💎', balance: 1250.0, decimals: 6, price: 1 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿', balance: 0.15, decimals: 8, price: 65000 },
  { symbol: 'DAI', name: 'Dai Stablecoin', icon: '🪙', balance: 850.0, decimals: 18, price: 1 },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', balance: 45.2, decimals: 18, price: 12.5 },
  { symbol: 'LINK', name: 'Chainlink', icon: '🔗', balance: 120.5, decimals: 18, price: 18.2 },
  { symbol: 'AAVE', name: 'Aave', icon: '🦇', balance: 8.7, decimals: 18, price: 95.3 },
];

export default function LimitOrderMissionPage() {
  const router = useRouter();
  
  // Form state
  const [fromToken, setFromToken] = React.useState<Token>(availableTokens[0]);
  const [toToken, setToToken] = React.useState<Token>(availableTokens[1]);
  const [amount, setAmount] = React.useState<string>('');
  const [price, setPrice] = React.useState<string>('');
  const [expiration, setExpiration] = React.useState<string>('1h');
  const [chartPeriod, setChartPeriod] = React.useState<string>('24H');
  
  // UI state
  const [showPreview, setShowPreview] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const [ordersCompleted, setOrdersCompleted] = React.useState(0);
  const [activeOrders, setActiveOrders] = React.useState<LimitOrder[]>([]);
  
  // Wagmi wallet hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

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
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }
    if (!amount || !price || parseFloat(amount) <= 0 || parseFloat(price) <= 0) {
      alert('Please fill in all required fields!');
      return;
    }
    setShowPreview(true);
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

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Here you would typically submit the order to a real blockchain or API
      // For now, we'll simulate the process but not create mock orders
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear form
      setAmount('');
      setPrice('');
      setShowPreview(false);
      
      // Update mission progress
      setOrdersCompleted(prev => prev + 1);
      addExperience(1000); // More XP for limit orders
      
      // Note: Real orders would be fetched from the 1inch API via the LimitOrders component
      // The ActiveOrders component will show orders from the real API, not mock data
      
    } catch (error) {
      console.error('Error submitting order:', error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    // In a real implementation, this would call the blockchain or API to cancel the order
    console.log('Cancelling order:', orderId);
    // Real order cancellation would be handled by the 1inch API
  };

  const handleLevelUpComplete = () => {
    setShowLevelUp(false);
  };

  const getCurrentPrice = () => {
    return (fromToken.price / toToken.price).toFixed(4);
  };

  const handleMaxAmount = () => {
    setAmount(fromToken.balance.toString());
  };

  const handleMarketPrice = () => {
    setPrice(getCurrentPrice());
  };

  console.log('Limit order page - isConnected:', isConnected, 'address:', address);

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
          <div className="relative z-20 w-full max-w-7xl mx-4">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-4"
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
              className="mb-6"
            >
              <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3">
                <h1 className="text-3xl font-bold text-white text-center">
                  📊 Limit Order Mission
                </h1>
                <p className="text-gray-300 text-lg text-center mt-1">
                  Master the art of strategic trading with limit orders
                </p>
              </div>
            </motion.div>

                    {/* Mission Progress */}
        <MissionProgress
          completed={ordersCompleted}
          total={2}
          title="🎯 Mission Progress"
        />

            {/* Main Layout - Chart and Form Side by Side */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Large Chart */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="xl:col-span-2"
              >
                <div className="bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-cyan-900/90 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      📈 Price Chart
                    </h2>
                    <p className="text-gray-300 text-sm">{fromToken.symbol}/{toToken.symbol} • {chartPeriod} Period</p>
                  </div>
                  
                  <ChartPrice
                    fromToken={fromToken}
                    toToken={toToken}
                    period={chartPeriod}
                    chainId={1}
                    className="w-full"
                    onPeriodChange={setChartPeriod}
                  />
                </div>
              </motion.div>

              {/* Right Column - Limit Order Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                className="xl:col-span-1"
              >
                <div className="sticky top-8">
                  <div className="bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-cyan-900/90 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-6 shadow-2xl">
                    {/* Panel Header */}
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-white mb-2">
                        ⚡ LIMIT ORDER ⚡
                      </h2>
                      <p className="text-gray-300 text-sm">Set your price, set your strategy</p>
                    </div>

                    <div className="space-y-4">
                      {/* From Token */}
                      <TokenSelector
                        label="From"
                        selectedToken={fromToken}
                        onTokenChange={setFromToken}
                        availableTokens={availableTokens}
                        disabled={!isConnected}
                      />

                      {/* Amount Input */}
                      <AmountInput
                        label="Amount"
                        value={amount}
                        onChange={setAmount}
                        placeholder="0.0"
                        maxValue={fromToken.balance}
                        onMaxClick={handleMaxAmount}
                        disabled={!isConnected}
                      />

                      {/* Swap Direction Button */}
                      <div className="flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 180 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleSwapTokens}
                          className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg border-2 border-white/20"
                        >
                          ⇅
                        </motion.button>
                      </div>

                      {/* To Token */}
                      <TokenSelector
                        label="To"
                        selectedToken={toToken}
                        onTokenChange={setToToken}
                        availableTokens={availableTokens}
                        disabled={!isConnected}
                      />

                      {/* Price Input */}
                      <AmountInput
                        label={`Limit Price (${toToken.symbol}/${fromToken.symbol})`}
                        value={price}
                        onChange={setPrice}
                        placeholder={getCurrentPrice()}
                        onMaxClick={handleMarketPrice}
                        disabled={!isConnected}
                      />

                      {/* Current Price Display */}
                      <div className="text-right text-xs text-gray-400">
                        Current Price: {getCurrentPrice()} {toToken.symbol}/{fromToken.symbol}
                      </div>

                      {/* Expiration Selector */}
                      <ExpirationSelector
                        selectedExpiration={expiration}
                        onExpirationChange={setExpiration}
                        disabled={!isConnected}
                      />

                      {/* Action Button */}
                      {!showPreview && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePreview}
                          disabled={!isConnected || !amount || !price || parseFloat(amount) <= 0 || parseFloat(price) <= 0}
                          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide text-sm"
                        >
                          🔮 Preview Order
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Preview Modal */}
            <OrderPreview
              isVisible={showPreview}
              fromToken={fromToken}
              toToken={toToken}
              amount={amount}
              price={price}
              expiration={expiration}
              orderType="buy"
              onConfirm={handleSubmitOrder}
              onCancel={() => setShowPreview(false)}
              isSubmitting={isSubmitting}
            />

            {/* Active Orders - Only show if there are real orders */}
            {activeOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                className="mt-8"
              >
                <ActiveOrders
                  orders={activeOrders}
                  onCancelOrder={handleCancelOrder}
                />
              </motion.div>
            )}

            {/* Real Limit Orders from 1inch */}
            {isConnected && address && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
                className="mt-8"
              >
                <LimitOrders
                  address={address}
                  chainId={1}
                  limit={20}
                  statuses="1,2,3"
                  onOrderClick={(order) => {
                    console.log('Clicked order:', order);
                    // Handle order click - could open details modal, etc.
                  }}
                />
              </motion.div>
            )}
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