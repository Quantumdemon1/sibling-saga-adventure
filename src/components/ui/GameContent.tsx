
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface GameContentProps {
  onStartHohCompetition: () => void;
  onManageAlliances: () => void;
}

const GameContent: React.FC<GameContentProps> = ({
  onStartHohCompetition,
  onManageAlliances
}) => {
  return (
    <div className="pt-16 h-full">
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="game-chip bg-game-accent mb-3">Development Mode</div>
          <h1 className="game-text-title mb-4">Big Brother RPG</h1>
          <p className="game-text-body mb-6">
            The 3D game world is currently in development. In the meantime, you can test the game mechanics.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={onStartHohCompetition} className="game-button">
              Start HoH Competition
            </Button>
            <Button onClick={onManageAlliances} className="game-button-secondary">
              Manage Alliances
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameContent;
