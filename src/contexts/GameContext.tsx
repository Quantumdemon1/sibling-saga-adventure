
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

  useEffect(() => {
    // Set the player ID when the game starts
    if (isGameActive && !currentPlayerId) {
      const humanPlayer = players.find(p => p.isHuman);
      if (humanPlayer) {
        setCurrentPlayerId(humanPlayer.id);
      }
    }
  }, [isGameActive, players, currentPlayerId]);

  const startGame = () => {
    setIsGameActive(true);
    setPhase('idle');
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
