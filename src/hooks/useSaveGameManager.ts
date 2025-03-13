
import { useCallback, useState } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { GameSaveData } from '@/types/saveTypes';
import { useToast } from '@/components/ui/use-toast';
import { GamePhase } from '@/types/gameTypes';

const useSaveGameManager = () => {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [loadSuccess, setLoadSuccess] = useState<boolean>(false);
  
  const { toast } = useToast();
  const gameState = useGameStateStore();
  
  const saveGame = useCallback(() => {
    try {
      // Create save data object
      const saveData: GameSaveData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        gameState: {
          players: gameState.players,
          alliances: gameState.alliances,
          currentPhase: gameState.currentPhase,
          nominees: gameState.nominees,
          hoh: gameState.hoh,
          vetoHolder: gameState.vetoHolder,
          dayCount: gameState.dayCount,
          weekCount: gameState.weekCount,
          // Don't save UI-specific state like dialogue or overlay
        }
      };
      
      // Save to localStorage
      localStorage.setItem('bbRpgSaveData', JSON.stringify(saveData));
      
      // Also support multiple save slots
      const saveSlot = `bbRpgSave_${new Date().toISOString()}`;
      localStorage.setItem(saveSlot, JSON.stringify(saveData));
      
      // Update save slots list
      const savedSlots = JSON.parse(localStorage.getItem('bbRpgSaveSlots') || '[]');
      savedSlots.push(saveSlot);
      localStorage.setItem('bbRpgSaveSlots', JSON.stringify(savedSlots));
      
      setSaveSuccess(true);
      setSaveError(null);
      
      toast({
        title: "Game Saved",
        description: "Your game has been saved successfully!",
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
      
      console.log('Game saved successfully');
      return true;
    } catch (error) {
      setSaveError(`Failed to save game: ${error}`);
      setSaveSuccess(false);
      console.error('Error saving game:', error);
      
      toast({
        title: "Save Failed",
        description: `Failed to save game: ${error}`,
        variant: "destructive",
      });
      
      return false;
    }
  }, [gameState, toast]);

  const loadGame = useCallback((slot?: string) => {
    try {
      // Load from specified slot or default
      const savedData = localStorage.getItem(slot || 'bbRpgSaveData');
      
      if (!savedData) {
        setLoadError('No saved game found');
        toast({
          title: "Load Failed",
          description: "No saved game found",
          variant: "destructive",
        });
        return false;
      }
      
      const saveData: GameSaveData = JSON.parse(savedData);
      
      // Version checking
      if (saveData.version !== '1.0') {
        setLoadError(`Incompatible save version: ${saveData.version}`);
        toast({
          title: "Load Failed",
          description: `Incompatible save version: ${saveData.version}`,
          variant: "destructive",
        });
        return false;
      }
      
      // Restore state
      gameState.setPlayers(saveData.gameState.players);
      
      // Properly cast the phase to GamePhase type
      gameState.setPhase(saveData.gameState.currentPhase as GamePhase);
      
      if (saveData.gameState.hoh) {
        gameState.setHohWinner(saveData.gameState.hoh);
      }
      
      if (saveData.gameState.nominees) {
        gameState.setNominees(saveData.gameState.nominees);
      }
      
      if (saveData.gameState.vetoHolder) {
        gameState.setVetoHolder(saveData.gameState.vetoHolder);
      }
      
      // Reset UI state
      gameState.setOverlay(null);
      
      setLoadSuccess(true);
      setLoadError(null);
      
      toast({
        title: "Game Loaded",
        description: "Your game has been loaded successfully!",
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setLoadSuccess(false), 3000);
      
      console.log('Game loaded successfully');
      return true;
    } catch (error) {
      setLoadError(`Failed to load game: ${error}`);
      setLoadSuccess(false);
      console.error('Error loading game:', error);
      
      toast({
        title: "Load Failed",
        description: `Failed to load game: ${error}`,
        variant: "destructive",
      });
      
      return false;
    }
  }, [gameState, toast]);

  const getSaveSlots = useCallback(() => {
    try {
      const slots = JSON.parse(localStorage.getItem('bbRpgSaveSlots') || '[]');
      return slots.map((slotKey: string) => {
        try {
          const slotData: GameSaveData = JSON.parse(localStorage.getItem(slotKey) || '{}');
          return {
            key: slotKey,
            timestamp: slotData.timestamp,
            dayCount: slotData.gameState.dayCount,
            playerCount: slotData.gameState.players.filter(p => p.status === 'active').length
          };
        } catch {
          return { key: slotKey, timestamp: 'Unknown', dayCount: 0, playerCount: 0 };
        }
      });
    } catch {
      return [];
    }
  }, []);

  const deleteSaveSlot = useCallback((slot: string) => {
    try {
      localStorage.removeItem(slot);
      const slots = JSON.parse(localStorage.getItem('bbRpgSaveSlots') || '[]');
      const updatedSlots = slots.filter((s: string) => s !== slot);
      localStorage.setItem('bbRpgSaveSlots', JSON.stringify(updatedSlots));
      
      toast({
        title: "Save Deleted",
        description: "Save slot has been deleted",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: `Failed to delete save: ${error}`,
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return { 
    saveGame,
    loadGame,
    getSaveSlots,
    deleteSaveSlot,
    saveError,
    loadError,
    saveSuccess,
    loadSuccess
  };
};

export default useSaveGameManager;
