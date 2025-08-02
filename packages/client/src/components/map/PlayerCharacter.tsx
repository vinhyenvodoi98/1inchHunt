import * as React from 'react';
import { motion } from 'framer-motion';
import { Position, CELL_SIZE } from './MapUtils';

interface PlayerCharacterProps {
  playerPos: Position;
  cameraX: number;
  cameraY: number;
}

export const PlayerCharacter: React.FC<PlayerCharacterProps> = ({ 
  playerPos, 
  cameraX, 
  cameraY 
}) => {
  return (
    <motion.div
      className="absolute flex items-center justify-center text-2xl z-30"
      style={{
        left: (playerPos.x - cameraX) * CELL_SIZE,
        top: (playerPos.y - cameraY) * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        duration: 0.2,
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative filter drop-shadow-lg"
        style={{
          textShadow: '0 0 8px rgba(251, 191, 36, 1), 0 0 15px rgba(251, 191, 36, 0.5)',
          filter: 'brightness(1.2) contrast(1.1)',
        }}
      >
        🧙‍♂️
        
        {/* Player magical aura */}
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-amber-400 rounded-full blur-md"
        />
        
        {/* Movement direction indicator */}
        <motion.div
          className="absolute inset-0 bg-white rounded-full opacity-20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.3 }}
          key={`${playerPos.x}-${playerPos.y}`}
        />
      </motion.div>
    </motion.div>
  );
}; 