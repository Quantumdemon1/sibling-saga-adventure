
import { create } from 'zustand';
import { GameState } from './types';
import { createGameProgressSlice } from './gameProgressSlice';
import { createPlayersSlice } from './playersSlice';
import { createUISlice } from './uiSlice';
import { createAllianceSlice } from './allianceSlice';
import { GamePhase } from '@/types/gameTypes';

// Additional actions that affect multiple slices
const createMiscActions = (set: any) => ({
  setPhase: (phase: GamePhase) => set((state: GameState) => ({
    currentPhase: phase,
    // If we're entering HoH competition, it's a new day
    dayCount: phase === 'hohCompetition' ? state.dayCount + 1 : state.dayCount,
  })),
  
  // Reset all state when starting a new game
  resetGame: () => set({
    currentPhase: 'idle',
    dayCount: 1,
    weekCount: 1,
    players: [],
    hoh: null,
    nominees: [],
    vetoHolder: null,
    overlay: null,
    alliances: [],
    allianceProposals: [],
  }),
});

// Create the store with all slices
const useGameStateStore = create<GameState>((set) => ({
  ...createGameProgressSlice(set),
  ...createPlayersSlice(set),
  ...createUISlice(set),
  ...createAllianceSlice(set),
  ...createMiscActions(set),
}));

export default useGameStateStore;
