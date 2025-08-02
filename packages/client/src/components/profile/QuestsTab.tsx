import * as React from 'react';
import { motion } from 'framer-motion';

interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  reward: string;
  progress: number;
  maxProgress: number;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  deadline?: string;
  completedAt?: string;
}

export const QuestsTab: React.FC = () => {
  // Mock quest data - in real app, this would come from swap history
  const quests: Quest[] = [
    {
      id: '1',
      title: 'First Fusion Swap',
      description: 'Complete your first token swap on any DEX',
      status: 'completed',
      reward: '50 XP + 🏆 Badge',
      progress: 1,
      maxProgress: 1,
      icon: '🔄',
      difficulty: 'easy',
      completedAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'ETH Master',
      description: 'Swap 1 ETH worth of tokens',
      status: 'active',
      reward: '200 XP + ⚡ Power Boost',
      progress: 0.65,
      maxProgress: 1,
      icon: '🔵',
      difficulty: 'medium',
      deadline: '2024-02-01',
    },
    {
      id: '3',
      title: 'DeFi Explorer',
      description: 'Use 3 different DEX protocols',
      status: 'active',
      reward: '150 XP + 🗺️ Explorer Badge',
      progress: 2,
      maxProgress: 3,
      icon: '🗺️',
      difficulty: 'medium',
      deadline: '2024-02-15',
    },
    {
      id: '4',
      title: 'High Roller',
      description: 'Complete a swap worth over $10,000',
      status: 'failed',
      reward: '500 XP + 💎 Diamond Badge',
      progress: 0,
      maxProgress: 1,
      icon: '💎',
      difficulty: 'hard',
      deadline: '2024-01-20',
    },
    {
      id: '5',
      title: 'Speed Demon',
      description: 'Complete 5 swaps in under 1 hour',
      status: 'completed',
      reward: '300 XP + 🏃 Speed Badge',
      progress: 5,
      maxProgress: 5,
      icon: '🏃',
      difficulty: 'hard',
      completedAt: '2024-01-18',
    },
    {
      id: '6',
      title: 'Token Collector',
      description: 'Hold 10 different tokens simultaneously',
      status: 'active',
      reward: '250 XP + 🎒 Collector Badge',
      progress: 7,
      maxProgress: 10,
      icon: '🎒',
      difficulty: 'medium',
      deadline: '2024-02-10',
    },
  ];

  const getStatusColor = (status: Quest['status']) => {
    switch (status) {
      case 'completed': return 'from-green-400 to-green-600';
      case 'active': return 'from-blue-400 to-blue-600';
      case 'failed': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyIcon = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  const completedQuests = quests.filter(q => q.status === 'completed').length;
  const activeQuests = quests.filter(q => q.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-mono">🗺️ Quests</h2>
          <p className="text-gray-600 font-mono">Complete missions to earn rewards</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="text-sm font-mono opacity-90">Completed</div>
            <div className="text-2xl font-bold font-mono">{completedQuests}</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-sm font-mono opacity-90">Active</div>
            <div className="text-2xl font-bold font-mono">{activeQuests}</div>
          </div>
        </div>
      </div>

      {/* Quest List */}
      <div className="grid gap-4">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${
              quest.status === 'completed' ? 'border-green-200' :
              quest.status === 'active' ? 'border-blue-200' :
              'border-red-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              {/* Quest Info */}
              <div className="flex items-start space-x-4 flex-1">
                <div className={`w-12 h-12 bg-gradient-to-r ${getStatusColor(quest.status)} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                  {quest.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-bold text-gray-800 font-mono">{quest.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-mono ${getDifficultyColor(quest.difficulty)}`}>
                      {getDifficultyIcon(quest.difficulty)} {quest.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 font-mono text-sm mb-2">{quest.description}</p>
                  
                  {/* Progress Bar */}
                  {quest.status === 'active' && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 font-mono mb-1">
                        <span>Progress</span>
                        <span>{quest.progress}/{quest.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Status Info */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500 font-mono">
                    {quest.deadline && quest.status === 'active' && (
                      <span>⏰ Due: {quest.deadline}</span>
                    )}
                    {quest.completedAt && quest.status === 'completed' && (
                      <span>✅ Completed: {quest.completedAt}</span>
                    )}
                    {quest.status === 'failed' && (
                      <span>❌ Failed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Reward */}
              <div className="text-right">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg p-3 text-white">
                  <div className="text-sm font-mono opacity-90">Reward</div>
                  <div className="font-bold font-mono text-sm">{quest.reward}</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {quest.status === 'active' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
              >
                🚀 Start Quest
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State (hidden when quests exist) */}
      {quests.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">No Quests Available</h3>
          <p className="text-gray-600 font-mono">Check back later for new adventures!</p>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
        >
          <div className="text-2xl mb-2">🔄</div>
          <div>Start New Swap</div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
        >
          <div className="text-2xl mb-2">📋</div>
          <div>View All Quests</div>
        </motion.button>
      </div>
    </div>
  );
}; 