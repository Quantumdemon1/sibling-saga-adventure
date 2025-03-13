import React, { useEffect, useState } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import useGameStateStore from '@/stores/gameStateStore';
import DialogueUI from '@/components/ui/DialogueUI';
import { motion } from 'framer-motion';
import GameHeader from '@/components/ui/GameHeader';
import GameSidebar from '@/components/ui/GameSidebar';
import GameOverlays from '@/components/ui/GameOverlays';
import GamePhaseManager from '@/components/game-phases/GamePhaseManager';
import GameWorld from '@/components/GameWorld';

const Game = () => {
  const { currentPlayerId, isGameActive } = useGameContext();
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
  const [view3D, setView3D] = useState(true);

  useEffect(() => {
    // Start with an idle phase
    if (isGameActive && currentPhase === 'idle') {
      // Game initialization logic can go here
    }
  }, [isGameActive, currentPhase]);

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

  const renderOverlay = () => {
    if (!overlay) return null;

    switch (overlay.type) {
      case 'dialogue':
        return (
          <DialogueUI 
            npcId={overlay.npcId} 
            onClose={() => setOverlay(null)} 
          />
        );
      // Other overlay types will be implemented as we build them
      default:
        return null;
    }
  };

  const toggleView = () => {
    setView3D(prev => !prev);
  };

  return (
    <div className="game-container relative">
      {/* Game header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 w-full z-20 glass-panel backdrop-blur-md bg-opacity-90 border-b border-game-glass-border"
      >
        <GameHeader 
          weekCount={weekCount}
          dayCount={dayCount}
          currentPhase={currentPhase}
          onShowWeekSidebar={handleShowWeekSidebar}
          is3DActive={view3D}
          onToggleView={toggleView}
        />
      </motion.div>

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
      <GameOverlays 
        overlay={overlay}
        renderOverlay={renderOverlay}
      />
    </div>
  );
};

export default Game;
