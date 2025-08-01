import * as React from 'react';
import { motion } from 'framer-motion';

import Layout from '@/components/layout/Layout';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
}

export default function RPGGameUI() {
  const [quests] = React.useState<Quest[]>([
    {
      id: '1',
      title: 'Slay the Shadow Beast',
      description: 'Defeat the corrupted beast in the Dark Woods',
      reward: '500 XP + Rare Sword',
      progress: 65,
    },
    {
      id: '2',
      title: 'Collect Ancient Crystals',
      description: 'Gather 5 mystical crystals from the Crystal Cave',
      reward: '300 XP + Magic Potion',
      progress: 40,
    },
    {
      id: '3',
      title: 'Rescue the Village',
      description: 'Save the villagers from the goblin raid',
      reward: '750 XP + Gold Armor',
      progress: 80,
    },
  ]);

  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Main Game Area */}
        <div className="relative z-0 flex-1 p-6">
          {/* Mission Board Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="absolute top-6 right-6 w-80"
          >
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white">
                <h3 className="text-xl font-bold flex items-center">
                  📋 Mission Board
                </h3>
              </div>
              
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {quests.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300"
                    style={{
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <h4 className="text-white font-semibold text-sm mb-2">{quest.title}</h4>
                    <p className="text-gray-300 text-xs mb-3">{quest.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{quest.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${quest.progress}%` }}
                          transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                    
                    <div className="text-xs text-amber-300 font-medium">{quest.reward}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Character Stats Floating Panel */}
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            className="absolute top-6 left-6 w-64"
          >
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-4">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center">
                ⚔️ Character Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-white">
                  <span className="text-gray-300">Strength:</span>
                  <span className="text-red-400 font-bold">85</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-gray-300">Agility:</span>
                  <span className="text-green-400 font-bold">72</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-gray-300">Intelligence:</span>
                  <span className="text-blue-400 font-bold">91</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-gray-300">Defense:</span>
                  <span className="text-yellow-400 font-bold">78</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="relative z-10 flex items-center justify-between p-4 bg-black/20 backdrop-blur-md border-t border-white/10"
        >
          <div className="flex items-center space-x-4">
            {/* Inventory Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
              }}
            >
              🎒
            </motion.button>
            
            <div className="text-white">
              <div className="text-sm font-medium">Inventory</div>
              <div className="text-xs text-gray-400">25/50 items</div>
            </div>
          </div>

          {/* Center Action Buttons */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
              }}
            >
              ⚔️ Attack
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
              }}
            >
              🛡️ Defend
            </motion.button>
          </div>

          {/* Swap Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)',
            }}
          >
            🔄 Swap
          </motion.button>
        </motion.div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
} 