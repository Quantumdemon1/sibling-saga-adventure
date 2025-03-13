
import React, { useEffect, useState } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import useGameStateStore, { useInitialPlayers } from '@/stores/gameStateStore';
import GameHeader from '@/components/ui/GameHeader';
import GameSidebar from '@/components/ui/GameSidebar';
import GameOverlays from '@/components/ui/GameOverlays';
import GamePhaseManager from '@/components/game-phases/GamePhaseManager';
import GameWorld from '@/components/GameWorld';

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
  const [view3D, setView3D] = useState(false); // Start with 2D view to help with performance

  useEffect(() => {
    // Start the game if it's not already active
    if (!isGameActive) {
      console.log("Starting game automatically");
      startGame();
    }

    // Start with an idle phase
    if (isGameActive && currentPhase === 'idle') {
      console.log("Game initialized");
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
    setView3D(prev => !prev);
  };

  return (
    <div className="game-container relative h-screen bg-slate-900">
      {/* Game header */}
      <div className="absolute top-0 left-0 w-full z-20 glass-panel backdrop-blur-md bg-opacity-90 border-b border-game-glass-border">
        <GameHeader 
          weekCount={weekCount}
          dayCount={dayCount}
          currentPhase={currentPhase}
          onShowWeekSidebar={handleShowWeekSidebar}
          is3DActive={view3D}
          onToggleView={toggleView}
        />
      </div>

      {/* Main game content */}
      <div className="pt-16 h-full">
        {view3D ? (
          <div className="h-full">
            <GameWorld />
          </div>
        ) : (
          <GamePhaseManager
            onStartHohCompetition={handleStartHohCompetition}
            onManageAlliances={handleManageAlliances}
          />
        )}
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
