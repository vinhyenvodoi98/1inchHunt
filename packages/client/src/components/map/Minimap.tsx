import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  GRID_SIZE, 
  terrainTypes, 
  getTerrainAt, 
  specialZones, 
  Position 
} from './MapUtils';

interface MinimapProps {
  playerPos: Position;
  cameraX: number;
  cameraY: number;
  viewportSize: number;
}

export const Minimap: React.FC<MinimapProps> = ({
  playerPos,
  cameraX,
  cameraY,
  viewportSize,
}) => {
  return (
    <div className="bg-black/30 border border-white/20 rounded-lg p-2">
      <h4 className="text-white font-bold text-xs mb-2 text-center">🗺️ World Map (80×80)</h4>
      <div 
        className="relative border border-amber-400/50 rounded"
        style={{ width: 200, height: 200 }} // Smaller for sidebar
      >
        {/* Terrain minimap */}
        {Array.from({ length: GRID_SIZE }).map((_, y) =>
          Array.from({ length: GRID_SIZE }).map((_, x) => {
            const terrain = getTerrainAt(x, y);
            const terrainData = terrainTypes[terrain as keyof typeof terrainTypes];
            return (
              <div
                key={`mini-${x}-${y}`}
                className="absolute"
                style={{
                  left: x * 2.5,
                  top: y * 2.5,
                  width: 2.5,
                  height: 2.5,
                  backgroundColor: terrainData?.color || '#4ade80',
                  opacity: 0.9,
                }}
              />
            );
          })
        )}
        
        {/* Player dot on minimap */}
        <motion.div
          className="absolute bg-amber-400 border border-white rounded-full"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            left: playerPos.x * 2.5 - 2,
            top: playerPos.y * 2.5 - 2,
            width: 4,
            height: 4,
            zIndex: 10,
          }}
        />
        
        {/* Viewport indicator */}
        <motion.div
          className="absolute border-2 border-white/80 rounded-sm pointer-events-none"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            left: cameraX * 2.5,
            top: cameraY * 2.5,
            width: viewportSize * 2.5,
            height: viewportSize * 2.5,
            zIndex: 5,
          }}
        />
        
        {/* Special zones on minimap */}
        {specialZones.map((zone) => (
          <motion.div
            key={`mini-zone-${zone.x}-${zone.y}`}
            className={`absolute rounded-full ${
              zone.type === 'swap' ? 'bg-blue-400' :
              zone.type === 'boss' ? 'bg-red-400' :
              'bg-yellow-400'
            }`}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: (zone.x + zone.y) * 0.05 
            }}
            style={{
              left: zone.x * 2.5 - 1,
              top: zone.y * 2.5 - 1,
              width: 2,
              height: 2,
              zIndex: 8,
            }}
          />
        ))}
      </div>
      <div className="text-gray-400 text-xs mt-1 text-center">
        <p>🟨 Player • ⬜ Viewport</p>
      </div>
    </div>
  );
}; 