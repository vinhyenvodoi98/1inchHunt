# Mission System

This directory contains the mission system for the HashHunt game, organized into different mission types with increasing complexity.

## Mission Structure

### `/mission` (Mission Hub)
- **File**: `index.tsx`
- **Purpose**: Central hub for all missions
- **Features**: 
  - Mission selection cards
  - Progress tracking
  - Difficulty indicators
  - XP rewards display

### `/mission/swap` (Basic Swap Mission)
- **File**: `swap.tsx`
- **Difficulty**: Beginner
- **XP Reward**: 500
- **Features**:
  - Simple token swapping
  - Basic preview functionality
  - Progress tracking (3 swaps required)
  - Level up animations

### `/mission/advanced-swap` (Advanced Swap Mission)
- **File**: `advanced-swap.tsx`
- **Difficulty**: Intermediate
- **XP Reward**: 800
- **Features**:
  - Multi-route optimization
  - Advanced settings (slippage control)
  - Route comparison
  - Progress tracking (2 swaps required)

### `/mission/limit-order` (Limit Order Mission)
- **File**: `limit-order.tsx`
- **Difficulty**: Advanced
- **XP Reward**: 1000
- **Features**:
  - Limit order creation
  - Price setting
  - Order management
  - Active orders tracking
  - Progress tracking (2 orders required)

## Navigation Flow

1. **Map Page** → Click on swap zone → `/mission` (redirects to mission hub)
2. **Mission Hub** → Select specific mission → `/mission/[type]`
3. **Individual Mission** → Complete objectives → Return to hub

## Mission Features

### Common Features Across All Missions
- Animated backgrounds with floating elements
- Level up system with XP rewards
- Progress tracking
- Back navigation to map
- Responsive design
- Framer Motion animations

### Mission-Specific Features
- **Basic Swap**: Simple token exchange with preview
- **Advanced Swap**: Multi-route optimization and settings
- **Limit Order**: Strategic trading with order management

## Technical Implementation

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **Animations**: Framer Motion
- **State Management**: React hooks
- **Routing**: Next.js router

## Future Enhancements

- Mission completion persistence
- Achievement system integration
- Leaderboard functionality
- Mission difficulty progression
- Real-time price feeds
- Blockchain integration 