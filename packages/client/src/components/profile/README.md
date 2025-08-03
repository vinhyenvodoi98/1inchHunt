# Profile Page Components

This directory contains the components for the 1inchHunt Profile Page, featuring a pixel-art RPG UI theme with fantasy adventure elements.

## Components

### Main Profile Page
- **`[address].tsx`** - Main profile page with header, tabs, and responsive layout

### Tab Components
- **`InventoryTab.tsx`** - Displays user's token collection with balances and values
- **`QuestsTab.tsx`** - Shows active and completed quests (swap missions)
- **`AchievementsTab.tsx`** - Displays unlocked achievements with rarity levels

## Features

### 🎮 RPG Theme
- **Pixel-art inspired design** with rounded corners and subtle shadows
- **Monospace fonts** for that game-like feel
- **Emoji icons** for visual appeal
- **Gradient backgrounds** and colorful elements
- **Framer Motion animations** for smooth interactions

### 📱 Responsive Design
- **Mobile-first approach** with responsive breakpoints
- **Flexible grid layouts** that adapt to screen size
- **Touch-friendly buttons** and interactions
- **Optimized spacing** for different devices

### 🧳 Inventory Tab
- **Token list** with icons, names, and balances
- **Real-time values** and 24h price changes
- **Total portfolio value** calculation
- **Quick action buttons** for trading
- **Empty state** for new users

### 🗺️ Quests Tab
- **Quest cards** with progress tracking
- **Difficulty levels** (easy, medium, hard)
- **Status indicators** (active, completed, failed)
- **Reward display** with XP and badges
- **Deadline tracking** for time-sensitive quests

### 📜 Achievements Tab
- **Rarity system** (common, rare, epic, legendary)
- **Progress tracking** for locked achievements
- **Unlock dates** for completed achievements
- **Visual effects** based on rarity
- **Overall progress** calculation

## Data Structure

### Token Interface
```typescript
interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  value: string;
  icon: string;
  color: string;
  change24h: number;
}
```

### Quest Interface
```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  reward: string;
  progress: number;
  maxProgress: number;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  deadline?: string;
  completedAt?: string;
}
```

### Achievement Interface
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  reward: string;
}
```

## Usage

### Basic Usage
```tsx
import { InventoryTab, QuestsTab, AchievementsTab } from '@/components/profile';

// Use in your profile page
<InventoryTab />
<QuestsTab />
<AchievementsTab />
```

### With Tab Switching
```tsx
import { useState } from 'react';
import { InventoryTab, QuestsTab, AchievementsTab } from '@/components/profile';

const [activeTab, setActiveTab] = useState('inventory');

{activeTab === 'inventory' && <InventoryTab />}
{activeTab === 'quests' && <QuestsTab />}
{activeTab === 'achievements' && <AchievementsTab />}
```

## Styling

### Color Scheme
- **Primary**: Purple to pink gradients
- **Success**: Green gradients
- **Warning**: Yellow/Orange gradients
- **Error**: Red gradients
- **Neutral**: Gray gradients

### Typography
- **Font Family**: Monospace for game-like feel
- **Font Weights**: Bold for headings, medium for buttons
- **Text Sizes**: Responsive scaling

### Animations
- **Framer Motion** for smooth transitions
- **Hover effects** on interactive elements
- **Staggered animations** for lists
- **Progress bar animations**

## Integration

### Wallet Integration
The profile page integrates with:
- **Wagmi** for wallet connection
- **RainbowKit** for wallet UI
- **Account address** display and validation

### API Integration Points
- **Token Balance API** for inventory data
- **Token Metadata API** for token icons and info
- **Swap History API** for quest tracking
- **Achievement API** for progress tracking

## Customization

### Adding New Tokens
1. Add token data to the `tokens` array in `InventoryTab.tsx`
2. Include icon, color, and metadata
3. Update total value calculation

### Adding New Quests
1. Add quest data to the `quests` array in `QuestsTab.tsx`
2. Set appropriate difficulty and rewards
3. Update progress tracking logic

### Adding New Achievements
1. Add achievement data to the `achievements` array in `AchievementsTab.tsx`
2. Set rarity level and requirements
3. Update progress calculation

## File Structure
```
profile/
├── index.ts              # Component exports
├── README.md             # This documentation
├── InventoryTab.tsx      # Token inventory display
├── QuestsTab.tsx         # Quest/mission tracking
└── AchievementsTab.tsx   # Achievement system
``` 