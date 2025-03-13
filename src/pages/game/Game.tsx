import React, { useEffect, useState, useRef } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import useGameStateStore, { useInitialPlayers } from '@/stores/gameStateStore';
import GameHeader from '@/components/ui/GameHeader';
import GameSidebar from '@/components/ui/GameSidebar';
import GameOverlays from '@/components/ui/GameOverlays';
import GamePhaseManager from '@/components/game-phases/GamePhaseManager';
import GameContent from '@/components/ui/GameContent';
import { toast } from '@/hooks/use-toast';

const Game = () => {
  const { currentPlayerId, isGameActive, startGame } = useGameContext();
  const { 
    currentPhase, 
    overlay, 
    setOverlay, 
    players, 
    dayCount, 
    weekCount,
    hoh,
    nominees,
    vetoHolder,
    setPhase
  } = useGameStateStore();
  
  // Initialize players
  const initialPlayers = useInitialPlayers();
  
  // Local UI state
  const [showControls, setShowControls] = useState(true);
  const [view3D, setView3D] = useState(false); // Always start with 2D view for reliability
  const [view3DError, setView3DError] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const gameStartAttempted = useRef(false);

  useEffect(() => {
    // Only attempt to start the game once
    if (!isGameActive && !gameStartAttempted.current) {
      console.log("Starting game");
      gameStartAttempted.current = true;
      // Use a slight delay to avoid state update conflicts
      setTimeout(() => {
        startGame();
      }, 0);
    }

    // Mark the game as ready once we're in idle phase
    if (isGameActive && currentPhase === 'idle') {
      console.log("Game initialized");
      setIsGameReady(true);
    } else if (isGameActive) {
      // Handle any other phase
      setIsGameReady(true);
    }
  }, [isGameActive, currentPhase, startGame]);
  
  const handlePhaseChange = (phase: string) => {
    setPhase(phase as any);
    setOverlay(null);
  };

  const handleShowWeekSidebar = () => {
    setOverlay({ type: 'weekSidebar' });
  };

  const handleStartHohCompetition = () => {
    setPhase('hohCompetition');
    setOverlay(null);
  };

  const handleManageAlliances = () => {
    setOverlay({ type: 'alliance' });
  };

  const toggleView = () => {
    // 3D view is disabled in this version for stability
    toast({
      title: "3D View Unavailable",
      description: "The 3D view is currently disabled for stability. All features are available in 2D mode.",
      variant: "destructive"
    });
    // Keep view in 2D mode
    setView3D(false);
  };

  // If game isn't ready yet, show loading screen
  if (!isGameReady) {
    return (
      <div className="game-container h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Initializing Game...</h2>
          <div className="w-32 h-2 mx-auto bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container relative h-screen bg-slate-900">
      {/* Game header */}
      <div className="absolute top-0 left-0 w-full z-20 glass-panel backdrop-blur-md bg-opacity-90 border-b border-game-glass-border">
        <GameHeader 
          weekCount={weekCount}
          dayCount={dayCount}
          currentPhase={currentPhase}
          onShowWeekSidebar={handleShowWeekSidebar}
          is3DActive={false} // Always false in this version for stability
          onToggleView={toggleView}
        />
      </div>

      {/* Main game content */}
      <div className="pt-16 h-full">
        <GamePhaseManager
          onStartHohCompetition={handleStartHohCompetition}
          onManageAlliances={handleManageAlliances}
        />
      </div>
      
      {/* Game status sidebar */}
      <GameSidebar 
        hoh={hoh}
        nominees={nominees}
        vetoHolder={vetoHolder}
        players={players}
        showControls={showControls}
        onToggleControls={() => setShowControls(!showControls)}
      />

      {/* Game overlays */}
      <GameOverlays overlay={overlay} />
      
      {/* Debug info */}
      <div className="absolute bottom-2 left-2 text-white text-xs opacity-50">
        Players: {players.length} | Phase: {currentPhase}
      </div>
    </div>
  );
};

export default Game;
