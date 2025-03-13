
import { StateCreator } from 'zustand';
import { GameState, UIState } from './types';
import { OverlayType } from '@/types/gameTypes';

export const createUISlice: StateCreator<
  GameState,
  [],
  [],
  UIState
> = (set) => ({
  overlay: null,
  
  setDialogue: (dialogue) => set({
    overlay: dialogue ? { type: 'dialogue', npcId: dialogue.npcId } : null
  }),
  
  setOverlay: (overlay) => set({ overlay }),
});
