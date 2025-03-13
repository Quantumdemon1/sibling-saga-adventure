
import React from 'react';
import { motion } from 'framer-motion';
import useGameStateStore from '@/stores/gameStateStore';
import { Player } from '@/types/PlayerProfileTypes';

interface GameSidebarProps {
  hoh: string | null;
  nominees: string[];
  vetoHolder: string | null;
  players: Player[];
  showControls: boolean;
  onToggleControls: () => void;
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  hoh,
  nominees,
  vetoHolder,
  players,
  showControls,
  onToggleControls
}) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: showControls ? '0%' : '90%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-16 right-0 bottom-0 w-80 glass-panel backdrop-blur-md border-l border-game-glass-border z-10"
    >
      <div 
        className="absolute top-1/2 -left-10 bg-game-surface hover:bg-game-surface-hover p-2 rounded-l-lg cursor-pointer"
        onClick={onToggleControls}
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
                      : player.status === 'nominee' || player.status === 'nominated'
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
  );
};

export default GameSidebar;
