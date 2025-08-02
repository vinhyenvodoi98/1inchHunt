import * as React from 'react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  reward: string;
}

export const AchievementsTab: React.FC = () => {
  // Mock achievement data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Fusion Swap',
      description: 'Complete your first token swap',
      icon: '🔄',
      rarity: 'common',
      unlocked: true,
      unlockedAt: '2024-01-10',
      reward: '50 XP',
    },
    {
      id: '2',
      title: 'ETH Master',
      description: 'Swap 1 ETH worth of tokens',
      icon: '🔵',
      rarity: 'rare',
      unlocked: true,
      unlockedAt: '2024-01-15',
      reward: '200 XP',
    },
    {
      id: '3',
      title: 'DeFi Explorer',
      description: 'Use 3 different DEX protocols',
      icon: '🗺️',
      rarity: 'rare',
      unlocked: true,
      unlockedAt: '2024-01-18',
      reward: '150 XP',
    },
    {
      id: '4',
      title: 'High Roller',
      description: 'Complete a swap worth over $10,000',
      icon: '💎',
      rarity: 'epic',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      reward: '500 XP',
    },
    {
      id: '5',
      title: 'Speed Demon',
      description: 'Complete 5 swaps in under 1 hour',
      icon: '🏃',
      rarity: 'epic',
      unlocked: true,
      unlockedAt: '2024-01-20',
      reward: '300 XP',
    },
    {
      id: '6',
      title: 'Token Collector',
      description: 'Hold 10 different tokens simultaneously',
      icon: '🎒',
      rarity: 'rare',
      unlocked: false,
      progress: 7,
      maxProgress: 10,
      reward: '250 XP',
    },
    {
      id: '7',
      title: 'Chain Master',
      description: 'Swap on 5 different blockchains',
      icon: '⛓️',
      rarity: 'legendary',
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      reward: '1000 XP',
    },
    {
      id: '8',
      title: 'Lucky Trader',
      description: 'Make a profit on 10 consecutive swaps',
      icon: '🍀',
      rarity: 'legendary',
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      reward: '1500 XP',
    },
    {
      id: '9',
      title: 'Gas Optimizer',
      description: 'Complete 50 swaps with optimal gas usage',
      icon: '⛽',
      rarity: 'epic',
      unlocked: false,
      progress: 23,
      maxProgress: 50,
      reward: '400 XP',
    },
    {
      id: '10',
      title: 'Weekend Warrior',
      description: 'Complete 100 swaps in a single weekend',
      icon: '⚔️',
      rarity: 'legendary',
      unlocked: false,
      progress: 0,
      maxProgress: 100,
      reward: '2000 XP',
    },
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-200';
      case 'rare': return 'shadow-blue-200';
      case 'epic': return 'shadow-purple-200';
      case 'legendary': return 'shadow-yellow-200';
      default: return 'shadow-gray-200';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-mono">📜 Achievements</h2>
          <p className="text-gray-600 font-mono">Unlock badges and rewards</p>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
          <div className="text-sm font-mono opacity-90">Progress</div>
          <div className="text-2xl font-bold font-mono">{unlockedAchievements}/{totalAchievements}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex justify-between text-sm text-gray-600 font-mono mb-2">
          <span>Overall Progress</span>
          <span>{Math.round((unlockedAchievements / totalAchievements) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedAchievements / totalAchievements) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
          />
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300 ${
              achievement.unlocked 
                ? `${getRarityBorder(achievement.rarity)} ${getRarityGlow(achievement.rarity)}` 
                : 'border-gray-200 opacity-60'
            }`}
          >
            {/* Achievement Icon */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-xl flex items-center justify-center text-2xl shadow-lg ${
                !achievement.unlocked && 'grayscale'
              }`}>
                {achievement.icon}
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-mono ${
                  achievement.rarity === 'common' ? 'bg-gray-100 text-gray-600' :
                  achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                  achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {achievement.rarity.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Achievement Info */}
            <div className="space-y-2">
              <h3 className={`font-bold font-mono ${
                achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {achievement.title}
              </h3>
              <p className={`text-sm font-mono ${
                achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {achievement.description}
              </p>

                             {/* Progress Bar for Locked Achievements */}
               {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                 <div className="mt-3">
                   <div className="flex justify-between text-xs text-gray-500 font-mono mb-1">
                     <span>Progress</span>
                     <span>{achievement.progress}/{achievement.maxProgress}</span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                     <motion.div
                       initial={{ width: 0 }}
                       animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                       transition={{ duration: 1, delay: 0.5 }}
                       className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
                     />
                   </div>
                 </div>
               )}

              {/* Unlock Date */}
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="text-xs text-green-600 font-mono">
                  ✅ Unlocked: {achievement.unlockedAt}
                </div>
              )}

              {/* Reward */}
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg p-2 text-white">
                <div className="text-xs font-mono opacity-90">Reward</div>
                <div className="font-bold font-mono text-sm">{achievement.reward}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State (hidden when achievements exist) */}
      {achievements.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">No Achievements</h3>
          <p className="text-gray-600 font-mono">Start trading to unlock achievements!</p>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
        >
          <div className="text-2xl mb-2">🏆</div>
          <div>View Leaderboard</div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
        >
          <div className="text-2xl mb-2">🔄</div>
          <div>Start Trading</div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
        >
          <div className="text-2xl mb-2">📊</div>
          <div>View Stats</div>
        </motion.button>
      </div>
    </div>
  );
}; 