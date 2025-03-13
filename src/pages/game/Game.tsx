import React, { useEffect, useState } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import useGameStateStore from '@/stores/gameStateStore';
import DialogueUI from '@/components/ui/DialogueUI';
import { motion } from 'framer-motion';
import GameHeader from '@/components/ui/GameHeader';
import GameSidebar from '@/components/ui/GameSidebar';
import GameContent from '@/components/ui/GameContent';
import GameOverlays from '@/components/ui/GameOverlays';

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
    setOverlay({ type: 'hoh' });
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
        />
      </motion.div>

      {/* Main game content */}
      <GameContent 
        onStartHohCompetition={handleStartHohCompetition}
        onManageAlliances={handleManageAlliances}
      />
      
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
