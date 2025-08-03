export interface Character {
  name: string;
  avatar: string;
  level: number;
  exp: number;
  maxExp: number;
}

// Character gallery data - all start from level 0
export const characterGallery: Character[] = [
  {
    name: "Elven Mage",
    avatar: "🧝‍♀️",
    level: 0,
    exp: 0,
    maxExp: 500,
  },
  {
    name: "Dragon Warrior", 
    avatar: "🐉",
    level: 0,
    exp: 0,
    maxExp: 500,
  },
  {
    name: "Shadow Rogue",
    avatar: "🥷",
    level: 0,
    exp: 0,
    maxExp: 500,
  },
  {
    name: "Crystal Healer",
    avatar: "🔮",
    level: 0,
    exp: 0,
    maxExp: 500,
  },
  {
    name: "Fire Wizard",
    avatar: "🧙‍♂️",
    level: 0,
    exp: 0,
    maxExp: 500,
  },
  {
    name: "Forest Guardian",
    avatar: "🌳",
    level: 0,
    exp: 0,
    maxExp: 500,
  },
  {
    name: "Storm Caller",
    avatar: "⚡",
    level: 0,
    exp: 0,
    maxExp: 500,
  },
  {
    name: "Moon Archer",
    avatar: "🏹",
    level: 0,
    exp: 0,
    maxExp: 500,
  },
]; 