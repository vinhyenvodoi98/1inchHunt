import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

type MissionStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

interface MissionCardProps {
  title?: string;
  description?: string;
  requiredAction?: string;
  status?: MissionStatus;
  reward?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'legendary';
  timeRemaining?: string;
  progress?: number;
  maxProgress?: number;
  experience?: number;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'from-gray-500 to-gray-600',
    textColor: 'text-gray-100',
    icon: '⏳',
    borderColor: 'border-gray-400/50',
    glowColor: 'rgba(107, 114, 128, 0.4)',
  },
  in_progress: {
    label: 'In Progress',
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-100',
    icon: '⚡',
    borderColor: 'border-blue-400/50',
    glowColor: 'rgba(59, 130, 246, 0.4)',
  },
  completed: {
    label: 'Completed',
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-100',
    icon: '✅',
    borderColor: 'border-green-400/50',
    glowColor: 'rgba(34, 197, 94, 0.4)',
  },
  failed: {
    label: 'Failed',
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-100',
    icon: '❌',
    borderColor: 'border-red-400/50',
    glowColor: 'rgba(239, 68, 68, 0.4)',
  },
};

const difficultyConfig = {
  easy: { stars: '⭐', color: 'text-green-400', glow: 'rgba(74, 222, 128, 0.4)' },
  medium: { stars: '⭐⭐', color: 'text-yellow-400', glow: 'rgba(251, 191, 36, 0.4)' },
  hard: { stars: '⭐⭐⭐', color: 'text-orange-400', glow: 'rgba(251, 146, 60, 0.4)' },
  legendary: { stars: '⭐⭐⭐⭐', color: 'text-purple-400', glow: 'rgba(168, 85, 247, 0.4)' },
};

export default function MissionCard({
  title = 'Ethereal Exchange',
  description = 'Complete a mystical token swap to unlock ancient treasures and prove your mastery over the digital realm.',
  requiredAction = 'Swap ETH → USDC',
  status = 'in_progress',
  reward = '500 XP + Rare Crystal',
  difficulty = 'medium',
  timeRemaining = '2h 30m',
  progress = 1,
  maxProgress = 3,
  experience = 500,
  className = '',
}: MissionCardProps) {
  const router = useRouter();
  const statusInfo = statusConfig[status];
  const difficultyInfo = difficultyConfig[difficulty];
  const progressPercentage = maxProgress ? (progress / maxProgress) * 100 : 0;

  const handleCardClick = () => {
    if (status === 'in_progress' || status === 'pending') {
      router.push('/mission');
    }
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)',
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-indigo-900/80 backdrop-blur-lg border-2 border-white/20 rounded-2xl p-6 shadow-2xl overflow-hidden max-w-md cursor-pointer ${className}`}
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

      {/* Click indicator for active missions */}
      {(status === 'in_progress' || status === 'pending') && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 bg-green-400 rounded-full"
            style={{ boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)' }}
          />
        </div>
      )}

      {/* Header with title and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-white mb-2"
            style={{
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(168, 85, 247, 0.3)',
            }}
          >
            📜 {title}
          </motion.h3>
          
          {/* Difficulty stars */}
          <div className="flex items-center space-x-2 mb-2">
            <motion.span 
              className={`text-sm ${difficultyInfo.color}`}
              animate={{ 
                textShadow: [
                  `0 0 5px ${difficultyInfo.glow}`,
                  `0 0 10px ${difficultyInfo.glow}`,
                  `0 0 5px ${difficultyInfo.glow}`,
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {difficultyInfo.stars}
            </motion.span>
            <span className="text-xs text-gray-300 font-medium capitalize bg-white/10 px-2 py-1 rounded-full">
              {difficulty}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`px-3 py-1 bg-gradient-to-r ${statusInfo.color} ${statusInfo.textColor} rounded-full text-xs font-bold shadow-lg border-2 ${statusInfo.borderColor}`}
          style={{
            boxShadow: `0 0 15px ${statusInfo.glowColor}`,
          }}
        >
          <span className="mr-1">{statusInfo.icon}</span>
          {statusInfo.label}
        </motion.div>
      </div>

      {/* Mission description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-300 text-sm leading-relaxed mb-4"
        style={{
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
        }}
      >
        {description}
      </motion.p>

      {/* Required action */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 mb-4"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">⚔️</span>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Required Action
            </p>
            <p className="text-sm font-bold text-white">
              {requiredAction}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress bar (if applicable) */}
      {maxProgress && maxProgress > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400 font-medium">
              Progress
            </span>
            <span className="text-xs text-white font-bold">
              {progress} / {maxProgress}
            </span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.7 }}
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg"
              style={{
                boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Footer with reward and time */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <motion.span 
            className="text-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💎
          </motion.span>
          <div>
            <p className="text-xs text-gray-400 font-medium">
              Reward
            </p>
            <p className="text-sm font-bold text-white">
              {reward}
            </p>
          </div>
        </div>

        {timeRemaining && status === 'in_progress' && (
          <div className="flex items-center space-x-2">
            <motion.span 
              className="text-lg"
              animate={{ scale: [1, 0.9, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⏰
            </motion.span>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">
                Time Left
              </p>
              <p className="text-sm font-bold text-white">
                {timeRemaining}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Click prompt for active missions */}
      {(status === 'in_progress' || status === 'pending') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-xs text-amber-300 font-bold bg-black/20 px-2 py-1 rounded-full border border-amber-300/30">
            ✨ Click to Start Mission
          </div>
        </motion.div>
      )}

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
  );
} 