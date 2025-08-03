import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import CharacterCard from '@/components/CharacterCard';
import GameMap from '@/components/GameMap';
import MissionCard from '@/components/MissionCard';
import { GameStorage, UserCharacter } from '@/utils/localStorage';

export default function HomePage() {
  // Character selection state
  const [selectedCharacter, setSelectedCharacter] = React.useState<UserCharacter | null>(() => {
    return GameStorage.getCharacter();
  });

  // Notification state
  const [showNotification, setShowNotification] = React.useState(false);
  const [notificationMessage, setNotificationMessage] = React.useState('');
  const [notificationType, setNotificationType] = React.useState<'success' | 'reset'>('success');

  // Handle character selection
  const handleCharacterSelect = (character: UserCharacter) => {
    setSelectedCharacter(character);
    
    // Save to localStorage
    GameStorage.saveCharacter(character);
    
    // Show success notification
    setNotificationMessage(`${character.name} selected successfully!`);
    setNotificationType('success');
    setShowNotification(true);
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Character gallery data - all start from level 0
  const characterGallery = [
    {
      name: "Elven Mage",
      avatar: "🧝‍♀️",
    },
    {
      name: "Dragon Warrior", 
      avatar: "🐉",
    },
    {
      name: "Shadow Rogue",
      avatar: "🥷",
    },
    {
      name: "Crystal Healer",
      avatar: "🔮",
    },
    {
      name: "Fire Wizard",
      avatar: "🧙‍♂️",
    },
    {
      name: "Forest Guardian",
      avatar: "🌳",
    },
    {
      name: "Storm Caller",
      avatar: "⚡",
    },
    {
      name: "Moon Archer",
      avatar: "🏹",
    },
  ];

  return (
    <div>
      {/* Enhanced Success Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            {/* Main notification container */}
            <div className="relative">
              {/* Background glow effect */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`absolute inset-0 rounded-3xl blur-xl ${
                  notificationType === 'success' 
                    ? 'bg-gradient-to-r from-amber-400/60 to-orange-500/60' 
                    : 'bg-gradient-to-r from-blue-400/60 to-purple-500/60'
                }`}
              />

              {/* Main notification card */}
              <motion.div
                className={`relative bg-gradient-to-r backdrop-blur-xl border-2 rounded-3xl px-8 py-6 shadow-2xl max-w-md ${
                  notificationType === 'success'
                    ? 'from-amber-500/90 to-orange-500/90 border-amber-300/50'
                    : 'from-blue-500/90 to-purple-500/90 border-blue-300/50'
                }`}
                style={{
                  boxShadow: notificationType === 'success'
                    ? '0 0 40px rgba(245, 158, 11, 0.6), 0 0 80px rgba(251, 191, 36, 0.3)'
                    : '0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(147, 51, 234, 0.3)'
                }}
              >
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-white/60 rounded-sm"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-white/60 rounded-sm"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 bg-white/60 rounded-sm"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 bg-white/60 rounded-sm"></div>

                {/* Inner border */}
                <div className="absolute inset-3 border border-white/30 rounded-2xl pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon and title */}
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                      className={`text-4xl ${
                        notificationType === 'success' ? 'animate-bounce' : 'animate-pulse'
                      }`}
                    >
                      {notificationType === 'success' ? '🎉' : '🔄'}
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <h3 className={`text-xl font-bold text-white ${
                        notificationType === 'success' ? 'text-amber-100' : 'text-blue-100'
                      }`}>
                        {notificationType === 'success' ? 'Character Selected!' : 'Character Reset!'}
                      </h3>
                    </motion.div>
                  </div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center mb-4"
                  >
                    <p className="text-white/90 font-medium">
                      {notificationMessage}
                    </p>
                    <p className="text-white/70 text-sm mt-1">
                      {notificationType === 'success' 
                        ? 'Your character has been synced across the game!' 
                        : 'All progress has been cleared.'
                      }
                    </p>
                  </motion.div>

                  {/* Progress bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4.5, delay: 0.6 }}
                    className="h-1 bg-white/20 rounded-full overflow-hidden"
                  >
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 4.5, delay: 0.6 }}
                      className={`h-full rounded-full ${
                        notificationType === 'success' 
                          ? 'bg-gradient-to-r from-amber-300 to-orange-300' 
                          : 'bg-gradient-to-r from-blue-300 to-purple-300'
                      }`}
                    />
                  </motion.div>

                  {/* Close button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowNotification(false)}
                    className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors p-1"
                  >
                    ✕
                  </motion.button>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        opacity: 0, 
                        scale: 0,
                        x: Math.random() * 200 - 100,
                        y: Math.random() * 200 - 100
                      }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: Math.random() * 300 - 150,
                        y: Math.random() * 300 - 150
                      }}
                      transition={{
                        duration: 2 + Math.random() * 1,
                        delay: 0.8 + Math.random() * 0.5,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 2
                      }}
                      className={`absolute w-2 h-2 rounded-full ${
                        notificationType === 'success' 
                          ? 'bg-amber-300' 
                          : 'bg-blue-300'
                      }`}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 -skew-x-12 pointer-events-none rounded-3xl"
                  animate={{
                    opacity: [0, 1, 0],
                    x: [-200, 400],
                  }}
                  transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Map Demo Section */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              🗺️ Game World Map
            </span>
          </h2>
          
          <div className="mb-12">
            <GameMap />
          </div>
        </div>
      </div>

      {/* Character Cards Demo Section */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🏰 Character Gallery
            </span>
          </h2>
          
          {/* Selection status */}
          {selectedCharacter && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-full px-6 py-3">
                <span className="text-2xl">{selectedCharacter.avatar}</span>
                <div>
                  <div className="text-amber-300 font-bold">{selectedCharacter.name}</div>
                  <div className="text-amber-200/70 text-sm">Level {selectedCharacter.level} • {selectedCharacter.exp} EXP</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCharacter(null);
                    GameStorage.saveCharacter({
                      level: 0,
                      exp: 0,
                      maxExp: 500,
                      name: 'New Adventurer',
                      avatar: '👤',
                    });
                    
                    // Show reset notification
                    setNotificationMessage('Character reset to default');
                    setNotificationType('reset');
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 5000);
                  }}
                  className="text-amber-300 hover:text-amber-100 transition-colors"
                  title="Clear selection"
                >
                  ✕
                </motion.button>
              </div>
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {/* Character cards - all start from level 0 */}
            {characterGallery.map((char, index) => (
              <motion.div
                key={char.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CharacterCard 
                  name={char.name}
                  avatar={char.avatar}
                  onSelect={handleCharacterSelect}
                  isSelected={selectedCharacter?.name === char.name}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Cards Demo Section */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              🎯 Available Missions
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <MissionCard 
              title="Basic Swap"
              description="Learn the fundamentals of token swapping"
              difficulty="easy"
              reward="100 EXP"
              missionType="swap"
            />
            
            <MissionCard 
              title="Advanced Swap"
              description="Master advanced swapping techniques"
              difficulty="medium"
              reward="200 EXP"
              missionType="advanced-swap"
            />
            
            <MissionCard 
              title="Limit Orders"
              description="Set and manage limit orders"
              difficulty="hard"
              reward="300 EXP"
              missionType="limit-order"
            />
            
            <MissionCard 
              title="Social Share"
              description="Share your experience and earn rewards"
              difficulty="easy"
              reward="50 EXP"
              missionType="share"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
