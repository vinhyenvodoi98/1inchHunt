import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

import Layout from '@/components/layout/Layout';

interface Position {
  x: number;
  y: number;
}

interface SpecialZone {
  x: number;
  y: number;
  type: 'swap' | 'boss' | 'chest';
  icon: string;
  name: string;
  description: string;
  action: string;
}

const GRID_SIZE = 80; // Massive world for full screen experience
const CELL_SIZE = 20; // Optimized for maximum screen coverage

// Calculate dynamic viewport size with header moved to sidebar
const getViewportSize = () => {
  if (typeof window === 'undefined') return 40; // Default for SSR
  
  const availableWidth = Math.floor((window.innerWidth - 340) / CELL_SIZE); // Account for sidebar
  const availableHeight = Math.floor((window.innerHeight - 120) / CELL_SIZE); // Account for Layout header only
  
  return Math.min(availableWidth, availableHeight, 75); // Maximum viewport with header in sidebar
};

const VIEWPORT_SIZE = getViewportSize();

// Define terrain types for classic RPG feel
const terrainTypes = {
  grass: { color: '#4ade80', char: '🟩' },
  water: { color: '#3b82f6', char: '🟦' },
  mountain: { color: '#6b7280', char: '⛰️' },
  forest: { color: '#059669', char: '🌲' },
  desert: { color: '#f59e0b', char: '🟨' },
  town: { color: '#8b5cf6', char: '🏘️' },
  path: { color: '#a3a3a3', char: '⬜' },
  castle: { color: '#7c2d12', char: '🏰' },
};

// Create a massive terrain map (80x80 grid)
const createTerrainMap = (): string[][] => {
  const map: string[][] = [];
  
  // Initialize with grass
  for (let y = 0; y < GRID_SIZE; y++) {
    map[y] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      map[y][x] = 'grass';
    }
  }
  
  // Add multiple large water bodies and river systems
  // Central Great Lake
  for (let y = 25; y <= 40; y++) {
    for (let x = 30; x <= 50; x++) {
      if (Math.pow(x - 40, 2) + Math.pow(y - 32.5, 2) < 120) {
        map[y][x] = 'water';
      }
    }
  }
  
  // Northern Lake
  for (let y = 5; y <= 15; y++) {
    for (let x = 50; x <= 65; x++) {
      if (Math.pow(x - 57.5, 2) + Math.pow(y - 10, 2) < 60) {
        map[y][x] = 'water';
      }
    }
  }
  
  // Southern Lake
  for (let y = 60; y <= 75; y++) {
    for (let x = 10; x <= 25; x++) {
      if (Math.pow(x - 17.5, 2) + Math.pow(y - 67.5, 2) < 70) {
        map[y][x] = 'water';
      }
    }
  }
  
  // Major river systems
  for (let y = 0; y < GRID_SIZE; y++) {
    map[y][25] = 'water'; // Vertical river
    map[y][55] = 'water'; // Second vertical river
  }
  for (let x = 0; x < GRID_SIZE; x++) {
    map[20][x] = 'water'; // Horizontal river
    map[50][x] = 'water'; // Second horizontal river
  }
  
  // Mountain ranges (multiple regions)
  // Northern Mountains
  for (let y = 0; y <= 18; y++) {
    for (let x = 0; x <= 30; x++) {
      if (Math.random() > 0.4) map[y][x] = 'mountain';
    }
  }
  
  // Eastern Mountains  
  for (let y = 10; y <= 40; y++) {
    for (let x = 65; x <= 79; x++) {
      if (Math.random() > 0.5) map[y][x] = 'mountain';
    }
  }
  
  // Western Mountains
  for (let y = 30; y <= 60; y++) {
    for (let x = 0; x <= 15; x++) {
      if (Math.random() > 0.3) map[y][x] = 'mountain';
    }
  }
  
  // Forest regions
  // Great Forest (South)
  for (let y = 55; y <= 79; y++) {
    for (let x = 35; x <= 65; x++) {
      if (Math.random() > 0.3) map[y][x] = 'forest';
    }
  }
  
  // Eastern Forest
  for (let y = 25; y <= 45; y++) {
    for (let x = 50; x <= 70; x++) {
      if (Math.random() > 0.6) map[y][x] = 'forest';
    }
  }
  
  // Desert regions
  // Great Desert (Southeast)
  for (let y = 45; y <= 79; y++) {
    for (let x = 65; x <= 79; x++) {
      map[y][x] = 'desert';
    }
  }
  
  // Small desert (Northwest)
  for (let y = 0; y <= 20; y++) {
    for (let x = 60; x <= 79; x++) {
      if (Math.random() > 0.4) map[y][x] = 'desert';
    }
  }
  
  // Towns and settlements (multiple 2x2 areas)
  const towns = [
    [15, 35], [45, 15], [35, 60], [65, 35], [25, 75], [5, 5], [75, 5], [75, 75]
  ];
  
  towns.forEach(([x, y]) => {
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        if (x + dx < GRID_SIZE && y + dy < GRID_SIZE) {
          map[y + dy][x + dx] = 'town';
        }
      }
    }
  });
  
  // Castles (multiple 2x2 areas)
  const castles = [
    [70, 10], [10, 70], [40, 5], [75, 40]
  ];
  
  castles.forEach(([x, y]) => {
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        if (x + dx < GRID_SIZE && y + dy < GRID_SIZE) {
          map[y + dy][x + dx] = 'castle';
        }
      }
    }
  });
  
  // Main road network
  for (let x = 0; x < GRID_SIZE; x++) {
    map[15][x] = 'path'; // Northern highway
    map[40][x] = 'path'; // Central highway  
    map[65][x] = 'path'; // Southern highway
  }
  for (let y = 0; y < GRID_SIZE; y++) {
    map[y][15] = 'path'; // Western highway
    map[y][40] = 'path'; // Central highway
    map[y][65] = 'path'; // Eastern highway
  }
  
  return map;
};

