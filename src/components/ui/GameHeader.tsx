
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronDown, Crown, Users } from 'lucide-react';
import ViewSwitcher from './ViewSwitcher';

interface GameHeaderProps {
  weekCount: number;
  dayCount: number;
  currentPhase: string;
  onShowWeekSidebar: () => void;
  is3DActive?: boolean;
  onToggleView?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  weekCount,
  dayCount,
  currentPhase,
  onShowWeekSidebar,
  is3DActive = true,
  onToggleView
}) => {
  const formatPhase = (phase: string) => {
    return phase
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="p-3 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowWeekSidebar}
          className="text-game-secondary hover:text-game-primary"
        >
          <CalendarDays className="h-4 w-4 mr-1" />
          <span className="font-semibold">Week {weekCount}</span>
          <span className="ml-1 text-xs text-muted-foreground">Day {dayCount}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
        
        <div className="hidden md:flex text-sm items-center">
          <span className="text-game-secondary">Current Phase:</span>
          <span className="ml-1 text-game-primary font-medium">
            {formatPhase(currentPhase)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {onToggleView && (
          <ViewSwitcher 
            is3DActive={is3DActive}
            onToggle={onToggleView}
          />
        )}
        
        <Button
          variant="outline"
          size="sm"
          className="text-game-secondary hover:text-game-primary"
        >
          <Users className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Houseguests</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="text-game-secondary hover:text-game-primary"
        >
          <Crown className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Rankings</span>
        </Button>
      </div>
    </div>
  );
};

export default GameHeader;
