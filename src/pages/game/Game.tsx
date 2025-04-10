import React, { useEffect, useState, useRef } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import useGameStateStore, { useInitialPlayers } from '@/stores/gameStateStore';
import GameHeader from '@/components/ui/GameHeader';
import GameSidebar from '@/components/ui/GameSidebar';
import GameOverlays from '@/components/ui/GameOverlays';
import GamePhaseManager from '@/components/game-phases/GamePhaseManager';
import GameContent from '@/components/ui/GameContent';
import { toast } from '@/hooks/use-toast';
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
  
  const [showControls, setShowControls] = useState(true);
  const [is3DActive, setIs3DActive] = useState(true);
  const [isGameReady, setIsGameReady] = useState(false);
  const gameStartAttempted = useRef(false);

  useEffect(() => {
    if (!isGameActive && !gameStartAttempted.current) {
      console.log("Starting game");
      gameStartAttempted.current = true;
      setTimeout(() => {
        startGame();
      }, 100);
    }

    if (isGameActive && (currentPhase === 'idle' || currentPhase)) {
      console.log("Game initialized");
      setIsGameReady(true);
    }
  }, [isGameActive, currentPhase, startGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        document.body.setAttribute('data-key-e', 'true');
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        document.body.setAttribute('data-key-e', 'false');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    document.body.setAttribute('data-key-e', 'false');
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.body.removeAttribute('data-key-e');
    };
  }, []);

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
    setIs3DActive(!is3DActive);
    toast({
      title: is3DActive ? "Switched to 2D Mode" : "Switched to 3D Mode",
      description: is3DActive ? "Using simplified 2D interface." : "Using immersive 3D environment."
    });
  };

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
      <div className="absolute top-0 left-0 w-full z-20 glass-panel backdrop-blur-md bg-opacity-90 border-b border-game-glass-border">
        <GameHeader 
          weekCount={weekCount}
          dayCount={dayCount}
          currentPhase={currentPhase}
          onShowWeekSidebar={handleShowWeekSidebar}
          is3DActive={is3DActive}
          onToggleView={toggleView}
        />
      </div>

      <div className="pt-16 h-full">
        <GamePhaseManager
          onStartHohCompetition={handleStartHohCompetition}
          onManageAlliances={handleManageAlliances}
        />
        <GameWorld />
      </div>
      
      <GameSidebar 
        hoh={hoh}
        nominees={nominees}
        vetoHolder={vetoHolder}
        players={players}
        showControls={showControls}
        onToggleControls={() => setShowControls(!showControls)}
      />

      <GameOverlays overlay={overlay} />
      
      <div className="absolute bottom-2 left-2 text-white text-xs opacity-50">
        Players: {players.length} | Phase: {currentPhase}
      </div>
    </div>
  );
};

export default Game;