const terrainMap = createTerrainMap();

const specialZones: SpecialZone[] = [
  // Major Towns (Trading Hubs)
  {
    x: 15,
    y: 35,
    type: 'swap',
    icon: '🏘️',
    name: 'Crypto Capital',
    description: 'The largest trading city in the realm, center of all DeFi activity',
    action: 'Press SPACE to enter the capital'
  },
  {
    x: 45,
    y: 15,
    type: 'swap',
    icon: '🏘️',
    name: 'Northern Outpost',
    description: 'A frontier trading post near the mountain ranges',
    action: 'Press SPACE to explore the outpost'
  },
  {
    x: 35,
    y: 60,
    type: 'swap',
    icon: '🏘️',
    name: 'Forest Haven',
    description: 'A mystical town hidden within the Great Forest',
    action: 'Press SPACE to discover the haven'
  },
  {
    x: 65,
    y: 35,
    type: 'swap',
    icon: '🏘️',
    name: 'Eastern Gateway',
    description: 'A mountain village connecting eastern and western lands',
    action: 'Press SPACE to visit the gateway'
  },
  
  // Castles and Strongholds
  {
    x: 70,
    y: 10,
    type: 'boss',
    icon: '🏰',
    name: 'Storm Castle',
    description: 'Fortress of the Storm Lord, master of lightning and thunder',
    action: 'Press SPACE to challenge the Storm Lord'
  },
  {
    x: 10,
    y: 70,
    type: 'boss',
    icon: '🏰',
    name: 'Shadow Keep',
    description: 'Dark castle where the Shadow King plots in eternal darkness',
    action: 'Press SPACE to infiltrate the keep'
  },
  {
    x: 40,
    y: 5,
    type: 'boss',
    icon: '🏰',
    name: 'Crystal Citadel',
    description: 'Gleaming fortress built entirely from magical crystals',
    action: 'Press SPACE to enter the citadel'
  },
  {
    x: 75,
    y: 40,
    type: 'boss',
    icon: '🏰',
    name: 'Iron Fortress',
    description: 'Impenetrable mountain stronghold of the Dwarf King',
    action: 'Press SPACE to petition the king'
  },
  
  // Mountain Locations
  {
    x: 12,
    y: 8,
    type: 'boss',
    icon: '⛰️',
    name: 'Dragon\'s Peak',
    description: 'Highest mountain where the Ancient Dragon hoards legendary treasures',
    action: 'Press SPACE to face the dragon'
  },
  {
    x: 20,
    y: 12,
    type: 'chest',
    icon: '💎',
    name: 'Crystal Mines',
    description: 'Deep mines filled with precious gems and rare earth tokens',
    action: 'Press SPACE to mine crystals'
  },
  {
    x: 68,
    y: 25,
    type: 'boss',
    icon: '🗻',
    name: 'Frost Giant\'s Lair',
    description: 'Icy cavern home to the legendary Frost Giant',
    action: 'Press SPACE to battle the giant'
  },
  {
    x: 72,
    y: 18,
    type: 'chest',
    icon: '❄️',
    name: 'Frozen Vault',
    description: 'Ancient vault sealed in eternal ice, containing winter magic',
    action: 'Press SPACE to break the ice seal'
  },
  
  // Water Locations
  {
    x: 40,
    y: 32,
    type: 'swap',
    icon: '🌊',
    name: 'Lake Exchange',
    description: 'Floating marketplace on the Great Lake, hub of aquatic commerce',
    action: 'Press SPACE to board the exchange'
  },
  {
    x: 45,
    y: 35,
    type: 'chest',
    icon: '🐚',
    name: 'Pearl Depths',
    description: 'Underwater treasure trove guarded by sea creatures',
    action: 'Press SPACE to dive for pearls'
  },
  {
    x: 57,
    y: 10,
    type: 'boss',
    icon: '🐙',
    name: 'Kraken\'s Domain',
    description: 'Deep waters where the mighty sea kraken rules',
    action: 'Press SPACE to challenge the kraken'
  },
  {
    x: 18,
    y: 67,
    type: 'chest',
    icon: '⚓',
    name: 'Shipwreck Cove',
    description: 'Sunken pirate ships filled with maritime treasures',
    action: 'Press SPACE to explore the wrecks'
  },
  
  // Forest Locations
  {
    x: 50,
    y: 65,
    type: 'boss',
    icon: '🌲',
    name: 'Ancient Ent',
    description: 'Millennia-old tree guardian, protector of the Great Forest',
    action: 'Press SPACE to seek the ent\'s wisdom'
  },
  {
    x: 55,
    y: 70,
    type: 'chest',
    icon: '🌿',
    name: 'Druid Circle',
    description: 'Sacred grove where forest druids perform nature magic',
    action: 'Press SPACE to join the circle'
  },
  {
    x: 60,
    y: 55,
    type: 'swap',
    icon: '🦋',
    name: 'Fairy Glade',
    description: 'Enchanted clearing where forest fairies trade magical items',
    action: 'Press SPACE to trade with fairies'
  },
  {
    x: 45,
    y: 75,
    type: 'chest',
    icon: '🍄',
    name: 'Mushroom Ring',
    description: 'Mysterious circle of giant mushrooms hiding alchemical secrets',
    action: 'Press SPACE to investigate the ring'
  },
  
  // Desert Locations
  {
    x: 72,
    y: 60,
    type: 'boss',
    icon: '🐪',
    name: 'Desert Sphinx',
    description: 'Ancient guardian of desert secrets, master of riddles',
    action: 'Press SPACE to answer riddles'
  },
  {
    x: 75,
    y: 65,
    type: 'chest',
    icon: '🏺',
    name: 'Pharaoh\'s Tomb',
    description: 'Hidden burial chamber filled with golden artifacts',
    action: 'Press SPACE to explore the tomb'
  },
  {
    x: 68,
    y: 70,
    type: 'swap',
    icon: '🏜️',
    name: 'Oasis Market',
    description: 'Desert trading post centered around a life-giving oasis',
    action: 'Press SPACE to rest at the oasis'
  },
  {
    x: 70,
    y: 55,
    type: 'chest',
    icon: '💰',
    name: 'Mirage Vault',
    description: 'Elusive treasure that appears and vanishes like a mirage',
    action: 'Press SPACE to catch the mirage'
  },
  
  // Highway Intersections
  {
    x: 15,
    y: 15,
    type: 'swap',
    icon: '🛤️',
    name: 'Northwest Junction',
    description: 'Major crossroads connecting mountain and forest regions',
    action: 'Press SPACE to trade at the junction'
  },
  {
    x: 40,
    y: 15,
    type: 'swap',
    icon: '🛤️',
    name: 'Northern Plaza',
    description: 'Grand marketplace at the northern highway intersection',
    action: 'Press SPACE to enter the plaza'
  },
  {
    x: 65,
    y: 15,
    type: 'swap',
    icon: '🛤️',
    name: 'Northeast Market',
    description: 'Trading hub near the eastern mountain passes',
    action: 'Press SPACE to browse the market'
  },
  {
    x: 15,
    y: 40,
    type: 'swap',
    icon: '🛤️',
    name: 'Western Terminal',
    description: 'Last stop before entering the western mountains',
    action: 'Press SPACE to resupply'
  },
  {
    x: 40,
    y: 40,
    type: 'boss',
    icon: '⚔️',
    name: 'Central Arena',
    description: 'Grand colosseum where champions prove their worth',
    action: 'Press SPACE to enter the arena'
  },
  
  // Secret and Hidden Locations
  {
    x: 0,
    y: 0,
    type: 'chest',
    icon: '🌟',
    name: 'World\'s Origin',
    description: 'The very beginning of existence, where all creation started',
    action: 'Press SPACE to witness creation'
  },
  {
    x: 79,
    y: 79,
    type: 'boss',
    icon: '🌙',
    name: 'World\'s End',
    description: 'Final frontier where reality meets the cosmic void',
    action: 'Press SPACE to transcend reality'
  },
  {
    x: 0,
    y: 79,
    type: 'chest',
    icon: '🔮',
    name: 'Time Nexus',
    description: 'Temporal anomaly where past, present, and future converge',
    action: 'Press SPACE to manipulate time'
  },
  {
    x: 79,
    y: 0,
    type: 'boss',
    icon: '👁️',
    name: 'Cosmic Eye',
    description: 'All-seeing entity that watches over the entire realm',
    action: 'Press SPACE to gaze into infinity'
  },
  
  // Elemental Shrines
  {
    x: 30,
    y: 30,
    type: 'chest',
    icon: '🔥',
    name: 'Fire Shrine',
    description: 'Sacred altar dedicated to the primal force of fire',
    action: 'Press SPACE to commune with fire'
  },
  {
    x: 50,
    y: 30,
    type: 'chest',
    icon: '💨',
    name: 'Wind Shrine',
    description: 'Hilltop sanctuary where the winds carry ancient whispers',
    action: 'Press SPACE to listen to the winds'
  },
  {
    x: 30,
    y: 50,
    type: 'chest',
    icon: '🌍',
    name: 'Earth Shrine',
    description: 'Deep cavern shrine connected to the planet\'s core',
    action: 'Press SPACE to feel the earth\'s pulse'
  },
  {
    x: 50,
    y: 50,
    type: 'chest',
    icon: '⚡',
    name: 'Lightning Shrine',
    description: 'Storm-touched spire crackling with electrical energy',
    action: 'Press SPACE to harness lightning'
  },
];

