import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStorage } from '@/utils/localStorage';

interface LevelUpAnimationProps {
  isVisible: boolean;
  oldLevel?: number;
  newLevel?: number;
  onComplete: () => void;
  character?: {
    name?: string;
    avatar?: string;
  };
}

export default function LevelUpAnimation({
  isVisible,
  oldLevel,
  newLevel,
  onComplete,
  character = { name: 'Hero', avatar: '🧙‍♂️' }
}: LevelUpAnimationProps) {
  const [showLevelNumber, setShowLevelNumber] = React.useState(false);
  const [showParticles, setShowParticles] = React.useState(false);
  
  // Get the actual character data from localStorage
  const [actualCharacter, setActualCharacter] = React.useState(() => {
    return GameStorage.getCharacter() || {
      level: 0,
      exp: 0,
      maxExp: 500,
      name: character.name || 'Hero',
      avatar: character.avatar || '🧙‍♂️',
    };
  });

  // Calculate the correct old and new levels
  const correctNewLevel = actualCharacter.level;
  const correctOldLevel = Math.max(0, correctNewLevel - 1);

  React.useEffect(() => {
    if (isVisible) {
      // Update character data from localStorage when animation starts
      const storedCharacter = GameStorage.getCharacter();
      if (storedCharacter) {
        setActualCharacter(storedCharacter);
      }
      
      // Sequence the animations
      const timer1 = setTimeout(() => setShowLevelNumber(true), 1000);
      const timer2 = setTimeout(() => setShowParticles(true), 500);
      const timer3 = setTimeout(() => {
        setShowLevelNumber(false);
        setShowParticles(false);
        onComplete();
      }, 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Main Level Up Container */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative flex flex-col items-center"
          >
            {/* Character Avatar with Glow */}
            <motion.div
              initial={{ scale: 0.8, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative mb-6"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(251, 191, 36, 0.4)',
                    '0 0 40px rgba(251, 191, 36, 0.8)',
                    '0 0 60px rgba(251, 191, 36, 1)',
                    '0 0 40px rgba(251, 191, 36, 0.8)',
                    '0 0 20px rgba(251, 191, 36, 0.4)',
                  ],
                  scale: [1, 1.1, 1.2, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-5xl border-4 border-amber-300"
              >
                {actualCharacter.avatar}
              </motion.div>

              {/* Rotating Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-amber-400/30 rounded-full"
                style={{ transform: 'scale(1.3)' }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border border-yellow-300/20 rounded-full"
                style={{ transform: 'scale(1.6)' }}
              />
            </motion.div>

            {/* Level Up Text */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="mb-4"
            >
              <motion.h1
                animate={{
                  textShadow: [
                    '0 0 10px rgba(251, 191, 36, 0.5)',
                    '0 0 20px rgba(251, 191, 36, 0.8)',
                    '0 0 30px rgba(251, 191, 36, 1)',
                    '0 0 20px rgba(251, 191, 36, 0.8)',
                    '0 0 10px rgba(251, 191, 36, 0.5)',
                  ],
                  scale: [1, 1.05, 1.1, 1.05, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl md:text-8xl font-bold text-center bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent"
                style={{ fontFamily: 'monospace' }}
              >
                LEVEL UP!
              </motion.h1>
            </motion.div>

            {/* Character Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6"
            >
              <p className="text-2xl text-white font-bold text-center">
                {actualCharacter.name}
              </p>
            </motion.div>

            {/* Level Number Animation */}
            <AnimatePresence>
              {showLevelNumber && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: 180 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="flex items-center space-x-4 mb-4"
                >
                  {/* Old Level */}
                  <motion.div
                    animate={{ x: [-10, 0], opacity: [1, 0.3] }}
                    transition={{ duration: 1 }}
                    className="text-4xl font-bold text-gray-400"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {correctOldLevel}
                  </motion.div>

                  {/* Arrow */}
                  <motion.div
                    animate={{
                      x: [0, 10, 0],
                      textShadow: [
                        '0 0 5px rgba(34, 197, 94, 0.5)',
                        '0 0 15px rgba(34, 197, 94, 1)',
                        '0 0 5px rgba(34, 197, 94, 0.5)',
                      ],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-3xl text-green-400"
                  >
                    →
                  </motion.div>

                  {/* New Level */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      textShadow: [
                        '0 0 10px rgba(251, 191, 36, 0.5)',
                        '0 0 20px rgba(251, 191, 36, 1)',
                        '0 0 10px rgba(251, 191, 36, 0.5)',
                      ],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-5xl font-bold text-amber-400"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {correctNewLevel}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Boost Notification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center"
            >
              <p className="text-green-400 font-bold mb-2">🎉 Stats Increased!</p>
              <div className="flex space-x-4 text-sm">
                <span className="text-red-400">⚔️ +5 ATK</span>
                <span className="text-blue-400">🛡️ +3 DEF</span>
                <span className="text-yellow-400">⚡ +2 SPD</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Confetti/Particle Effects */}
          <AnimatePresence>
            {showParticles && (
              <>
                {/* Golden Particles */}
                {[...Array(25)].map((_, i) => (
                  <motion.div
                    key={`gold-${i}`}
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: 0,
                      y: 0,
                      rotate: 0,
                    }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 1.2, 0],
                      x: [0, (Math.random() - 0.5) * 400],
                      y: [0, Math.random() * -200 - 100],
                      rotate: [0, Math.random() * 360],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2 + Math.random() * 1,
                      delay: Math.random() * 0.5,
                      ease: 'easeOut',
                    }}
                    className="absolute w-3 h-3 bg-amber-400 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      boxShadow: '0 0 6px rgba(251, 191, 36, 0.8)',
                    }}
                  />
                ))}

                {/* Star Particles */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={`star-${i}`}
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: 0,
                      y: 0,
                      rotate: 0,
                    }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1.5, 1, 0],
                      x: [0, (Math.random() - 0.5) * 600],
                      y: [0, Math.random() * -300 - 50],
                      rotate: [0, Math.random() * 720],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 3 + Math.random() * 1,
                      delay: Math.random() * 0.3,
                      ease: 'easeOut',
                    }}
                    className="absolute text-2xl"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                  >
                    ⭐
                  </motion.div>
                ))}

                {/* Sparkle Effects */}
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: 0,
                      y: 0,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, Math.random() * 0.5 + 0.5, 0],
                      x: [0, (Math.random() - 0.5) * 500],
                      y: [0, Math.random() * -250 - 75],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.5 + Math.random() * 1,
                      delay: Math.random() * 1,
                      ease: 'easeOut',
                    }}
                    className="absolute text-lg"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                  >
                    ✨
                  </motion.div>
                ))}

                {/* Magic Burst Rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`ring-${i}`}
                    initial={{
                      opacity: 0,
                      scale: 0,
                    }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      scale: [0, 3 + i],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      ease: 'easeOut',
                    }}
                    className="absolute border-2 border-amber-400/30 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: '100px',
                      height: '100px',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Background Flash Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0, 0.2, 0],
            }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 