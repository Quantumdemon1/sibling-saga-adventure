
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import useGameStateStore from '@/stores/gameStateStore';
import { Player } from '@/types/PlayerProfileTypes';

interface VetoCeremonyProps {
  players: Player[];
  hoh: string | null;
  nominees: string[];
  vetoHolder: string | null;
}

const VetoCeremony: React.FC<VetoCeremonyProps> = ({ 
  players, 
  hoh, 
  nominees, 
  vetoHolder 
}) => {
  const { setNominees, setPhase } = useGameStateStore();
  const [vetoUsed, setVetoUsed] = useState(false);
  const [savedNominee, setSavedNominee] = useState<string | null>(null);
  const [replacementNominee, setReplacementNominee] = useState<string | null>(null);
  
  const vetoPlayer = players.find(player => player.id === vetoHolder);
  const hohPlayer = players.find(player => player.id === hoh);
  
  const eligibleReplacements = players.filter(player => 
    player.status === 'active' && 
    !nominees.includes(player.id) && 
    player.id !== hoh &&
    player.id !== vetoHolder
  );
  
  const handleVetoDecision = (use: boolean) => {
    if (!use) {
      // Don't use veto, move to eviction voting
      setPhase('evictionVoting');
    } else {
      setVetoUsed(true);
    }
  };
  
  const handleSaveNominee = (nomineeId: string) => {
    setSavedNominee(nomineeId);
  };
  
  const handleSelectReplacement = (playerId: string) => {
    setReplacementNominee(playerId);
  };
  
  const handleConfirmReplacement = () => {
    if (savedNominee && replacementNominee) {
      const newNominees = [...nominees];
      const index = newNominees.indexOf(savedNominee);
      if (index !== -1) {
        newNominees[index] = replacementNominee;
        setNominees(newNominees);
      }
      setPhase('evictionVoting');
    }
  };
  
  if (!vetoUsed) {
    return (
      <div className="game-panel p-6">
        <h2 className="game-text-title mb-4">Veto Ceremony</h2>
        <p className="game-text-body mb-6">
          {vetoPlayer?.name} has won the Power of Veto. Will they use it?
        </p>
        
        <div className="mb-6">
          <h3 className="game-text-subtitle mb-2">Current Nominees</h3>
          <div className="flex flex-wrap gap-2">
            {nominees.map(nomineeId => {
              const player = players.find(p => p.id === nomineeId);
              return player ? (
                <div key={nomineeId} className="game-chip bg-game-warning text-black">
                  {player.name}
                </div>
              ) : null;
            })}
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => handleVetoDecision(true)} 
            className="game-button-primary"
          >
            Use Veto
          </Button>
          <Button 
            onClick={() => handleVetoDecision(false)} 
            className="game-button-secondary"
          >
            Don't Use Veto
          </Button>
        </div>
      </div>
    );
  }
  
  if (vetoUsed && !savedNominee) {
    return (
      <div className="game-panel p-6">
        <h2 className="game-text-title mb-4">Veto Ceremony</h2>
        <p className="game-text-body mb-6">
          {vetoPlayer?.name} has decided to use the Power of Veto. Which nominee should be saved?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nominees.map(nomineeId => {
            const player = players.find(p => p.id === nomineeId);
            return player ? (
              <Button
                key={nomineeId}
                onClick={() => handleSaveNominee(nomineeId)}
                className="game-button p-4"
              >
                {player.name}
              </Button>
            ) : null;
          })}
        </div>
      </div>
    );
  }
  
  return (
    <div className="game-panel p-6">
      <h2 className="game-text-title mb-4">Replacement Nomination</h2>
      <p className="game-text-body mb-6">
        {hohPlayer?.name} must name a replacement nominee.
      </p>
      
      <div className="mb-6">
        <h3 className="game-text-subtitle mb-2">Select a replacement nominee:</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eligibleReplacements.map(player => (
          <Button
            key={player.id}
            onClick={() => handleSelectReplacement(player.id)}
            className={`game-button flex flex-col items-center p-4 ${
              replacementNominee === player.id ? 'bg-game-warning text-black' : ''
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
          onClick={handleConfirmReplacement}
          disabled={!replacementNominee}
          className="game-button-primary"
        >
          Confirm Replacement
        </Button>
      </div>
    </div>
  );
};

export default VetoCeremony;
