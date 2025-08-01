import * as React from 'react';
import { motion } from 'framer-motion';

import LevelUpAnimation from '@/components/LevelUpAnimation';

interface CharacterCardProps {
  name?: string;
  level?: number;
  experience?: number;
  maxExperience?: number;
  avatar?: string;
  className?: string;
}

export default function CharacterCard({
  name = 'Elven Mage',
  level = 42,
  experience = 1250,
  maxExperience = 2000,
  avatar = '🧝‍♀️',
  className = '',
}: CharacterCardProps) {
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const [character, setCharacter] = React.useState({
    level,
    exp: experience,
    maxExp: maxExperience,
    name,
    avatar,
  });

  const expPercentage = (character.exp / character.maxExp) * 100;

  // Function to add experience and trigger level up
  const addExperience = (amount: number) => {
    setCharacter(prev => {
      const newExp = prev.exp + amount;
      if (newExp >= prev.maxExp) {
        // Trigger level up animation
        setTimeout(() => setShowLevelUp(true), 300);
        return {
          ...prev,
          level: prev.level + 1,
          exp: newExp - prev.maxExp, // Carry over excess EXP
          maxExp: Math.floor(prev.maxExp * 1.2), // Increase EXP requirement
        };
      }
      return { ...prev, exp: newExp };
    });
  };

  const handleLevelUpComplete = () => {
    setShowLevelUp(false);
  };

  return (
    <>
      <motion.div
        whileHover={{
          scale: 1.02,
          y: -5,
          boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-indigo-900/80 backdrop-blur-lg border-2 border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden ${className}`}
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          background: `
            linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(99, 102, 241, 0.1) 100%),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            )
          `,
        }}
      >
        {/* Pixel-art style corner decorations */}
        <div className="absolute top-2 left-2 w-3 h-3 bg-amber-400/60 rounded-sm"></div>
        <div className="absolute top-2 right-2 w-3 h-3 bg-amber-400/60 rounded-sm"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 bg-amber-400/60 rounded-sm"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-amber-400/60 rounded-sm"></div>

        {/* Inner border for pixel-art effect */}
        <div className="absolute inset-3 border border-amber-300/30 rounded-xl pointer-events-none"></div>

        {/* Character Avatar */}
        <div className="flex flex-col items-center mb-4">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="relative w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-3"
            style={{
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
            }}
          >
            {character.avatar}

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>

            {/* Pixel corners on avatar */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-amber-300 rounded-sm"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-300 rounded-sm"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-amber-300 rounded-sm"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-amber-300 rounded-sm"></div>
          </motion.div>

          {/* Character Name */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-white mb-1 text-center"
            style={{
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(168, 85, 247, 0.3)',
            }}
          >
            {character.name}
          </motion.h3>

          {/* Level Badge with Level Up Button */}
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
              style={{
                boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)',
              }}
            >
              Level {character.level}
            </motion.div>

            {/* Level Up Test Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.9 }}
              onClick={() => addExperience(1000)}
              className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-full transition-all duration-300"
              title="Add 1000 EXP (Test Level Up)"
            >
              ⚡
            </motion.button>
          </div>
        </div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm font-medium">Experience</span>
            <span className="text-amber-300 text-sm font-bold">
              {character.exp} / {character.maxExp}
            </span>
          </div>

          {/* Experience Progress Bar */}
          <div className="relative">
            {/* Background bar with pixel effect */}
            <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden border border-gray-600/50">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700/30 to-gray-600/30"></div>
            </div>

            {/* Progress bar */}
            <motion.div
              animate={{ width: `${expPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute top-0 h-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full shadow-lg"
              style={{
                boxShadow: '0 0 10px rgba(147, 51, 234, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}
            />

            {/* Glow effect on progress bar */}
            <motion.div
              animate={{ width: `${expPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute top-0 h-3 bg-gradient-to-r from-blue-300/50 via-purple-400/50 to-pink-400/50 rounded-full blur-sm"
            />
          </div>

          {/* Progress percentage */}
          <div className="text-center">
            <span className="text-xs text-gray-400">
              {Math.round(expPercentage)}% to next level
            </span>
          </div>
        </motion.div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full opacity-40"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 1,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 -skew-x-12 pointer-events-none rounded-2xl"
          whileHover={{
            opacity: [0, 1, 0],
            x: [-100, 300],
          }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>

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