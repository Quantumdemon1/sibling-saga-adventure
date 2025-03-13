
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import useGameStateStore from '@/stores/gameStateStore';

export const useSaveGame = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const gameState = useGameStateStore();

  const saveGame = useCallback(() => {
    try {
      setIsLoading(true);
      
      const gameData = {
        currentPhase: gameState.currentPhase,
        dayCount: gameState.dayCount,
        weekCount: gameState.weekCount,
        players: gameState.players,
        hoh: gameState.hoh,
        nominees: gameState.nominees,
        vetoHolder: gameState.vetoHolder,
        alliances: gameState.alliances,
        allianceProposals: gameState.allianceProposals
      };
      
      localStorage.setItem('bigBrotherRPG_saveData', JSON.stringify(gameData));
      
      toast({
        title: "Game Saved",
        description: "Your game has been saved successfully!",
      });
    } catch (error) {
      console.error('Error saving game:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your game.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [gameState, toast]);

  const loadGame = useCallback(() => {
    try {
      setIsLoading(true);
      
      const savedData = localStorage.getItem('bigBrotherRPG_saveData');
      
      if (!savedData) {
        toast({
          title: "No Saved Game",
          description: "There is no saved game data to load.",
          variant: "destructive",
        });
        return;
      }
      
      const gameData = JSON.parse(savedData);
      
      // Update game state
      gameState.setPhase(gameData.currentPhase);
      gameState.setPlayers(gameData.players);
      
      if (gameData.hoh) {
        gameState.setHohWinner(gameData.hoh);
      }
      
      if (gameData.nominees && gameData.nominees.length) {
        gameState.setNominees(gameData.nominees);
      }
      
      if (gameData.vetoHolder) {
        gameState.setVetoHolder(gameData.vetoHolder);
      }
      
      toast({
        title: "Game Loaded",
        description: "Your saved game has been loaded successfully!",
      });
    } catch (error) {
      console.error('Error loading game:', error);
      toast({
        title: "Load Failed",
        description: "There was an error loading your saved game.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [gameState, toast]);

  return { saveGame, loadGame, isLoading };
};
