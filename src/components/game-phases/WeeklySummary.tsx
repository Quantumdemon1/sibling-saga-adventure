
import React from 'react';
import { Button } from '@/components/ui/button';
import useGameStateStore from '@/stores/gameStateStore';
import { Player } from '@/types/PlayerProfileTypes';

interface WeeklySummaryProps {
  players: Player[];
  weekCount: number;
  dayCount: number;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ 
  players, 
  weekCount, 
  dayCount 
}) => {
  const { setPhase } = useGameStateStore();
  
  const handleContinue = () => {
    setPhase('hohCompetition');
  };
  
  const activePlayers = players.filter(player => player.status !== 'evicted');
  const evictedPlayers = players.filter(player => player.status === 'evicted');
  
  return (
    <div className="game-panel p-6">
      <h2 className="game-text-title mb-4">Week {weekCount} Summary</h2>
      
      <div className="mb-6">
        <h3 className="game-text-subtitle mb-2">Remaining Houseguests</h3>
        <div className="glass-panel p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePlayers.map(player => (
              <div key={player.id} className="flex items-center gap-3">
                {player.avatarUrl && (
                  <div className="w-10 h-10 rounded-full bg-game-surface overflow-hidden">
                    <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="font-bold">{player.name}</div>
                  <div className="text-sm">
                    HoH Wins: {player.stats?.hohWins || 0}, 
                    Veto Wins: {player.stats?.povWins || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {evictedPlayers.length > 0 && (
        <div className="mb-6">
          <h3 className="game-text-subtitle mb-2">Evicted Houseguests</h3>
          <div className="glass-panel p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evictedPlayers.map(player => (
                <div key={player.id} className="flex items-center gap-3">
                  {player.avatarUrl && (
                    <div className="w-10 h-10 rounded-full bg-game-surface overflow-hidden grayscale">
                      <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="text-game-secondary">
                    <div className="font-bold">{player.name}</div>
                    <div className="text-sm">
                      Days in house: {player.stats?.daysInHouse || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-8">
        <Button onClick={handleContinue} className="game-button-primary">
          Start Week {weekCount + 1}
        </Button>
      </div>
    </div>
  );
};

export default WeeklySummary;
