import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { GameStorage, UserCharacter } from '@/utils/localStorage';

interface UserLevelProps {
  className?: string;
  showAvatar?: boolean;
  showLevelUpButton?: boolean;
  compact?: boolean;
}

export const UserLevel: React.FC<UserLevelProps> = ({
  className = '',
  showAvatar = true,
  showLevelUpButton = false,
  compact = false,
}) => {
  const router = useRouter();
  const { address } = useAccount();
  
  // Character state with localStorage sync
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

  // Calculate level based on total experience
  const calculateLevel = (totalExp: number): { level: number; expInLevel: number; expForNextLevel: number } => {
    const level = Math.floor(totalExp / 500);
    const expInLevel = totalExp % 500;
    const expForNextLevel = 500;
    return { level, expInLevel, expForNextLevel };
  };

  // Get current level info
  const levelInfo = calculateLevel(character.exp);
  const expPercentage = (levelInfo.expInLevel / levelInfo.expForNextLevel) * 100;

  // Add experience function
  const addExperience = (amount: number) => {
    setCharacter(prev => {
      const newExp = prev.exp + amount;
      const newLevelInfo = calculateLevel(newExp);
      
      const newCharacter = {
        ...prev,
        level: newLevelInfo.level,
        exp: newExp,
        maxExp: newLevelInfo.expForNextLevel,
      };
      
      // Save to localStorage
      GameStorage.saveCharacter(newCharacter);
      
      return newCharacter;
    });
  };

  // Level up effect
  const [showLevelUpEffect, setShowLevelUpEffect] = React.useState(false);
  
  // Listen for localStorage changes to sync character data
  React.useEffect(() => {
    const handleStorageChange = () => {
      const savedCharacter = GameStorage.getCharacter();
      if (savedCharacter && (
        savedCharacter.name !== character.name || 
        savedCharacter.avatar !== character.avatar ||
        savedCharacter.level !== character.level ||
        savedCharacter.exp !== character.exp
      )) {
        setCharacter(savedCharacter);
      }
    };

    // Listen for storage events (when localStorage changes in other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes periodically (for same-tab updates)
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [character.name, character.avatar, character.level, character.exp]);
  
  React.useEffect(() => {
    if (levelInfo.level > 0) {
      setShowLevelUpEffect(true);
      setTimeout(() => setShowLevelUpEffect(false), 2000);
    }
  }, [levelInfo.level]);

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Character Avatar */}
      {showAvatar && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => address && router.push(`/profile/${address}`)}
          className={`w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg ring-2 ring-amber-300/50 ring-offset-2 ring-offset-transparent transition-all duration-300 ${
            address ? 'cursor-pointer hover:ring-amber-200 hover:shadow-xl' : 'cursor-default'
          }`}
          title={address ? 'View Profile' : 'Connect wallet to view profile'}
        >
          {character.avatar}
        </motion.div>
      )}

      {/* Level and EXP */}
      <div className="text-white">
        <div className="flex items-center space-x-2">
          <motion.span 
            className="text-lg font-bold text-amber-300"
            animate={showLevelUpEffect ? { scale: [1, 1.2, 1], color: ['#fbbf24', '#f59e0b', '#fbbf24'] } : {}}
            transition={{ duration: 0.5 }}
          >
            Level {levelInfo.level}
          </motion.span>
          
          {/* Level Up Test Button */}
          {showLevelUpButton && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => addExperience(200)}
              className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded transition-all duration-300"
              title="Add 200 EXP (Test Level Up)"
            >
              +EXP
            </motion.button>
          )}
        </div>
        
        {!compact && (
          <div className="mt-1">
            <div className="w-32 bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <motion.div
                animate={{ width: `${expPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg"
                style={{
                  boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
                }}
              />
            </div>
            <div className="text-xs text-gray-300 mt-1">
              {levelInfo.expInLevel} / {levelInfo.expForNextLevel} XP
            </div>
            <div className="text-xs text-gray-400">
              Total: {character.exp} XP
            </div>
          </div>
        )}
      </div>

      {/* Level Up Animation */}
      {showLevelUpEffect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: -20 }}
          exit={{ opacity: 0, scale: 0.5, y: -40 }}
          className="absolute pointer-events-none"
        >
          <div className="text-2xl">🎉</div>
          <div className="text-xs text-amber-300 font-bold">LEVEL UP!</div>
        </motion.div>
      )}
    </div>
  );
}; 