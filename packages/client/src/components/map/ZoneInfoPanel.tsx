import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpecialZone } from './MapUtils';

interface ZoneInfoPanelProps {
  showZoneMessage: boolean;
  currentZone: SpecialZone | null;
}

export const ZoneInfoPanel: React.FC<ZoneInfoPanelProps> = ({
  showZoneMessage,
  currentZone,
}) => {
  return (
    <AnimatePresence>
      {showZoneMessage && currentZone && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-black/90 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-3xl">{currentZone.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{currentZone.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  currentZone.type === 'swap' ? 'bg-blue-500/20 text-blue-300' :
                  currentZone.type === 'advanced-swap' ? 'bg-purple-500/20 text-purple-300' :
                  currentZone.type === 'limit-order' ? 'bg-emerald-500/20 text-emerald-300' :
                  currentZone.type === 'boss' ? 'bg-red-500/20 text-red-300' :
                  'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {currentZone.type.toUpperCase()}
                </span>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{currentZone.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-amber-300 text-sm font-medium">{currentZone.action}</span>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-lg text-amber-300 text-xs font-bold"
              >
                SPACE
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 