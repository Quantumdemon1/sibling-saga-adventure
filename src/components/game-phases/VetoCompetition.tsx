
import React from 'react';
import { Button } from '@/components/ui/button';
import useGameStateStore from '@/stores/gameStateStore';
import { Player } from '@/types/PlayerProfileTypes';

interface VetoCompetitionProps {
  players: Player[];
  hoh: string | null;
  nominees: string[];
}

const VetoCompetition: React.FC<VetoCompetitionProps> = ({ players, hoh, nominees }) => {
  const { setVetoHolder, setPhase } = useGameStateStore();
  
  // In a real game, we'd have a limited pool of veto players (HoH, nominees, and random others)
  // For simplicity, all active players can compete
  const eligiblePlayers = players.filter(player => player.status === 'active');
  
  const handleSelectWinner = (playerId: string) => {
    setVetoHolder(playerId);
    setPhase('vetoCeremony');
  };
  
  return (
    <div className="game-panel p-6">
      <h2 className="game-text-title mb-4">Power of Veto Competition</h2>
      <p className="game-text-body mb-6">
        Select the winner of the Power of Veto competition.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eligiblePlayers.map(player => (
          <Button
            key={player.id}
            onClick={() => handleSelectWinner(player.id)}
            className={`game-button flex flex-col items-center p-4 ${
              nominees.includes(player.id) ? 'bg-game-warning text-black' : ''
            } ${
              player.id === hoh ? 'bg-game-accent' : ''
            }`}
          >
            {player.avatarUrl && (
              <div className="w-16 h-16 rounded-full bg-game-surface mb-2 overflow-hidden">
                <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
              </div>
            )}
            <span>{player.name}</span>
            {nominees.includes(player.id) && <span className="text-xs">(Nominated)</span>}
            {player.id === hoh && <span className="text-xs">(HoH)</span>}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default VetoCompetition;
