// LocalStorage keys
const STORAGE_KEYS = {
  USER_LEVEL: '1inchHunt_user_level',
  USER_EXP: '1inchHunt_user_exp',
  USER_MAX_EXP: '1inchHunt_user_max_exp',
  USER_NAME: '1inchHunt_user_name',
  USER_AVATAR: '1inchHunt_user_avatar',
  MAP_POSITION: '1inchHunt_map_position',
  SHARES_COMPLETED: '1inchHunt_shares_completed',
  VISITED_ZONES: '1inchHunt_visited_zones',
  MISSION_PROGRESS: '1inchHunt_mission_progress',
} as const;

// User character interface
export interface UserCharacter {
  level: number;
  exp: number;
  maxExp: number;
  name: string;
  avatar: string;
}

// Map position interface
export interface MapPosition {
  x: number;
  y: number;
}

// Mission progress interface
export interface MissionProgress {
  swap: { completed: number; total: number };
  advancedSwap: { completed: number; total: number };
  limitOrder: { completed: number; total: number };
  share: { completed: number; total: number };
}

// LocalStorage utility class
export class GameStorage {
  // Character management
  static saveCharacter(character: UserCharacter): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_LEVEL, character.level.toString());
      localStorage.setItem(STORAGE_KEYS.USER_EXP, character.exp.toString());
      localStorage.setItem(STORAGE_KEYS.USER_MAX_EXP, character.maxExp.toString());
      localStorage.setItem(STORAGE_KEYS.USER_NAME, character.name);
      localStorage.setItem(STORAGE_KEYS.USER_AVATAR, character.avatar);
    } catch (error) {
      console.error('Error saving character data:', error);
    }
  }

  static getCharacter(): UserCharacter | null {
    try {
      const level = localStorage.getItem(STORAGE_KEYS.USER_LEVEL);
      const exp = localStorage.getItem(STORAGE_KEYS.USER_EXP);
      const maxExp = localStorage.getItem(STORAGE_KEYS.USER_MAX_EXP);
      const name = localStorage.getItem(STORAGE_KEYS.USER_NAME);
      const avatar = localStorage.getItem(STORAGE_KEYS.USER_AVATAR);

      if (level && exp && maxExp && name && avatar) {
        return {
          level: parseInt(level),
          exp: parseInt(exp),
          maxExp: parseInt(maxExp),
          name,
          avatar,
        };
      }
      return null;
    } catch (error) {
      console.error('Error loading character data:', error);
      return null;
    }
  }

  // Map position management
  static saveMapPosition(position: MapPosition): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MAP_POSITION, JSON.stringify(position));
    } catch (error) {
      console.error('Error saving map position:', error);
    }
  }

  static getMapPosition(): MapPosition | null {
    try {
      const position = localStorage.getItem(STORAGE_KEYS.MAP_POSITION);
      return position ? JSON.parse(position) : null;
    } catch (error) {
      console.error('Error loading map position:', error);
      return null;
    }
  }

  // Shares completed management
  static saveSharesCompleted(count: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SHARES_COMPLETED, count.toString());
    } catch (error) {
      console.error('Error saving shares completed:', error);
    }
  }

  static getSharesCompleted(): number {
    try {
      const count = localStorage.getItem(STORAGE_KEYS.SHARES_COMPLETED);
      return count ? parseInt(count) : 0;
    } catch (error) {
      console.error('Error loading shares completed:', error);
      return 0;
    }
  }

  // Visited zones management
  static saveVisitedZones(zones: Set<string>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VISITED_ZONES, JSON.stringify(Array.from(zones)));
    } catch (error) {
      console.error('Error saving visited zones:', error);
    }
  }

  static getVisitedZones(): Set<string> {
    try {
      const zones = localStorage.getItem(STORAGE_KEYS.VISITED_ZONES);
      return zones ? new Set(JSON.parse(zones)) : new Set();
    } catch (error) {
      console.error('Error loading visited zones:', error);
      return new Set();
    }
  }

  // Mission progress management
  static saveMissionProgress(progress: MissionProgress): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MISSION_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving mission progress:', error);
    }
  }

  static getMissionProgress(): MissionProgress {
    try {
      const progress = localStorage.getItem(STORAGE_KEYS.MISSION_PROGRESS);
      if (progress) {
        return JSON.parse(progress);
      }
      // Default progress
      return {
        swap: { completed: 0, total: 3 },
        advancedSwap: { completed: 0, total: 2 },
        limitOrder: { completed: 0, total: 2 },
        share: { completed: 0, total: 1 },
      };
    } catch (error) {
      console.error('Error loading mission progress:', error);
      return {
        swap: { completed: 0, total: 3 },
        advancedSwap: { completed: 0, total: 2 },
        limitOrder: { completed: 0, total: 2 },
        share: { completed: 0, total: 1 },
      };
    }
  }

  // Clear all game data
  static clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing game data:', error);
    }
  }

  // Check if localStorage is available
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
} 