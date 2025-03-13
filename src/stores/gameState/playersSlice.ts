
import { StateCreator } from 'zustand';
import { GameState, PlayersState } from './types';

export const createPlayersSlice: StateCreator<
  GameState,
  [],
  [],
  PlayersState
> = (set) => ({
  players: [],
  hoh: null,
  nominees: [],
  vetoHolder: null,
  
  setPlayers: (players) => set({ players }),
  
  setHohWinner: (playerId) => set((state) => ({
    hoh: playerId,
    players: state.players.map(player => 
      player.id === playerId 
        ? { 
            ...player, 
            stats: { 
              ...player.stats, 
              hohWins: (player.stats?.hohWins || 0) + 1 
            } 
          }
        : player
    )
  })),
  
  setNominees: (nominees) => set((state) => ({
    nominees,
    players: state.players.map(player => 
      nominees.includes(player.id)
        ? { 
            ...player, 
            status: 'nominated',
            stats: { 
              ...player.stats, 
              nominations: (player.stats?.nominations || 0) + 1 
            } 
          }
        : player.status === 'nominated' && !nominees.includes(player.id)
          ? { ...player, status: 'active' }
          : player
    )
  })),
  
  setVetoHolder: (playerId) => set((state) => ({
    vetoHolder: playerId,
    players: state.players.map(player => 
      player.id === playerId 
        ? { 
            ...player, 
            stats: { 
              ...player.stats, 
              povWins: (player.stats?.povWins || 0) + 1 
            } 
          }
        : player
    )
  })),
});
