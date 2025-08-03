# Map Components

This directory contains the modular components for the 1inchHunt game map. The map has been refactored from a single monolithic component into multiple smaller, maintainable components.

## Component Structure

### Core Components

- **`MapContainer.tsx`** - Main container component that manages state and coordinates all other components
- **`MapUtils.ts`** - Utility functions, constants, and data structures shared across map components

### Rendering Components

- **`GameGrid.tsx`** - Renders the terrain grid and grid lines
- **`PlayerCharacter.tsx`** - Renders the player character with animations
- **`SpecialZones.tsx`** - Renders special zones (towns, bosses, chests) on the map
- **`Minimap.tsx`** - Renders the minimap in the sidebar

### UI Components

- **`ZoneInfoPanel.tsx`** - Displays information about the current zone when player is on it
- **`GameSidebar.tsx`** - Contains game stats, minimap, and legends
- **`FloatingParticles.tsx`** - Adds magical particle effects to the map

## Usage

```tsx
import { MapContainer } from '@/components/map';

export default function MapPage() {
  return (
    <Layout>
      <MapContainer />
    </Layout>
  );
}
```

## Component Dependencies

```
MapContainer
├── GameGrid
├── PlayerCharacter
├── SpecialZones
├── ZoneInfoPanel
├── GameSidebar
│   └── Minimap
└── FloatingParticles
```

## State Management

The `MapContainer` component manages all the game state:

- `playerPos` - Player position
- `currentZone` - Currently occupied special zone
- `showZoneMessage` - Whether to show zone info panel
- `visitedZones` - Set of visited zone coordinates
- `viewportSize` - Dynamic viewport size based on screen

## Key Features

- **Modular Design**: Each component has a single responsibility
- **Reusable Components**: Components can be easily reused or modified
- **Type Safety**: Full TypeScript support with proper interfaces
- **Performance**: Optimized rendering with proper React patterns
- **Maintainability**: Easy to modify individual features without affecting others

## Adding New Features

To add new features to the map:

1. **New Terrain Types**: Add to `terrainTypes` in `MapUtils.ts`
2. **New Special Zones**: Add to `specialZones` array in `MapUtils.ts`
3. **New UI Elements**: Create new components and import them in `MapContainer`
4. **New Animations**: Use Framer Motion in individual components

## File Structure

```
map/
├── index.ts              # Exports all components
├── README.md             # This documentation
├── MapUtils.ts           # Utilities and constants
├── MapContainer.tsx      # Main container
├── GameGrid.tsx          # Terrain grid
├── PlayerCharacter.tsx   # Player rendering
├── SpecialZones.tsx      # Special zones
├── ZoneInfoPanel.tsx     # Zone information
├── GameSidebar.tsx       # Sidebar UI
├── Minimap.tsx           # Minimap component
└── FloatingParticles.tsx # Particle effects
``` 