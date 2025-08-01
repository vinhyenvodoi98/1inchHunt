import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

interface LocationMarker {
  id: string;
  name: string;
  type: 'swap' | 'boss' | 'treasure' | 'shop' | 'quest' | 'dungeon';
  x: number; // percentage position
  y: number; // percentage position
  description: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'legendary';
  available: boolean;
}

interface GameMapProps {
  characterPosition?: { x: number; y: number };
  className?: string;
}

const markerConfig = {
  swap: {
    icon: '🔄',
    color: 'bg-blue-500',
    borderColor: 'border-blue-600',
    glowColor: 'rgba(59, 130, 246, 0.5)',
  },
  boss: {
    icon: '👹',
    color: 'bg-red-500',
    borderColor: 'border-red-600',
    glowColor: 'rgba(239, 68, 68, 0.5)',
  },
  treasure: {
    icon: '💰',
    color: 'bg-yellow-500',
    borderColor: 'border-yellow-600',
    glowColor: 'rgba(251, 191, 36, 0.5)',
  },
  shop: {
    icon: '🏪',
    color: 'bg-green-500',
    borderColor: 'border-green-600',
    glowColor: 'rgba(34, 197, 94, 0.5)',
  },
  quest: {
    icon: '📋',
    color: 'bg-purple-500',
    borderColor: 'border-purple-600',
    glowColor: 'rgba(168, 85, 247, 0.5)',
  },
  dungeon: {
    icon: '🏰',
    color: 'bg-gray-500',
    borderColor: 'border-gray-600',
    glowColor: 'rgba(107, 114, 128, 0.5)',
  },
};

const difficultyColors = {
  easy: 'border-green-400',
  medium: 'border-yellow-400',
  hard: 'border-orange-400',
  legendary: 'border-purple-400',
};

