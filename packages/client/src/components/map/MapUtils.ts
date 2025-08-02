export interface Position {
  x: number;
  y: number;
}

export interface SpecialZone {
  x: number;
  y: number;
  type: 'swap' | 'advanced-swap' | 'limit-order' | 'boss' | 'chest';
  icon: string;
  name: string;
  description: string;
  action: string;
}

export const GRID_SIZE = 80; // Massive world for full screen experience
export const CELL_SIZE = 20; // Optimized for maximum screen coverage

// Calculate dynamic viewport size with header moved to sidebar
export const getViewportSize = () => {
  if (typeof window === 'undefined') return 40; // Default for SSR
  
  const availableWidth = Math.floor((window.innerWidth - 340) / CELL_SIZE); // Account for sidebar
  const availableHeight = Math.floor((window.innerHeight - 120) / CELL_SIZE); // Account for Layout header only
  
  return Math.min(availableWidth, availableHeight, 75); // Maximum viewport with header in sidebar
};

export const VIEWPORT_SIZE = getViewportSize();

// Define terrain types for classic RPG feel
export const terrainTypes = {
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
export const createTerrainMap = (): string[][] => {
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

export const terrainMap = createTerrainMap();

export const specialZones: SpecialZone[] = [
  // Basic Swap Missions (Beginner)
  {
    x: 15,
    y: 35,
    type: 'swap',
    icon: '🔄',
    name: 'Basic Swap Academy',
    description: 'Learn the fundamentals of token swapping in this beginner-friendly zone',
    action: 'Press SPACE to start basic swap mission'
  },
  {
    x: 45,
    y: 15,
    type: 'swap',
    icon: '🔄',
    name: 'Swap Training Grounds',
    description: 'Practice simple token exchanges with guided tutorials',
    action: 'Press SPACE to enter training grounds'
  },
  
  // Advanced Swap Missions (Intermediate)
  {
    x: 35,
    y: 60,
    type: 'advanced-swap',
    icon: '🚀',
    name: 'Advanced Trading Hub',
    description: 'Master complex routing and optimization strategies',
    action: 'Press SPACE to access advanced swap mission'
  },
  {
    x: 65,
    y: 35,
    type: 'advanced-swap',
    icon: '🚀',
    name: 'Multi-Route Exchange',
    description: 'Advanced trading with multiple route optimization',
    action: 'Press SPACE to explore multi-route trading'
  },
  
  // Limit Order Missions (Advanced)
  {
    x: 25,
    y: 25,
    type: 'limit-order',
    icon: '📊',
    name: 'Limit Order Tower',
    description: 'Strategic trading with limit orders and price management',
    action: 'Press SPACE to enter limit order mission'
  },
  {
    x: 55,
    y: 55,
    type: 'limit-order',
    icon: '📊',
    name: 'Strategic Trading Center',
    description: 'Advanced limit order strategies and market analysis',
    action: 'Press SPACE to access strategic trading'
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

// Utility functions
export const getTerrainAt = (x: number, y: number): string => {
  if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return 'grass';
  return terrainMap[y][x];
};

export const isValidPosition = (x: number, y: number): boolean => {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
};

export const getZoneAtPosition = (x: number, y: number): SpecialZone | null => {
  return specialZones.find(zone => zone.x === x && zone.y === y) || null;
}; 