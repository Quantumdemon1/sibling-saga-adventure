
import React from 'react';
import { Button } from '@/components/ui/button';
import SaveGameUI from '@/components/ui/SaveGameUI';
import useGameStateStore from '@/stores/gameStateStore';

interface GameHeaderProps {
  weekCount: number;
  dayCount: number;
  currentPhase: string;
  onShowWeekSidebar: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  weekCount, 
  dayCount, 
  currentPhase,
  onShowWeekSidebar
}) => {
  return (
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
            onClick={onShowWeekSidebar}
            variant="outline"
            size="sm"
            className="text-sm"
          >
            Game Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