export default function MapPage() {
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
  
  // Get terrain at position
  const getTerrainAt = (x: number, y: number): string => {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return 'grass';
    return terrainMap[y][x];
  };

  // Check if position is within grid boundaries
  const isValidPosition = (x: number, y: number): boolean => {
    return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
  };

  // Get special zone at position
  const getZoneAtPosition = (x: number, y: number): SpecialZone | null => {
    return specialZones.find(zone => zone.x === x && zone.y === y) || null;
  };

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
    <Layout>
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

              {/* Special Zones (visible in viewport) */}
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

              {/* Player Character (always centered in classic JRPG style) */}
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

              {/* World Coordinates Display (debug) */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono">
                World: ({playerPos.x}, {playerPos.y}) | Camera: ({cameraX}, {cameraY})
              </div>
            </div>

            
          </motion.div>
        </div>

        {/* Zone Information Panel */}
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

        {/* Compact Sidebar with Header, Minimap and Legends */}
        <div className="w-80 flex-shrink-0 bg-black/20 backdrop-blur-sm border-l border-white/10 p-3 overflow-y-auto">
          {/* Game Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 border border-white/20 rounded-lg p-3 mb-3"
          >
            <h1 className="text-lg font-bold text-white text-center mb-3">
              🌍 <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                HashHunt Epic Realm
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
        </div>

        {/* Floating magical particles */}
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
      </div>
    </Layout>
  );
} 