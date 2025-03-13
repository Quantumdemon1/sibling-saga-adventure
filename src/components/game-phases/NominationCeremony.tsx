
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import useGameStateStore from '@/stores/gameStateStore';
import { Player } from '@/types/PlayerProfileTypes';

interface NominationCeremonyProps {
  players: Player[];
  hoh: string | null;
}

const NominationCeremony: React.FC<NominationCeremonyProps> = ({ players, hoh }) => {
  const { setNominees, setPhase } = useGameStateStore();
  const [selectedNominees, setSelectedNominees] = useState<string[]>([]);
  
  const eligiblePlayers = players.filter(player => 
    player.status === 'active' && player.id !== hoh
  );
  
  const hohPlayer = players.find(player => player.id === hoh);
  
  const handleToggleNominee = (playerId: string) => {
    if (selectedNominees.includes(playerId)) {
      setSelectedNominees(selectedNominees.filter(id => id !== playerId));
    } else {
      if (selectedNominees.length < 2) {
        setSelectedNominees([...selectedNominees, playerId]);
      }
    }
  };
  
  const handleConfirmNominations = () => {
    if (selectedNominees.length === 2) {
      setNominees(selectedNominees);
      setPhase('vetoCompetition');
    }
  };
  
  return (
    <div className="game-panel p-6">
      <h2 className="game-text-title mb-4">Nomination Ceremony</h2>
      <p className="game-text-body mb-6">
        {hohPlayer?.name} (HoH) must nominate two houseguests for eviction.
      </p>
      
      <div className="mb-6">
        <h3 className="game-text-subtitle mb-2">Selected Nominees: {selectedNominees.length}/2</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eligiblePlayers.map(player => (
          <Button
            key={player.id}
            onClick={() => handleToggleNominee(player.id)}
            className={`game-button flex flex-col items-center p-4 ${
              selectedNominees.includes(player.id) ? 'bg-game-warning text-black' : ''
            }`}
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
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleConfirmNominations}
          disabled={selectedNominees.length !== 2}
          className="game-button-primary"
        >
          Confirm Nominations
        </Button>
      </div>
    </div>
  );
};

export default NominationCeremony;
