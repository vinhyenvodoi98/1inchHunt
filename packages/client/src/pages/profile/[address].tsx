import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import Layout from '@/components/layout/Layout';
import { InventoryTab } from '@/components/profile/InventoryTab';
import { QuestsTab } from '@/components/profile/QuestsTab';
import { AchievementsTab } from '@/components/profile/AchievementsTab';
import { HistoryTab } from '@/components/profile/HistoryTab';

type TabType = 'inventory' | 'quests' | 'achievements' | 'history';

export default function ProfilePage() {
  const router = useRouter();
  const { address } = useAccount();
  const [activeTab, setActiveTab] = React.useState<TabType>('inventory');
  
  // Mock player data
  const playerData = {
    name: 'Arcane Wizard',
    avatar: '🧙‍♂️',
    level: 42,
    exp: 1850,
    maxExp: 2000,
    address: address || '0x1234...5678',
  };

  const expPercentage = (playerData.exp / playerData.maxExp) * 100;

  const tabs = [
    { id: 'inventory', label: '🧳 Inventory', icon: '🎒' },
    { id: 'quests', label: '🗺️ Quests', icon: '⚔️' },
    { id: 'achievements', label: '📜 Achievements', icon: '🏆' },
    { id: 'history', label: '📜 History', icon: '📋' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="mb-6 flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl text-purple-700 font-medium hover:bg-white transition-all duration-300 shadow-lg"
          >
            <span>←</span>
            <span>Back</span>
          </motion.button>

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg border border-purple-200 rounded-2xl p-6 mb-8 shadow-xl"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg border-4 border-white"
                >
                  {playerData.avatar}
                </motion.div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-800 font-mono">
                    {playerData.name}
                  </h1>
                  <p className="text-sm text-gray-600 font-mono">
                    {playerData.address}
                  </p>
                </div>
              </div>

              {/* Level and Stats */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="space-y-4">
                  {/* Level Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-800 font-mono">
                        Level {playerData.level}
                      </span>
                      <span className="text-sm text-gray-600 font-mono">
                        {playerData.exp} / {playerData.maxExp} XP
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border-2 border-gray-300">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${expPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-purple-100 rounded-xl p-3 text-center border border-purple-200">
                      <div className="text-2xl mb-1">⚔️</div>
                      <div className="text-sm font-bold text-purple-800 font-mono">42</div>
                      <div className="text-xs text-purple-600">Power</div>
                    </div>
                    <div className="bg-blue-100 rounded-xl p-3 text-center border border-blue-200">
                      <div className="text-2xl mb-1">🛡️</div>
                      <div className="text-sm font-bold text-blue-800 font-mono">28</div>
                      <div className="text-xs text-blue-600">Defense</div>
                    </div>
                    <div className="bg-green-100 rounded-xl p-3 text-center border border-green-200">
                      <div className="text-2xl mb-1">💚</div>
                      <div className="text-sm font-bold text-green-800 font-mono">100%</div>
                      <div className="text-xs text-green-600">Health</div>
                    </div>
                    <div className="bg-yellow-100 rounded-xl p-3 text-center border border-yellow-200">
                      <div className="text-2xl mb-1">💙</div>
                      <div className="text-sm font-bold text-yellow-800 font-mono">85%</div>
                      <div className="text-xs text-yellow-600">Mana</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg border border-purple-200 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-purple-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex-1 px-6 py-4 text-center font-mono font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-transparent text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'inventory' && <InventoryTab />}
                  {activeTab === 'quests' && <QuestsTab />}
                  {activeTab === 'achievements' && <AchievementsTab />}
                  {activeTab === 'history' && <HistoryTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Floating Particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg opacity-20"
              animate={{
                y: [0, -100, -200],
                x: [0, Math.random() * 50 - 25],
                opacity: [0.2, 0.1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
              }}
            >
              {['✨', '🌟', '💫', '⭐'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 