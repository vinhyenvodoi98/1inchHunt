import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import Layout from '@/components/layout/Layout';
import LevelUpAnimation from '@/components/LevelUpAnimation';
import { MissionProgress } from '@/components/mission';
import { GameStorage, UserCharacter } from '@/utils/localStorage';

interface ShareStatus {
  id: string;
  text: string;
  hashtags: string[];
  expReward: number;
  isCompleted: boolean;
}

export default function ShareMissionPage() {
  const router = useRouter();
  
  // Mission state
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const [sharesCompleted, setSharesCompleted] = React.useState(() => {
    return GameStorage.getSharesCompleted();
  });
  const [selectedStatus, setSelectedStatus] = React.useState<ShareStatus | null>(null);
  const [isSharing, setIsSharing] = React.useState(false);
  const [customMessage, setCustomMessage] = React.useState('');
  const [showVerification, setShowVerification] = React.useState(false);
  const [verificationStatus, setVerificationStatus] = React.useState<'pending' | 'verified' | 'failed'>('pending');
  const [autoVerifyCountdown, setAutoVerifyCountdown] = React.useState(10);
  
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

  // Available share statuses
  const [shareStatuses, setShareStatuses] = React.useState<ShareStatus[]>([
    {
      id: '1',
      text: "🚀 Just built an amazing DeFi game at the 1inch Hackathon! The 1inch API is absolutely incredible - seamless price charts, real-time orderbook data, and lightning-fast token info. #1inchHackathon #1inchAPI #DeFi #Web3 #1inchHunt",
      hashtags: ['#1inchHackathon', '#1inchAPI', '#DeFi', '#Web3', '#1inchHunt'],
      expReward: 500,
      isCompleted: false,
    },
  ]);

  const addExperience = (amount: number) => {
    setCharacter(prev => {
      const newExp = prev.exp + amount;
      const level = Math.floor(newExp / 500);
      const expInLevel = newExp % 500;
      
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

  const handleShareToTwitter = async (status: ShareStatus) => {
    setIsSharing(true);
    
    try {
      // Create the tweet text
      const tweetText = customMessage || status.text;
      const encodedText = encodeURIComponent(tweetText);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
      
      // Open Twitter in new window
      window.open(twitterUrl, '_blank', 'width=600,height=400');
      
      // Show verification options after sharing
      setTimeout(() => {
        setIsSharing(false);
        setShowVerification(true);
      }, 2000);
      
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      setIsSharing(false);
    }
  };

  const handleManualVerification = async (status: ShareStatus) => {
    console.log('Starting manual verification for status:', status.id);
    setVerificationStatus('pending');
    
    // Simulate manual verification process
    setTimeout(() => {
      console.log('Manual verification completed');
      setVerificationStatus('verified');
      setSharesCompleted(prev => {
        const newCount = prev + 1;
        console.log('Updating shares completed from', prev, 'to', newCount);
        // Save to localStorage
        GameStorage.saveSharesCompleted(newCount);
        return newCount;
      });
      addExperience(status.expReward);
      
      // Mark status as completed
      setShareStatuses(prev => {
        console.log('Updating share statuses:', prev);
        return prev.map(s => 
          s.id === status.id ? { ...s, isCompleted: true } : s
        );
      });

      // Reset states after 3 seconds
      setTimeout(() => {
        console.log('Resetting verification states');
        setShowVerification(false);
        setVerificationStatus('pending');
        setSelectedStatus(null);
        setCustomMessage('');
      }, 3000);
    }, 1500);
  };

  // Auto-verification after 10 seconds
  React.useEffect(() => {
    if (showVerification && selectedStatus && verificationStatus === 'pending') {
      // Reset countdown when verification starts
      setAutoVerifyCountdown(10);
      
      // Countdown timer
      const countdownTimer = setInterval(() => {
        setAutoVerifyCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const autoVerifyTimer = setTimeout(() => {
        clearInterval(countdownTimer);
        setVerificationStatus('verified');
        setSharesCompleted(prev => {
          const newCount = prev + 1;
          // Save to localStorage
          GameStorage.saveSharesCompleted(newCount);
          return newCount;
        });
        addExperience(selectedStatus.expReward);
        
        // Mark status as completed
        setShareStatuses(prev => {
          return prev.map(s => 
            s.id === selectedStatus.id ? { ...s, isCompleted: true } : s
          );
        });

        // Reset states after 3 seconds
        setTimeout(() => {
          setShowVerification(false);
          setVerificationStatus('pending');
          setSelectedStatus(null);
          setCustomMessage('');
          setAutoVerifyCountdown(10);
        }, 3000);
      }, 10000); // 10 seconds

      // Cleanup timers if component unmounts or verification changes
      return () => {
        clearTimeout(autoVerifyTimer);
        clearInterval(countdownTimer);
      };
    }
  }, [showVerification, selectedStatus, verificationStatus]);

  const handleAPIVerification = async (status: ShareStatus) => {
    setVerificationStatus('pending');
    
    try {
      const tweetText = customMessage || status.text;
      
      // Call our verification API
      const response = await fetch('/api/verify-tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tweetText,
          userId: 'user_id_here', // Would need to get from Twitter auth
        }),
      });

      const result = await response.json();
      
      if (result.verified) {
        setVerificationStatus('verified');
        setSharesCompleted(prev => {
          const newCount = prev + 1;
          // Save to localStorage
          GameStorage.saveSharesCompleted(newCount);
          return newCount;
        });
        addExperience(status.expReward);
        
        // Mark status as completed
        setShareStatuses(prev => prev.map(s => 
          s.id === status.id ? { ...s, isCompleted: true } : s
        ));
      } else {
        setVerificationStatus('failed');
      }
      
      // Reset states after 3 seconds
      setTimeout(() => {
        setShowVerification(false);
        setVerificationStatus('pending');
        setSelectedStatus(null);
        setCustomMessage('');
      }, 3000);
    } catch (error) {
      setVerificationStatus('failed');
      setTimeout(() => {
        setShowVerification(false);
        setVerificationStatus('pending');
      }, 3000);
    }
  };

  const handleLevelUpComplete = () => {
    setShowLevelUp(false);
  };

  const handleStatusSelect = (status: ShareStatus) => {
    setSelectedStatus(status);
    setCustomMessage(status.text);
  };

  return (
    <>
      <Layout>
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
          {/* Mission Background */}
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
                    <defs>
                      <pattern id="social" patternUnits="userSpaceOnUse" width="100" height="100">
                        <circle cx="20" cy="20" r="1" fill="#1da1f2" opacity="0.8"/>
                        <circle cx="80" cy="40" r="0.5" fill="#1da1f2" opacity="0.6"/>
                        <circle cx="50" cy="70" r="1.5" fill="#1da1f2" opacity="0.9"/>
                        <circle cx="10" cy="90" r="0.8" fill="#1da1f2" opacity="0.7"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#social)"/>
                    <path d="M0,400 Q300,200 600,350 T1200,300" stroke="#1da1f2" stroke-width="2" fill="none" opacity="0.3"/>
                    <path d="M0,500 Q400,250 800,400 T1200,450" stroke="#1da1f2" stroke-width="1.5" fill="none" opacity="0.2"/>
                  </svg>
                `)}`,
              }}
            />
          </div>

          {/* Main Content Container */}
          <div className="relative z-20 w-full max-w-4xl mx-4 flex flex-col space-y-6">
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
                className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-white font-medium shadow-lg hover:border-blue-400/50 transition-all duration-300"
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
                  📱 Social Share Mission
                </h1>
                <p className="text-gray-300 text-sm text-center mt-1">
                  Share your 1inchHunt experience and earn rewards
                </p>
              </div>
            </motion.div>

            {/* Mission Progress */}
            <MissionProgress
              completed={sharesCompleted}
              total={1}
              title="📱 Share Progress"
            />

            {/* Verification Modal */}
            {showVerification && selectedStatus && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  🔍 Verify Your Tweet
                </h3>
                
                <div className="mb-6">
                  <p className="text-gray-300 text-sm text-center mb-4">
                    Please verify that you've shared the tweet to earn your rewards.
                  </p>
                  
                  {/* Auto-verification countdown */}
                  {verificationStatus === 'pending' && (
                    <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-3 mb-4 text-center">
                      <div className="text-amber-300 text-sm font-medium mb-1">
                        ⏰ Verification in progress...
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          animate={{ width: `${((10 - autoVerifyCountdown) / 10) * 100}%` }}
                          transition={{ duration: 1, ease: 'linear' }}
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 mb-4">
                    <div className="text-blue-300 text-sm font-medium mb-2">Shared Tweet:</div>
                    <div className="text-white text-sm">
                      {customMessage || selectedStatus.text}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Manual Verification */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleManualVerification(selectedStatus)}
                    disabled={verificationStatus === 'pending'}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300"
                  >
                    {verificationStatus === 'pending' ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Verifying...</span>
                      </div>
                    ) : verificationStatus === 'verified' ? (
                      '✅ Verified Successfully!'
                    ) : (
                      '✅ I Shared the Tweet (Manual Verification)'
                    )}
                  </motion.button>

                  {/* API Verification (if configured) */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAPIVerification(selectedStatus)}
                    disabled={verificationStatus === 'pending'}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300"
                  >
                    {verificationStatus === 'pending' ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Checking Twitter...</span>
                      </div>
                    ) : verificationStatus === 'verified' ? (
                      '✅ Verified Successfully!'
                    ) : (
                      '🔍 Verify via Twitter API'
                    )}
                  </motion.button>

                  {/* Cancel */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowVerification(false);
                      setVerificationStatus('pending');
                    }}
                    className="w-full py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                </div>

                {/* Verification Status */}
                {verificationStatus === 'verified' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-green-500/20 border border-green-400/50 rounded-lg p-3 text-center"
                  >
                    <div className="text-green-400 font-bold">🎉 Verification Successful!</div>
                    <div className="text-green-300 text-sm">
                      You earned {selectedStatus.expReward} EXP!
                    </div>
                  </motion.div>
                )}

                {verificationStatus === 'failed' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-red-500/20 border border-red-400/50 rounded-lg p-3 text-center"
                  >
                    <div className="text-red-400 font-bold">❌ Verification Failed</div>
                    <div className="text-red-300 text-sm">
                      Please make sure you've shared the tweet and try again.
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Share Statuses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shareStatuses.map((status, index) => (
                <motion.div
                  key={status.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
                  className={`relative bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-xl border-2 rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
                    status.isCompleted 
                      ? 'border-green-400/50 bg-green-500/10' 
                      : 'border-white/20 hover:border-blue-400/50'
                  }`}
                >
                  {/* Completion Badge */}
                  {status.isCompleted && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      ✅ COMPLETED
                    </div>
                  )}

                  {/* Status Content */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">Share #{status.id}</h3>
                      <div className="text-blue-400 font-bold">+{status.expReward} EXP</div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {status.text}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {status.hashtags.map((hashtag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded-full"
                        >
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  {!status.isCompleted ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusSelect(status)}
                      disabled={isSharing}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide text-sm"
                    >
                      {isSharing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Sharing...</span>
                        </div>
                      ) : (
                        '🐦 Share to Twitter'
                      )}
                    </motion.button>
                  ) : (
                    <div className="w-full py-3 bg-green-500/20 border border-green-400/50 text-green-400 font-bold rounded-xl text-center text-sm">
                      ✅ Shared Successfully
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Custom Share Section */}
            {selectedStatus && !selectedStatus.isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  ✏️ Customize Your Share
                </h3>
                
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Customize your message or use the default..."
                    className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-400 focus:outline-none transition-all duration-300"
                    rows={3}
                    maxLength={280}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {customMessage.length}/280 characters
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleShareToTwitter(selectedStatus)}
                    disabled={isSharing}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide text-sm"
                  >
                    {isSharing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Sharing to Twitter...</span>
                      </div>
                    ) : (
                      '🐦 Share Now'
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedStatus(null);
                      setCustomMessage('');
                    }}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                </div>
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
                {['📱', '🐦', '📢', '🌟', '💬', '📤', '🎯', '✨'][i % 8]}
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