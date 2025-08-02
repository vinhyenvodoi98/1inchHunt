import * as React from 'react';
import { terrainTypes, getTerrainAt, CELL_SIZE } from './MapUtils';

interface GameGridProps {
  viewportSize: number;
  cameraX: number;
  cameraY: number;
}

export const GameGrid: React.FC<GameGridProps> = ({ viewportSize, cameraX, cameraY }) => {
  return (
    <>
      {/* Terrain Background */}
      <div className="absolute inset-0">
        {Array.from({ length: viewportSize }).map((_, viewY) =>
          Array.from({ length: viewportSize }).map((_, viewX) => {
            const worldX = cameraX + viewX;
            const worldY = cameraY + viewY;
            const terrain = getTerrainAt(worldX, worldY);
            const terrainData = terrainTypes[terrain as keyof typeof terrainTypes];
            
            return (
              <div
                key={`terrain-${viewX}-${viewY}`}
                className="absolute border border-black/20"
                style={{
                  left: viewX * CELL_SIZE,
                  top: viewY * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: terrainData?.color || '#4ade80',
                  backgroundImage: terrain === 'water' ? 
                    'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%)' :
                    terrain === 'mountain' ?
                    'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)' :
                    terrain === 'forest' ?
                    'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' :
                    terrain === 'desert' ?
                    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)' :
                    terrain === 'path' ?
                    'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' :
                    'none',
                }}
              >
                {/* Terrain character overlay for visual variety */}
                <div className="w-full h-full flex items-center justify-center text-xs opacity-30">
                  {terrain === 'grass' && Math.random() > 0.8 && '🌱'}
                  {terrain === 'water' && Math.random() > 0.7 && '〰️'}
                  {terrain === 'mountain' && Math.random() > 0.6 && '▲'}
                  {terrain === 'forest' && Math.random() > 0.5 && '🌿'}
                  {terrain === 'desert' && Math.random() > 0.7 && '🏔️'}
                  {terrain === 'town' && '🏠'}
                  {terrain === 'castle' && '🏰'}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Grid Lines (optional, can be toggled) */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: viewportSize + 1 }).map((_, i) => (
          <React.Fragment key={`grid-${i}`}>
            {/* Vertical lines */}
            <div
              className="absolute border-l border-white/20"
              style={{
                left: i * CELL_SIZE,
                height: '100%',
              }}
            />
            {/* Horizontal lines */}
            <div
              className="absolute border-t border-white/20"
              style={{
                top: i * CELL_SIZE,
                width: '100%',
              }}
            />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}; 