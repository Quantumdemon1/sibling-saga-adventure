
import { StateCreator } from 'zustand';
import { GameState, GameProgressState } from './types';
import { GamePhase } from '@/types/gameTypes';

export const createGameProgressSlice: StateCreator<
  GameState,
  [],
  [],
  GameProgressState
> = (set) => ({
  currentPhase: 'idle',
  dayCount: 1,
  weekCount: 1,
  
  advanceWeek: () => set((state) => ({
    weekCount: state.weekCount + 1,
    dayCount: state.dayCount + 7,
    hoh: null,
    nominees: [],
    vetoHolder: null,
    players: state.players.map(player => 
      player.status !== 'evicted'
        ? { 
            ...player, 
            status: 'active',
            stats: { 
              ...player.stats, 
              daysInHouse: (player.stats?.daysInHouse || 0) + 7 
            } 
          }
        : player
    )
  })),
});
