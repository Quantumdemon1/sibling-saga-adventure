
import { create } from 'zustand';
import { createGameProgressSlice } from './gameState/gameProgressSlice';
import { createPlayersSlice } from './gameState/playersSlice';
import { createUISlice } from './gameState/uiSlice';
import { createAllianceSlice } from './gameState/allianceSlice';
import { createMiscActions } from './gameState/index';
import { GameState } from './gameState/types';

// Create the store with all slices
const useGameStateStore = create<GameState>()((...a) => ({
  ...createGameProgressSlice(...a),
  ...createPlayersSlice(...a),
  ...createUISlice(...a),
  ...createAllianceSlice(...a),
  ...createMiscActions(...a),
}));

export { useInitialPlayers } from './gameState/initialPlayers';
export default useGameStateStore;
