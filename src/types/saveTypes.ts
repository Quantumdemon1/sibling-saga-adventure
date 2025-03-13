
import { Player } from './PlayerProfileTypes';
import { Alliance, GamePhase } from './gameTypes';

export interface GameSaveData {
  version: string;
  timestamp: string;
  gameState: {
    players: Player[];
    alliances: Alliance[];
    currentPhase: GamePhase;
    nominees: string[];
    hoh: string | null;
    vetoHolder: string | null;
    dayCount: number;
    weekCount: number;
    [key: string]: any; // Allow for future extensions
  };
}
