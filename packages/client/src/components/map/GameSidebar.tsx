import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Position, getTerrainAt, specialZones, terrainTypes } from './MapUtils';
import { Minimap } from './Minimap';

interface GameSidebarProps {
  playerPos: Position;
  cameraX: number;
  cameraY: number;
  viewportSize: number;
  visitedZones: Set<string>;
}

export const GameSidebar: React.FC<GameSidebarProps> = ({
  playerPos,
  cameraX,
  cameraY,
  viewportSize,
  visitedZones,
}) => {
  const router = useRouter();

  return (
    <div className="w-80 flex-shrink-0 bg-black/20 backdrop-blur-sm border-l border-white/10 p-3 overflow-y-auto">
      {/* Game Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 border border-white/20 rounded-lg p-3 mb-3"
      >
        <h1 className="text-lg font-bold text-white text-center mb-3">
          🌍 <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            1inchHunt Epic Realm
          </span>
        </h1>
        
        {/* Game Stats */}
        <div className="space-y-2 text-xs">
          <div className="bg-black/40 border border-white/10 rounded px-2 py-1 flex justify-between">
            <span className="text-gray-300">Position:</span>
            <span className="text-amber-300 font-mono">({playerPos.x}, {playerPos.y})</span>
          </div>
          <div className="bg-black/40 border border-white/10 rounded px-2 py-1 flex justify-between">
            <span className="text-gray-300">Terrain:</span>
            <span className="text-amber-300 capitalize">{getTerrainAt(playerPos.x, playerPos.y)}</span>
          </div>
          <div className="bg-black/40 border border-white/10 rounded px-2 py-1 flex justify-between">
            <span className="text-gray-300">Zones:</span>
            <span className="text-green-400 font-mono">{visitedZones.size}/{specialZones.length}</span>
          </div>
          <div className="bg-black/40 border border-white/10 rounded px-2 py-1 flex justify-between">
            <span className="text-gray-300">Viewport:</span>
            <span className="text-purple-400 font-mono">{viewportSize}×{viewportSize}</span>
          </div>
          <div className="bg-black/40 border border-white/10 rounded px-2 py-1 flex justify-between">
            <span className="text-gray-300">Progress:</span>
            <span className="text-cyan-400 font-mono">
              {((visitedZones.size / specialZones.length) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Minimap and Legend - Now in sidebar */}
      <div className="space-y-2">
        {/* Full Screen Minimap */}
        <Minimap
          playerPos={playerPos}
          cameraX={cameraX}
          cameraY={cameraY}
          viewportSize={viewportSize}
        />
        
        {/* Compact Legends */}
        <div className="bg-black/30 border border-white/20 rounded-lg p-2">
          <h4 className="text-white font-bold text-xs mb-2 text-center">🌍 Terrain</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(terrainTypes).slice(0, 6).map(([type, data]) => (
              <div key={type} className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 border border-gray-400 rounded-sm"
                  style={{ backgroundColor: data.color }}
                />
                <span className="text-gray-300 capitalize text-xs">{type}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
        >
          ← Back to Home
        </motion.button>
      </div>
    </div>
  );
}; 