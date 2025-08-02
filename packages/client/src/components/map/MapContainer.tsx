import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  Position, 
  SpecialZone, 
  GRID_SIZE, 
  CELL_SIZE, 
  VIEWPORT_SIZE, 
  getViewportSize,
  specialZones,
  getZoneAtPosition,
  isValidPosition
} from './MapUtils';
import { GameGrid } from './GameGrid';
import { PlayerCharacter } from './PlayerCharacter';
import { SpecialZones } from './SpecialZones';
import { ZoneInfoPanel } from './ZoneInfoPanel';
import { GameSidebar } from './GameSidebar';
import { FloatingParticles } from './FloatingParticles';

export const MapContainer: React.FC = () => {
  const router = useRouter();
  const [playerPos, setPlayerPos] = React.useState<Position>({ x: 40, y: 40 }); // Start in center of massive world
  const [currentZone, setCurrentZone] = React.useState<SpecialZone | null>(null);
  const [showZoneMessage, setShowZoneMessage] = React.useState(false);
  const [visitedZones, setVisitedZones] = React.useState<Set<string>>(new Set());
  const [viewportSize, setViewportSize] = React.useState(VIEWPORT_SIZE);
  
  // Update viewport size on window resize for true full-screen adaptation
  React.useEffect(() => {
    const handleResize = () => {
      setViewportSize(getViewportSize());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Camera system for following player (dynamic viewport size based on screen)
  const cameraX = Math.max(0, Math.min(GRID_SIZE - viewportSize, playerPos.x - Math.floor(viewportSize / 2)));
  const cameraY = Math.max(0, Math.min(GRID_SIZE - viewportSize, playerPos.y - Math.floor(viewportSize / 2)));

  // Handle player movement
  const movePlayer = React.useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setPlayerPos(prevPos => {
      let newX = prevPos.x;
      let newY = prevPos.y;

      switch (direction) {
        case 'up':
          newY = prevPos.y - 1;
          break;
        case 'down':
          newY = prevPos.y + 1;
          break;
        case 'left':
          newX = prevPos.x - 1;
          break;
        case 'right':
          newX = prevPos.x + 1;
          break;
      }

      // Check boundaries
      if (!isValidPosition(newX, newY)) {
        return prevPos;
      }

      // Check for special zones
      const zone = getZoneAtPosition(newX, newY);
      if (zone) {
        setCurrentZone(zone);
        setShowZoneMessage(true);
        setVisitedZones(prev => new Set([...Array.from(prev), `${zone.x}-${zone.y}`]));
        
        // Auto-hide message after 4 seconds
        setTimeout(() => setShowZoneMessage(false), 4000);
      } else {
        setCurrentZone(null);
        setShowZoneMessage(false);
      }

      return { x: newX, y: newY };
    });
  }, []);

  // Handle special zone interaction
  const handleZoneInteraction = () => {
    if (currentZone) {
      switch (currentZone.type) {
        case 'swap':
          router.push('/mission');
          break;
        case 'boss':
          alert(`You challenged the ${currentZone.name}! Battle system coming soon...`);
          break;
        case 'chest':
          alert(`You opened the ${currentZone.name} and found treasures! Inventory system coming soon...`);
          break;
      }
    }
  };

  // Keyboard event listener
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      
      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          movePlayer('up');
          break;
        case 's':
        case 'arrowdown':
          movePlayer('down');
          break;
        case 'a':
        case 'arrowleft':
          movePlayer('left');
          break;
        case 'd':
        case 'arrowright':
          movePlayer('right');
          break;
        case ' ':
          if (currentZone) {
            handleZoneInteraction();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, currentZone]);

  return (
    <div className="min-h-main bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex overflow-hidden">
      {/* Full Screen Game Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Game Map Container - Takes most space */}
        <div className="flex-1 flex justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative bg-black/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-2xl"
            style={{
              boxShadow: '0 0 40px rgba(168, 85, 247, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Grid Container - Dynamic Full Screen Viewport - Auto Centered */}
            <div 
              className="relative border-4 border-amber-400/50 rounded-2xl overflow-hidden mx-auto my-auto flex justify-center items-center"
              style={{ 
                width: viewportSize * CELL_SIZE, 
                height: viewportSize * CELL_SIZE,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                imageRendering: 'pixelated',
              }}
            >
              <GameGrid 
                viewportSize={viewportSize}
                cameraX={cameraX}
                cameraY={cameraY}
              />
              
              <SpecialZones
                specialZones={specialZones}
                playerPos={playerPos}
                cameraX={cameraX}
                cameraY={cameraY}
                viewportSize={viewportSize}
                visitedZones={visitedZones}
              />

              <PlayerCharacter
                playerPos={playerPos}
                cameraX={cameraX}
                cameraY={cameraY}
              />

              {/* World Coordinates Display (debug) */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono">
                World: ({playerPos.x}, {playerPos.y}) | Camera: ({cameraX}, {cameraY})
              </div>
            </div>
          </motion.div>
        </div>

        <ZoneInfoPanel
          showZoneMessage={showZoneMessage}
          currentZone={currentZone}
        />

        {/* Back to Home Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => router.push('/')}
          className="fixed top-6 left-6 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium shadow-lg transition-all duration-300"
        >
          ← Back to Home
        </motion.button>

        <GameSidebar
          playerPos={playerPos}
          cameraX={cameraX}
          cameraY={cameraY}
          viewportSize={viewportSize}
          visitedZones={visitedZones}
        />
      </div>

      <FloatingParticles />
    </div>
  );
}; 