
import React from 'react';
import { Button } from '@/components/ui/button';
import useGameStateStore from '@/stores/gameStateStore';
import { Player } from '@/types/PlayerProfileTypes';

interface HohCompetitionProps {
  players: Player[];
}

const HohCompetition: React.FC<HohCompetitionProps> = ({ players }) => {
  const { setHohWinner, setPhase } = useGameStateStore();
  
  const eligiblePlayers = players.filter(player => player.status === 'active');
  
  const handleSelectWinner = (playerId: string) => {
    setHohWinner(playerId);
    setPhase('nominationCeremony');
  };
  
  return (
    <div className="game-panel p-6">
      <h2 className="game-text-title mb-4">Head of Household Competition</h2>
      <p className="game-text-body mb-6">
        Select the winner of the Head of Household competition.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eligiblePlayers.map(player => (
          <Button
            key={player.id}
            onClick={() => handleSelectWinner(player.id)}
            className="game-button flex flex-col items-center p-4"
          >
            {player.avatarUrl && (
              <div className="w-16 h-16 rounded-full bg-game-surface mb-2 overflow-hidden">
                <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
              </div>
            )}
            <span>{player.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default HohCompetition;
