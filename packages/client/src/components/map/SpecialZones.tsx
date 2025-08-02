import * as React from 'react';
import { motion } from 'framer-motion';
import { SpecialZone, Position, CELL_SIZE } from './MapUtils';

interface SpecialZonesProps {
  specialZones: SpecialZone[];
  playerPos: Position;
  cameraX: number;
  cameraY: number;
  viewportSize: number;
  visitedZones: Set<string>;
}

export const SpecialZones: React.FC<SpecialZonesProps> = ({
  specialZones,
  playerPos,
  cameraX,
  cameraY,
  viewportSize,
  visitedZones,
}) => {
  return (
    <>
      {specialZones
        .filter(zone => 
          zone.x >= cameraX && zone.x < cameraX + viewportSize &&
          zone.y >= cameraY && zone.y < cameraY + viewportSize
        )
        .map((zone, index) => {
          const isVisited = visitedZones.has(`${zone.x}-${zone.y}`);
          const viewX = zone.x - cameraX;
          const viewY = zone.y - cameraY;
          
          return (
            <motion.div
              key={`zone-${zone.x}-${zone.y}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={`absolute flex items-center justify-center text-lg transition-all duration-300 z-20 ${
                isVisited ? 'filter brightness-75' : ''
              }`}
              style={{
                left: viewX * CELL_SIZE,
                top: viewY * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            >
              <motion.div
                animate={{
                  scale: playerPos.x === zone.x && playerPos.y === zone.y ? [1, 1.3, 1] : [1, 1.1, 1],
                  rotate: playerPos.x === zone.x && playerPos.y === zone.y ? [0, 15, -15, 0] : 0,
                }}
                transition={{ 
                  duration: playerPos.x === zone.x && playerPos.y === zone.y ? 0.5 : 2, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="relative filter drop-shadow-lg"
              >
                {zone.icon}
                
                {/* Zone glow effect */}
                <motion.div 
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute inset-0 rounded-full blur-sm ${
                    zone.type === 'swap' ? 'bg-blue-400' :
                    zone.type === 'boss' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`}
                />
                
                {/* Visited indicator */}
                {isVisited && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white/50" />
                )}
              </motion.div>
            </motion.div>
          );
        })}
    </>
  );
}; 