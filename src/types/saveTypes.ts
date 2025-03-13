
import { Player } from './PlayerProfileTypes';
import { Alliance } from './gameTypes';

export interface GameSaveData {
  version: string;
  timestamp: string;
  gameState: {
    players: Player[];
    alliances: Alliance[];
    currentPhase: string;
    nominees: string[];
    hoh: string | null;
    vetoHolder: string | null;
    dayCount: number;
    [key: string]: any; // Allow for future extensions
  };
}
