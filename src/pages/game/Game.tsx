
import React, { useEffect, useState } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import useGameStateStore, { useInitialPlayers } from '@/stores/gameStateStore';
import GameHeader from '@/components/ui/GameHeader';
import GameSidebar from '@/components/ui/GameSidebar';
import GameOverlays from '@/components/ui/GameOverlays';
import GamePhaseManager from '@/components/game-phases/GamePhaseManager';
import GameWorld from '@/components/GameWorld';
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
  const [view3D, setView3D] = useState(false); // Start with 2D view to help with performance
  const [view3DError, setView3DError] = useState(false);

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
    if (view3DError && !view3D) {
      // If there was a previous 3D error and user is trying to switch to 3D
      toast({
        title: "3D View Unavailable",
        description: "The 3D view is currently unavailable due to technical limitations. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    setView3D(prev => !prev);
  };

  const handle3DError = () => {
    setView3DError(true);
    setView3D(false);
    toast({
      title: "3D View Error",
      description: "Encountered an error loading the 3D view. Switched to 2D mode.",
      variant: "destructive"
    });
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
          <div className="h-full" key="3d-view">
            <GameWorld />
          </div>
        ) : (
          <div key="2d-view">
            <GamePhaseManager
              onStartHohCompetition={handleStartHohCompetition}
              onManageAlliances={handleManageAlliances}
            />
          </div>
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