export default function GameMap({
  characterPosition = { x: 30, y: 70 },
  className = '',
}: GameMapProps) {
  const router = useRouter();
  const [hoveredMarker, setHoveredMarker] = React.useState<string | null>(null);

  // Sample location markers
  const locations: LocationMarker[] = [
    {
      id: 'swap-central',
      name: 'Central Exchange',
      type: 'swap',
      x: 50,
      y: 40,
      description: 'The main trading hub where all token swaps take place. High liquidity guaranteed.',
      available: true,
    },
    {
      id: 'dragon-boss',
      name: 'Dragon\'s Lair',
      type: 'boss',
      x: 80,
      y: 20,
      description: 'Face the mighty DeFi Dragon. Requires 1000+ XP to enter.',
      difficulty: 'legendary',
      available: false,
    },
    {
      id: 'treasure-vault',
      name: 'Ancient Vault',
      type: 'treasure',
      x: 20,
      y: 30,
      description: 'Hidden treasure containing rare NFTs and bonus tokens.',
      difficulty: 'medium',
      available: true,
    },
    {
      id: 'magic-shop',
      name: 'Mystical Shop',
      type: 'shop',
      x: 65,
      y: 75,
      description: 'Purchase magical items and power-ups with your earned tokens.',
      available: true,
    },
    {
      id: 'quest-board',
      name: 'Quest Hub',
      type: 'quest',
      x: 40,
      y: 60,
      description: 'Accept new missions and track your quest progress.',
      available: true,
    },
    {
      id: 'shadow-dungeon',
      name: 'Shadow Depths',
      type: 'dungeon',
      x: 15,
      y: 80,
      description: 'A dangerous dungeon filled with shadowy creatures and dark magic.',
      difficulty: 'hard',
      available: true,
    },
  ];

  const handleMapClick = () => {
    router.push('/map');
  };

  return (
    <motion.div
      className={`relative w-full h-96 bg-gray-900 border-4 border-gray-800 overflow-hidden cursor-pointer ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleMapClick}
      transition={{ duration: 0.2 }}
    >
      {/* Click to explore overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-30"
      >
        <div className="bg-black/80 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3">
          <p className="text-white font-bold text-lg">🗺️ Click to Explore Interactive Map</p>
          <p className="text-gray-300 text-sm text-center">Navigate with WASD • Discover hidden locations</p>
        </div>
      </motion.div>

      {/* Background Map Image with Pixel Art Style */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
              <defs>
                <pattern id="grass" patternUnits="userSpaceOnUse" width="40" height="40">
                  <rect width="40" height="40" fill="#4ade80"/>
                  <circle cx="10" cy="10" r="2" fill="#22c55e"/>
                  <circle cx="30" cy="20" r="1.5" fill="#16a34a"/>
                  <circle cx="20" cy="35" r="1" fill="#15803d"/>
                </pattern>
                <pattern id="water" patternUnits="userSpaceOnUse" width="30" height="30">
                  <rect width="30" height="30" fill="#3b82f6"/>
                  <circle cx="15" cy="15" r="3" fill="#2563eb" opacity="0.7"/>
                  <circle cx="5" cy="25" r="2" fill="#1d4ed8" opacity="0.5"/>
                </pattern>
                <pattern id="mountain" patternUnits="userSpaceOnUse" width="50" height="50">
                  <rect width="50" height="50" fill="#6b7280"/>
                  <polygon points="25,10 35,35 15,35" fill="#4b5563"/>
                  <polygon points="10,20 20,40 5,40" fill="#374151"/>
                </pattern>
              </defs>

              <!-- Grass areas -->
              <rect x="0" y="200" width="400" height="400" fill="url(#grass)"/>
              <rect x="500" y="300" width="300" height="300" fill="url(#grass)"/>

              <!-- Water areas -->
              <ellipse cx="150" cy="100" rx="80" ry="40" fill="url(#water)"/>
              <rect x="600" y="50" width="150" height="100" fill="url(#water)"/>

              <!-- Mountain areas -->
              <rect x="0" y="0" width="500" height="200" fill="url(#mountain)"/>
              <rect x="550" y="150" width="250" height="150" fill="url(#mountain)"/>

              <!-- Paths -->
              <rect x="200" y="0" width="20" height="600" fill="#a3a3a3"/>
              <rect x="0" y="250" width="800" height="20" fill="#a3a3a3"/>

              <!-- Structures -->
              <rect x="350" y="180" width="100" height="80" fill="#7c2d12"/>
              <rect x="50" y="450" width="60" height="60" fill="#1f2937"/>
              <rect x="650" y="400" width="80" height="70" fill="#581c87"/>
            </svg>
          `)}`,
          imageRendering: 'pixelated',
        }}
      />

      {/* Pixel Grid Overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 19px,
              rgba(255, 255, 255, 0.1) 19px,
              rgba(255, 255, 255, 0.1) 20px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 19px,
              rgba(255, 255, 255, 0.1) 19px,
              rgba(255, 255, 255, 0.1) 20px
            )
          `,
        }}
      />

      {/* Character Position */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute"
        style={{
          left: `${characterPosition.x}%`,
          top: `${characterPosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative"
        >
          {/* Character Shadow */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-black/30 rounded-full blur-sm"></div>

          {/* Character */}
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 border-4 border-white rounded-lg flex items-center justify-center text-2xl shadow-lg">
            🧙‍♂️
          </div>

          {/* Character Glow */}
          <div className="absolute inset-0 w-12 h-12 bg-amber-400 rounded-lg opacity-30 animate-pulse"></div>
        </motion.div>
      </motion.div>

      {/* Location Markers */}
      {locations.map((location, index) => {
        const config = markerConfig[location.type];
        const isHovered = hoveredMarker === location.id;

        return (
          <div
            key={location.id}
            className="absolute"
            style={{
              left: `${location.x}%`,
              top: `${location.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Marker */}
            <motion.div
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut'
              }}
              onHoverStart={() => setHoveredMarker(location.id)}
              onHoverEnd={() => setHoveredMarker(null)}
              className={`relative cursor-pointer ${location.available ? '' : 'opacity-50'}`}
            >
              {/* Marker Pulse Animation */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
                className={`absolute inset-0 w-10 h-10 ${config.color} rounded-full`}
              />

              {/* Main Marker */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  y: [0, -3, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                className={`w-10 h-10 ${config.color} border-2 ${config.borderColor} rounded-full flex items-center justify-center text-lg shadow-lg relative z-10`}
                style={{
                  boxShadow: `0 0 15px ${config.glowColor}`,
                }}
              >
                {config.icon}

                {/* Difficulty Indicator */}
                {location.difficulty && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 border-2 ${difficultyColors[location.difficulty]} rounded-full bg-white`}></div>
                )}

                {/* Unavailable Overlay */}
                {!location.available && (
                  <div className="absolute inset-0 bg-gray-600/50 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🔒</span>
                  </div>
                )}
              </motion.div>

              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 z-20"
                >
                  <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-2xl">
                    <h4 className="text-white font-bold text-sm mb-1">{location.name}</h4>
                    <p className="text-gray-300 text-xs mb-2">{location.description}</p>

                    {location.difficulty && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Difficulty:</span>
                        <span className={`text-xs font-bold capitalize ${
                          location.difficulty === 'easy' ? 'text-green-400' :
                          location.difficulty === 'medium' ? 'text-yellow-400' :
                          location.difficulty === 'hard' ? 'text-orange-400' :
                          'text-purple-400'
                        }`}>
                          {location.difficulty}
                        </span>
                      </div>
                    )}

                    {!location.available && (
                      <div className="text-red-400 text-xs mt-1">🔒 Locked</div>
                    )}
                  </div>

                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        );
      })}

      {/* Map Title */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
        <h3 className="text-white font-bold text-lg">🗺️ HashHunt Realm</h3>
        <p className="text-gray-300 text-xs">Explore the DeFi kingdom</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg p-3">
        <h4 className="text-white font-bold text-sm mb-2">Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(markerConfig).map(([type, config]) => (
            <div key={type} className="flex items-center space-x-2">
              <div className={`w-4 h-4 ${config.color} border ${config.borderColor} rounded-full flex items-center justify-center text-xs`}>
                {config.icon}
              </div>
              <span className="text-gray-300 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scan Lines for Retro Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
        }}
      />
    </motion.div>
  );
} 