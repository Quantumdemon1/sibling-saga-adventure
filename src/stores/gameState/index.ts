
import { StateCreator } from 'zustand';
import { GameState, MiscActions } from './types';
import { GamePhase } from '@/types/gameTypes';

// Additional actions that affect multiple slices
export const createMiscActions: StateCreator<
  GameState,
  [],
  [],
  MiscActions
> = (set) => ({
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
