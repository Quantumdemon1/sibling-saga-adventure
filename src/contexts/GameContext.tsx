
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import useGameStateStore from '@/stores/gameStateStore';
import { Player } from '@/types/PlayerProfileTypes';
import { Alliance, AllianceProposal } from '@/types/gameTypes';

type GameContextType = {
  players: Player[];
  alliances: Alliance[];
  allianceProposals: AllianceProposal[];
  currentPlayerId: string | null;
  isGameActive: boolean;
  startGame: () => void;
  endGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { players, alliances, allianceProposals, setPhase } = useGameStateStore();
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  // Set the player ID only once when the game starts
  useEffect(() => {
    if (isGameActive && !currentPlayerId && players.length > 0) {
      const humanPlayer = players.find(p => p.isHuman);
      if (humanPlayer) {
        setCurrentPlayerId(humanPlayer.id);
      }
    }
  }, [isGameActive, players, currentPlayerId]);

  // Only set the phase once when the game becomes active
  useEffect(() => {
    if (isGameActive) {
      setPhase('idle');
    }
  }, [isGameActive, setPhase]);

  const startGame = () => {
    setIsGameActive(true);
    // Phase setting moved to useEffect to prevent render loop
  };

  const endGame = () => {
    setIsGameActive(false);
    setCurrentPlayerId(null);
  };

  return (
    <GameContext.Provider
      value={{
        players,
        alliances,
        allianceProposals,
        currentPlayerId,
        isGameActive,
        startGame,
        endGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
