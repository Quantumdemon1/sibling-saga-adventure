
import React, { useEffect, useState } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import useGameStateStore from '@/stores/gameStateStore';
import DialogueUI from '@/components/ui/DialogueUI';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import SaveGameUI from '@/components/ui/SaveGameUI';

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
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="game-chip bg-game-accent">
                Week {weekCount}
              </div>
              <div className="game-chip bg-game-surface">
                Day {dayCount}
              </div>
              <div className="game-chip bg-game-surface">
                Phase: {currentPhase}
              </div>
            </div>
            <div className="flex space-x-2">
              <SaveGameUI />
              <Button 
                onClick={handleShowWeekSidebar}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                Game Details
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main game content */}
      <div className="pt-16 h-full">
        {/* This is where the 3D game world will go */}
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="game-chip bg-game-accent mb-3">Development Mode</div>
            <h1 className="game-text-title mb-4">Big Brother RPG</h1>
            <p className="game-text-body mb-6">
              The 3D game world is currently in development. In the meantime, you can test the game mechanics.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={handleStartHohCompetition} className="game-button">
                Start HoH Competition
              </Button>
              <Button onClick={() => setOverlay({ type: 'alliance' })} className="game-button-secondary">
                Manage Alliances
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game status sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: showControls ? '0%' : '90%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-16 right-0 bottom-0 w-80 glass-panel backdrop-blur-md border-l border-game-glass-border z-10"
      >
        <div 
          className="absolute top-1/2 -left-10 bg-game-surface hover:bg-game-surface-hover p-2 rounded-l-lg cursor-pointer"
          onClick={() => setShowControls(!showControls)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transform transition-transform ${showControls ? 'rotate-0' : 'rotate-180'}`}
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        
        <div className="p-5 overflow-y-auto h-full">
          <h2 className="game-text-title mb-4">House Status</h2>

          {/* HoH Status */}
          <div className="mb-6">
            <h3 className="game-text-subtitle mb-2">Head of Household</h3>
            {hoh ? (
              <div className="glass-panel p-3">
                {players.find(p => p.id === hoh)?.name || 'Unknown'}
              </div>
            ) : (
              <div className="glass-panel p-3 text-game-secondary">
                Not yet determined
              </div>
            )}
          </div>

          {/* Nominees */}
          <div className="mb-6">
            <h3 className="game-text-subtitle mb-2">Nominees</h3>
            {nominees.length > 0 ? (
              <div className="glass-panel p-3">
                <ul className="space-y-2">
                  {nominees.map(nomineeId => (
                    <li key={nomineeId}>
                      {players.find(p => p.id === nomineeId)?.name || 'Unknown'}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="glass-panel p-3 text-game-secondary">
                No nominees yet
              </div>
            )}
          </div>

          {/* Veto Holder */}
          <div className="mb-6">
            <h3 className="game-text-subtitle mb-2">Veto Holder</h3>
            {vetoHolder ? (
              <div className="glass-panel p-3">
                {players.find(p => p.id === vetoHolder)?.name || 'Unknown'}
              </div>
            ) : (
              <div className="glass-panel p-3 text-game-secondary">
                Not yet determined
              </div>
            )}
          </div>

          {/* Players */}
          <div>
            <h3 className="game-text-subtitle mb-2">Houseguests</h3>
            <div className="glass-panel p-3">
              <ul className="space-y-2">
                {players.map(player => (
                  <li key={player.id} className="flex items-center justify-between">
                    <span>{player.name}</span>
                    <span className={`game-chip ${
                      player.status === 'evicted' 
                        ? 'bg-game-destructive text-white'
                        : player.status === 'nominated'
                        ? 'bg-game-warning text-black'
                        : 'bg-game-surface'
                    }`}>
                      {player.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Game overlays */}
      <AnimatePresence>
        {overlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
          >
            {renderOverlay()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
