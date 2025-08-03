import * as React from 'react';
import { motion } from 'framer-motion';

interface MissionProgressProps {
  completed: number;
  total: number;
  title?: string;
  className?: string;
}

export const MissionProgress: React.FC<MissionProgressProps> = ({
  completed,
  total,
  title = "🎯 Mission Progress",
  className = "",
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const remaining = total - completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className={`mb-8 p-4 bg-black/20 border border-amber-300/30 rounded-xl ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-amber-300 text-sm font-bold">{title}</span>
        <span className="text-amber-300 text-sm">{completed}/{total}</span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
        <motion.div
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
          style={{
            boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
          }}
        />
      </div>
      <p className="text-gray-300 text-xs mt-2">
        {remaining > 0 
          ? `Complete ${remaining} more ${remaining === 1 ? 'task' : 'tasks'} to finish!`
          : '🎉 Mission completed!'
        }
      </p>
    </motion.div>
  );
}; 