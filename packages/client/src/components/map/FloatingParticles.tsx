import * as React from 'react';
import { motion } from 'framer-motion';

export const FloatingParticles: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl opacity-20"
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
  );
}; 